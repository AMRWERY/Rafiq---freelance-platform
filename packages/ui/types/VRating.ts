export type StarRatingSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface StarRatingProps {
  modelValue?: number;
  maxStars?: number;
  size?: StarRatingSize;
  interactive?: boolean;
  showScore?: boolean;
  showCount?: boolean;
  countLabel?: string;
  precision?: number;
}
