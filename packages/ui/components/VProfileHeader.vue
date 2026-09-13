<template>
    <component :is="as || 'article'" :class="[
        'w-full bg-white border border-[#DEE1E7] rounded-[12px] text-[#14171F] transition-all',
        'shadow-none hover:border-[#8A909C]/40',
        densityConfig.cardPadding,
    ]" role="region" :aria-label="`Talent Profile Header: ${name}`">
        <!-- 3-Zone Flex Grid Container -->
        <div class="flex flex-col lg:flex-row items-start justify-between gap-6">

            <!-- ZONE 01: Left Identity Standoff Anchor -->
            <div class="flex items-start gap-4 shrink-0">
                <slot name="avatar">
                    <LazyVAvatar :src="avatarUrl" :name="name" :size="avatarSize"
                        :role-context="perspective === 'developer' ? 'developer' : 'client'"
                        :presence="availability === 'available' ? 'online' : availability === 'busy' ? 'busy' : 'none'"
                        :verified="verified" />
                </slot>

                <!-- Mobile-Only Title Layout (Hidden on Desktop) -->
                <div class="lg:hidden">
                    <h2 :class="['font-bold tracking-tight text-[#14171F]', densityConfig.nameHeading]">
                        {{ name }}
                    </h2>
                    <div class="text-xs font-semibold text-[#5B6270]">{{ headline }}</div>
                </div>
            </div>

            <!-- ZONE 02: Center Metadata Cluster -->
            <div class="flex-1 space-y-3 min-w-0">
                <!-- Name, Verified Badge & Developer Handle Header -->
                <div class="hidden lg:flex items-center gap-2.5 flex-wrap">
                    <h2 :class="['font-bold tracking-tight text-[#14171F]', densityConfig.nameHeading]">
                        {{ name }}
                    </h2>

                    <!-- Verified Status Badge using shared VBadge -->
                    <slot name="verified-badge" :verified="verified" :perspective="perspective">
                        <LazyVBadge v-if="verified" :tone="perspective === 'developer' ? 'developer' : 'client'"
                            density="sm">
                            <template #leading>
                                <Icon name="ph:shield-check-bold" class="w-3.5 h-3.5 me-1" />
                            </template>
                            {{ perspective === 'developer' ? 'Vetted Developer' : 'Escrow Verified' }}
                        </LazyVBadge>
                    </slot>

                    <!-- Dynamic Component for GitHub Link / Chip -->
                    <component :is="githubUrl ? 'a' : 'div'" v-if="perspective === 'developer' && githubHandle"
                        :href="githubUrl" :target="githubUrl ? '_blank' : undefined"
                        :rel="githubUrl ? 'noopener noreferrer' : undefined"
                        class="text-xs text-[#5B6270] hover:text-[#14171F] flex items-center gap-1 bg-[#EEF0F4] hover:bg-[#DEE1E7] px-2 py-0.5 rounded transition-colors group cursor-pointer">
                        <Icon name="lucide:git-branch" class="w-3.5 h-3.5 text-[#6E56CF]" />
                        <span>github.com/{{ githubHandle }}</span>
                        <span v-if="githubStars" class="text-[#C77D18] flex items-center font-bold">
                            <Icon name="lucide:star" class="w-3 h-3 fill-current ms-1 me-0.5" /> {{ githubStars }}
                        </span>
                    </component>

                    <!-- Committer Rank using shared VBadge -->
                    <LazyVBadge v-if="perspective === 'developer' && committerRank" tone="success" density="sm"
                        class="font-bold">
                        {{ committerRank }}
                    </LazyVBadge>
                </div>

                <div class="hidden lg:block text-xs font-semibold text-[#5B6270]">
                    {{ headline }}
                </div>

                <!-- Bio Description -->
                <slot name="bio" :bio="bio">
                    <p class="text-xs text-[#5B6270] font-body leading-relaxed line-clamp-2 max-w-2xl">
                        {{ bio }}
                    </p>
                </slot>

                <!-- Contextual Telemetry Chips (Location, Local Time, Rating/Success) -->
                <div class="flex flex-wrap items-center gap-3 text-xs text-[#5B6270] pt-1">
                    <span v-if="location" class="flex items-center gap-1">
                        <Icon name="lucide:map-pin" class="w-3.5 h-3.5 text-[#8A909C]" />
                        <span>{{ location }}</span>
                    </span>

                    <span v-if="localTime" class="flex items-center gap-1">
                        <Icon name="lucide:clock" class="w-3.5 h-3.5 text-[#8A909C]" />
                        <span>{{ timezoneOffset }} ({{ localTime }})</span>
                    </span>

                    <span v-if="jobSuccessRate" class="flex items-center gap-1 text-[#17A883] font-bold">
                        <Icon name="lucide:check-circle-2" class="w-3.5 h-3.5" />
                        <span>{{ jobSuccessRate }}% Job Success ({{ completedProjects }} Projects)</span>
                    </span>
                </div>

                <!-- Tech Stack Tag Cluster using shared VBadge -->
                <slot name="skills" :skills="skills" :visible-skills="visibleSkills"
                    :overflow-count="overflowSkillsCount">
                    <div class="flex flex-wrap items-center gap-1.5 pt-1">
                        <LazyVBadge v-for="skill in visibleSkills" :key="skill" tone="neutral" density="sm"
                            class="hover:bg-[#DEE1E7] transition-colors">
                            {{ skill }}
                        </LazyVBadge>

                        <LazyVBadge v-if="overflowSkillsCount > 0" tone="neutral" density="sm" class="bg-white">
                            +{{ overflowSkillsCount }} more
                        </LazyVBadge>
                    </div>
                </slot>
            </div>

            <!-- ZONE 03: Right Monetization, Availability & Conversion Engine -->
            <div
                class="flex flex-col lg:items-end justify-between w-full lg:w-auto shrink-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-[#DEE1E7] space-y-4">
                <!-- Hourly Rate & Escrow Commitment Plaque -->
                <div class="lg:text-end">
                    <div class="flex items-baseline lg:justify-end gap-1">
                        <span class="text-2xl font-bold tracking-tight text-[#14171F]">${{ hourlyRate }}</span>
                        <span class="text-xs text-[#5B6270]">/hr. {{ currency }}</span>
                    </div>
                    <div class="text-[11px] text-[#8A909C] flex items-center lg:justify-end gap-1 mt-0.5">
                        <Icon name="ph:lock-simple-bold" class="w-3 h-3 text-[#17A883]" />
                        <span>Smart Contract Escrow Locked</span>
                    </div>
                </div>

                <!-- Availability Status Pill using shared VBadge -->
                <LazyVBadge tone="success" density="sm" dot pulse class="rounded-full w-fit lg:self-end font-semibold">
                    {{ availabilityText }}
                </LazyVBadge>

                <!-- Conversion CTAs: Context-Swapped Pairing with Shared VButton & Dynamic Component Support -->
                <div class="flex items-center gap-2 w-full lg:w-auto">
                    <!-- Secondary Action -->
                    <slot name="secondary-action" :perspective="perspective" :emit="emit">
                        <LazyVButton v-if="secondaryActionAs === 'button'" variant="secondary" :size="buttonSize"
                            v-bind="secondaryActionProps" class="flex-1 lg:flex-initial"
                            @click="emit('secondaryAction')">
                            <template #leading>
                                <slot name="secondary-action-icon">
                                    <Icon
                                        :name="perspective === 'developer' ? 'lucide:git-pull-request' : 'ph:chat-teardrop-dots-bold'"
                                        class="w-4 h-4 text-[#5B6270]" />
                                </slot>
                            </template>
                            {{ secondaryActionLabel }}
                        </LazyVButton>
                        <component :is="secondaryActionAs" v-else :type="secondaryActionAs ? undefined : 'button'"
                            v-bind="secondaryActionProps"
                            class="flex-1 lg:flex-initial inline-flex items-center justify-center gap-1.5 bg-white border border-[#DEE1E7] hover:border-[#8A909C] text-[#14171F] font-semibold rounded-lg transition-all active:scale-[0.97] cursor-pointer"
                            :class="densityConfig.buttonHeight" @click="emit('secondaryAction')">
                            <slot name="secondary-action-icon">
                                <Icon
                                    :name="perspective === 'developer' ? 'lucide:git-pull-request' : 'ph:chat-teardrop-dots-bold'"
                                    class="w-4 h-4 text-[#5B6270]" />
                            </slot>
                            <span>{{ secondaryActionLabel }}</span>
                        </component>
                    </slot>

                    <!-- Primary Action -->
                    <slot name="primary-action" :perspective="perspective" :emit="emit">
                        <LazyVButton v-if="primaryActionAs === 'button'" variant="primary" :size="buttonSize"
                            :role-context="perspective === 'developer' ? 'developer' : 'client'"
                            v-bind="primaryActionProps" class="flex-1 lg:flex-initial" @click="emit('primaryAction')">
                            <template #leading>
                                <slot name="primary-action-icon">
                                    <Icon :name="perspective === 'developer' ? 'lucide:code' : 'ph:shield-check-bold'"
                                        class="w-4 h-4" />
                                </slot>
                            </template>
                            {{ primaryActionLabel }}
                        </LazyVButton>
                        <component :is="primaryActionAs" v-else :type="primaryActionAs ? undefined : 'button'"
                            v-bind="primaryActionProps" :class="[
                                'flex-1 lg:flex-initial inline-flex items-center justify-center gap-1.5 text-white font-semibold rounded-lg transition-all active:scale-[0.97] cursor-pointer shadow-sm',
                                densityConfig.buttonHeight,
                                perspective === 'developer'
                                    ? 'bg-[#6E56CF] hover:bg-[#5D3EB8]'
                                    : 'bg-[#2563C7] hover:bg-[#1D4ED8]',
                            ]" @click="emit('primaryAction')">
                            <slot name="primary-action-icon">
                                <Icon :name="perspective === 'developer' ? 'lucide:code' : 'ph:shield-check-bold'"
                                    class="w-4 h-4" />
                            </slot>
                            <span>{{ primaryActionLabel }}</span>
                        </component>
                    </slot>
                </div>
            </div>
        </div>
    </component>
