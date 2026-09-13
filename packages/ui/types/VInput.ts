export type InputDensity = "sm" | "md" | "lg";

export type InputRoleContext = "client" | "developer";

export interface BaseInputProps {
  modelValue?: string | number;
  id?: string;
  /** vee-validate field name. Required for the field to participate in an ancestor <Form>/useForm(). */
  name?: string;
  /** vee-validate rules, e.g. "required|email" or { required: true, min: 8 }. */
  rules?: RuleExpression<string | number>;
  type?: "text" | "password" | "email" | "number" | "search" | "tel" | "url";
  label?: string;
  placeholder?: string;
  helperText?: string;
  /** Manual error override for use outside a vee-validate field (e.g. static previews/demos). */
  errorMessage?: string;
  density?: InputDensity;
  roleContext?: InputRoleContext;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  maxLength?: number;
  showCount?: boolean;
}
