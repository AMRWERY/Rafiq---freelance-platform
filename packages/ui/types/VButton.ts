export type ButtonVariant = "primary" | "secondary" | "tertiary";

export type ButtonSize = "sm" | "md" | "lg";

export type ButtonRoleContext = "client" | "developer" | "danger";

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  roleContext?: ButtonRoleContext;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  block?: boolean;
}