</template>

<script lang="ts" setup>
import type { TalentProfileHeaderProps } from "~/types/VProfileHeader"

const props = withDefaults(defineProps<TalentProfileHeaderProps>(), {
    as: 'article',
    name: 'Malik Tehrani',
    headline: 'Staff Cloud Architect',
    bio: 'Distributed systems engineer specializing in high-throughput transactional pipelines, Kafka clustering, and PCI-DSS compliance.',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    perspective: 'client',
    density: 'standard',
    hourlyRate: 165,
    currency: 'USD',
    rateType: 'fixed',
    availability: 'available',
    availabilityText: 'Available Now',
    location: 'Munich, Germany',
    timezoneOffset: 'UTC+2',
    localTime: '03:42 local',
    jobSuccessRate: 99.8,
    completedProjects: 43,
    skills: () => ['Rust', 'Go', 'Kubernetes', 'Kafka', 'Terraform', 'gRPC', 'PostgreSQL', 'Docker'],
    maxVisibleSkills: 5,
    verified: true,
    escrowProtected: true,
    githubHandle: 'm-tehrani-infra',
    githubStars: '1.4k',
    committerRank: 'top 1% committer',
    primaryActionAs: 'button',
    secondaryActionAs: 'button',
})

const emit = defineEmits<{
    (e: 'primaryAction'): void
    (e: 'secondaryAction'): void
}>()

