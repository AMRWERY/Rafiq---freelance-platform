export type BadgeTone =
  | "cobalt"
  | "violet"
  | "teal"
  | "amber"
  | "coral"
  | "slate";

export type BadgeDensity = "sm" | "md" | "lg";


export interface BadgeProps {
  tone?: BadgeTone;
  density?: BadgeDensity;
  dot?: boolean;
  pulse?: boolean;
  removable?: boolean;
  selectable?: boolean;
  selected?: boolean;
}
