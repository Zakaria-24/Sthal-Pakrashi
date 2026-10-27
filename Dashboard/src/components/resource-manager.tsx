"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import {
  RESOURCE_MAP,
  type FieldDef,
  type ResourceSlug,
} from "@/lib/resource-config";
import { api, type Record_ } from "@/lib/client-api";
import { FieldInput } from "@/components/field-input";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
 * Generic CRUD screen. Everything it renders — columns, form controls,
 * validation hints — comes from the resource registry, so this one component
 * serves every content type in every school that reuses this dashboard.
 */
export function ResourceManager({ slug }: { slug: ResourceSlug }) {
  const config = RESOURCE_MAP[slug];

  const [items, setItems] = useState<Record_[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const [editing, setEditing] = useState<Record_ | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Record_>({});
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Record_ | null>(null);

  const tableFields = useMemo(
    () => config.fields.filter((field) => !field.hideInTable),
    [config.fields],
  );

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const result = await api.list(slug, search ? { search } : undefined);
      setItems(result.items);
    } catch (caught) {
      setLoadError(caught instanceof Error ? caught.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [slug, search]);

  useEffect(() => {
    const timer = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, search]);

  function openCreate() {
    setForm(defaultsFor(config.fields));
    setCreating(true);
  }

  function openEdit(item: Record_) {
    setForm({ ...item });
    setEditing(item);
  }

  function closeDialog() {
    setCreating(false);
    setEditing(null);
    setForm({});
  }

  async function handleSave() {
    const missing = config.fields.filter(
      (field) => field.required && !String(form[field.name] ?? "").trim(),
    );
    if (missing.length > 0) {
      toast.error(`${missing.map((f) => f.label).join(", ")} required`);
      return;
    }

    setSaving(true);
    try {
      const payload = Object.fromEntries(
        config.fields.map((field) => [field.name, form[field.name]]),
      );

      if (editing) {
        await api.update(slug, String(editing._id), payload);
        toast.success(`${config.singular} updated`);
      } else {
        await api.create(slug, payload);
        toast.success(`${config.singular} created`);
      }
      closeDialog();
      await load();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    try {
      await api.remove(slug, String(deleteTarget._id));
      toast.success(`${config.singular} deleted`);
      setDeleteTarget(null);
      await load();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Delete failed");
    }
  }

  const dialogOpen = creating || editing !== null;

  return (
    <div className="space-y-6 p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-h1 text-foreground">{config.label}</h1>
          <p className="text-muted-foreground text-sm">{config.description}</p>
        </div>
        <Button onClick={openCreate}>Add {config.singular.toLowerCase()}</Button>
      </header>

      <Input
        placeholder={`Search ${config.label.toLowerCase()}…`}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {loadError ? (
        <div className="border-destructive/40 bg-destructive/5 rounded-md border p-4">
          <p className="text-destructive text-sm font-medium">{loadError}</p>
          <p className="text-muted-foreground mt-1 text-xs">
            Check that the database is running, then try again.
          </p>
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
      ) : items.length === 0 ? (
        <div className="rounded-md border border-dashed p-10 text-center">
          <p className="text-muted-foreground text-sm">
            No {config.label.toLowerCase()} yet.
          </p>
          <Button variant="outline" size="sm" className="mt-3" onClick={openCreate}>
            Add the first one
          </Button>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                {tableFields.map((field) => (
                  <TableHead key={field.name}>{field.label}</TableHead>
                ))}
                <TableHead className="w-32 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={String(item._id)}>
                  {tableFields.map((field) => (
                    <TableCell key={field.name}>
                      <CellValue field={field} value={item[field.name]} />
                    </TableCell>
                  ))}
                  <TableCell className="space-x-2 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEdit(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => setDeleteTarget(item)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={(open) => !open && closeDialog()}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? `Edit ${config.singular}` : `New ${config.singular}`}
            </DialogTitle>
            <DialogDescription>{config.description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-2 sm:grid-cols-2">
            {config.fields.map((field) => (
              <div
                key={field.name}
                className={
                  field.type === "textarea" || field.type === "image"
                    ? "sm:col-span-2"
                    : undefined
                }
              >
                <FieldInput
                  field={field}
                  value={form[field.name]}
                  onChange={(value) =>
                    setForm((prev) => ({ ...prev, [field.name]: value }))
                  }
                />
              </div>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeDialog} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete this {config.singular.toLowerCase()}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes it from the website. It cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function CellValue({ field, value }: { field: FieldDef; value: unknown }) {
  if (field.type === "image") {
    return value ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={String(value)}
        alt=""
        className="h-10 w-16 rounded border object-cover"
      />
    ) : (
      <span className="text-muted-foreground text-xs">—</span>
    );
  }

  if (field.type === "boolean") {
    return (
      <Badge variant={value ? "default" : "secondary"}>
        {value ? "Yes" : "No"}
      </Badge>
    );
  }

  if (field.type === "date") {
    if (!value) return <span className="text-muted-foreground text-xs">—</span>;
    const date = new Date(String(value));
    return <span>{Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString()}</span>;
  }

  if (field.type === "select") {
    return value ? <Badge variant="outline">{String(value)}</Badge> : <span>—</span>;
  }

  const text = Array.isArray(value) ? value.join(", ") : String(value ?? "");
  if (!text) return <span className="text-muted-foreground text-xs">—</span>;
  return (
    <span className="line-clamp-2 max-w-xs" title={text}>
      {text}
    </span>
  );
}

function defaultsFor(fields: readonly FieldDef[]): Record_ {
  const initial: Record_ = {};
  for (const field of fields) {
    switch (field.type) {
      case "boolean":
        initial[field.name] = field.name === "isActive";
        break;
      case "number":
        initial[field.name] = 0;
        break;
      case "select":
        initial[field.name] = field.options?.[0] ?? "";
        break;
      case "tags":
        initial[field.name] = [];
        break;
      case "date":
        initial[field.name] = null;
        break;
      default:
        initial[field.name] = "";
    }
  }
  return initial;
}
