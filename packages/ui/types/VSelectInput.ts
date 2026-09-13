import type { Component } from "vue";
import type { RuleExpression } from "vee-validate";

export type SelectDensity = "sm" | "md" | "lg";
export type SelectRoleContext = "client" | "developer";

export interface SelectOptionItem {
  label: string;
  value: any;
  disabled?: boolean;
  subtitle?: string;
  icon?: string;
}

export type SelectOption = string | number | SelectOptionItem;

export interface BaseSelectInputProps {
  modelValue?: any;
  id?: string;
  name?: string;
  rules?: RuleExpression<any>;
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorMessage?: string;
  options?: SelectOption[];
  density?: SelectDensity;
  roleContext?: SelectRoleContext;
  required?: boolean;
  disabled?: boolean;
  as?: string | Component;
  selectAs?: string | Component;
}
