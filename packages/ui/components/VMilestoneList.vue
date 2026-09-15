<template>
    <div class="space-y-6 text-[#14171F]">
        <!-- 1. Top Escrow Header Summary Card -->
        <div class="bg-white border border-[#DEE1E7] rounded-[12px] p-6 shadow-none space-y-4">
            <div class="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-[#DEE1E7]">
                <div>
                    <div class="flex items-center gap-2 text-[11px] mb-1.5">
                        <span class="text-[#5B6270]">ESCROW-ID: {{ contractId }}</span>
                        <LazyVBadge tone="teal" density="sm" dot pulse>MULTI-SIG SECURED</LazyVBadge>
                    </div>
                    <h2 class="text-xl md:text-2xl font-bold tracking-tight text-[#14171F]">
                        {{ title }}
                    </h2>
                    <p class="text-xs text-[#5B6270] mt-0.5 font-body">
                        {{ subtitle }}
                    </p>
                </div>

                <div class="md:text-end shrink-0">
                    <span class="text-[10px] text-[#8A909C] uppercase tracking-wider block">TOTAL COMMITTED
                        ESCROW</span>
                    <div class="text-2xl md:text-3xl font-bold tracking-tight text-[#14171F]">
                        ${{ totalCommitted.toLocaleString('en-US', { minimumFractionDigits: 2 }) }}
                        <span class="text-xs font-normal text-[#8A909C]">USD</span>
                    </div>
                </div>
            </div>

            <!-- Live Progress Bar Subcard -->
            <div class="bg-[#F7F7F9] border border-[#DEE1E7] rounded-xl p-4 space-y-2.5 text-xs">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                    <span class="font-bold text-[#14171F]">
                        {{ completedCount }} of {{ internalMilestones.length }} Milestones Settled ({{ progressPercent
                        }}.0%)
                    </span>
                    <span class="text-[#5B6270]">
                        ${{ disbursedTotal.toLocaleString() }}.00 disbursed / ${{ lockedTotal.toLocaleString() }}.00
                        locked
                    </span>
                </div>

                <!-- 400ms Eased Progress Track -->
                <div class="w-full bg-[#DEE1E7] h-2 rounded-full overflow-hidden">
                    <div class="h-full bg-[#17A883] rounded-full transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
                        :style="{ width: `${progressPercent}%` }" />
                </div>

                <div class="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] text-[#8A909C] pt-1">
                    <span class="flex items-center gap-1 text-[#17A883]">
                        <Icon name="ph:lock-simple-bold" class="w-3 h-3" />
                        Escrow funds held in multi-sig vault. ${{ lockedTotal.toLocaleString() }}.00 locked, ${{
                            disbursedTotal.toLocaleString() }}.00 disbursed
                    </span>
                    <span>Ledger: Safe-v2.1</span>
                </div>
            </div>
        </div>

        <!-- 2. Vertical Stepper Pipeline with Continuous Stem -->
        <div class="relative ps-6 md:ps-8 space-y-4" role="list" aria-label="Contract Milestone Stepper">

            <!-- Continuous Vertical Background Rail (Stem) -->
            <div class="absolute left-3 md:left-4 top-4 bottom-4 w-[1.5px] bg-[#DEE1E7] pointer-events-none" />

            <!-- Milestone Cards Repeater -->
            <div v-for="(ms, index) in internalMilestones" :key="ms.id" role="listitem"
                :aria-current="ms.state === 'submitted' || ms.state === 'in_progress' ? 'step' : undefined"
                class="relative">
                <!-- Stem Step Node Icon Anchor -->
                <div :class="[
                    'absolute -left-6 md:-left-8 top-5 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-[#F7F7F9] z-10 transition-colors',
                    ms.state === 'paid' || ms.state === 'approved'
                        ? 'bg-[#17A883] text-white'
                        : ms.state === 'submitted'
                            ? 'bg-[#C77D18] text-white ring-amber-100'
                            : ms.state === 'in_progress'
                                ? 'bg-[#6E56CF] text-white'
                                : 'bg-white border-2 border-[#DEE1E7] text-[#8A909C]'
                ]">
                    <Icon v-if="ms.state === 'paid' || ms.state === 'approved'" name="lucide:check"
                        class="w-3.5 h-3.5 stroke-[3]" />
                    <Icon v-else-if="ms.state === 'submitted'" name="lucide:clock" class="w-3.5 h-3.5" />
                    <span v-else class="text-[10px] font-bold">{{ index + 1 }}</span>
                </div>

                <!-- Milestone Card Container -->
                <div :class="[
                    'bg-white border rounded-[12px] p-5 transition-all space-y-3',
                    ms.state === 'submitted'
                        ? 'border-[#C77D18] ring-2 ring-[#C77D18]/15 shadow-sm'
                        : ms.state === 'in_progress'
                            ? 'border-[#6E56CF]/40'
                            : 'border-[#DEE1E7]'
                ]">
                    <!-- Top Row: Title, Sequence, Amount & Due Date -->
                    <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div>
                            <div class="flex items-center gap-2 mb-1">
                                <span
                                    class="text-[11px] text-[#8A909C] bg-[#EEF0F4] px-1.5 py-0.5 rounded font-bold">
                                    0{{ ms.sequence }}
                                </span>
                                <h3 class="font-bold text-base text-[#14171F]">
                                    {{ ms.title }}
                                </h3>
                            </div>

                            <!-- Semantic Status Pill Badge -->
                            <div class="flex items-center gap-2 pt-0.5">
                                <LazyVBadge v-if="ms.state === 'paid'" tone="teal" density="sm">
                                    <template #leading><Icon name="lucide:check" class="w-3 h-3" /></template>
                                    Paid
                                </LazyVBadge>
                                <LazyVBadge v-else-if="ms.state === 'approved'" tone="teal" density="sm">
                                    <template #leading><Icon name="lucide:check-circle-2" class="w-3 h-3" /></template>
                                    Approved
                                </LazyVBadge>
                                <LazyVBadge v-else-if="ms.state === 'submitted'" tone="amber" density="sm">
                                    <template #leading><Icon name="lucide:clock" class="w-3 h-3" /></template>
                                    Submitted
                                </LazyVBadge>
                                <LazyVBadge v-else-if="ms.state === 'in_progress'" tone="violet" density="sm"
                                    dot pulse>
                                    In Progress
                                </LazyVBadge>
                                <LazyVBadge v-else tone="slate" density="sm">
                                    Pending
                                </LazyVBadge>
                            </div>
                        </div>

                        <!-- Financial Ledger Token Column -->
                        <div class="sm:text-end shrink-0">
                            <div class="text-base font-bold text-[#14171F]">
                                ${{ ms.amount > 0 ? ms.amount.toLocaleString('en-US', { minimumFractionDigits: 2 }) :
                                    '0.00' }}
                                <span class="text-xs font-normal text-[#8A909C]">{{ ms.amount === 0 ? '(Safeguard)' :
                                    'USD' }}</span>
                            </div>
                            <div class="text-[11px] text-[#8A909C]">
                                Due {{ ms.dueDate }}
                            </div>
                        </div>
                    </div>

                    <!-- Description -->
                    <p class="text-xs text-[#5B6270] font-body leading-relaxed">
                        {{ ms.description }}
                    </p>

                    <!-- Cryptographic Verification / Evidence Note -->
                    <div v-if="ms.evidenceText || ms.proofTx"
                        class="p-2.5 bg-[#F7F7F9] rounded-lg border border-[#DEE1E7] text-[11px] text-[#5B6270] flex items-center justify-between gap-2">
                        <div class="flex items-center gap-1.5 truncate">
                            <Icon
                                :name="ms.state === 'paid' ? 'ph:shield-check-bold' : ms.state === 'submitted' ? 'lucide:git-pull-request' : 'lucide:check-circle-2'"
                                class="w-3.5 h-3.5 text-[#17A883] shrink-0" />
                            <span class="truncate">{{ ms.evidenceText }}</span>
                        </div>
                        <span v-if="ms.proofTx" class="text-[#2563C7] shrink-0 hover:underline cursor-pointer">
                            Tx: {{ ms.proofTx }}
                        </span>
                    </div>

                    <!-- Active Submitted Milestone Action Dock -->
                    <div v-if="ms.state === 'submitted'"
                        class="pt-3 border-t border-[#DEE1E7] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                        <!-- Primary & Secondary Approval Pair -->
                        <div class="flex items-center gap-2">
                            <LazyVButton
                                type="button"
                                variant="primary"
                                size="sm"
                                :role-context="perspective === 'developer' ? 'developer' : 'client'"
                                @click="handleApprove(ms)"
                            >
                                <template #leading>
                                    <Icon name="ph:lock-simple-bold" class="w-3.5 h-3.5" />
                                </template>
                                Approve & Release Funds (${{ ms.amount.toLocaleString() }}.00)
                            </LazyVButton>

                            <LazyVButton
                                type="button"
                                variant="secondary"
                                size="sm"
                                :role-context="perspective === 'developer' ? 'developer' : 'client'"
                                @click="emit('requestChanges', ms)"
                            >
                                Request Changes / Review Spec
                            </LazyVButton>
                        </div>

                        <!-- SLA Timer Telemetry Pill -->
                        <LazyVBadge v-if="ms.slaCountdown" tone="amber" density="sm">
                            <template #leading><Icon name="lucide:clock" class="w-3 h-3" /></template>
                            {{ ms.slaCountdown }}
                        </LazyVBadge>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { MilestoneItem, MilestoneTrackerProps } from "@/types/VMilestoneList";

