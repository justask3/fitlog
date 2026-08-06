/**
 * Design language — locked in as the source of truth for every screen.
 * Gold/amber "stat-card" direction: floating cards with shadow, a single
 * saturated accent for CTAs/icons/hero numbers, light and dark variants.
 * Typography defaults to the system font; Press Start 2P is an opt-in
 * "Pixel" Style (Settings -> Style), not the default look. Any screen
 * deviating from this should be flagged, not silently drifted. Colors and
 * typography are theme-dependent — read them via `useTheme()` (see
 * `./ThemeProvider`), not by importing a static object.
 */

export type ColorPalette = {
  background: string;
  surface: string;
  primary: string;
  primaryLight: string;
  accentBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  danger: string;
  white: string;
  noActivity: string;
};

export const lightColors: ColorPalette = {
  background: "#F4F8F7",
  surface: "#FFFFFF",
  // Golden-amber, not a pale pastel: white icons/text sit on this in a few
  // real spots (FAB, Save button, profile avatar) and a true light yellow
  // fails contrast there — this keeps the "yellow" read while staying legible.
  primary: "#D9A404",
  primaryLight: "#FDF0C4",
  accentBorder: "#D9A404",
  textPrimary: "#1B2429",
  textSecondary: "#5F6B70",
  textMuted: "#8D9A9E",
  danger: "#A32D2D",
  white: "#FFFFFF",
  noActivity: "#E4ECEB",
};

export const darkColors: ColorPalette = {
  background: "#12181A",
  surface: "#1C2426",
  primary: "#E8B923",
  primaryLight: "#4A3D14",
  accentBorder: "#E8B923",
  textPrimary: "#EDF3F3",
  textSecondary: "#A9B4B6",
  textMuted: "#7C8688",
  danger: "#E5605C",
  white: "#FFFFFF",
  noActivity: "#2A3335",
};

/**
 * Fixed exercise-category palette, validated with the dataviz skill's
 * validate_palette.js against this app's white card surface (adjacent-pair
 * CVD gate for stacked bars). Order is the stacking/legend order — never
 * re-sorted by value, since color here identifies the category, not its size.
 * Dark values reuse the same skill reference palette's own documented dark
 * column for these hues.
 */
export const categoryOrder = [
  "chest",
  "legs",
  "back",
  "shoulders",
  "triceps",
  "biceps",
  "core",
  "cardio",
] as const;

type CategoryColors = Record<(typeof categoryOrder)[number], string>;

export const lightCategoryColors: CategoryColors = {
  chest: "#2a78d6",
  legs: "#eb6834",
  back: "#1baf7a",
  shoulders: "#eda100",
  triceps: "#e87ba4",
  biceps: "#008300",
  core: "#4a3aa7",
  cardio: "#e34948",
};

export const darkCategoryColors: CategoryColors = {
  chest: "#3987e5",
  legs: "#d95926",
  back: "#199e70",
  shoulders: "#c98500",
  triceps: "#d55181",
  biceps: "#008300",
  core: "#9085e9",
  cardio: "#e66767",
};

export const radius = {
  card: 20,
  pill: 999,
  input: 12,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
} as const;

export const PIXEL_FONT = "PressStart2P_400Regular";

type TextStylePreset = {
  fontSize: number;
  fontWeight: "400" | "500" | "600" | "700";
  fontFamily?: string;
  letterSpacing?: number;
  textTransform?: "uppercase";
};

export type TypographyPalette = {
  title: TextStylePreset;
  body: TextStylePreset;
  label: TextStylePreset;
  value: TextStylePreset;
  // Uppercase, tracked section/field header — e.g. "RECENT WORKOUTS", "SIZE"
  microLabel: TextStylePreset;
  // Big bold number for a hero stat (e.g. streak count)
  hero: TextStylePreset;
};

/** The original, pre-pixel-font look — this is the default Style. */
export const defaultTypography: TypographyPalette = {
  title: { fontSize: 20, fontWeight: "500" },
  body: { fontSize: 15, fontWeight: "400" },
  label: { fontSize: 12, fontWeight: "500" },
  value: { fontSize: 18, fontWeight: "500" },
  microLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  hero: { fontSize: 32, fontWeight: "700" },
};

/**
 * Opt-in "Pixel" Style (Settings -> Style). Sizes are bumped a couple px
 * from `defaultTypography` — Press Start 2P's blocky glyphs need more room
 * to stay legible at small sizes.
 */
export const pixelTypography: TypographyPalette = {
  title: { fontSize: 18, fontWeight: "500", fontFamily: PIXEL_FONT },
  body: { fontSize: 13, fontWeight: "400", fontFamily: PIXEL_FONT },
  label: { fontSize: 13, fontWeight: "500", fontFamily: PIXEL_FONT },
  value: { fontSize: 15, fontWeight: "500", fontFamily: PIXEL_FONT },
  microLabel: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    fontFamily: PIXEL_FONT,
  },
  hero: { fontSize: 26, fontWeight: "700", fontFamily: PIXEL_FONT },
};
