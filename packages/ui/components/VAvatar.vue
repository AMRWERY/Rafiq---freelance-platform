<template>
  <div
    role="img"
    :aria-label="accessibleLabel"
    :class="[
      'relative inline-flex items-center justify-center rounded-full shrink-0 font-sans font-bold select-none',
      sizeStyles.box,
    ]"
  >
    <!-- 1. Photographic Avatar Primitive -->
    <img
      v-if="src && !imageFailed"
      :src="src"
      :alt="alt || name"
      class="w-full h-full object-cover rounded-full border border-[#DEE1E7]"
      @error="imageFailed = true"
    />

    <!-- 2. Role-Accented Monogram / Initials Fallback Tile -->
    <div
      v-else
      :class="[
        'w-full h-full flex items-center justify-center rounded-full border tracking-wide font-sans font-bold',
        roleStyles.bg,
        roleStyles.text,
        roleStyles.border,
      ]"
    >
      {{ initials }}
    </div>

    <!-- 3. Telemetry Presence Dot Overlay -->
    <span
      v-if="presence !== 'none' && !verified"
      :class="[
        'absolute rounded-full ring-white',
        sizeStyles.dot,
        presenceColor,
      ]"
      aria-hidden="true"
    />

    <!-- 4. Cryptographic Verified Authority Badge -->
    <span
      v-if="verified"
      :class="[
        'absolute rounded-full ring-white flex items-center justify-center text-white shadow-sm',
        sizeStyles.badge,
        roleStyles.badgeBg,
      ]"
      aria-hidden="true"
    >
      <Icon name="lucide:check" class="w-[75%] h-[75%] stroke-[3]" />
    </span>
  </div>
</template>

<script lang="ts" setup>
import type {
  AvatarSize,
  AvatarRoleContext,
  AvatarPresence,
  AvatarProps,
} from "~/types/VAvatar";

const props = withDefaults(defineProps<AvatarProps>(), {
  src: "",
  name: "",
  alt: "",
  size: "md",
  roleContext: "client",
  presence: "none",
  verified: false,
});

const imageFailed = ref(false);

watch(
  () => props.src,
  () => {
    imageFailed.value = false;
  },
);

// Extract 2-letter initials (e.g., "Alex Chen" -> "AC")
const initials = computed(() => {
  if (!props.name) return "?";
  const parts = props.name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
});

const accessibleLabel = computed(() => {
  const presenceString =
    props.presence !== "none" ? ` (${props.presence})` : "";
  const verifiedString = props.verified ? " (Verified)" : "";
  return props.name
    ? `${props.name}${presenceString}${verifiedString}`
    : props.alt || "User Avatar";
});

// Proportions & dimensional standards
const sizeStyles = computed(() => {
  switch (props.size) {
    case "xs":
      return {
        box: "w-6 h-6 text-[10px]",
        dot: "w-1.5 h-1.5 ring-[1.5px] -bottom-0.5 -right-0.5",
        badge: "w-3 h-3 text-[7px] ring-[1.5px] -bottom-1 -right-1",
      };
    case "sm":
      return {
        box: "w-8 h-8 text-[12px]",
        dot: "w-2 h-2 ring-[2px] bottom-0 right-0",
        badge: "w-3.5 h-3.5 text-[8px] ring-[2px] -bottom-0.5 -right-0.5",
      };
    case "lg":
      return {
        box: "w-14 h-14 text-[16px]",
        dot: "w-3 h-3 ring-[2.5px] bottom-0.5 right-0.5",
        badge: "w-5 h-5 text-[11px] ring-[2.5px] bottom-0 right-0",
      };
    case "xl":
      return {
        box: "w-[72px] h-[72px] text-[22px]",
        dot: "w-4 h-4 ring-[3px] bottom-1 right-1",
        badge: "w-6 h-6 text-[13px] ring-[3px] bottom-0.5 right-0.5",
      };
    case "md":
    default:
      return {
        box: "w-10 h-10 text-[14px]",
        dot: "w-2.5 h-2.5 ring-[2px] bottom-0 right-0",
        badge: "w-4 h-4 text-[9px] ring-[2px] -bottom-0.5 -right-0.5",
      };
  }
});

// Role-accented 12% tint background & text colors
const roleStyles = computed(() => {
  switch (props.roleContext) {
    case "developer":
      return {
        bg: "bg-[#6E56CF]/12",
        text: "text-[#6E56CF]",
        border: "border-[#6E56CF]/20",
        badgeBg: "bg-[#6E56CF]",
      };
    case "neutral":
      return {
        bg: "bg-[#5B6270]/12",
        text: "text-[#5B6270]",
        border: "border-[#5B6270]/20",
        badgeBg: "bg-[#5B6270]",
      };
    case "client":
    default:
      return {
        bg: "bg-[#2563C7]/12",
        text: "text-[#2563C7]",
        border: "border-[#2563C7]/20",
        badgeBg: "bg-[#2563C7]",
      };
  }
});

// Presence indicator colors
const presenceColor = computed(() => {
  switch (props.presence) {
    case "online":
      return "bg-[#17A883]";
    case "away":
      return "bg-[#C77D18]";
    case "busy":
      return "bg-[#D23C3C]";
    case "offline":
      return "bg-[#8A909C]";
    default:
      return "";
  }
});
</script>