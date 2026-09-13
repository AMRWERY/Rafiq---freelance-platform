<template>
  <div
    class="bg-white border border-[#DEE1E7] rounded-[12px] p-4 md:p-5 text-[#14171F] space-y-4 shadow-none"
  >
    <!-- Header -->
    <div
      class="flex items-center justify-between pb-3 border-b border-[#DEE1E7]"
    >
      <div class="flex items-center gap-2">
        <Icon name="lucide:sliders-horizontal" class="w-4 h-4 text-[#2563C7]" />
        <h3 class="text-sm font-bold text-[#14171F]">Project Filters</h3>
        <LazyVBadge v-if="activeFilterCount > 0" tone="client" density="sm">
          {{ activeFilterCount }} active
        </LazyVBadge>
      </div>

      <LazyVButton
        v-if="activeFilterCount > 0"
        variant="ghost"
        size="sm"
        @click="resetFilters"
      >
        Reset
      </LazyVButton>
    </div>

    <!-- Filter Inputs Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
      <!-- Keyword Search -->
      <div class="md:col-span-1">
        <LazyVInput
          v-model="filters.keyword"
          placeholder="Search projects by keyword..."
          density="sm"
        >
          <template #leading>
            <Icon name="lucide:search" class="w-3.5 h-3.5 text-[#8A909C]" />
          </template>
        </LazyVInput>
      </div>

      <!-- Contract Settlement Model Filter with LazyVSelectInput -->
      <div>
        <LazyVSelectInput
          v-model="filters.contractType"
          placeholder="All Contract Models"
          density="sm"
          :options="[
            { label: 'All Contract Models', value: '' },
            { label: 'Fixed Price (Milestones)', value: 'fixed' },
            { label: 'Hourly Rate (/hr)', value: 'hourly' },
          ]"
        >
          <template #leading>
            <Icon
              name="lucide:file-signature"
              class="w-3.5 h-3.5 text-[#8A909C]"
            />
          </template>
        </LazyVSelectInput>
      </div>

      <!-- Delivery Window Filter with LazyVSelectInput -->
      <div>
        <LazyVSelectInput
          v-model="filters.deliveryWindow"
          placeholder="All Delivery Windows"
          density="sm"
          :options="[
            { label: 'All Delivery Windows', value: '' },
            { label: '1 to 3 Months (Standard)', value: '1-3' },
            { label: '3 to 6 Months (Enterprise)', value: '3-6' },
            { label: '6+ Months (Multi-phase)', value: '6+' },
          ]"
        >
          <template #leading>
            <Icon name="lucide:calendar" class="w-3.5 h-3.5 text-[#8A909C]" />
          </template>
        </LazyVSelectInput>
      </div>

      <!-- Budget Range Filter with LazyVSelectInput -->
      <div>
        <LazyVSelectInput
          v-model="filters.budgetRange"
          placeholder="All Budget Ranges"
          density="sm"
          :options="[
            { label: 'All Budget Ranges', value: '' },
            { label: 'Under $2,500', value: 'under-2500' },
            { label: '$2,500 to $10,000', value: '2500-10000' },
            { label: '$10,000 and above', value: 'above-10000' },
          ]"
        >
          <template #leading>
            <Icon
              name="lucide:dollar-sign"
              class="w-3.5 h-3.5 text-[#8A909C]"
            />
          </template>
        </LazyVSelectInput>
      </div>
    </div>

    <!-- Quick Skill Chips -->
    <div class="flex items-center gap-2 pt-1 flex-wrap text-xs">
      <span class="text-[11px] font-semibold text-[#8A909C]"
        >Popular Stacks:</span
      >
      <LazyVBadge
        v-for="skill in popularSkills"
        :key="skill"
        tone="neutral"
        density="sm"
        selectable
        :class="[
          'cursor-pointer transition-all',
          filters.skills.includes(skill)
            ? 'bg-[#2563C7]/15 text-[#2563C7] border-[#2563C7] font-bold'
            : 'hover:bg-[#EEF0F4]',
        ]"
        @click="toggleSkill(skill)"
      >
        {{ skill }}
      </LazyVBadge>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ProjectFilterState } from "~/types/VProjectFilters"

const props = withDefaults(
  defineProps<{
    modelValue?: Partial<ProjectFilterState>;
  }>(),
  {}
);

const emit = defineEmits<{
  (e: "update:modelValue", val: ProjectFilterState): void;
  (e: "change", val: ProjectFilterState): void;
}>();

const popularSkills = ["Rust", "Solana", "TypeScript", "Nuxt", "PostgreSQL", "Docker"];

const filters = reactive<ProjectFilterState>({
  keyword: props.modelValue?.keyword ?? "",
  contractType: props.modelValue?.contractType ?? "",
  deliveryWindow: props.modelValue?.deliveryWindow ?? "",
  budgetRange: props.modelValue?.budgetRange ?? "",
  skills: props.modelValue?.skills ?? [],
});

watch(
  filters,
  (val) => {
    emit("update:modelValue", { ...val });
    emit("change", { ...val });
  },
  { deep: true }
);

const activeFilterCount = computed(() => {
  let count = 0;
  if (filters.keyword.trim()) count++;
  if (filters.contractType) count++;
  if (filters.deliveryWindow) count++;
  if (filters.budgetRange) count++;
  count += filters.skills.length;
  return count;
});

const toggleSkill = (skill: string) => {
  const idx = filters.skills.indexOf(skill);
  if (idx >= 0) {
    filters.skills.splice(idx, 1);
  } else {
    filters.skills.push(skill);
  }
};

const resetFilters = () => {
  filters.keyword = "";
  filters.contractType = "";
  filters.deliveryWindow = "";
  filters.budgetRange = "";
  filters.skills = [];
};
</script>