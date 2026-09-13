<template>
    <component :is="as || 'div'" class="flex flex-col gap-1.5 w-full text-start">
        <!-- Header: Label, Required Asterisk, Max Length Counter / Slot Header -->
        <div v-if="label || showCount || $slots.headerExtra" class="flex items-center justify-between">
            <label v-if="label" :for="textareaId"
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

        <!-- Textarea Frame Container with Dynamic Component Support -->
        <div :class="[
            'relative flex flex-col rounded-[8px] border overflow-hidden transition-all duration-150 ease-out',
            stateClasses,
        ]">
            <!-- Optional Injected Toolbar (e.g. Markdown buttons, actions) -->
            <div v-if="$slots.toolbar"
                class="bg-[#F7F7F9] border-b border-[#DEE1E7] px-3 py-1.5 flex items-center justify-between text-[#5B6270]">
                <slot name="toolbar" />
            </div>

            <!-- Native / Dynamic Textarea Field -->
            <component :is="textareaAs || 'textarea'" :id="textareaId" :value="fieldValue" :rows="rows"
                :placeholder="placeholder" :disabled="disabled" :readonly="readonly" :maxlength="maxLength"
                :aria-invalid="hasError" :aria-describedby="hasError
                    ? `${textareaId}-error`
                    : helperText
                        ? `${textareaId}-helper`
                        : undefined
                    " :class="[
            'w-full bg-transparent outline-none placeholder:text-[#8A909C] leading-relaxed',
            resizeClass,
            densityClasses.input,
        ]" @input="handleInput" @focus="emit('focus', $event)" @blur="onBlur" />

            <!-- Custom Bottom / Footer Slot Inside Frame -->
            <div v-if="$slots.frameFooter" class="px-3 py-1.5 bg-[#F7F7F9] border-t border-[#DEE1E7]">
                <slot name="frameFooter" />
            </div>
        </div>

        <!-- Remediation Error Message or Helper Context Description -->
        <p v-if="hasError" :id="`${textareaId}-error`" class="text-[11px] text-[#D23C3C] flex items-center gap-1 mt-0.5"
            role="alert">
            <Icon name="lucide:alert-circle" class="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{{ displayError }}</span>
        </p>
        <p v-else-if="helperText" :id="`${textareaId}-helper`" class="text-[11px] text-[#5B6270] mt-0.5">
            {{ helperText }}
        </p>
    </component>
</template>

<script lang="ts" setup>
import type { BaseTextareaProps } from "~/types/VTextarea";

const props = withDefaults(defineProps<BaseTextareaProps>(), {
    modelValue: "",
    rows: 4,
    density: "md",
    roleContext: "client",
    resize: "vertical",
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
const textareaId = computed(() => props.id || `textarea-${generatedId}`);

// Registers this textarea as a vee-validate field
const {
    value: fieldValue,
    errorMessage: fieldErrorMessage,
    handleChange,
    handleBlur,
} = useField<string>(() => props.name ?? textareaId.value, props.rules, {
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

const handleInput = (event: Event) => {
    const target = event.target as HTMLTextAreaElement;
    handleChange(target.value);
    emit("update:modelValue", target.value);
};

const onBlur = (event: FocusEvent) => {
    handleBlur(event, true);
    emit("blur", event);
};

const resizeClass = computed(() => {
    switch (props.resize) {
        case "none":
            return "resize-none";
        case "horizontal":
            return "resize-x";
        case "both":
            return "resize";
        case "vertical":
        default:
            return "resize-y";
    }
});

const densityClasses = computed(() => {
    switch (props.density) {
        case "sm":
            return {
                input: "p-2 text-xs",
            };
        case "lg":
            return {
                input: "p-4 text-base",
            };
        case "md":
        default:
            return {
                input: "p-3 text-xs md:text-sm",
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