"use client";

import { Fragment, useState, useTransition } from "react";

import { submitApplicationAction } from "@/app/actions/apply";
import { buttonVariants } from "@/components/ui/button";
import { CheckIcon } from "@/components/ui/icons";
import { useI18n } from "@/lib/i18n/provider";
import { localizeDigits, type MessageKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const STEP_KEYS: MessageKey[] = [
  "page.apply.stepStudent",
  "page.apply.stepGuardian",
  "page.apply.stepAcademic",
  "page.apply.stepDocuments",
  "page.apply.stepReview",
];

const DOC_KEYS = [1, 2, 3, 4, 5] as const;

const MAX_FILE_BYTES = 5 * 1024 * 1024;
const REQUIRED_FIELDS = [
  "studentName",
  "studentDob",
  "classApplying",
  "guardianName",
  "guardianPhone",
] as const;

/** Error alert copy for each way a submission can fail. */
const ERRORS = {
  required: ["page.apply.errRequiredTitle", "page.apply.errRequiredDesc"],
  closed: ["page.apply.closedTitle", "page.apply.closedDesc"],
  invalid: ["page.apply.errInvalidTitle", "page.apply.errInvalidDesc"],
  file: ["page.apply.errFileTitle", "page.apply.errFileDesc"],
  "too-many": ["page.apply.errBusyTitle", "page.apply.errBusyDesc"],
  unavailable: ["page.apply.errUnavailableTitle", "page.apply.errUnavailableDesc"],
} as const satisfies Record<string, readonly [MessageKey, MessageKey]>;
type ErrorKind = keyof typeof ERRORS;

const EMPTY = {
  studentName: "",
  studentDob: "",
  classApplying: "",
  guardianName: "",
  guardianPhone: "",
  guardianEmail: "",
  prevSchool: "",
  prevClass: "",
  prevResult: "",
};
type Field = keyof typeof EMPTY;

const INPUT =
  "w-full rounded-lg border border-line bg-white px-3.5 py-3 font-sans text-body-sm text-ink outline-none transition-colors duration-200 placeholder:text-ink-soft focus:border-green";

const OUTLINE = buttonVariants({ variant: "outline", shape: "pill" });

/**
 * Five-step admission application (Student → Guardian → Academic → Documents →
 * Review), as in the design. Submission sends the fields and the chosen
 * documents to the CMS through `submitApplicationAction`; an Application ID is
 * only ever shown when the CMS returned one, and every failure is reported
 * plainly rather than pretending the application was sent.
 */
export function ApplyForm() {
  const { t, locale } = useI18n();
  const [step, setStep] = useState(0);
  const [data, setData] = useState(EMPTY);
  const [files, setFiles] = useState<Record<number, File>>({});
  const [fileErrors, setFileErrors] = useState<Record<number, MessageKey>>({});
  const [error, setError] = useState<ErrorKind | null>(null);
  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const set = (field: Field) => (value: string) =>
    setData((current) => ({ ...current, [field]: value }));

  function submit() {
    if (REQUIRED_FIELDS.some((field) => !data[field].trim())) {
      setError("required");
      return;
    }
    setError(null);

    const form = new FormData();
    form.set("data", JSON.stringify(data));
    for (const n of DOC_KEYS) {
      const file = files[n];
      if (!file) continue;
      form.set(`document_${n}`, file);
      form.set(`label_${n}`, t(`page.admission.doc${n}`));
    }

    startTransition(async () => {
      const result = await submitApplicationAction(form);
      if (result.ok) setApplicationId(result.id);
      else setError(result.reason);
    });
  }

  function chooseFile(n: number, file: File | undefined) {
    const without = <T,>(record: Record<number, T>) => {
      const next = { ...record };
      delete next[n];
      return next;
    };
    setFiles(without);
    setFileErrors(without);
    if (!file) return;
    if (file.size > MAX_FILE_BYTES) {
      setFileErrors((current) => ({ ...current, [n]: "page.apply.fileTooBig" }));
      return;
    }
    if (!/^(image\/|application\/pdf)/.test(file.type)) {
      setFileErrors((current) => ({ ...current, [n]: "page.apply.fileBadType" }));
      return;
    }
    setFiles((current) => ({ ...current, [n]: file }));
  }

  function reset() {
    setStep(0);
    setData(EMPTY);
    setFiles({});
    setFileErrors({});
    setError(null);
    setApplicationId(null);
  }

  if (applicationId) {
    return (
      <div className="rounded-card-lg border border-line bg-white px-9 py-11 text-center animate-fade-in-up">
        <span className="mx-auto mb-4.5 flex size-15 items-center justify-center rounded-full bg-surface text-green">
          <CheckIcon className="size-6.5" />
        </span>
        <h2 className="mb-2.5 font-heading text-h3 font-extrabold text-ink">
          {t("page.apply.submittedTitle")}
        </h2>
        <p className="mb-5 text-body-sm text-ink-soft">
          {t("page.apply.submittedDesc")}
        </p>
        <div className="mb-6 inline-block rounded-xl bg-surface p-4">
          <p className="mb-1 text-xs font-semibold tracking-wider text-ink-soft">
            {t("page.apply.applicationId")}
          </p>
          <p className="font-heading text-stat text-green">{applicationId}</p>
        </div>
        <div>
          <button type="button" onClick={reset} className={cn(OUTLINE, "cursor-pointer")}>
            {t("page.apply.startNew")}
          </button>
        </div>
      </div>
    );
  }

  const text = (
    field: Field,
    placeholder: MessageKey,
    type: "text" | "date" | "tel" | "email" = "text",
  ) => (
    <input
      key={field}
      type={type}
      value={data[field]}
      onChange={(event) => set(field)(event.target.value)}
      placeholder={t(placeholder)}
      aria-label={t(placeholder)}
      className={cn(INPUT, type === "date" && "text-ink-soft")}
    />
  );

  const review: [MessageKey, string][] = [
    ["page.apply.studentName", data.studentName],
    ["page.apply.dateOfBirth", data.studentDob],
    ["page.apply.classApplyingFor", data.classApplying],
    ["page.apply.guardianName", data.guardianName],
    ["page.apply.guardianPhone", data.guardianPhone],
    ["page.apply.guardianEmail", data.guardianEmail],
    ["page.apply.previousSchool", data.prevSchool],
    ["page.apply.previousClass", data.prevClass],
    ["page.apply.previousResult", data.prevResult],
  ];

  const heading = (key: MessageKey) => (
    <h2 className="mb-5 font-heading text-body font-bold text-ink">{t(key)}</h2>
  );

  return (
    <div>
      {/* stepper — dots joined by lines, labels beneath (as in the design) */}
      <ol
        aria-label={t("page.apply.step", { n: localizeDigits(step + 1, locale), total: localizeDigits(5, locale) })}
        className="flex items-center gap-1.5"
      >
        {STEP_KEYS.map((key, index) => {
          const reached = index <= step;
          return (
            <Fragment key={key}>
              <li
                aria-current={index === step ? "step" : undefined}
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full font-heading text-small font-bold transition-colors duration-300",
                  reached ? "bg-green text-white" : "bg-surface text-ink-soft",
                )}
              >
                <span className="sr-only">{t(key)}</span>
                {index < step ? (
                  <CheckIcon className="size-3.5" />
                ) : (
                  <span aria-hidden>{localizeDigits(index + 1, locale)}</span>
                )}
              </li>
              <li
                aria-hidden
                className={cn(
                  "h-0.5 flex-1 transition-colors duration-300",
                  index < step ? "bg-green" : "bg-line",
                )}
              />
            </Fragment>
          );
        })}
      </ol>
      <div aria-hidden className="mt-2 mb-8 flex justify-between">
        {STEP_KEYS.map((key, index) => (
          <span
            key={key}
            className={cn(
              "flex-1 text-center text-nano font-semibold sm:text-xs",
              index <= step ? "text-green" : "text-ink-soft",
            )}
          >
            {t(key)}
          </span>
        ))}
      </div>

      <div className="rounded-card-lg border border-line bg-white px-5 py-7 sm:px-7.5 sm:py-8">
        {step === 0 && (
          <>
            {heading("page.apply.studentInfo")}
            <div className="flex flex-col gap-3.5">
              {text("studentName", "page.apply.studentFullName")}
              {text("studentDob", "page.apply.dob", "date")}
              {text("classApplying", "page.apply.classApplying")}
            </div>
          </>
        )}
        {step === 1 && (
          <>
            {heading("page.apply.guardianInfo")}
            <div className="flex flex-col gap-3.5">
              {text("guardianName", "page.apply.guardianFullName")}
              {text("guardianPhone", "page.apply.mobileNumber", "tel")}
              {text("guardianEmail", "page.apply.emailAddress", "email")}
            </div>
          </>
        )}
        {step === 2 && (
          <>
            {heading("page.apply.academicInfo")}
            <div className="flex flex-col gap-3.5">
              {text("prevSchool", "page.apply.prevSchool")}
              {text("prevClass", "page.apply.lastClass")}
              {text("prevResult", "page.apply.resultGpa")}
            </div>
          </>
        )}
        {step === 3 && (
          <>
            {heading("page.apply.documentUpload")}
            <div className="flex flex-col gap-3">
              {DOC_KEYS.map((n) => (
                <label
                  key={n}
                  className="flex cursor-pointer items-center justify-between gap-3.5 rounded-xl border-[1.5px] border-dashed border-line px-4 py-3.5 transition-[border-color,background-color] duration-200 hover:border-green hover:bg-surface has-focus-visible:border-green has-focus-visible:ring-2 has-focus-visible:ring-green"
                >
                  <span className="min-w-0">
                    <span className="block text-small font-semibold text-ink">
                      {t(`page.admission.doc${n}`)}
                    </span>
                    <span
                      className={cn(
                        "mt-0.5 block text-xs",
                        fileErrors[n] ? "font-semibold text-gold-dark" : "text-ink-soft",
                      )}
                    >
                      {fileErrors[n]
                        ? t(fileErrors[n])
                        : files[n]
                          ? t("page.apply.fileChosen", { file: files[n].name })
                          : t(`page.admission.doc${n}Desc`)}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-pill bg-surface px-3.5 py-2 text-xs font-bold text-green">
                    {t("page.apply.chooseFile")}
                  </span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="sr-only"
                    onChange={(event) => chooseFile(n, event.target.files?.[0])}
                  />
                </label>
              ))}
            </div>
          </>
        )}
        {step === 4 && (
          <>
            {heading("page.apply.review")}
            <dl className="flex flex-col gap-2.5 text-small">
              {review.map(([label, value], index) => (
                <div
                  key={label}
                  className={cn(
                    "flex justify-between gap-4 pb-2",
                    index < review.length - 1 && "border-b border-line",
                  )}
                >
                  <dt className="text-ink-soft">{t(label)}</dt>
                  <dd className="text-right font-semibold break-words text-ink">
                    {value || "—"}
                  </dd>
                </div>
              ))}
            </dl>
          </>
        )}

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-gold-dark bg-gold-tint px-4 py-3.5 text-small text-on-gold-soft"
          >
            <p className="font-heading font-bold">{t(ERRORS[error][0])}</p>
            <p className="mt-1">{t(ERRORS[error][1])}</p>
          </div>
        )}

        <div className="mt-7 flex justify-between gap-3">
          {step === 0 ? (
            <span />
          ) : (
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep((s) => Math.max(s - 1, 0));
              }}
              className={cn(OUTLINE, "cursor-pointer")}
            >
              {t("page.apply.back")}
            </button>
          )}
          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => Math.min(s + 1, 4))}
              className={cn(
                buttonVariants({ variant: "default", shape: "pill" }),
                "cursor-pointer px-6 hover:bg-gold hover:text-on-gold motion-safe:hover:-translate-y-0.5",
              )}
            >
              {t("page.apply.next")}
            </button>
          ) : (
            <button
              type="button"
              disabled={pending}
              onClick={submit}
              className={cn(
                buttonVariants({ variant: "gold", shape: "pill" }),
                "cursor-pointer px-6 motion-safe:hover:-translate-y-0.5",
              )}
            >
              {t("page.apply.submit")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
