<template>
  <div class="flex flex-col gap-1.5 w-full text-start">
    <!-- Header: Label, Required Asterisk, Max Length Counter / Slot Header -->
    <div v-if="label || showCount || $slots.headerExtra" class="flex items-center justify-between">
      <label v-if="label" :for="inputId"
        class="text-xs font-semibold text-[#14171F] flex items-center gap-1 select-none">
        <span>{{ label }}</span>
        <span v-if="required" class="text-[#D23C3C] font-bold" aria-hidden="true">*</span>
      </label>

      <div class="flex items-center gap-2">
        <slot name="headerExtra" />
        <span v-if="showCount && maxLength" class="text-[11px] text-[#8A909C]">
          {{ String(fieldValue ?? "").length }}/{{ maxLength }}
        </span>
      </div>
    </div>

    <!-- Input Box Frame -->
    <div :class="[
      'relative flex items-center rounded-[8px] border transition-all duration-150 ease-out',
      densityClasses.wrapper,
      stateClasses,
    ]">
      <!-- Leading Icon / Addon Slot -->
      <div v-if="$slots.leading"
        class="absolute start-3 flex items-center justify-center text-[#5B6270] pointer-events-none select-none">
        <slot name="leading" />
      </div>

      <!-- Native HTML Input -->
      <input :id="inputId" :type="type" :value="fieldValue" :placeholder="placeholder" :disabled="disabled"
        :readonly="readonly" :maxlength="maxLength" :aria-invalid="hasError" :aria-describedby="hasError
          ? `${inputId}-error`
          : helperText
            ? `${inputId}-helper`
            : undefined
          " :class="[
            'w-full h-full bg-transparent outline-none placeholder:text-[#8A909C]',
            densityClasses.input,
            $slots.leading ? densityClasses.leadingPadding : '',
            $slots.trailing || hasError ? densityClasses.trailingPadding : '',
          ]" @input="handleInput" @focus="emit('focus', $event)" @blur="onBlur" />

      <!-- Trailing Action Slot / Error Warning Icon -->
      <div v-if="$slots.trailing || hasError" class="absolute end-3 flex items-center gap-1.5">
        <!-- Injected Error Warning Indicator -->
        <Icon v-if="hasError" name="lucide:alert-circle" class="text-[#D23C3C] shrink-0"
          :class="densityClasses.iconSize" aria-hidden="true" />
        <!-- Custom Trailing Slot (Clipboard, Eye Toggle, Currency) -->
        <slot v-else name="trailing" />
      </div>
    </div>

    <!-- Remediation Error Message or Helper Context Description -->
    <p v-if="hasError" :id="`${inputId}-error`"
      class="text-[11px] font-body text-[#D23C3C] flex items-center gap-1 mt-0.5" role="alert">
      {{ displayError }}
    </p>
    <p v-else-if="helperText" :id="`${inputId}-helper`" class="text-[11px] font-body text-[#5B6270] mt-0.5">
      {{ helperText }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import type { RuleExpression } from "vee-validate";
import type {
  InputDensity,
  InputRoleContext,
  BaseInputProps,
} from "~/types/VInput";

const props = withDefaults(defineProps<BaseInputProps>(), {
  modelValue: "",
  type: "text",
  density: "md",
  roleContext: "client",
  required: false,
  disabled: false,
  readonly: false,
  showCount: false,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
}>();

const generatedId = useId();
const inputId = computed(() => props.id || `input-${generatedId}`);

// Registers this input as a vee-validate field (in an ancestor <Form>/useForm() scope when
// present, otherwise its own standalone field). Pass `rules` to get validation + errorMessage
// for free; `errorMessage` prop still works as a manual override when no `rules` are set.
const {
  value: fieldValue,
  errorMessage: fieldErrorMessage,
  handleChange,
  handleBlur,
} = useField<string | number>(() => props.name ?? inputId.value, props.rules, {
  initialValue: props.modelValue,
});

// Keep the vee-validate field in sync when a parent drives this input via v-model
// (useField's initialValue only applies once, on creation).
watch(
  () => props.modelValue,
  (value) => {
    if (value !== fieldValue.value) fieldValue.value = value ?? "";
  },
);

const displayError = computed(
  () => fieldErrorMessage.value || props.errorMessage,
);
const hasError = computed(() => Boolean(displayError.value));

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  handleChange(target.value);
  emit("update:modelValue", target.value);
};

const onBlur = (event: FocusEvent) => {
  // vee-validate's handleBlur only marks the field "touched" by default — it does NOT
  // validate unless told to (its `shouldValidate` param defaults to false).
  handleBlur(event, true);
  emit("blur", event);
};

// Density sizing specifications
const densityClasses = computed(() => {
  switch (props.density) {
    case "sm":
      return {
        wrapper: "h-8 text-[13px]",
        input: "px-2.5 py-1 text-[13px]",
        leadingPadding: "ps-8",
        trailingPadding: "pe-8",
        iconSize: "w-3.5 h-3.5",
      };
    case "lg":
      return {
        wrapper: "h-12 text-[16px]",
        input: "px-4 py-3 text-[16px]",
        leadingPadding: "ps-11",
        trailingPadding: "pe-11",
        iconSize: "w-5 h-5",
      };
    case "md":
    default:
      return {
        wrapper: "h-10 text-[14px]",
        input: "px-3 py-2 text-[14px]",
        leadingPadding: "ps-9",
        trailingPadding: "pe-9",
        iconSize: "w-4 h-4",
      };
  }
});

// Role-aware and error border/ring states
const stateClasses = computed(() => {
  if (props.disabled) {
    return "bg-[#EEF0F4] border-[#DEE1E7] text-[#8A909C] cursor-not-allowed opacity-60 select-none";
  }
  if (hasError.value) {
    return "bg-white border-[#D23C3C] border-[1.5px] text-[#14171F] hover:border-[#B02E2E] focus-within:ring-2 focus-within:ring-[#D23C3C]/20 focus-within:border-[#D23C3C]";
  }
  // Client vs Developer Context Focus Ring
  const ringColor =
    props.roleContext === "developer"
      ? "focus-within:border-[#6E56CF] focus-within:ring-2 focus-within:ring-[#6E56CF]/20"
      : "focus-within:border-[#2563C7] focus-within:ring-2 focus-within:ring-[#2563C7]/20";

  return `bg-white border-[#DEE1E7] hover:border-[#8A909C] text-[#14171F] ${ringColor}`;
});
</script>