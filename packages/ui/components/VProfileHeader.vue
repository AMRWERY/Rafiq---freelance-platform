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
                    <div class="relative shrink-0">
                        <!-- Squircle Avatar Container -->
                        <div :class="[
                            'overflow-hidden border border-[#DEE1E7] flex items-center justify-center select-none bg-[#EEF0F4]',
                            densityConfig.avatarBox,
                        ]">
                            <img v-if="avatarUrl && !avatarImageFailed" :src="avatarUrl" :alt="name"
                                class="w-full h-full object-cover" @error="avatarImageFailed = true" />
                            <span v-else :class="[
                                'font-bold',
                                densityConfig.avatarText,
                                perspective === 'developer' ? 'text-[#6E56CF]' : 'text-[#2563C7]',
                            ]">
                                {{ initials }}
                            </span>
                        </div>

                        <!-- Real-Time Floating Presence Pip -->
                        <span v-if="availability === 'available'"
                            class="absolute -top-1 -end-1 w-3.5 h-3.5 rounded-full bg-[#17A883] ring-2 ring-white"
                            title="Available Now" aria-label="Online presence status" />

                        <!-- Cryptographic Verification Shield Badge -->
                        <span v-if="verified" :class="[
                            'absolute -bottom-1.5 -end-1.5 p-1 rounded-full text-white ring-2 ring-white shadow-sm flex items-center justify-center',
                            perspective === 'developer' ? 'bg-[#6E56CF]' : 'bg-[#2563C7]',
                        ]" title="Verified Talent">
                            <Icon name="ph:shield-check-bold" class="w-3.5 h-3.5" />
                        </span>
                    </div>
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

                    <slot name="verified-badge" :verified="verified" :perspective="perspective">
                        <div v-if="verified" :class="[
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold border',
                            perspective === 'developer'
                                ? 'bg-[#6E56CF]/10 text-[#6E56CF] border-[#6E56CF]/20'
                                : 'bg-[#2563C7]/10 text-[#2563C7] border-[#2563C7]/20',
                        ]">
                            <Icon name="ph:shield-check-bold" class="w-3.5 h-3.5" />
                            <span>{{ perspective === 'developer' ? 'Vetted Developer' : 'Escrow Verified' }}</span>
                        </div>
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

                    <div v-if="perspective === 'developer' && committerRank"
                        class="text-xs text-[#17A883] bg-[#17A883]/10 px-2 py-0.5 rounded font-bold">
                        {{ committerRank }}
                    </div>
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

                <!-- Tech Stack Monospace Tag Cluster -->
                <slot name="skills" :skills="skills" :visible-skills="visibleSkills"
                    :overflow-count="overflowSkillsCount">
                    <div class="flex flex-wrap items-center gap-1.5 pt-1">
                        <span v-for="skill in visibleSkills" :key="skill"
                            class="px-2 py-0.5 bg-[#EEF0F4] hover:bg-[#DEE1E7] text-[#14171F] text-[11px] rounded border border-[#DEE1E7] transition-colors">
                            {{ skill }}
                        </span>

                        <span v-if="overflowSkillsCount > 0"
                            class="px-1.5 py-0.5 bg-white text-[#5B6270] text-[11px] rounded border border-[#DEE1E7]">
                            +{{ overflowSkillsCount }} more
                        </span>
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

                <!-- Availability Status Pill -->
                <div
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#17A883]/10 border border-[#17A883]/20 rounded-full text-xs text-[#17A883] font-semibold w-fit lg:self-end">
                    <span class="w-1.5 h-1.5 rounded-full bg-[#17A883] animate-pulse"></span>
                    <span>{{ availabilityText }}</span>
                </div>

                <!-- Conversion CTAs: Context-Swapped Pairing with Dynamic Component Support -->
                <div class="flex items-center gap-2 w-full lg:w-auto">
                    <!-- Secondary Action -->
                    <slot name="secondary-action" :perspective="perspective" :emit="emit">
                        <component :is="secondaryActionAs || 'button'" :type="secondaryActionAs ? undefined : 'button'"
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
                        <component :is="primaryActionAs || 'button'" :type="primaryActionAs ? undefined : 'button'"
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

const avatarImageFailed = ref(false)

const initials = computed(() => {
    if (!props.name) return '?'
    const parts = props.name.trim().split(/\s+/)
    return parts.length === 1 ? parts[0].slice(0, 2).toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
})

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

// Density proportional styles
const densityConfig = computed(() => {
    switch (props.density) {
        case 'compact':
            return {
                cardPadding: 'p-4',
                avatarBox: 'w-14 h-14 rounded-lg',
                avatarText: 'text-base',
                nameHeading: 'text-lg',
                buttonHeight: 'h-8 px-3 text-xs',
            }
        case 'spotlight':
            return {
                cardPadding: 'p-6 md:p-8',
                avatarBox: 'w-24 h-24 rounded-2xl',
                avatarText: 'text-2xl',
                nameHeading: 'text-2xl',
                buttonHeight: 'h-12 px-6 text-base',
            }
        case 'standard':
        default:
            return {
                cardPadding: 'p-6',
                avatarBox: 'w-20 h-20 md:w-24 md:h-24 rounded-xl',
                avatarText: 'text-xl',
                nameHeading: 'text-xl',
                buttonHeight: 'h-10 px-4 text-sm',
            }
    }
})
</script>