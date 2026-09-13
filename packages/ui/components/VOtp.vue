<template>
    <component :is="as || 'div'" class="flex flex-col gap-2 w-full text-start">
        <!-- Header: Label & Action Slot -->
        <div v-if="label || $slots.headerExtra" class="flex items-center justify-between">
            <label :for="`${otpId}-0`" class="text-xs font-semibold text-[#14171F] select-none">
                {{ label }}
            </label>
            <div v-if="$slots.headerExtra" class="flex items-center gap-2">
                <slot name="headerExtra" />
            </div>
        </div>

        <!-- OTP Input Array Frame -->
        <div class="flex items-center justify-center gap-2 sm:gap-3 select-none" role="group"
            :aria-label="label || 'One-Time Password Inputs'">
            <template v-for="(_, index) in normalizedLength" :key="index">
                <!-- Optional Center Divider for 6-digit layouts -->
                <span v-if="normalizedLength === 6 && index === 3"
                    class="text-[#8A909C] font-bold text-lg select-none px-0.5" aria-hidden="true">
                    <slot name="separator">-</slot>
                </span>

                <!-- Dynamic Digit Input Box -->
                <component :is="inputAs || 'input'" :ref="(el: any) => setInputRef(el, index)" :id="`${otpId}-${index}`"
                    :type="masked ? 'password' : type === 'number' ? 'tel' : 'text'"
                    :inputmode="type === 'number' ? 'numeric' : 'text'"
                    :pattern="type === 'number' ? '[0-9]*' : undefined" maxlength="1" :value="digits[index]"
                    :disabled="disabled" :readonly="readonly" autocomplete="one-time-code"
                    :aria-label="`Verification code digit ${index + 1} of ${normalizedLength}`" :aria-invalid="hasError"
                    :class="[
                        'text-center font-bold rounded-[10px] border outline-none transition-all duration-150',
                        densityClasses.box,
                        stateClasses(index),
                    ]" @input="handleInput($event, index)" @keydown="handleKeyDown($event, index)"
                    @paste="handlePaste($event, index)" @focus="handleFocus(index, $event)"
                    @blur="handleBlurEvent($event)" />
            </template>
        </div>

        <!-- Error Remediation Message or Context Helper -->
        <p v-if="hasError" :id="`${otpId}-error`"
            class="text-[11px] text-[#D23C3C] flex items-center justify-center gap-1 mt-1 text-center" role="alert">
            <Icon name="lucide:alert-circle" class="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span>{{ displayError }}</span>
        </p>
        <p v-else-if="helperText" :id="`${otpId}-helper`" class="text-[11px] text-[#5B6270] text-center mt-1">
            {{ helperText }}
        </p>

        <!-- Footer Slot (e.g. Resend code timer, contact support) -->
        <div v-if="$slots.footer" class="pt-1 flex items-center justify-center">
            <slot name="footer" :value="joinedValue" :is-complete="isComplete" :clear="clear" />
        </div>
    </component>
</template>

<script lang="ts" setup>
import type { OtpProps } from "~/types/VOtp";

const props = withDefaults(defineProps<OtpProps>(), {
    modelValue: "",
    length: 6,
    type: "number",
    density: "md",
    roleContext: "client",
    disabled: false,
    readonly: false,
    autofocus: false,
    masked: false,
});

const emit = defineEmits<{
    (e: "update:modelValue", value: string): void;
    (e: "change", value: string): void;
    (e: "complete", value: string): void;
    (e: "focus", index: number, event: FocusEvent): void;
    (e: "blur", event: FocusEvent): void;
}>();

const generatedId = useId();
const otpId = computed(() => props.id || `otp-${generatedId}`);

// Enforce: At least 4 inputs and at most 6
const normalizedLength = computed(() => {
    const parsed = Number(props.length) || 6;
    return Math.min(6, Math.max(4, parsed));
});

// Registers this OTP block with vee-validate
const {
    value: fieldValue,
    errorMessage: fieldErrorMessage,
    handleChange,
    handleBlur: handleVeeBlur,
} = useField<string>(() => props.name ?? otpId.value, props.rules, {
    initialValue: props.modelValue,
});

// Reactive individual digit state
const digits = ref<string[]>(Array(normalizedLength.value).fill(""));
const inputRefs = ref<HTMLInputElement[]>([]);

const setInputRef = (el: HTMLInputElement | null, index: number) => {
    if (el) {
        inputRefs.value[index] = el;
    }
};

// Sync internal digits when modelValue or fieldValue changes
const syncFromExternal = (val: string) => {
    const chars = (val || "").split("").slice(0, normalizedLength.value);
    const newDigits = Array(normalizedLength.value).fill("");
    for (let i = 0; i < chars.length; i++) {
        newDigits[i] = chars[i];
    }
    digits.value = newDigits;
};

syncFromExternal(props.modelValue || fieldValue.value || "");

watch(
    () => props.modelValue,
    (val) => {
        if (val !== joinedValue.value) {
            syncFromExternal(val ?? "");
        }
    }
);

