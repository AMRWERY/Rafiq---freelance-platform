import type { Component } from "vue";
import type { RuleExpression } from "vee-validate";

export type TextareaDensity = "sm" | "md" | "lg";

export type TextareaRoleContext = "client" | "developer";

export type TextareaResize = "none" | "vertical" | "horizontal" | "both";

export interface BaseTextareaProps {
  modelValue?: string;
  id?: string;
  name?: string;
  rules?: RuleExpression<string>;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  rows?: number;
  density?: TextareaDensity;
  roleContext?: TextareaRoleContext;
  resize?: TextareaResize;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  maxLength?: number;
  showCount?: boolean;
  as?: string | Component;
  textareaAs?: string | Component;
}
