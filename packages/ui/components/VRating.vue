<template>
  <div class="inline-flex items-center select-none" :role="interactive ? 'radiogroup' : 'img'"
    :aria-label="`Rating: ${effectiveScore.toFixed(precision)} out of ${maxStars} stars`"
    @mouseleave="handleMouseLeave">
    <!-- 5-Star Visual Array -->
    <div :class="['flex items-center', sizeStyles.gap]">
      <div v-for="i in maxStars" :key="i" :class="[
        'relative inline-block shrink-0',
        sizeStyles.star,
        interactive
          ? 'cursor-pointer transition-transform duration-150 hover:-translate-y-0.5'
          : '',
      ]" @click="handleStarClick(i - 1, $event)" @mousemove="handleStarHover(i - 1, $event)">
        <!-- 1. Background Empty Star Track -->
        <Icon name="material-symbols:kid-star-outline" class="w-full h-full text-[#DEE1E7]" aria-hidden="true" />

        <!-- 2. Active Proportional Clip-Path Star Overlay (#C77D18) -->
        <div class="absolute inset-0 overflow-hidden pointer-events-none transition-[clip-path] duration-150" :style="{
          clipPath: isStaggering
            ? 'inset(0 100% 0 0)'
            : getStarFillPercentage(i - 1).clipPath,
        }">
          <Icon name="material-symbols:kid-star" :class="[
            'w-full h-full text-[#C77D18]',
            isStaggering ? 'animate-star-pop' : '',
          ]" :style="{
              animationDelay: isStaggering ? `${(i - 1) * 60}ms` : '0ms',
            }" aria-hidden="true" />
        </div>
      </div>
    </div>

    <!-- Telemetry Numeric Score -->
    <div v-if="showScore" class="flex items-center ms-2.5 text-[#14171F]">
      <span :class="['font-bold text-[#14171F]', sizeStyles.scoreText]">
        {{ effectiveScore.toFixed(precision) }}
      </span>
      <span v-if="!showCount" class="text-[#8A909C] text-xs ms-1">/ {{ maxStars.toFixed(1) }}</span>
    </div>

    <!-- Review Count Telemetry -->
    <span v-if="showCount && countLabel" :class="['text-[#8A909C]', sizeStyles.countText]">
      {{ countLabel }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import type { StarRatingSize, StarRatingProps } from "~/types/VRating";

const props = withDefaults(defineProps<StarRatingProps>(), {
  modelValue: 0,
  maxStars: 5,
  size: "md",
  interactive: false,
  showScore: true,
  showCount: false,
  countLabel: "",
  precision: 1,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: number): void;
  (e: "change", value: number): void;
}>();

const hoveredScore = ref<number | null>(null);
const isStaggering = ref(false);

// Active effective rating value (hover takes precedence during interaction)
const effectiveScore = computed(() => {
  if (props.interactive && hoveredScore.value !== null) {
    return hoveredScore.value;
  }
  return Math.min(Math.max(props.modelValue, 0), props.maxStars);
});

// Sub-pixel clip-path calculation for individual star index (0..4)
const getStarFillPercentage = (
  starIndex: number,
): { fill: string; clipPath: string } => {
  const rawDelta = effectiveScore.value - starIndex;
  const fillPercent = Math.min(Math.max(rawDelta * 100, 0), 100);
  return {
    fill: `${fillPercent.toFixed(1)}%`,
    clipPath: `inset(0 ${100 - fillPercent}% 0 0)`,
  };
};

// Density scale configurations
const sizeStyles = computed(() => {
  switch (props.size) {
    case "xs":
      return {
        star: "w-3.5 h-3.5",
        gap: "gap-[2px]",
        scoreText: "text-[11px]",
        countText: "text-[10px] ms-1.5",
      };
    case "sm":
      return {
        star: "w-4 h-4",
        gap: "gap-1",
        scoreText: "text-xs",
        countText: "text-[10px] ms-1.5",
      };
    case "lg":
      return {
        star: "w-7 h-7",
        gap: "gap-1.5",
        scoreText: "text-base font-bold",
        countText: "text-sm ms-2.5",
      };
    case "xl":
      return {
        star: "w-9 h-9",
        gap: "gap-2",
        scoreText: "text-xl font-bold",
        countText: "text-base ms-3",
      };
    case "md":
    default:
      return {
        star: "w-5 h-5",
        gap: "gap-1",
        scoreText: "text-[13px] font-semibold",
        countText: "text-xs ms-2",
      };
  }
});

// Star Click & Hover Handlers
const handleStarClick = (starIndex: number, event: MouseEvent) => {
  if (!props.interactive) return;
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const isHalf = event.clientX - rect.left < rect.width / 2;
  const newRating = starIndex + (isHalf ? 0.5 : 1);
  emit("update:modelValue", newRating);
  emit("change", newRating);
};

const handleStarHover = (starIndex: number, event: MouseEvent) => {
  if (!props.interactive) return;
  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  const isHalf = event.clientX - rect.left < rect.width / 2;
  hoveredScore.value = starIndex + (isHalf ? 0.5 : 1);
};

const handleMouseLeave = () => {
  if (!props.interactive) return;
  hoveredScore.value = null;
};

// Trigger 60ms Staggered Animation
const triggerStagger = () => {
  isStaggering.value = true;
  setTimeout(() => {
    isStaggering.value = false;
  }, 420);
};

defineExpose({
  triggerStagger,
});
</script>

<style scoped>
@keyframes star-pop {
  0% {
    transform: scale(1);
    opacity: 0.2;
  }

  50% {
    transform: scale(1.18);
    opacity: 1;
  }

  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.animate-star-pop {
  animation: star-pop 280ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}
</style>