const githubUrl = computed(() => {
    if (!props.githubHandle) return undefined
    return `https://github.com/${props.githubHandle}`
})

const primaryActionLabel = computed(() => {
    if (props.primaryActionText) return props.primaryActionText
    return props.perspective === 'developer' ? 'Connect & Collaborate' : 'Hire Architect'
})

const secondaryActionLabel = computed(() => {
    if (props.secondaryActionText) return props.secondaryActionText
    return props.perspective === 'developer' ? 'Fork Scope' : 'Direct Message'
})

// Visible skills with overflow calculation
const visibleSkills = computed(() => props.skills.slice(0, props.maxVisibleSkills))
const overflowSkillsCount = computed(() => Math.max(0, props.skills.length - props.maxVisibleSkills))

const avatarSize = computed(() => {
    switch (props.density) {
        case 'compact':
            return 'md'
        case 'spotlight':
            return 'xl'
        case 'standard':
        default:
            return 'lg'
    }
})

const buttonSize = computed(() => {
    switch (props.density) {
        case 'compact':
            return 'sm'
        case 'spotlight':
            return 'lg'
        case 'standard':
        default:
            return 'md'
    }
})

// Density proportional styles
const densityConfig = computed(() => {
    switch (props.density) {
        case 'compact':
            return {
                cardPadding: 'p-4',
                nameHeading: 'text-lg',
                buttonHeight: 'h-8 px-3 text-xs',
            }
        case 'spotlight':
            return {
                cardPadding: 'p-6 md:p-8',
                nameHeading: 'text-2xl',
                buttonHeight: 'h-12 px-6 text-base',
            }
        case 'standard':
        default:
            return {
                cardPadding: 'p-6',
                nameHeading: 'text-xl',
                buttonHeight: 'h-10 px-4 text-sm',
            }
    }
})
</script>