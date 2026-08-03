/**
 * Design language — locked in as the source of truth for every screen.
 * Playful/sage direction: soft green background, flat white cards,
 * forest-green primary action. Any screen deviating from this should
 * be flagged, not silently drifted.
 */

export const colors = {
  background: "#E8F0E6",
  surface: "#FFFFFF",
  primary: "#3B6D11",
  primaryLight: "#97C459",
  accentBorder: "#97C459",
  textPrimary: "#1D3B2A",
  textSecondary: "#5F5E5A",
  textMuted: "#888780",
  danger: "#A32D2D",
  white: "#FFFFFF",
} as const;

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
};
