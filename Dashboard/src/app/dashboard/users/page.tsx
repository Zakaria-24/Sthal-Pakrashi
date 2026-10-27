"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { api, type Record_ } from "@/lib/client-api";
import { ASSIGNABLE_ROLES, ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/permissions";
import type { UserRole } from "@/models/User";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

/**
 * Staff accounts, super admin only.
 *
 * Passwords are issued here and nowhere else: staff cannot change their own,
 * so this page is the single place a password is ever set or reset.
 */
export default function UsersPage() {
  const [users, setUsers] = useState<Record_[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<Record_ | null>(null);
  const [passwordTarget, setPasswordTarget] = useState<Record_ | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Record_ | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.listUsers();
      setUsers(result.items);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await api.deleteUser(String(deleteTarget._id));
      toast.success("User removed");
      setDeleteTarget(null);
      await load();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Delete failed");
    }
  }

  async function toggleActive(user: Record_) {
    try {
      await api.updateUser(String(user._id), { isActive: !user.isActive });
      toast.success(user.isActive ? "Account disabled" : "Account enabled");
      await load();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Update failed");
    }
  }

  return (
    <div className="space-y-6 p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-h1 text-foreground">Users</h1>
          <p className="text-muted-foreground text-sm">
            Staff accounts and their passwords. Only you can change these.
          </p>
        </div>
        <Button onClick={() => setCreating(true)}>Add user</Button>
      </header>

      {error ? (
        <div className="border-destructive/40 bg-destructive/5 rounded-md border p-4">
          <p className="text-destructive text-sm">{error}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={load}>
            Retry
          </Button>
        </div>
      ) : loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((row) => (
            <Skeleton key={row} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const isSuper = user.role === "superAdmin";
                return (
                  <TableRow key={String(user._id)}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant={isSuper ? "default" : "outline"}>
                        {ROLE_LABELS[user.role as UserRole] ?? user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {isSuper ? (
                        <span className="text-muted-foreground text-xs">
                          One-time code
                        </span>
                      ) : (
                        <Badge variant={user.isActive ? "default" : "secondary"}>
                          {user.isActive ? "Active" : "Disabled"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="space-x-1 text-right">
                      {isSuper ? (
                        <span className="text-muted-foreground text-xs">
                          That&apos;s you
                        </span>
                      ) : (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditing(user)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPasswordTarget(user)}
                          >
                            Password
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleActive(user)}
                          >
                            {user.isActive ? "Disable" : "Enable"}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => setDeleteTarget(user)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <CreateUserDialog
        open={creating}
        onClose={() => setCreating(false)}
        onSaved={load}
      />
      <EditUserDialog
        user={editing}
        onClose={() => setEditing(null)}
        onSaved={load}
      />
      <PasswordDialog
        user={passwordTarget}
        onClose={() => setPasswordTarget(null)}
      />

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this user?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.name} will lose access immediately. This cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Remove</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function RoleSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="role">Role</Label>
      <Select
        value={value}
        onValueChange={(next) => onChange(next ?? "moderator")}
      >
        <SelectTrigger id="role" className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ASSIGNABLE_ROLES.map((role) => (
            <SelectItem key={role} value={role}>
              {ROLE_LABELS[role]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-muted-foreground text-xs">
        {ROLE_DESCRIPTIONS[value as UserRole]}
      </p>
    </div>
  );
}

function CreateUserDialog({
  open,
  onClose,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<string>("moderator");
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  function reset() {
    setName("");
    setEmail("");
    setRole("moderator");
    setPassword("");
  }

  async function handleSave() {
    setSaving(true);
    try {
      await api.createUser({ name, email, role, password });
      toast.success(`${name} can now sign in with that password`);
      reset();
      onClose();
      await onSaved();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Create failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add user</DialogTitle>
          <DialogDescription>
            They sign in with this email and password. Give the password to them
            directly — they cannot change it themselves.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="new-name">Name</Label>
            <Input
              id="new-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-email">Email</Label>
            <Input
              id="new-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <RoleSelect value={role} onChange={setRole} />
          <div className="space-y-2">
            <Label htmlFor="new-password">Password</Label>
            <Input
              id="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setPassword(generatePassword())}
            >
              Generate
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Creating…" : "Create user"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditUserDialog({
  user,
  onClose,
  onSaved,
}: {
  user: Record_ | null;
  onClose: () => void;
  onSaved: () => Promise<void>;
}) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("moderator");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setName(String(user.name ?? ""));
      setRole(String(user.role ?? "moderator"));
    }
  }, [user]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      await api.updateUser(String(user._id), { name, role });
      toast.success("User updated");
      onClose();
      await onSaved();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={user !== null} onOpenChange={(next) => !next && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>{user?.email}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Name</Label>
            <Input
              id="edit-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <RoleSelect value={role} onChange={setRole} />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PasswordDialog({
  user,
  onClose,
}: {
  user: Record_ | null;
  onClose: () => void;
}) {
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setPassword("");
  }, [user]);

  async function handleSave() {
    if (!user) return;
    setSaving(true);
    try {
      await api.updateUser(String(user._id), { password });
      toast.success("Password changed — give it to them directly");
      onClose();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={user !== null} onOpenChange={(next) => !next && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set password</DialogTitle>
          <DialogDescription>
            New password for {user?.name}. It replaces their old one
            immediately.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="reset-password">Password</Label>
          <Input
            id="reset-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPassword(generatePassword())}
          >
            Generate
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || password.length < 8}>
            {saving ? "Saving…" : "Set password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/** Readable but random — the super admin has to pass this on by hand. */
function generatePassword(): string {
  const alphabet = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const values = crypto.getRandomValues(new Uint32Array(14));
  return Array.from(values, (v) => alphabet[v % alphabet.length]).join("");
}
