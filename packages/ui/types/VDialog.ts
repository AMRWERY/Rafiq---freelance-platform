export type DialogSize = "sm" | "md" | "lg";

export type DialogRoleContext = "client" | "developer" | "danger";

export interface BaseDialogProps {
  modelValue: boolean;
  title?: string;
  description?: string;
  size?: DialogSize;
  roleContext?: DialogRoleContext;
  tag?: string;
  stage?: string;
  closeOnEsc?: boolean;
  closeOnBackdrop?: boolean;
  showCloseButton?: boolean;
}
