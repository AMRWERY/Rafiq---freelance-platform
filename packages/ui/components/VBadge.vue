<template>
  <span
    role="status"
    :class="[
      'inline-flex items-center justify-center rounded-[8px] border font-medium select-none transition-all duration-150',
      fontFamily === 'mono'
        ? 'font-mono tracking-[0.01em]'
        : 'font-sans font-semibold',
      densityStyles.badge,
      toneStyles.bg,
      toneStyles.text,
      selectable && selected
        ? [toneStyles.selectedBorder, 'border-[1.5px] shadow-sm']
        : toneStyles.border,
      selectable
        ? ['cursor-pointer', toneStyles.hoverBg, 'active:scale-95']
        : '',
    ]"
    @click="handleClick"
  >
    <!-- Pulsing Radar Beacon Dot -->
    <span v-if="dot" class="relative flex items-center justify-center shrink-0">
      <span
        v-if="pulse"
        :class="[
          'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
          toneStyles.dot,
        ]"
      />
      <span
        :class="[
          'relative inline-flex rounded-full',
          densityStyles.dot,
          toneStyles.dot,
        ]"
      />
    </span>

    <!-- Leading Icon Slot -->
    <span v-if="$slots.leading" class="inline-flex items-center shrink-0">
      <slot name="leading" />
    </span>

    <!-- Badge Label Content -->
    <span class="truncate">
      <slot />
    </span>

    <!-- Trailing Icon Slot -->
    <span v-if="$slots.trailing" class="inline-flex items-center shrink-0">
      <slot name="trailing" />
    </span>

    <!-- Removable / Dismissible Affordance -->
    <button
      v-if="removable"
      type="button"
      aria-label="Remove tag"
      class="inline-flex items-center justify-center -me-0.5 ms-0.5 p-0.5 rounded-full hover:bg-black/10 transition-colors cursor-pointer"
      @click="handleDismiss"
    >
      <Icon name="lucide:x" :class="densityStyles.close" />
    </button>
  </span>
</template>

<script lang="ts" setup>
import type {
  BadgeTone,
  BadgeDensity,
  BadgeFontFamily,
  BadgeProps,
} from "~/types/VBadge";

const props = withDefaults(defineProps<BadgeProps>(), {
  tone: "cobalt",
  density: "md",
  fontFamily: "ui",
  dot: false,
  pulse: false,
  removable: false,
  selectable: false,
  selected: false,
});

const emit = defineEmits<{
  (e: "dismiss", event: MouseEvent): void;
  (e: "toggle", selected: boolean): void;
}>();

const handleDismiss = (e: MouseEvent) => {
  e.stopPropagation();
  emit("dismiss", e);
};

const handleClick = () => {
  if (props.selectable) {
    emit("toggle", !props.selected);
  }
};

// Density specifications (20px, 24px, 28px)
const densityStyles = computed(() => {
  switch (props.density) {
    case "sm":
      return {
        badge: "h-5 px-2 py-0.5 text-[11px] gap-1",
        icon: "w-3 h-3 text-[12px]",
        dot: "w-1.5 h-1.5",
        close: "w-3 h-3",
      };
    case "lg":
      return {
        badge: "h-7 px-3 py-1.5 text-[13px] gap-1.5",
        icon: "w-4 h-4 text-[16px]",
        dot: "w-2 h-2",
        close: "w-3.5 h-3.5",
      };
    case "md":
    default:
      return {
        badge: "h-6 px-2.5 py-1 text-[12px] gap-1.5",
        icon: "w-3.5 h-3.5 text-[14px]",
        dot: "w-1.5 h-1.5",
        close: "w-3 h-3",
      };
  }
});

// Semantic 12% alpha wash tokens
const toneStyles = computed(() => {
  switch (props.tone) {
    case "violet":
      return {
        bg: "bg-[#6E56CF]/12",
        text: "text-[#6E56CF]",
        border: "border-[#6E56CF]/25",
        dot: "bg-[#6E56CF]",
        selectedBorder: "border-[#6E56CF]",
        hoverBg: "hover:bg-[#6E56CF]/18",
      };
    case "teal":
      return {
        bg: "bg-[#17A883]/12",
        text: "text-[#17A883]",
        border: "border-[#17A883]/25",
        dot: "bg-[#17A883]",
        selectedBorder: "border-[#17A883]",
        hoverBg: "hover:bg-[#17A883]/18",
      };
    case "amber":
      return {
        bg: "bg-[#C77D18]/12",
        text: "text-[#C77D18]",
        border: "border-[#C77D18]/25",
        dot: "bg-[#C77D18]",
        selectedBorder: "border-[#C77D18]",
        hoverBg: "hover:bg-[#C77D18]/18",
      };
    case "coral":
      return {
        bg: "bg-[#D23C3C]/12",
        text: "text-[#D23C3C]",
        border: "border-[#D23C3C]/25",
        dot: "bg-[#D23C3C]",
        selectedBorder: "border-[#D23C3C]",
        hoverBg: "hover:bg-[#D23C3C]/18",
      };
    case "slate":
      return {
        bg: "bg-[#14171F]/10",
        text: "text-[#14171F]",
        border: "border-[#14171F]/20",
        dot: "bg-[#14171F]",
        selectedBorder: "border-[#14171F]",
        hoverBg: "hover:bg-[#14171F]/15",
      };
    case "cobalt":
    default:
      return {
        bg: "bg-[#2563C7]/12",
        text: "text-[#2563C7]",
        border: "border-[#2563C7]/25",
        dot: "bg-[#2563C7]",
        selectedBorder: "border-[#2563C7]",
        hoverBg: "hover:bg-[#2563C7]/18",
      };
  }
});
</script>