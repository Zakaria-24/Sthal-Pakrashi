"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { api, type Record_ } from "@/lib/client-api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { PageHeader, PageShell } from "@/components/page-header";

const STATUSES = ["submitted", "under-review", "accepted", "rejected"] as const;

const STATUS_LABEL: Record<string, string> = {
  submitted: "Submitted",
  "under-review": "Under review",
  accepted: "Accepted",
  rejected: "Rejected",
};

const STATUS_VARIANT: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  submitted: "secondary",
  "under-review": "outline",
  accepted: "default",
  rejected: "destructive",
};

const PAGE_SIZE = 20;

const dateText = (value: unknown) => {
  if (!value) return "—";
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
};

/**
 * Admission applications: search, filter by status, open one to read every
 * field and download its documents, change its status. Reads and writes go to
 * the admin-only /api/applications endpoints.
 */
export function ApplicationsManager() {
  const [items, setItems] = useState<Record_[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [openId, setOpenId] = useState<string | null>(null);
  const [detail, setDetail] = useState<Record_ | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [newStatus, setNewStatus] = useState("submitted");
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const params: Record<string, string> = {
        page: String(page),
        limit: String(PAGE_SIZE),
      };
      if (status !== "all") params.status = status;
      if (search.trim()) params.search = search.trim();
      const result = await api.listApplications<Record_>(params);
      setItems(result.items);
      setTotal(result.total);
      setCounts(result.counts);
    } catch (caught) {
      setLoadError(caught instanceof Error ? caught.message : "Failed to load");
    } finally {
      setLoading(false);
    }
  }, [page, status, search]);

  useEffect(() => {
    const timer = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, search]);

  async function openApplication(id: string) {
    setOpenId(id);
    setDetail(null);
    setDetailLoading(true);
    try {
      const application = await api.getApplication<Record_>(id);
      setDetail(application);
      setNewStatus(String(application.status));
      setNote(String(application.adminNote ?? ""));
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not open");
      setOpenId(null);
    } finally {
      setDetailLoading(false);
    }
  }

  function closeDetail() {
    setOpenId(null);
    setDetail(null);
    setConfirmDelete(false);
  }

  async function handleSave() {
    if (!openId || !detail) return;
    setSaving(true);
    try {
      const body: Record_ = { adminNote: note };
      if (newStatus !== detail.status) body.status = newStatus;
      await api.updateApplication(openId, body);
      toast.success("Application updated");
      closeDetail();
      await load();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!openId) return;
    setDeleting(true);
    try {
      await api.removeApplication(openId);
      toast.success("Application deleted");
      closeDetail();
      await load();
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const all = Object.values(counts).reduce((sum, n) => sum + n, 0);

  return (
    <PageShell>
      <PageHeader
        eyebrow="Admission"
        title="Applications"
        description="Online admission applications. This information is private — it is never shown on the public website."
      />

      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder="Search by name, phone or application ID…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
        <div className="flex flex-wrap gap-2">
          {(["all", ...STATUSES] as const).map((value) => (
            <Button
              key={value}
              size="sm"
              variant={status === value ? "default" : "outline"}
              onClick={() => {
                setStatus(value);
                setPage(1);
              }}
            >
              {value === "all" ? "All" : STATUS_LABEL[value]} (
              {value === "all" ? all : (counts[value] ?? 0)})
            </Button>
          ))}
        </div>
      </div>

      {loadError ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-4">
          <p className="text-destructive text-sm font-medium">{loadError}</p>
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
          <p className="text-muted-foreground text-sm">No applications found.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Application ID</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Guardian phone</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={String(item._id)}>
                    <TableCell className="font-mono text-xs">
                      {item.applicationId}
                    </TableCell>
                    <TableCell>{item.studentName}</TableCell>
                    <TableCell>{item.classApplying}</TableCell>
                    <TableCell>{item.guardianPhone}</TableCell>
                    <TableCell>{dateText(item.submittedAt)}</TableCell>
                    <TableCell>
                      <Badge variant={STATUS_VARIANT[item.status] ?? "outline"}>
                        {STATUS_LABEL[item.status] ?? item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openApplication(String(item._id))}
                      >
                        Open
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {total} application{total === 1 ? "" : "s"} · page {page} of {pages}
            </span>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <Dialog open={openId !== null} onOpenChange={(open) => !open && closeDetail()}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {detail ? String(detail.applicationId) : "Application"}
            </DialogTitle>
            <DialogDescription>
              {detail
                ? `Submitted ${dateText(detail.submittedAt)}${detail.session ? ` · Session ${detail.session}` : ""}`
                : "Loading…"}
            </DialogDescription>
          </DialogHeader>

          {detailLoading || !detail ? (
            <Skeleton className="h-48 w-full" />
          ) : (
            <div className="space-y-5 py-2 text-sm">
              <Section title="Student">
                <Row label="Full name" value={detail.studentName} />
                <Row label="Date of birth" value={dateText(detail.studentDob)} />
                <Row label="Gender" value={detail.gender} />
                <Row label="Birth registration no." value={detail.birthRegistrationNo} />
                <Row label="Class applying for" value={detail.classApplying} />
              </Section>
              <Section title="Guardian">
                <Row label="Name" value={detail.guardianName} />
                <Row label="Relationship" value={detail.guardianRelationship} />
                <Row label="Father" value={detail.fatherName} />
                <Row label="Mother" value={detail.motherName} />
                <Row label="Phone" value={detail.guardianPhone} />
                <Row label="Email" value={detail.guardianEmail} />
              </Section>
              <Section title="Previous institution">
                <Row label="School" value={detail.prevSchool} />
                <Row label="Last class" value={detail.prevClass} />
                <Row label="Result / GPA" value={detail.prevResult} />
              </Section>

              <div className="space-y-2">
                <h3 className="font-medium">Documents</h3>
                {Array.isArray(detail.documents) && detail.documents.length > 0 ? (
                  <ul className="space-y-1">
                    {detail.documents.map((doc: Record_) => (
                      <li key={doc.slot}>
                        <a
                          href={doc.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline underline-offset-2"
                        >
                          {doc.label || `Document ${doc.slot}`} — {doc.fileName}
                        </a>{" "}
                        <span className="text-muted-foreground text-xs">
                          ({Math.max(1, Math.round(Number(doc.size) / 1024))} KB)
                        </span>
                      </li>
                    ))}
                    <li className="text-muted-foreground text-xs">
                      Links are private and expire after 10 minutes — reopen the
                      application for a fresh one.
                    </li>
                  </ul>
                ) : (
                  <p className="text-muted-foreground">No documents uploaded.</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="application-status">Status</Label>
                  <Select value={newStatus} onValueChange={(next) => setNewStatus(String(next))}>
                    <SelectTrigger id="application-status" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map((value) => (
                        <SelectItem key={value} value={value}>
                          {STATUS_LABEL[value]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="application-note">Internal note</Label>
                  <Textarea
                    id="application-note"
                    rows={3}
                    value={note}
                    placeholder="Only visible to administrators."
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>

              {Array.isArray(detail.statusHistory) && detail.statusHistory.length > 0 && (
                <div className="space-y-1">
                  <h3 className="font-medium">History</h3>
                  <ul className="text-muted-foreground space-y-0.5 text-xs">
                    {detail.statusHistory.map((entry: Record_, index: number) => (
                      <li key={index}>
                        {dateText(entry.at)} · {STATUS_LABEL[entry.status] ?? entry.status}
                        {entry.by ? ` · ${entry.by}` : ""}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="sm:justify-between">
            <Button
              variant="ghost"
              className="text-destructive hover:text-destructive"
              disabled={!detail || deleting}
              onClick={() => setConfirmDelete(true)}
            >
              Delete
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={closeDetail} disabled={saving}>
                Close
              </Button>
              <Button onClick={handleSave} disabled={!detail || saving}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this application?</AlertDialogTitle>
            <AlertDialogDescription>
              The record and its uploaded documents are permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <h3 className="font-medium">{title}</h3>
      <dl className="grid gap-x-4 gap-y-1 sm:grid-cols-2">{children}</dl>
    </div>
  );
}

function Row({ label, value }: { label: string; value: unknown }) {
  return (
    <div className="flex justify-between gap-3 border-b py-1">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right break-words">{String(value ?? "") || "—"}</dd>
    </div>
  );
}
