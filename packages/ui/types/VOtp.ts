import type { Component } from "vue";
import type { RuleExpression } from "vee-validate";

export type OtpLength = 4 | 5 | 6;

export type OtpDensity = "sm" | "md" | "lg";

export type OtpRoleContext = "client" | "developer";

export type OtpType = "number" | "text" | "password";

export interface OtpProps {
  modelValue?: string;
  id?: string;
  name?: string;
  rules?: RuleExpression<string>;
  length?: OtpLength | number;
  type?: OtpType;
  label?: string;
  helperText?: string;
  errorMessage?: string;
  density?: OtpDensity;
  roleContext?: OtpRoleContext;
  disabled?: boolean;
  readonly?: boolean;
  autofocus?: boolean;
  masked?: boolean;
  as?: string | Component;
  inputAs?: string | Component;
}
