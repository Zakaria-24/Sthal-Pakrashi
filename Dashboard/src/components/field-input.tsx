"use client";

import { useRef, useState } from "react";

import type { FieldDef } from "@/lib/resource-config";
import { api } from "@/lib/client-api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** Renders the correct control for a field definition from the registry. */
export function FieldInput({
  field,
  value,
  onChange,
}: {
  field: FieldDef;
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  const id = `field-${field.name}`;

  const control = () => {
    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            id={id}
            rows={5}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
          />
        );

      case "number":
        return (
          <Input
            id={id}
            type="number"
            value={value === undefined || value === null ? "" : String(value)}
            onChange={(e) =>
              onChange(e.target.value === "" ? 0 : Number(e.target.value))
            }
          />
        );

      case "date":
        return (
          <Input
            id={id}
            type="date"
            value={toDateInput(value)}
            onChange={(e) => onChange(e.target.value || null)}
          />
        );

      case "boolean":
        return (
          <div className="flex h-9 items-center">
            <Switch
              id={id}
              checked={Boolean(value)}
              onCheckedChange={(checked) => onChange(checked)}
            />
          </div>
        );

      case "select":
        return (
          <Select
            value={String(value ?? field.options?.[0] ?? "")}
            onValueChange={(next) => onChange(next)}
          >
            <SelectTrigger id={id} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "tags":
        return (
          <Input
            id={id}
            placeholder="Comma separated"
            value={Array.isArray(value) ? value.join(", ") : String(value ?? "")}
            onChange={(e) =>
              onChange(
                e.target.value
                  .split(",")
                  .map((tag) => tag.trim())
                  .filter(Boolean),
              )
            }
          />
        );

      case "image":
        return (
          <ImageField
            id={id}
            value={String(value ?? "")}
            onChange={(next) => onChange(next)}
          />
        );

      default:
        return (
          <Input
            id={id}
            value={String(value ?? "")}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {field.label}
        {field.required && <span className="text-destructive"> *</span>}
      </Label>
      {control()}
      {field.helpText && (
        <p className="text-muted-foreground text-xs">{field.helpText}</p>
      )}
    </div>
  );
}

/**
 * Accepts a pasted URL or uploads a file. Upload needs Cloudinary configured;
 * when it isn't, the error explains that and the URL box still works.
 */
function ImageField({
  id,
  value,
  onChange,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const { url } = await api.upload(file);
      onChange(url);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          id={id}
          value={value}
          placeholder="https://… or upload"
          onChange={(e) => onChange(e.target.value)}
        />
        <Button
          type="button"
          variant="outline"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? "Uploading…" : "Upload"}
        </Button>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {error && <p className="text-destructive text-xs">{error}</p>}
      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt=""
          className="h-20 w-32 rounded border object-cover"
        />
      )}
    </div>
  );
}

function toDateInput(value: unknown): string {
  if (!value) return "";
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}
