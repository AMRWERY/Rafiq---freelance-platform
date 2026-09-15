<template>
    <article role="article" :aria-label="`Developer Proposal from ${data.candidateName}`" :class="[
        'w-full bg-white border border-[#DEE1E7] rounded-[12px] font-sans text-[#14171F]',
        'transition-all duration-150 ease-out will-change-transform',
        'hover:-translate-y-0.5 hover:border-[#8A909C]/50 hover:shadow-none',
        densityStyles.cardPadding,
    ]">
        <!-- ZONE 01: Identity & Trust Anchor Header -->
        <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#DEE1E7]">
            <div class="flex items-center gap-3">
                <!-- Avatar via shared VAvatar — handles image, fallback initials & presence pip -->
                <LazyVAvatar :src="data.candidateAvatar" :name="data.candidateName" :size="avatarSize"
                    :role-context="perspective === 'developer' ? 'developer' : 'client'" presence="online" />

                <!-- Name, Star Rating & Verified Contract Meta -->
                <div>
                    <div class="flex items-center gap-2 flex-wrap">
                        <h3 :class="['font-bold text-[#14171F] tracking-tight', densityStyles.nameHeading]">
                            {{ data.candidateName }}
                        </h3>

                        <!-- Top Committer Badge -->
                        <LazyVBadge v-if="data.committerBadge" tone="violet" density="sm">
                            {{ data.committerBadge }}
                        </LazyVBadge>
                    </div>

                    <div class="flex items-center gap-2 text-xs text-[#5B6270] font-mono mt-0.5 flex-wrap">
                        <span class="flex items-center gap-1 text-[#C77D18] font-bold">
                            <Icon name="material-symbols:kid-star" class="w-3.5 h-3.5 fill-current text-[#C77D18]" />
                            <span>{{ data.starRating?.toFixed(2) }}</span>
                        </span>
                        <span>·</span>
                        <span>{{ data.verifiedContractsCount }} verified contracts</span>
                        <span>·</span>
                        <span class="text-[#17A883] font-bold">{{ data.completionRate }}% Completion</span>
                    </div>
                </div>
            </div>

            <!-- Lifecycle Review Status Pill & Timestamp -->
            <div
                class="sm:text-right font-mono text-xs shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-1">
                <LazyVBadge :tone="statusTone" density="sm" dot>
                    {{ statusLabel }}
                </LazyVBadge>
                <span class="text-[11px] text-[#8A909C]">{{ data.submittedTimeAgo }}</span>
            </div>
        </header>

        <!-- ZONE 02: Financial & Temporal Ledger Grid -->
        <div
            class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-[#F7F7F9] border border-[#DEE1E7] rounded-xl font-mono">
            <!-- 1. Bid Amount -->
            <div class="space-y-0.5">
                <span class="text-[10px] text-[#8A909C] uppercase tracking-wider block">BID AMOUNT</span>
                <div class="text-lg font-bold tracking-tight text-[#14171F]">
                    ${{ data.bidAmount?.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
                    <span class="text-xs font-normal text-[#8A909C]">{{ data.currency }}</span>
                </div>
                <span class="text-[11px] text-[#2563C7] hover:underline cursor-pointer block">
                    {{ data.milestonesCount }} Milestones Structured
                </span>
            </div>

            <!-- 2. Committed Window -->
            <div class="space-y-0.5">
                <span class="text-[10px] text-[#8A909C] uppercase tracking-wider block">COMMITTED WINDOW</span>
                <div class="text-lg font-bold tracking-tight text-[#14171F] flex items-center gap-1.5">
                    <Icon name="lucide:calendar" class="w-4 h-4 text-[#5B6270]" />
                    <span>{{ data.timelineDays }} Days</span>
                </div>
                <span class="text-[11px] text-[#5B6270] block">
                    Delivery: {{ data.targetDeliveryDate }}
                </span>
            </div>

            <!-- 3. Escrow Security Guarantee -->
            <div class="space-y-0.5">
                <span class="text-[10px] text-[#8A909C] uppercase tracking-wider block">ESCROW SECURITY</span>
                <div class="text-xs font-bold text-[#17A883] flex items-center gap-1">
                    <Icon name="ph:shield-check-bold" class="w-4 h-4" />
                    <span>Deterministic</span>
                </div>
                <span class="text-[10px] text-[#8A909C] block">
                    Funded upon acceptance
                </span>
            </div>
        </div>

        <!-- ZONE 03: Synthesized Abstract & Proposal Text -->
        <div class="space-y-1.5 text-xs font-body">
            <div class="flex items-center justify-between text-[11px] font-mono text-[#8A909C]">
                <span># PROPOSAL ABSTRACT</span>
                <span>{{ data.wordCount }} words total</span>
            </div>

            <p class="text-[#5B6270] italic leading-relaxed line-clamp-2">
                "{{ data.abstractText }}"
            </p>

            <!-- Tertiary ghost link using VButton -->
            <LazyVButton type="button" variant="tertiary" size="sm"
                :role-context="perspective === 'developer' ? 'developer' : 'client'"
                @click="emit('readFull', data.id!)">
                Read Full Architecture Proposal ({{ data.wordCount }} words)
                <template #trailing>
                    <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" />
                </template>
            </LazyVButton>
        </div>

        <!-- ZONE 04: Monospace Stack Vector Tags -->
        <div class="flex items-center gap-1.5 flex-wrap pt-1">
            <span class="text-[10px] font-mono text-[#8A909C] mr-1">Stack Vector:</span>
            <span v-for="skill in data.skills" :key="skill"
                class="px-2 py-0.5 bg-[#EEF0F4] hover:bg-[#DEE1E7] text-[#14171F] font-mono text-[11px] rounded border border-[#DEE1E7] transition-colors">
                {{ skill }}
            </span>
        </div>

        <!-- ZONE 05: Contextual Action Triad Footer -->
        <footer class="pt-4 border-t border-[#DEE1E7] flex flex-col sm:flex-row sm:items-center justify-between gap-3">

            <!-- Perspective: Client Lens -->
            <template v-if="perspective === 'client'">
                <div class="flex items-center gap-2 flex-wrap flex-1">
                    <!-- Primary CTA: Accept & Fund -->
                    <LazyVButton type="button" variant="primary" :size="buttonSize" role-context="client"
                        @click="emit('accept', data.id!)">
                        <template #leading>
                            <Icon name="ph:lock-simple-bold" class="w-4 h-4" />
                        </template>
                        Accept Proposal & Fund Escrow
                    </LazyVButton>

                    <!-- Secondary CTA: Message -->
                    <LazyVButton type="button" variant="secondary" :size="buttonSize" role-context="client"
                        @click="emit('message', data.id!)">
                        <template #leading>
                            <Icon name="ph:chat-teardrop-dots-bold" class="w-4 h-4" />
                        </template>
                        Message {{ data.candidateName?.split(' ')[0] }}
                    </LazyVButton>
                </div>

                <!-- Tertiary CTA: Polite Decline -->
                <LazyVButton type="button" variant="tertiary" :size="buttonSize" role-context="danger"
                    @click="emit('decline', data.id!)">
                    ✕ Decline Bid
                </LazyVButton>
            </template>

            <!-- Perspective: Developer Lens -->
            <template v-else>
                <div class="flex items-center gap-2 flex-wrap flex-1">
                    <!-- Primary CTA: Edit Proposal -->
                    <LazyVButton type="button" variant="primary" :size="buttonSize" role-context="developer"
                        @click="emit('edit', data.id!)">
                        <template #leading>
                            <Icon name="lucide:edit-3" class="w-4 h-4" />
                        </template>
                        Edit Proposal Scope
                    </LazyVButton>

                    <!-- Secondary CTA: Withdraw -->
                    <LazyVButton type="button" variant="secondary" :size="buttonSize" role-context="danger"
                        @click="emit('withdraw', data.id!)">
                        Withdraw
                    </LazyVButton>
                </div>

                <!-- Developer Queue Telemetry -->
                <LazyVBadge tone="teal" density="sm" dot>
                    Queue: {{ data.competitorsInQueue }} Competitors
                </LazyVBadge>
            </template>
        </footer>
    </article>
</template>

<script lang="ts" setup>
import type { ProposalData, ProposalPerspective, ProposalDensity } from '@/types/VProposalCard'

const props = withDefaults(
    defineProps<{
        data?: Partial<ProposalData>
        perspective?: ProposalPerspective
        density?: ProposalDensity
    }>(),
    {
        perspective: 'client',
        density: 'standard',
        data: () => ({
            id: 'BID-RF-0821',
            candidateName: 'Alexei Vance',
            candidateAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
            starRating: 4.95,
            verifiedContractsCount: 14,
            committerBadge: 'Top 1% Committer',
            completionRate: 99.8,
            status: 'pending',
            submittedTimeAgo: 'Submitted 2h ago',
            bidAmount: 6400,
            currency: 'USD',
            milestonesCount: 3,
            timelineDays: 18,
            targetDeliveryDate: 'Jun 14, 2026',
            escrowGuaranteed: true,
            abstractText:
                'Specialized in high-throughput Solana RPC indexing and Rust Tokio event pipelines. I have reviewed your ScyllaDB persistence schema and can deliver verified multi-sig milestone tranches.',
            wordCount: 420,
            skills: ['rust::wasm', 'solana-core', 'tokio', 'scylladb', 'grpc'],
            budgetVariancePercent: -12,
            clientViewedTimeAgo: 'Viewed 54m ago by Client',
            competitorsInQueue: 4,
        }),
    }
)

const emit = defineEmits<{
    (e: 'accept', id: string): void
    (e: 'message', id: string): void
    (e: 'decline', id: string): void
    (e: 'edit', id: string): void
    (e: 'withdraw', id: string): void
    (e: 'readFull', id: string): void
}>()

// Map card density → VAvatar size
const avatarSize = computed(() => {
    switch (props.density) {
        case 'compact': return 'md' as const
        case 'expanded': return 'lg' as const
        default: return 'md' as const
    }
})

// Map card density → VButton size
const buttonSize = computed(() => {
    switch (props.density) {
        case 'compact': return 'sm' as const
        case 'expanded': return 'md' as const
        default: return 'sm' as const
    }
})

// Map status → VBadge tone
const statusTone = computed(() => {
    switch (props.data?.status) {
        case 'accepted': return 'teal' as const
        case 'declined': return 'coral' as const
        case 'shortlisted': return 'violet' as const
        default: return 'cobalt' as const
    }
})

const statusLabel = computed(() => {
    switch (props.data?.status) {
        case 'accepted': return 'Accepted & Funded'
        case 'declined': return 'Declined'
        case 'shortlisted': return 'Shortlisted'
        default: return 'Pending Review'
    }
})

// Density card padding + name heading size
const densityStyles = computed(() => {
    switch (props.density) {
        case 'compact':
            return { cardPadding: 'p-4 space-y-3', nameHeading: 'text-base' }
        case 'expanded':
            return { cardPadding: 'p-6 md:p-8 space-y-6', nameHeading: 'text-2xl' }
        default:
            return { cardPadding: 'p-6 space-y-4', nameHeading: 'text-lg' }
    }
})
</script>