const props = withDefaults(defineProps<MilestoneTrackerProps>(), {
    contractId: 'SOL-7782-E',
    title: 'High-Throughput Solana RPC Indexer Pipeline',
    subtitle: 'Enterprise Infrastructure Milestone Contract • Fixed-Price Escrow',
    perspective: 'client',
    milestones: () => [
        {
            id: 'ms-01',
            sequence: 1,
            title: 'Architecture Specification & Ingestion Schema',
            description: 'Schema definitions, Kafka partition taxonomy, and protobuf specs signed off.',
            amount: 2000,
            dueDate: 'Mar 15, 2026',
            state: 'paid',
            proofTx: '0x883c...3a9c',
            evidenceText: 'Escrow Released on Mar 14',
        },
        {
            id: 'ms-02',
            sequence: 2,
            title: 'Indexer Cluster & WebSocket Telemetry',
            description: 'Rust gRPC daemon deployed to devnet, sustained 48k slots/sec in load verification.',
            amount: 3500,
            dueDate: 'Apr 02, 2026',
            state: 'approved',
            evidenceText: 'Approved by Enterprise Client • Awaiting Batch Disbursal',
        },
        {
            id: 'ms-03',
            sequence: 3,
            title: 'ScyllaDB Persistence & Live Failover Tests',
            description: 'Clustered persistent storage backend with automated Raft failover under 180ms.',
            amount: 2500,
            dueDate: 'Apr 20, 2026',
            state: 'submitted',
            evidenceText: 'PR #42 linked • Commit 7604fd • CI/CD Passed (36/36 Tests)',
            slaCountdown: '3 Day Escrow Disbursement SLA',
        },
        {
            id: 'ms-04',
            sequence: 4,
            title: 'Production Cluster Hardening & Benchmark Report',
            description: 'Stress testing across 4 geographically distributed validator zones with 99.99% ingress uptime.',
            amount: 2000,
            dueDate: 'May 10, 2026',
            state: 'in_progress',
        },
        {
            id: 'ms-05',
            sequence: 5,
            title: 'Dispute Buffer & Final Settlement Sign-off',
            description: 'Post-launch 14-day warranty and definitive contract closure with escrow sweep.',
            amount: 0,
            dueDate: 'May 30, 2026',
            state: 'pending',
        },
    ],
})

