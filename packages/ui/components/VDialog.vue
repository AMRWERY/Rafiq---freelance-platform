<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0F1117]/60 backdrop-blur-[4px] overflow-y-auto"
        @click="handleBackdropClick"
        role="presentation"
      >
        <!-- Modal Dialog Surface Card -->
        <div
          ref="modalRef"
          role="dialog"
          aria-modal="true"
          :aria-labelledby="title ? titleId : undefined"
          :aria-describedby="description ? descId : undefined"
          :class="[
            'relative w-full bg-white text-[#14171F] rounded-[16px] border border-[#DEE1E7]',
            'shadow-[0_8px_24px_rgba(0,0,0,0.12)] flex flex-col max-h-[90vh] overflow-hidden',
            'transition-all will-change-transform',
            sizeClasses[size],
          ]"
          @click.stop
        >
          <!-- 1. Header Section -->
          <div class="p-6 pb-4 border-b border-[#DEE1E7] flex flex-col gap-2">
            <!-- Top Tag & Stage Row -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2 text-[11px]">
                <span
                  v-if="tag"
                  :class="[
                    'px-2 py-0.5 rounded font-semibold uppercase tracking-wider',
                    roleContext === 'developer'
                      ? 'bg-[#6E56CF]/10 text-[#6E56CF]'
                      : roleContext === 'danger'
                        ? 'bg-[#D23C3C]/10 text-[#D23C3C]'
                        : 'bg-[#2563C7]/10 text-[#2563C7]',
                  ]"
                >
                  {{ tag }}
                </span>
                <span v-if="stage" class="text-[#8A909C]">{{ stage }}</span>
              </div>

              <!-- Close (X) Trigger -->
              <LazyVButton
                v-if="showCloseButton"
                type="button"
                variant="tertiary"
                size="sm"
                :role-context="roleContext === 'developer' ? 'developer' : 'client'"
                aria-label="Close dialog"
                @click="closeModal"
              >
                <Icon name="lucide:x" class="w-4 h-4" />
              </LazyVButton>
            </div>

            <!-- Title & Description -->
            <div>
              <slot name="header">
                <h2
                  v-if="title"
                  :id="titleId"
                  class="text-xl font-bold tracking-tight text-[#14171F]"
                >
                  {{ title }}
                </h2>
                <p
                  v-if="description"
                  :id="descId"
                  class="text-xs text-[#5B6270] mt-1 font-body leading-relaxed"
                >
                  {{ description }}
                </p>
              </slot>
            </div>
          </div>

          <!-- 2. Scrollable Body Content -->
          <div class="p-6 overflow-y-auto flex-1 font-body text-sm space-y-4">
            <slot />
          </div>

          <!-- 3. Footer Action Bar -->
          <div
            v-if="$slots.footer"
            class="px-6 py-4 bg-[#F7F7F9] border-t border-[#DEE1E7] flex items-center justify-between gap-3"
          >
            <slot name="footer" :close="closeModal" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import type { DialogSize, DialogRoleContext, BaseDialogProps } from "~/types/VDialog"

const props = withDefaults(defineProps<BaseDialogProps>(), {
  modelValue: false,
  size: "md",
  roleContext: "client",
  closeOnEsc: true,
  closeOnBackdrop: true,
  showCloseButton: true,
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "close"): void;
  (e: "confirm"): void;
}>();

const generatedId = useId();
const titleId = `modal-title-${generatedId}`;
const descId = `modal-desc-${generatedId}`;

const modalRef = ref<HTMLElement | null>(null);
let previousActiveElement: HTMLElement | null = null;

const closeModal = () => {
  emit("update:modelValue", false);
  emit("close");
};

const handleBackdropClick = (e: MouseEvent) => {
  if (props.closeOnBackdrop && e.target === e.currentTarget) {
    closeModal();
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (!props.modelValue) return;

  if (e.key === "Escape" && props.closeOnEsc) {
    e.preventDefault();
    closeModal();
    return;
  }

  // Strict Tab Trap
  if (e.key === "Tab" && modalRef.value) {
    const focusable = modalRef.value.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (focusable.length === 0) return;

    const firstEl = focusable[0];
    const lastEl = focusable[focusable.length - 1];

    if (e.shiftKey && document.activeElement === firstEl) {
      e.preventDefault();
      lastEl.focus();
    } else if (!e.shiftKey && document.activeElement === lastEl) {
      e.preventDefault();
      firstEl.focus();
    }
  }
};

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen) {
      previousActiveElement = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      await nextTick();
      if (modalRef.value) {
        const focusable = modalRef.value.querySelector<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), [tabindex="0"]',
        );
        focusable?.focus();
      }
    } else {
      document.body.style.overflow = "";
      previousActiveElement?.focus();
    }
  },
);

onMounted(() => window.addEventListener("keydown", handleKeyDown));

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
  document.body.style.overflow = "";
});

const sizeClasses = {
  sm: "max-w-[440px]",
  md: "max-w-[560px]",
  lg: "max-w-[720px]",
};
</script>

<style scoped>
/* Scrim Crossfade (150ms ease-out) */
.modal-fade-enter-active {
  transition: opacity 150ms cubic-bezier(0, 0, 0.2, 1);
}

.modal-fade-leave-active {
  transition: opacity 150ms cubic-bezier(0.4, 0, 1, 1);
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

/* Panel Pop & Scale In (220ms ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1)) */
.modal-fade-enter-active > div {
  animation: modal-enter 220ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

.modal-fade-leave-active > div {
  animation: modal-exit 150ms cubic-bezier(0.4, 0, 1, 1) forwards;
}

@keyframes modal-enter {
  from {
    opacity: 0;
    transform: scale(0.96) translateY(-4px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes modal-exit {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: scale(0.96) translateY(4px);
  }
}
</style>