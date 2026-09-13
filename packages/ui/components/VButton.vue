<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :aria-disabled="disabled || loading"
    :aria-busy="loading"
    :class="[
      'inline-flex items-center justify-center font-semibold rounded-[8px] select-none',
      'transition-all duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'active:scale-[0.97]',
      block ? 'w-full' : 'w-auto',
      sizeClasses,
      variantClasses,
      disabled
        ? 'opacity-40 cursor-not-allowed pointer-events-none active:scale-100'
        : 'cursor-pointer',
      loading ? 'active:scale-100' : '',
    ]"
    @click="handleClick"
  >
    <!-- Loading Spinner -->
     <Icon name="svg-spinners:90-ring-with-bg" v-if="loading" class="animate-spin text-current shrink-0" />
 
    <!-- Leading Icon Slot -->
    <span
      v-if="$slots.leading && !loading"
      class="inline-flex items-center shrink-0"
    >
      <slot name="leading" />
    </span>

    <!-- Label / Default Slot -->
    <span :class="{ 'opacity-90': loading }">
      <slot />
    </span>

    <!-- Trailing Icon Slot -->
    <span
      v-if="$slots.trailing && !loading"
      class="inline-flex items-center shrink-0"
    >
      <slot name="trailing" />
    </span>
  </button>
</template>

<script lang="ts" setup>
import type {
  ButtonVariant,
  ButtonSize,
  ButtonRoleContext,
  ButtonProps,
} from "~/types/VButton";

const props = withDefaults(defineProps<ButtonProps>(), {
  variant: "primary",
  size: "md",
  roleContext: "client",
  type: "button",
  disabled: false,
  loading: false,
  block: false,
});

const emit = defineEmits<{
  (e: "click", event: MouseEvent): void;
}>();

const handleClick = (e: MouseEvent) => {
  if (props.disabled || props.loading) {
    e.preventDefault();
    e.stopPropagation();
    return;
  }
  emit("click", e);
};

const sizeClasses = computed(() => {
  switch (props.size) {
    case "sm":
      return "h-8 px-3 py-1.5 text-[13px] gap-1.5 [&_svg]:w-3.5 [&_svg]:h-3.5";
    case "lg":
      return "h-12 px-6 py-3 text-[16px] gap-2.5 [&_svg]:w-[18px] [&_svg]:h-[18px]";
    case "md":
    default:
      return "h-10 px-4 py-2 text-[14px] gap-2 [&_svg]:w-4 [&_svg]:h-4";
  }
});

const variantClasses = computed(() => {
  if (props.roleContext === "danger") {
    if (props.variant === "primary") {
      return "bg-[#D23C3C] text-white hover:brightness-105 active:bg-[#B02E2E] focus-visible:ring-[#D23C3C]";
    }
    if (props.variant === "secondary") {
      return "bg-transparent border border-[#D23C3C] text-[#D23C3C] hover:bg-[#D23C3C]/10 active:bg-[#D23C3C]/20 focus-visible:ring-[#D23C3C]";
    }
    // Tertiary / Ghost
    return "bg-transparent text-[#D23C3C] hover:bg-[#D23C3C]/10 active:bg-[#D23C3C]/20 focus-visible:ring-[#D23C3C]";
  }

  const isDev = props.roleContext === "developer";

  if (props.variant === "primary") {
    return isDev
      ? "bg-[#6E56CF] text-white hover:brightness-105 active:bg-[#5D3EB8] focus-visible:ring-[#6E56CF]"
      : "bg-[#2563C7] text-white hover:brightness-105 active:bg-[#1D4ED8] focus-visible:ring-[#2563C7]";
  }

  if (props.variant === "secondary") {
    return isDev
      ? "bg-transparent border border-[#6E56CF] text-[#6E56CF] hover:bg-[#6E56CF]/10 active:bg-[#6E56CF]/20 focus-visible:ring-[#6E56CF]"
      : "bg-transparent border border-[#2563C7] text-[#2563C7] hover:bg-[#2563C7]/10 active:bg-[#2563C7]/20 focus-visible:ring-[#2563C7]";
  }

  // Tertiary / Ghost
  return isDev
    ? "bg-transparent text-[#6E56CF] hover:bg-[#6E56CF]/10 active:bg-[#6E56CF]/20 focus-visible:ring-[#6E56CF]"
    : "bg-transparent text-[#2563C7] hover:bg-[#2563C7]/10 active:bg-[#2563C7]/20 focus-visible:ring-[#2563C7]";
});
</script>