"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { api, type Record_ } from "@/lib/client-api";
import { DEFAULT_THEME_KEY } from "@/lib/theme-presets";
import { ThemeSwatchPicker } from "@/components/theme-swatch-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/**
 * Site identity lives in the database rather than in code, which is what keeps
 * this dashboard school-agnostic: the public site reads these values, so
 * rebranding for a new institution never means editing a component.
 */
const SECTIONS = [
  {
    title: "Identity",
    description: "Names and descriptions used across the public site.",
    fields: [
      { name: "siteName", label: "School name" },
      { name: "shortName", label: "Short name" },
      { name: "tagline", label: "Tagline" },
      { name: "establishedYear", label: "Established year" },
      { name: "eiin", label: "EIIN" },
      { name: "mpoCode", label: "MPO code" },
      { name: "institutionCode", label: "Institution code" },
      {
        name: "educationBoard",
        label: "Education board",
        placeholder: "e.g. Board of Intermediate and Secondary Education, Rajshahi",
      },
      {
        name: "institutionType",
        label: "Institution type",
        placeholder: "e.g. Secondary School",
      },
      { name: "about", label: "About", multiline: true },
      { name: "missionStatement", label: "Mission", multiline: true },
      { name: "visionStatement", label: "Vision", multiline: true },
    ],
  },
  {
    title: "Academic information",
    description:
      "Shifts, versions and levels taught — published as required by DSHE.",
    fields: [
      {
        name: "teachingInfo",
        label: "Teaching information",
        multiline: true,
        placeholder:
          "e.g. Day shift, Bangla version, Classes 6–10 under Dhaka Education Board.",
      },
      {
        name: "administrativeInfo",
        label: "Administrative information",
        multiline: true,
        placeholder:
          "How the institution is administered — office structure, working hours, who to approach for what.",
      },
    ],
  },
  {
    title: "Branding",
    description: "Logo and focus colour.",
    fields: [
      { name: "logoUrl", label: "Logo URL" },
      { name: "faviconUrl", label: "Favicon URL" },
      {
        name: "primaryColor",
        label: "Custom colour override (advanced)",
        placeholder: "e.g. oklch(0.48 0.14 250) or #1d4ed8",
        multiline: false,
        helpText:
          "Only needed for a shade the swatches above don't cover — this replaces the picker entirely when set. Leave blank normally.",
      },
    ],
  },
  {
    title: "Contact",
    description: "Shown in the site footer and contact page.",
    fields: [
      { name: "address", label: "Address", multiline: true },
      { name: "phone", label: "Phone" },
      { name: "mobile", label: "Mobile" },
      { name: "email", label: "Email" },
      { name: "officeHours", label: "Office hours" },
      { name: "mapEmbedUrl", label: "Google Maps embed URL" },
    ],
  },
] as const;

/** Settings stored as nested objects rather than flat keys. */
const NESTED_GROUPS = [
  {
    key: "infoCentre",
    title: "Information service centre",
    description:
      "তথ্য সেবা কেন্দ্র — the public help desk. Required by DSHE.",
    fields: [
      { name: "address", label: "Address" },
      { name: "mobile", label: "Mobile" },
      { name: "phone", label: "Phone" },
      { name: "email", label: "Email" },
    ],
  },
  {
    key: "grievanceOfficer",
    title: "Grievance redress officer",
    description:
      "অভিযোগ নিষ্পত্তি কর্মকর্তা — who complaints go to. Required by DSHE.",
    fields: [
      { name: "name", label: "Name" },
      { name: "designation", label: "Designation" },
      { name: "address", label: "Office address" },
      { name: "mobile", label: "Mobile" },
      { name: "phone", label: "Phone" },
      { name: "email", label: "Email" },
    ],
  },
  {
    key: "socialLinks",
    title: "Social links",
    description: "Leave blank to hide an icon.",
    fields: [
      { name: "facebook", label: "Facebook" },
      { name: "youtube", label: "YouTube" },
      { name: "linkedin", label: "LinkedIn" },
      { name: "instagram", label: "Instagram" },
    ],
  },
] as const;

