import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * Singleton document holding the institution's identity and contact details.
 * Everything here is editable from the dashboard, so no school-specific value
 * is ever hard-coded in either project.
 */
const SettingsSchema = new Schema(
  {
    key: { type: String, default: "site", unique: true, immutable: true },

    siteName: { type: String, default: "" },
    shortName: { type: String, default: "" },
    tagline: { type: String, default: "" },
    about: { type: String, default: "" },
    missionStatement: { type: String, default: "" },
    visionStatement: { type: String, default: "" },
    establishedYear: { type: String, default: "" },
    eiin: { type: String, default: "" },

    /* --- DSHE-mandated disclosures --- */
    mpoCode: { type: String, default: "" },
    institutionType: { type: String, default: "" },
    institutionCode: { type: String, default: "" },
    /** The education board the institution is affiliated with. */
    educationBoard: { type: String, default: "" },
    /** MPO enlistment state. Empty = not published. */
    mpoStatus: {
      type: String,
      enum: ["", "enlisted", "pending", "not-enlisted"],
      default: "",
    },

    /**
     * Whether the public site accepts online applications. Closed by default:
     * an institution opts in when it is ready to receive them.
     */
    admissionOpen: { type: Boolean, default: false },
    /** Free text describing shifts, versions and levels taught. */
    teachingInfo: { type: String, default: "" },
    /** প্রশাসনিক তথ্য — how the institution is administered. */
    administrativeInfo: { type: String, default: "" },

    /** তথ্য সেবা কেন্দ্র — the public information service desk. */
    infoCentre: {
      address: { type: String, default: "" },
      mobile: { type: String, default: "" },
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
    },

    /** অভিযোগ নিষ্পত্তি কর্মকর্তা — grievance redress officer. */
    grievanceOfficer: {
      name: { type: String, default: "" },
      designation: { type: String, default: "" },
      address: { type: String, default: "" },
      mobile: { type: String, default: "" },
      phone: { type: String, default: "" },
      email: { type: String, default: "" },
    },

    logoUrl: { type: String, default: "" },
    faviconUrl: { type: String, default: "" },

    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    mobile: { type: String, default: "" },
    email: { type: String, default: "" },
    officeHours: { type: String, default: "" },
    mapEmbedUrl: { type: String, default: "" },

    socialLinks: {
      facebook: { type: String, default: "" },
      youtube: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      instagram: { type: String, default: "" },
    },

    /**
     * Key into THEME_PRESETS (src/lib/theme-presets.ts) — the swatch chosen
     * in the dashboard's focus-colour picker. Both apps fall back to the
     * "indigo" preset, hardcoded directly in globals.css, whenever this is
     * empty or the value doesn't match a known preset.
     */
    themeColor: { type: String, default: "" },

    /**
     * Advanced escape hatch: a raw CSS colour value that overrides the
     * picker entirely (e.g. a shade the 10 presets don't cover). Ignored
     * when empty, which is the normal case now that themeColor exists.
     */
    primaryColor: { type: String, default: "" },
  },
  { timestamps: true },
);

export type SettingsDoc = InferSchemaType<typeof SettingsSchema>;

export const Settings: Model<SettingsDoc> =
  (models.Settings as Model<SettingsDoc>) ??
  model<SettingsDoc>("Settings", SettingsSchema);