watch(
    () => fieldValue.value,
    (val) => {
        if (val !== joinedValue.value) {
            syncFromExternal(val ?? "");
        }
    }
);

watch(normalizedLength, (newLen) => {
    if (digits.value.length !== newLen) {
        digits.value = Array(newLen).fill("");
        inputRefs.value = [];
    }
});

const joinedValue = computed(() => digits.value.join(""));
const isComplete = computed(() => joinedValue.value.length === normalizedLength.value && !digits.value.includes(""));

const displayError = computed(() => fieldErrorMessage.value || props.errorMessage);
const hasError = computed(() => Boolean(displayError.value));

const emitState = () => {
    const code = joinedValue.value;
    handleChange(code);
    emit("update:modelValue", code);
    emit("change", code);

    if (isComplete.value) {
        emit("complete", code);
    }
};

const handleInput = (event: Event, index: number) => {
    const target = event.target as HTMLInputElement;
    let val = target.value;

    if (props.type === "number") {
        val = val.replace(/\D/g, "");
    }

    if (val.length > 0) {
        // Only take the last character typed if length > 1
        const char = val.slice(-1);
        digits.value[index] = char;
        emitState();

        // Auto-advance to next input if available
        if (index < normalizedLength.value - 1) {
            inputRefs.value[index + 1]?.focus();
            inputRefs.value[index + 1]?.select();
        }
    } else {
        digits.value[index] = "";
        emitState();
    }
};

const handleKeyDown = (event: KeyboardEvent, index: number) => {
    if (event.key === "Backspace") {
        if (!digits.value[index] && index > 0) {
            // Current slot empty -> move to previous and clear it
            event.preventDefault();
            digits.value[index - 1] = "";
            emitState();
            inputRefs.value[index - 1]?.focus();
        } else {
            // Let standard backspace clear current slot
            digits.value[index] = "";
            emitState();
        }
    } else if (event.key === "ArrowLeft" && index > 0) {
        event.preventDefault();
        inputRefs.value[index - 1]?.focus();
        inputRefs.value[index - 1]?.select();
    } else if (event.key === "ArrowRight" && index < normalizedLength.value - 1) {
        event.preventDefault();
        inputRefs.value[index + 1]?.focus();
        inputRefs.value[index + 1]?.select();
    }
};

const handlePaste = (event: ClipboardEvent, index: number) => {
    event.preventDefault();
    const pasted = event.clipboardData?.getData("text") || "";
    let clean = pasted.trim();

    if (props.type === "number") {
        clean = clean.replace(/\D/g, "");
    }

    if (!clean) return;

    const chars = clean.split("");
    let targetIndex = index;

    for (let i = 0; i < chars.length && targetIndex < normalizedLength.value; i++, targetIndex++) {
        digits.value[targetIndex] = chars[i];
    }

    emitState();

    // Focus next available slot or last filled slot
    const nextFocus = Math.min(targetIndex, normalizedLength.value - 1);
    inputRefs.value[nextFocus]?.focus();
};

const handleFocus = (index: number, event: FocusEvent) => {
    inputRefs.value[index]?.select();
    emit("focus", index, event);
};

const handleBlurEvent = (event: FocusEvent) => {
    handleVeeBlur(event, true);
    emit("blur", event);
};

onMounted(() => {
    if (props.autofocus && !props.disabled) {
        inputRefs.value[0]?.focus();
    }
});

const clear = () => {
    digits.value = Array(normalizedLength.value).fill("");
    emitState();
    inputRefs.value[0]?.focus();
};

const densityClasses = computed(() => {
    switch (props.density) {
        case "sm":
            return {
                box: "w-9 h-10 text-base",
            };
        case "lg":
            return {
                box: "w-13 h-14 text-2xl",
            };
        case "md":
        default:
            return {
                box: "w-11 h-12 text-xl",
            };
    }
});

const stateClasses = (index: number) => {
    if (props.disabled) {
        return "bg-[#EEF0F4] border-[#DEE1E7] text-[#8A909C] cursor-not-allowed opacity-60";
    }

    if (hasError.value) {
        return "bg-white border-[#D23C3C] text-[#D23C3C] focus:border-[#D23C3C] focus:ring-2 focus:ring-[#D23C3C]/20";
    }

    const isFilled = Boolean(digits.value[index]);
    const ringColor =
        props.roleContext === "developer"
            ? "focus:border-[#6E56CF] focus:ring-2 focus:ring-[#6E56CF]/20"
            : "focus:border-[#2563C7] focus:ring-2 focus:ring-[#2563C7]/20";

    return `bg-white ${isFilled ? "border-[#14171F]" : "border-[#DEE1E7]"
        } hover:border-[#8A909C] text-[#14171F] ${ringColor}`;
};

defineExpose({
    value: joinedValue,
    isComplete,
    clear,
    focus: (index = 0) => inputRefs.value[index]?.focus(),
});
</script>