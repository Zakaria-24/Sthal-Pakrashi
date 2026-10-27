"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { api, type Record_ } from "@/lib/client-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Admission management: the open/closed switch (stored on the site settings)
 * and the editable content of the public Admission Info page. List fields are
 * plain text — one item per line, "Label | value" for the paired ones — which
 * keeps the form as simple as the rest of the dashboard.
 */

type Pair = { a: string; b: string };

const toLines = (items: unknown): string =>
  Array.isArray(items) ? items.map(String).join("\n") : "";

const fromLines = (text: string): string[] =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

function pairsToText(items: unknown, a: string, b: string): string {
  if (!Array.isArray(items)) return "";
  return items
    .map((item: Record_) => `${item[a] ?? ""} | ${item[b] ?? ""}`.trim())
    .join("\n");
}

function textToPairs(text: string): Pair[] {
  return fromLines(text).map((line) => {
    const [first, ...rest] = line.split("|");
    return { a: first.trim(), b: rest.join("|").trim() };
  });
}

export default function AdmissionPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [toggling, setToggling] = useState(false);

  const [session, setSession] = useState("");
  const [eligibility, setEligibility] = useState("");
  const [process, setProcess] = useState("");
  const [documents, setDocuments] = useState("");
  const [fees, setFees] = useState("");
  const [dates, setDates] = useState("");
  const [instructions, setInstructions] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [settings, info] = await Promise.all([
          api.getSettings<Record_>(),
          api.getAdmissionInfo<Record_>(),
        ]);
        setOpen(Boolean(settings?.admissionOpen));
        setSession(info.academicSession ?? "");
        setEligibility(toLines(info.eligibility));
        setProcess(pairsToText(info.process, "title", "description"));
        setDocuments(toLines(info.requiredDocuments));
        setFees(pairsToText(info.fees, "label", "amount"));
        setDates(pairsToText(info.importantDates, "label", "value"));
        setInstructions(info.instructions ?? "");
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function toggleOpen(next: boolean) {
    setToggling(true);
    try {
      await api.updateSettings({ admissionOpen: next });
      setOpen(next);
      toast.success(next ? "Admission is now open" : "Admission is now closed");
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Could not update");
    } finally {
      setToggling(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      await api.updateAdmissionInfo({
        academicSession: session,
        eligibility: fromLines(eligibility),
        process: textToPairs(process).map((p) => ({ title: p.a, description: p.b })),
        requiredDocuments: fromLines(documents),
        fees: textToPairs(fees).map((p) => ({ label: p.a, amount: p.b })),
        importantDates: textToPairs(dates).map((p) => ({ label: p.a, value: p.b })),
        instructions,
      });
      toast.success("Admission information saved");
    } catch (caught) {
      toast.error(caught instanceof Error ? caught.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-h1 text-foreground">Admission info</h1>
          <p className="text-muted-foreground text-sm">
            What applicants see on the Admission Info page, and whether they can
            apply online.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </header>

      {error && (
        <div className="border-destructive/40 bg-destructive/5 rounded-md border p-4">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Online applications</CardTitle>
          <CardDescription>
            Open: the public site shows Apply Now and accepts applications.
            Closed: it shows Admission Info instead and the form rejects new
            submissions. Changes apply immediately.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-3">
          <Switch
            id="admissionOpen"
            checked={open}
            disabled={toggling}
            onCheckedChange={toggleOpen}
          />
          <Label htmlFor="admissionOpen">
            Admission is {open ? "open" : "closed"}
          </Label>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Admission information</CardTitle>
          <CardDescription>
            Leave a box empty to show “Not published” on the website. Only enter
            rules, fees and dates the institution has officially confirmed.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-5">
          <div className="space-y-2">
            <Label htmlFor="session">Academic session</Label>
            <Input
              id="session"
              value={session}
              placeholder="e.g. 2027"
              onChange={(e) => setSession(e.target.value)}
            />
          </div>
          <ListBox
            id="eligibility"
            label="Eligibility"
            help="One rule per line."
            value={eligibility}
            onChange={setEligibility}
          />
          <ListBox
            id="process"
            label="Application process"
            help="One step per line: Title | Description"
            value={process}
            onChange={setProcess}
          />
          <ListBox
            id="documents"
            label="Required documents"
            help="One document per line."
            value={documents}
            onChange={setDocuments}
          />
          <ListBox
            id="fees"
            label="Fees"
            help="One fee per line: Label | Amount"
            value={fees}
            onChange={setFees}
          />
          <ListBox
            id="dates"
            label="Important dates"
            help="One date per line: Label | Date"
            value={dates}
            onChange={setDates}
          />
          <ListBox
            id="instructions"
            label="Instructions"
            help="Shown as a note on the Admission Info page."
            value={instructions}
            onChange={setInstructions}
          />
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}

function ListBox({
  id,
  label,
  help,
  value,
  onChange,
}: {
  id: string;
  label: string;
  help: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-muted-foreground text-xs">{help}</p>
    </div>
  );
}