const emit = defineEmits<{
    (e: 'approve', milestone: MilestoneItem): void
    (e: 'requestChanges', milestone: MilestoneItem): void
}>()

// Internal reactive milestones list
const internalMilestones = ref<MilestoneItem[]>([...props.milestones])

// Escrow Telemetry Totals
const totalCommitted = computed(() =>
    internalMilestones.value.reduce((sum, item) => sum + item.amount, 0)
)

const disbursedTotal = computed(() =>
    internalMilestones.value
        .filter((m) => m.state === 'paid' || m.state === 'approved')
        .reduce((sum, item) => sum + item.amount, 0)
)

const lockedTotal = computed(() => totalCommitted.value - disbursedTotal.value)

const completedCount = computed(
    () => internalMilestones.value.filter((m) => m.state === 'paid' || m.state === 'approved').length
)

const progressPercent = computed(() => {
    if (totalCommitted.value <= 0) return 0
    return Math.round((disbursedTotal.value / totalCommitted.value) * 100)
})

// Quick Progression Setter for Simulator
const setProgressPreset = (percentage: number) => {
    if (percentage === 20) {
        internalMilestones.value[0].state = 'paid'
        internalMilestones.value[1].state = 'in_progress'
        internalMilestones.value[2].state = 'pending'
        internalMilestones.value[3].state = 'pending'
        internalMilestones.value[4].state = 'pending'
    } else if (percentage === 55) {
        internalMilestones.value[0].state = 'paid'
        internalMilestones.value[1].state = 'approved'
        internalMilestones.value[2].state = 'submitted'
        internalMilestones.value[3].state = 'in_progress'
        internalMilestones.value[4].state = 'pending'
    } else if (percentage === 80) {
        internalMilestones.value[0].state = 'paid'
        internalMilestones.value[1].state = 'paid'
        internalMilestones.value[2].state = 'paid'
        internalMilestones.value[3].state = 'submitted'
        internalMilestones.value[4].state = 'in_progress'
    } else if (percentage === 100) {
        internalMilestones.value.forEach((m) => (m.state = 'paid'))
    }
}

const handleApprove = (ms: MilestoneItem) => {
    ms.state = 'paid'
    emit('approve', ms)
}

defineExpose({
    setProgressPreset,
    internalMilestones,
})
</script>