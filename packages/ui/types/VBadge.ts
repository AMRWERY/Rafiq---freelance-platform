export type BadgeTone =
  | "cobalt"
  | "violet"
  | "teal"
  | "amber"
  | "coral"
  | "slate";

export type BadgeDensity = "sm" | "md" | "lg";

export type BadgeFontFamily = "ui" | "mono";

export interface BadgeProps {
  tone?: BadgeTone;
  density?: BadgeDensity;
  fontFamily?: BadgeFontFamily;
  dot?: boolean;
  pulse?: boolean;
  removable?: boolean;
  selectable?: boolean;
  selected?: boolean;
}
