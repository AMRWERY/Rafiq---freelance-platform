<template>
  <component :is="as || 'div'" class="flex flex-col gap-1.5 w-full text-start">
    <!-- Header: Label, Required Asterisk, Header Extra Slot -->
    <div
      v-if="label || $slots.headerExtra"
      class="flex items-center justify-between"
    >
      <label
        v-if="label"
        :for="selectId"
        class="text-xs font-semibold text-[#14171F] flex items-center gap-1 select-none"
      >
        <span>{{ label }}</span>
        <span
          v-if="required"
          class="text-[#D23C3C] font-bold"
          aria-hidden="true"
          >*</span
        >
      </label>

      <div v-if="$slots.headerExtra" class="flex items-center gap-2">
        <slot name="headerExtra" />
      </div>
    </div>

    <!-- Select Box Frame with Dynamic Component Support -->
    <div
      :class="[
        'relative flex items-center rounded-[8px] border transition-all duration-150 ease-out',
        densityClasses.wrapper,
        stateClasses,
      ]"
    >
      <!-- Leading Icon / Addon Slot -->
      <div
        v-if="$slots.leading"
        class="absolute start-3 flex items-center justify-center text-[#5B6270] pointer-events-none select-none"
      >
        <slot name="leading" />
      </div>

      <!-- Native or Custom Dynamic Select Element -->
      <component
        :is="selectAs || 'select'"
        :id="selectId"
        :value="fieldValue"
        :disabled="disabled"
        :aria-invalid="hasError"
        :aria-describedby="
          hasError
            ? `${selectId}-error`
            : helperText
              ? `${selectId}-helper`
              : undefined
        "
        :class="[
          'w-full h-full bg-transparent outline-none cursor-pointer appearance-none text-[#14171F]',
          densityClasses.select,
          $slots.leading ? densityClasses.leadingPadding : 'ps-3',
          'pe-9',
        ]"
        @change="handleChangeEvent"
        @focus="emit('focus', $event)"
        @blur="onBlur"
      >
        <!-- Placeholder Option -->
        <option v-if="placeholder" value="" disabled :selected="!fieldValue">
          {{ placeholder }}
        </option>

        <!-- Default Slot for Custom <option> tags -->
        <slot>
          <option
            v-for="opt in normalizedOptions"
            :key="String(opt.value)"
            :value="opt.value"
            :disabled="opt.disabled"
          >
            {{ opt.label }}
          </option>
        </slot>
      </component>

      <!-- Trailing Dropdown Chevron or Injected Icon -->
      <div
        class="absolute end-3 flex items-center gap-1.5 pointer-events-none text-[#8A909C]"
      >
        <slot name="trailing">
          <Icon
            v-if="hasError"
            name="lucide:alert-circle"
            class="text-[#D23C3C] w-4 h-4"
          />
          <Icon
            v-else
            name="lucide:chevron-down"
            :class="densityClasses.iconSize"
          />
        </slot>
      </div>
    </div>

    <!-- Remediation Error Message or Helper Description -->
    <p
      v-if="hasError"
      :id="`${selectId}-error`"
      class="text-[11px] text-[#D23C3C] flex items-center gap-1 mt-0.5"
      role="alert"
    >
      <Icon
        name="lucide:alert-circle"
        class="w-3.5 h-3.5 shrink-0"
        aria-hidden="true"
      />
      <span>{{ displayError }}</span>
    </p>
    <p
      v-else-if="helperText"
      :id="`${selectId}-helper`"
      class="text-[11px] text-[#5B6270] mt-0.5"
    >
      {{ helperText }}
    </p>
  </component>
</template>

<script lang="ts" setup>
import type {
  BaseSelectInputProps,
  SelectOptionItem,
} from "~/types/VSelectInput";

const props = withDefaults(defineProps<BaseSelectInputProps>(), {
  modelValue: "",
  density: "md",
  roleContext: "client",
  required: false,
  disabled: false,
  options: () => [],
});

const emit = defineEmits<{
  (e: "update:modelValue", value: any): void;
  (e: "change", value: any): void;
  (e: "focus", event: FocusEvent): void;
  (e: "blur", event: FocusEvent): void;
}>();

const generatedId = useId();
const selectId = computed(() => props.id || `select-${generatedId}`);

// Registers this select as a vee-validate field
const {
  value: fieldValue,
  errorMessage: fieldErrorMessage,
  handleChange,
  handleBlur,
} = useField<any>(() => props.name ?? selectId.value, props.rules, {
  initialValue: props.modelValue,
});

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

const normalizedOptions = computed<SelectOptionItem[]>(() => {
  return (props.options || []).map((opt) => {
    if (typeof opt === "string" || typeof opt === "number") {
      return { label: String(opt), value: opt };
    }
    return opt;
  });
});

const handleChangeEvent = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  handleChange(target.value);
  emit("update:modelValue", target.value);
  emit("change", target.value);
};

const onBlur = (event: FocusEvent) => {
  handleBlur(event, true);
  emit("blur", event);
};

const densityClasses = computed(() => {
  switch (props.density) {
    case "sm":
      return {
        wrapper: "h-8 text-[13px]",
        select: "py-1 text-[13px]",
        leadingPadding: "ps-8",
        iconSize: "w-3.5 h-3.5",
      };
    case "lg":
      return {
        wrapper: "h-12 text-[16px]",
        select: "py-3 text-[16px]",
        leadingPadding: "ps-11",
        iconSize: "w-5 h-5",
      };
    case "md":
    default:
      return {
        wrapper: "h-10 text-[14px]",
        select: "py-2 text-[14px]",
        leadingPadding: "ps-9",
        iconSize: "w-4 h-4",
      };
  }
});

const stateClasses = computed(() => {
  if (props.disabled) {
    return "bg-[#EEF0F4] border-[#DEE1E7] text-[#8A909C] cursor-not-allowed opacity-60 select-none";
  }
  if (hasError.value) {
    return "bg-white border-[#D23C3C] border-[1.5px] text-[#14171F] hover:border-[#B02E2E] focus-within:ring-2 focus-within:ring-[#D23C3C]/20 focus-within:border-[#D23C3C]";
  }
  const ringColor =
    props.roleContext === "developer"
      ? "focus-within:border-[#6E56CF] focus-within:ring-2 focus-within:ring-[#6E56CF]/20"
      : "focus-within:border-[#2563C7] focus-within:ring-2 focus-within:ring-[#2563C7]/20";

  return `bg-white border-[#DEE1E7] hover:border-[#8A909C] text-[#14171F] ${ringColor}`;
});
</script>