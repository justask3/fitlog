/**
 * Design language — locked in as the source of truth for every screen.
 * Teal "stat-card" direction (replaces the earlier sage/playful one):
 * light neutral background, floating white cards with shadow, a single
 * saturated teal accent for CTAs/icons/hero numbers. Any screen deviating
 * from this should be flagged, not silently drifted.
 */

export const colors = {
  background: "#F4F8F7",
  surface: "#FFFFFF",
  primary: "#0FB6C2",
  primaryLight: "#B7ECEF",
  accentBorder: "#0FB6C2",
  textPrimary: "#1B2429",
  textSecondary: "#5F6B70",
  textMuted: "#8D9A9E",
  danger: "#A32D2D",
  white: "#FFFFFF",
  noActivity: "#E4ECEB",
} as const;

/**
 * Fixed exercise-category palette, validated with the dataviz skill's
 * validate_palette.js against this app's white card surface (adjacent-pair
 * CVD gate for stacked bars). Order is the stacking/legend order — never
 * re-sorted by value, since color here identifies the category, not its size.
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

export const categoryColors: Record<(typeof categoryOrder)[number], string> = {
  chest: "#2a78d6",
  legs: "#eb6834",
  back: "#1baf7a",
  shoulders: "#eda100",
  triceps: "#e87ba4",
  biceps: "#008300",
  core: "#4a3aa7",
  cardio: "#e34948",
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

export const typography = {
  title: { fontSize: 20, fontWeight: "500" as const },
  body: { fontSize: 15, fontWeight: "400" as const },
  label: { fontSize: 12, fontWeight: "500" as const },
  value: { fontSize: 18, fontWeight: "500" as const },
  // Uppercase, tracked section/field header — e.g. "RECENT WORKOUTS", "SIZE"
  microLabel: {
    fontSize: 11,
    fontWeight: "600" as const,
    letterSpacing: 0.8,
    textTransform: "uppercase" as const,
  },
  // Big bold number for a hero stat (e.g. streak count)
  hero: { fontSize: 32, fontWeight: "700" as const },
};