const MPO_STATUS_LABELS: Record<string, string> = {
  unset: "Not published",
  enlisted: "Enlisted",
  pending: "Application pending",
  "not-enlisted": "Not enlisted",
};

export default function SettingsPage() {
  const [form, setForm] = useState<Record_>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const settings = await api.getSettings<Record_>();
        setForm(settings ?? {});
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : "Failed to load");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function set(name: string, value: string) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function setNested(group: string, name: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [group]: { ...(prev[group] ?? {}), [name]: value },
    }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload: Record_ = {};
      for (const group of NESTED_GROUPS) {
        payload[group.key] = form[group.key] ?? {};
      }
      for (const section of SECTIONS) {
        for (const field of section.fields) {
          payload[field.name] = form[field.name] ?? "";
        }
      }
      payload.mpoStatus = form.mpoStatus ?? "";
      payload.admissionOpen = Boolean(form.admissionOpen);
      await api.updateSettings(payload);
      toast.success("Settings saved");
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
          <h1 className="text-h1 text-foreground">Site settings</h1>
          <p className="text-muted-foreground text-sm">
            These values appear on the public website.
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

      {SECTIONS.map((section) => (
        <Card key={section.title}>
          <CardHeader>
            <CardTitle className="text-base">{section.title}</CardTitle>
            <CardDescription>{section.description}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {section.title === "Branding" && (
              <div className="space-y-2 sm:col-span-2">
                <Label>Focus colour</Label>
                <ThemeSwatchPicker
                  initialKey={form.themeColor || DEFAULT_THEME_KEY}
                />
              </div>
            )}
            {section.fields.map((field) => {
              const multiline = "multiline" in field && field.multiline;
              const helpText = "helpText" in field ? field.helpText : undefined;
              return (
                <div
                  key={field.name}
                  className={multiline ? "space-y-2 sm:col-span-2" : "space-y-2"}
                >
                  <Label htmlFor={field.name}>{field.label}</Label>
                  {multiline ? (
                    <Textarea
                      id={field.name}
                      rows={3}
                      value={String(form[field.name] ?? "")}
                      onChange={(e) => set(field.name, e.target.value)}
                    />
                  ) : (
                    <Input
                      id={field.name}
                      placeholder={
                        "placeholder" in field ? field.placeholder : undefined
                      }
                      value={String(form[field.name] ?? "")}
                      onChange={(e) => set(field.name, e.target.value)}
                    />
                  )}
                  {helpText && (
                    <p className="text-muted-foreground text-xs">{helpText}</p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Admission & MPO</CardTitle>
          <CardDescription>
            Opening admission turns on the Apply Now form on the public site;
            closing it swaps the button for Admission Info and stops new
            applications. Detailed admission content is under Admission info.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="admissionOpen">Admission open</Label>
            <div className="flex h-9 items-center gap-3">
              <Switch
                id="admissionOpen"
                checked={Boolean(form.admissionOpen)}
                onCheckedChange={(checked) =>
                  setForm((prev) => ({ ...prev, admissionOpen: checked }))
                }
              />
              <span className="text-muted-foreground text-sm">
                {form.admissionOpen ? "Open" : "Closed"}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="mpoStatus">MPO status</Label>
            <Select
              value={String(form.mpoStatus || "unset")}
              onValueChange={(next) =>
                setForm((prev) => ({
                  ...prev,
                  mpoStatus: next === "unset" ? "" : next,
                }))
              }
            >
              <SelectTrigger id="mpoStatus" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(MPO_STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">
              Only publish a status the institution has confirmed officially.
            </p>
          </div>
        </CardContent>
      </Card>

      {NESTED_GROUPS.map((group) => (
        <Card key={group.key}>
          <CardHeader>
            <CardTitle className="text-base">{group.title}</CardTitle>
            <CardDescription>{group.description}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            {group.fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={`${group.key}-${field.name}`}>
                  {field.label}
                </Label>
                <Input
                  id={`${group.key}-${field.name}`}
                  value={String(form[group.key]?.[field.name] ?? "")}
                  onChange={(e) =>
                    setNested(group.key, field.name, e.target.value)
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
