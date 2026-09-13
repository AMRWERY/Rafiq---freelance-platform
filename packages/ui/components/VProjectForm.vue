<template>
    <component :is="as || 'form'" @submit.prevent="handleSubmit"
        class="bg-white border border-[#DEE1E7] rounded-[12px] text-[#14171F] p-6 md:p-8 space-y-6 shadow-none"
        role="form" aria-label="Project Brief Authoring Form">
        <!-- 1. Wizard Step Indicator Progress with Dynamic Component Step Items -->
        <div class="pb-4 border-b border-[#DEE1E7] space-y-2">
            <div class="flex items-center justify-between text-xs">
                <span class="font-bold text-[#14171F]">AUTHORING WIZARD PROGRESS</span>
                <span class="text-[#2563C7] font-semibold">
                    <template v-if="activeStep !== 'all'">
                        Step {{ activeStep }} of 3: {{ activeStepSubtitle }}
                    </template>
                    <template v-else>
                        Full Specification View (All 3 Steps)
                    </template>
                </span>
            </div>
            <div class="grid grid-cols-3 gap-2 text-xs">
                <!-- Step 1 Tab -->
                <component :is="stepItemAs || 'button'" type="button" @click="setStep(1)" :class="[
                    'flex items-center gap-1.5 p-2 rounded transition-all cursor-pointer text-start',
                    activeStep === 1
                        ? 'bg-[#2563C7]/10 text-[#2563C7] border border-[#2563C7] font-bold'
                        : activeStep === 'all' || activeStep > 1
                            ? 'bg-[#17A883]/10 text-[#17A883] border border-[#17A883]/20 font-semibold'
                            : 'bg-[#F7F7F9] text-[#8A909C] border border-[#DEE1E7]'
                ]">
                    <Icon v-if="activeStep === 'all' || activeStep > 1" name="lucide:check-circle-2"
                        class="w-3.5 h-3.5 shrink-0" />
                    <span v-else-if="activeStep === 1" class="w-2 h-2 rounded-full bg-[#2563C7] shrink-0"></span>
                    <span class="truncate">1. Scope & Details</span>
                </component>

                <!-- Step 2 Tab -->
                <component :is="stepItemAs || 'button'" type="button" @click="setStep(2)" :class="[
                    'flex items-center gap-1.5 p-2 rounded transition-all cursor-pointer text-start',
                    activeStep === 2
                        ? 'bg-[#2563C7]/10 text-[#2563C7] border border-[#2563C7] font-bold'
                        : activeStep === 'all' || activeStep > 2
                            ? 'bg-[#17A883]/10 text-[#17A883] border border-[#17A883]/20 font-semibold'
                            : 'bg-[#F7F7F9] text-[#8A909C] border border-[#DEE1E7]'
                ]">
                    <Icon v-if="activeStep === 'all' || activeStep > 2" name="lucide:check-circle-2"
                        class="w-3.5 h-3.5 shrink-0" />
                    <span v-else-if="activeStep === 2" class="w-2 h-2 rounded-full bg-[#2563C7] shrink-0"></span>
                    <span class="truncate">2. Budget & Milestones</span>
                </component>

                <!-- Step 3 Tab -->
                <component :is="stepItemAs || 'button'" type="button" @click="setStep(3)" :class="[
                    'flex items-center gap-1.5 p-2 rounded transition-all cursor-pointer text-start',
                    activeStep === 3
                        ? 'bg-[#2563C7]/10 text-[#2563C7] border border-[#2563C7] font-bold'
                        : activeStep === 'all'
                            ? 'bg-[#17A883]/10 text-[#17A883] border border-[#17A883]/20 font-semibold'
                            : 'bg-[#F7F7F9] text-[#8A909C] border border-[#DEE1E7]'
                ]">
                    <Icon v-if="activeStep === 'all'" name="lucide:check-circle-2" class="w-3.5 h-3.5 shrink-0" />
                    <span v-else-if="activeStep === 3" class="w-2 h-2 rounded-full bg-[#2563C7] shrink-0"></span>
                    <span class="truncate">3. Review & Deposit</span>
                </component>
            </div>
        </div>

        <!-- ==================== STEP 1: SCOPE & DETAILS ==================== -->
        <div v-show="activeStep === 'all' || activeStep === 1" class="space-y-6">
            <!-- 2. Project Title Input via Shared VInput Component -->
            <LazyVInput id="project-title" v-model="title" label="Project Title" required show-count :max-length="90"
                :disabled="readOnly"
                placeholder="Provide a precise, technical title highlighting the architectural deliverable and core runtime."
                helper-text="Provide a precise, technical title highlighting the architectural deliverable and core runtime." />

            <!-- 3. Scope of Work via Shared LazyVTextarea Component -->
            <LazyVTextarea id="project-scope" v-model="scopeMarkdown" label="Scope of Work & Technical Requirements"
                required :rows="5" :disabled="readOnly"
                placeholder="Detailed markdown specification of architecture, APIs, endpoints, and deployment constraints...">
                <template #headerExtra>
                    <button type="button" @click="isPreviewMode = !isPreviewMode"
                        class="text-[11px] text-[#2563C7] hover:underline cursor-pointer flex items-center gap-1">
                        <Icon :name="isPreviewMode ? 'lucide:edit-3' : 'lucide:eye'" class="w-3 h-3" />
                        <span>{{ isPreviewMode ? 'Edit Spec' : 'Split View' }}</span>
                    </button>
                    <span class="text-[11px] text-[#8A909C]">Markdown Supported</span>
                </template>

                <template #toolbar>
                    <div class="flex items-center gap-1 text-xs">
                        <button type="button" @click="appendMarkdown('**', '**')" :disabled="readOnly"
                            class="p-1 hover:text-[#14171F] hover:bg-[#DEE1E7] rounded cursor-pointer disabled:opacity-50"
                            title="Bold">
                            <Icon name="lucide:bold" class="w-3.5 h-3.5" />
                        </button>
                        <button type="button" @click="appendMarkdown('*', '*')" :disabled="readOnly"
                            class="p-1 hover:text-[#14171F] hover:bg-[#DEE1E7] rounded cursor-pointer disabled:opacity-50"
                            title="Italic">
                            <Icon name="lucide:italic" class="w-3.5 h-3.5" />
                        </button>
                        <button type="button" @click="appendMarkdown('`', '`')" :disabled="readOnly"
                            class="p-1 hover:text-[#14171F] hover:bg-[#DEE1E7] rounded cursor-pointer disabled:opacity-50"
                            title="Code">
                            <Icon name="lucide:code" class="w-3.5 h-3.5" />
                        </button>
                        <button type="button" @click="appendMarkdown('[', '](url)')" :disabled="readOnly"
                            class="p-1 hover:text-[#14171F] hover:bg-[#DEE1E7] rounded cursor-pointer disabled:opacity-50"
                            title="Link">
                            <Icon name="lucide:link" class="w-3.5 h-3.5" />
                        </button>
                        <button type="button" @click="appendMarkdown('\n- ')" :disabled="readOnly"
                            class="p-1 hover:text-[#14171F] hover:bg-[#DEE1E7] rounded cursor-pointer disabled:opacity-50"
                            title="List">
                            <Icon name="lucide:list" class="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <span class="text-[10px] text-[#8A909C]">
                        Mode: <strong class="text-[#2563C7]">{{ isPreviewMode ? 'Rendered Preview' : 'Raw Spec' }}</strong>
                    </span>
                </template>

                <template v-if="isPreviewMode" #frameFooter>
                    <div class="p-3 min-h-[120px] bg-[#FAFBFD] text-xs text-[#14171F] whitespace-pre-wrap leading-relaxed">
                        {{ scopeMarkdown }}
                    </div>
                </template>
            </LazyVTextarea>

            <!-- 4. Required Technical Stack & Skills using Shared VBadge Component -->
            <div class="space-y-1.5">
                <label class="text-xs font-bold text-[#14171F] flex items-center gap-1">
                    <span>Required Technical Stack & Skills</span>
                    <span class="text-[#D23C3C]">*</span>
                </label>

                <div
                    class="border border-[#DEE1E7] rounded-lg p-2 bg-white flex flex-wrap items-center gap-1.5 focus-within:border-[#2563C7] focus-within:ring-2 focus-within:ring-[#2563C7]/20 transition-all">
                    <!-- Rendered Stack Chips via Shared VBadge Component -->
                    <LazyVBadge v-for="(skill, idx) in skills" :key="skill" tone="developer" density="sm"
                        :removable="!readOnly" @dismiss="removeSkill(idx)">
                        <template #leading>
                            <span class="w-1.5 h-1.5 rounded-full bg-[#6E56CF] me-1"></span>
                        </template>
                        {{ skill }}
                    </LazyVBadge>

                    <!-- Input -->
                    <input v-if="!readOnly" type="text" v-model="skillInput"
                        @keydown.enter.prevent="addSkill(skillInput)" placeholder="Type skill & press enter..."
                        class="flex-1 min-w-[160px] text-xs outline-none bg-transparent placeholder:text-[#8A909C] py-1" />
                </div>

                <!-- Quick Suggestion Chips via Shared VBadge -->
                <div v-if="!readOnly" class="flex items-center gap-1.5 text-[11px] pt-0.5 text-[#8A909C] flex-wrap">
                    <span>SUGGESTIONS:</span>
                    <LazyVBadge v-for="sug in skillSuggestions" :key="sug" tone="neutral" density="sm" selectable
                        class="cursor-pointer hover:text-[#2563C7] hover:bg-[#2563C7]/10" @click="addSkill(sug)">
                        + {{ sug }}
                    </LazyVBadge>
                </div>
            </div>
        </div>

        <!-- ==================== STEP 2: BUDGET & MILESTONES ==================== -->
        <div v-show="activeStep === 'all' || activeStep === 2" class="space-y-6">
            <!-- 5. Contract Settlement Model & Delivery Window -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Settlement Model Segmented Switcher -->
                <div class="space-y-1.5">
                    <label class="text-xs font-bold text-[#14171F]">Contract Settlement Model</label>
                    <div class="grid grid-cols-2 gap-1 p-1 bg-[#EEF0F4] border border-[#DEE1E7] rounded-lg text-xs">
                        <button type="button" :disabled="readOnly" @click="contractType = 'fixed'" :class="[
                            'py-2 rounded-md font-semibold transition-all cursor-pointer text-center',
                            contractType === 'fixed' ? 'bg-white text-[#2563C7] shadow-sm' : 'text-[#5B6270] hover:text-[#14171F]'
                        ]">
                            ● Fixed Price <span class="block text-[10px] font-normal text-[#8A909C]">(Milestones)</span>
                        </button>
                        <button type="button" :disabled="readOnly" @click="contractType = 'hourly'" :class="[
                            'py-2 rounded-md font-semibold transition-all cursor-pointer text-center',
                            contractType === 'hourly' ? 'bg-white text-[#2563C7] shadow-sm' : 'text-[#5B6270] hover:text-[#14171F]'
                        ]">
                            Hourly Rate <span class="block text-[10px] font-normal text-[#8A909C]">(/hr cap)</span>
                        </button>
                    </div>
                </div>

                <!-- Target Delivery Window via Shared LazyVSelectInput Component -->
                <LazyVSelectInput
                    v-model="deliveryWindow"
                    label="Target Delivery Window"
                    :disabled="readOnly"
                    :options="[
                        '1 to 3 Months (Standard Sprint)',
                        '3 to 6 Months (Enterprise)',
                        '6+ Months (Multi-phase Architecture)',
                    ]"
                />
            </div>

            <!-- 6. Contract Budget Cap Range using Shared VInput Components -->
            <div class="space-y-1.5">
                <div class="flex items-center justify-between">
                    <label class="text-xs font-bold text-[#14171F]">Contract Budget Cap Range (USD)</label>
                    <span class="text-[11px] text-[#5B6270]">Escrow Reserve Buffer: +5.0%</span>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <LazyVInput type="number" v-model.number="minBudget" label="Minimum Allocation Target"
                        :disabled="readOnly" density="sm">
                        <template #leading>
                            <span class="text-xs text-[#8A909C]">$</span>
                        </template>
                    </LazyVInput>

                    <LazyVInput type="number" v-model.number="maxBudget" label="Maximum Escrow Ceiling"
                        :disabled="readOnly" density="sm">
                        <template #leading>
                            <span class="text-xs text-[#8A909C]">$</span>
                        </template>
                    </LazyVInput>
                </div>
            </div>

            <!-- 7. Settlement Milestone Ledger Table with Shared VButton & VInput Components -->
            <div class="space-y-3 pt-2">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                        <h3 class="text-sm font-bold text-[#14171F]">Settlement Milestone Ledger</h3>
                        <p class="text-xs text-[#5B6270]">Structured milestones held in escrow until verified branch/PR
                            merge and test approval.</p>
                    </div>

                    <!-- Add Milestone CTA with Shared VButton & Dynamic Component Support -->
                    <slot name="add-milestone" :add="addMilestone">
                        <LazyVButton v-if="!readOnly && addMilestoneAs === 'button'" variant="secondary" size="sm"
                            role-context="client" v-bind="addMilestoneProps" @click="addMilestone">
                            <template #leading>
                                <Icon name="lucide:plus" class="w-3.5 h-3.5" />
                            </template>
                            Add Milestone Row
                        </LazyVButton>
                        <component v-else-if="!readOnly" :is="addMilestoneAs" type="button" v-bind="addMilestoneProps"
                            @click="addMilestone"
                            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#2563C7] bg-[#2563C7]/10 hover:bg-[#2563C7]/20 rounded-lg transition-colors cursor-pointer w-fit">
                            <Icon name="lucide:plus" class="w-3.5 h-3.5" />
                            <span>Add Milestone Row</span>
                        </component>
                    </slot>
                </div>

                <!-- Milestone Repeater Stack -->
                <div class="space-y-2" role="group" aria-label="Settlement Milestone Rows">
                    <div v-for="(ms, index) in milestones" :key="ms.id"
                        class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 p-2.5 bg-[#F7F7F9] border border-[#DEE1E7] rounded-lg focus-within:border-[#2563C7] focus-within:ring-1 focus-within:ring-[#2563C7] transition-all">
                        <!-- Drag Icon & Index Badge -->
                        <div class="flex items-center gap-1.5 shrink-0 text-[#8A909C]">
                            <Icon name="lucide:grip-vertical" class="w-4 h-4 cursor-grab" />
                            <span
                                class="text-xs font-bold text-[#14171F] bg-white border border-[#DEE1E7] px-1.5 py-0.5 rounded">
                                0{{ index + 1 }}
                            </span>
                        </div>

                        <!-- Title Input with Shared VInput -->
                        <div class="flex-1">
                            <LazyVInput v-model="ms.title" :disabled="readOnly" density="sm"
                                placeholder="Milestone deliverable description..." />
                        </div>

                        <!-- Due Date Picker with Shared VInput -->
                        <div class="w-full sm:w-[135px]">
                            <LazyVInput type="date" v-model="ms.dueDate" :disabled="readOnly" density="sm" />
                        </div>

                        <!-- Currency Parsed Amount with Shared VInput -->
                        <div class="w-full sm:w-[135px]">
                            <LazyVInput type="number" v-model.number="ms.amount" :disabled="readOnly" density="sm">
                                <template #leading>
                                    <span class="text-xs text-[#8A909C]">$</span>
                                </template>
                            </LazyVInput>
                        </div>

                        <!-- Remove Action Button with Shared VButton -->
                        <LazyVButton v-if="!readOnly" variant="ghost" size="sm" role-context="danger"
                            :disabled="milestones.length === 1" @click="removeMilestone(index)" title="Remove milestone"
                            class="p-2 shrink-0">
                            <Icon name="lucide:trash-2" class="w-4 h-4" />
                        </LazyVButton>
                    </div>
                </div>

                <!-- Live Summation & Escrow Coverage Card -->
                <div class="p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all"
                    :class="[
                        isOverflow
                            ? 'bg-[#D23C3C]/5 border-[#D23C3C] text-[#D23C3C]'
                            : isBalanced
                                ? 'bg-[#17A883]/5 border-[#17A883]/30 text-[#17A883]'
                                : 'bg-[#F7F7F9] border-[#DEE1E7] text-[#14171F]'
                    ]" aria-live="polite">
                    <div>
                        <div class="text-[10px] uppercase text-[#8A909C]">MILESTONE SUMMATION:</div>
                        <div class="text-xl font-bold tracking-tight text-[#14171F]">
                            ${{ totalMilestoneSum.toLocaleString('en-US', { minimumFractionDigits: 2 }) }} USD
                        </div>
                        <div class="text-xs flex items-center gap-1 mt-0.5">
                            <Icon :name="isOverflow ? 'lucide:alert-circle' : 'lucide:check-circle-2'"
                                class="w-3.5 h-3.5" :class="isOverflow ? 'text-[#D23C3C]' : 'text-[#17A883]'" />
                            <span v-if="isOverflow" class="text-[#D23C3C] font-bold">
                                Surpasses Ceiling by ${{ Math.abs(variance).toFixed(2) }} (Validation Blocked)
                            </span>
                            <span v-else-if="isBalanced" class="text-[#17A883] font-bold">
                                Synchronized with Max (exact $0.00 variance)
                            </span>
                            <span v-else class="text-[#5B6270]">
                                Remaining unallocated escrow: ${{ Math.abs(variance).toFixed(2) }}
                            </span>
                        </div>
                    </div>

                    <!-- Escrow Coverage Bar -->
                    <div class="w-full sm:w-48 space-y-1 text-end">
                        <div class="flex justify-between text-[11px] text-[#5B6270]">
                            <span>Escrow Coverage</span>
                            <span class="font-bold text-[#14171F]">{{ coveragePercent }}%</span>
                        </div>
                        <div class="w-full bg-[#DEE1E7] h-2 rounded-full overflow-hidden">
                            <div :class="[
                                'h-full transition-all duration-300 rounded-full',
                                isOverflow ? 'bg-[#D23C3C]' : 'bg-[#17A883]'
                            ]" :style="{ width: `${Math.min(coveragePercent, 100)}%` }" />
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- ==================== STEP 3: REVIEW & DEPOSIT ==================== -->
        <div v-show="activeStep === 'all' || activeStep === 3" class="space-y-4">
            <div class="p-4 md:p-5 rounded-xl border border-[#DEE1E7] bg-[#FAFBFD] space-y-4">
                <div class="flex items-center justify-between pb-3 border-b border-[#DEE1E7]">
                    <div>
                        <span class="text-[10px] text-[#8A909C] uppercase tracking-wider block">SPECIFICATION
                            CONFIRMATION</span>
                        <h3 class="text-base font-bold text-[#14171F] mt-0.5">{{ title }}</h3>
                    </div>
                    <!-- Status Badge with Shared VBadge -->
                    <VBadge tone="success" density="sm" class="shrink-0">
                        Ready for Escrow Lock
                    </VBadge>
                </div>

                <!-- Scope summary block -->
                <div class="space-y-1">
                    <span class="text-xs font-bold text-[#5B6270]">Architectural Scope Summary:</span>
                    <p
                        class="text-xs text-[#14171F] bg-white p-3 rounded-lg border border-[#DEE1E7] whitespace-pre-wrap leading-relaxed max-h-36 overflow-y-auto">
                        {{ scopeMarkdown }}
                    </p>
                </div>

                <!-- Meta Grid -->
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                    <div class="p-2.5 bg-white border border-[#DEE1E7] rounded-lg">
                        <span class="text-[10px] text-[#8A909C] block uppercase">Contract Model</span>
                        <span class="font-bold text-[#14171F] capitalize">{{ contractType }} Price</span>
                    </div>
                    <div class="p-2.5 bg-white border border-[#DEE1E7] rounded-lg">
                        <span class="text-[10px] text-[#8A909C] block uppercase">Delivery Window</span>
                        <span class="font-bold text-[#14171F]">{{ deliveryWindow }}</span>
                    </div>
                    <div class="p-2.5 bg-white border border-[#DEE1E7] rounded-lg">
                        <span class="text-[10px] text-[#8A909C] block uppercase">Max Escrow Ceiling</span>
                        <span class="font-bold text-[#2563C7]">${{ maxBudget.toLocaleString('en-US') }} USD</span>
                    </div>
                </div>

                <!-- Stack Chips with Shared VBadge -->
                <div class="space-y-1">
                    <span class="text-xs font-bold text-[#5B6270]">Verified Runtime Stack:</span>
                    <div class="flex flex-wrap gap-1.5">
                        <VBadge v-for="skill in skills" :key="skill" tone="developer" density="sm">
                            {{ skill }}
                        </VBadge>
                    </div>
                </div>

                <!-- Escrow Security Notice -->
                <div
                    class="flex items-center gap-2 p-3 bg-[#2563C7]/5 border border-[#2563C7]/20 rounded-lg text-xs text-[#2563C7]">
                    <Icon name="ph:shield-check-bold" class="w-4 h-4 shrink-0" />
                    <span>Escrow funds remain locked in programmatic smart vault until verified test & PR merge
                        approval.</span>
                </div>
            </div>
        </div>

        <!-- ==================== 8. FORM ACTIONS FOOTER ==================== -->
        <!-- CTAs Pairing with Shared VButton & Dynamic Component Support -->
        <div class="pt-4 border-t border-[#DEE1E7] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div class="flex items-center gap-2 w-full sm:w-auto">
                <!-- Reset Action with Shared VButton & Dynamic Component Support -->
                <slot name="reset-action" :reset="handleReset">
                    <LazyVButton v-if="resetActionAs === 'button'" variant="ghost" size="sm" v-bind="resetActionProps"
                        @click="handleReset">
                        Reset Draft
                    </LazyVButton>
                    <component :is="resetActionAs" v-else :type="resetActionAs ? undefined : 'button'"
                        v-bind="resetActionProps" @click="handleReset"
                        class="w-full sm:w-auto px-4 py-2 text-xs font-semibold text-[#5B6270] hover:text-[#14171F] hover:bg-[#EEF0F4] rounded-lg transition-colors cursor-pointer">
                        Reset Draft
                    </component>
                </slot>

                <!-- Previous Step Button (when in wizard mode) using Shared VButton -->
                <LazyVButton v-if="activeStep !== 'all' && activeStep > 1" variant="secondary" size="sm"
                    @click="prevStep">
                    <template #leading>
                        <Icon name="lucide:chevron-left" class="w-3.5 h-3.5" />
                    </template>
                    Back
                </LazyVButton>
            </div>

            <div class="flex items-center gap-2 w-full sm:w-auto">
                <!-- Secondary / Draft Action with Shared VButton & Dynamic Component Support -->
                <slot name="secondary-action" :payload="currentPayload" :save="handleSaveDraft">
                    <LazyVButton v-if="secondaryActionAs === 'button'" variant="secondary" size="sm"
                        v-bind="secondaryActionProps" class="flex-1 sm:flex-initial" @click="handleSaveDraft">
                        {{ secondaryActionText || 'Save as Staging Spec' }}
                    </LazyVButton>
                    <component :is="secondaryActionAs" v-else :type="secondaryActionAs ? undefined : 'button'"
                        v-bind="secondaryActionProps" @click="handleSaveDraft"
                        class="flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold text-[#14171F] bg-white border border-[#DEE1E7] hover:border-[#8A909C] rounded-lg transition-colors cursor-pointer">
                        {{ secondaryActionText || 'Save as Staging Spec' }}
                    </component>
                </slot>

                <!-- Next Step Button using Shared VButton -->
                <LazyVButton v-if="activeStep !== 'all' && activeStep < 3" variant="primary" size="sm"
                    class="flex-1 sm:flex-initial bg-[#14171F] hover:bg-[#2B303B] text-white" @click="nextStep">
                    <span>Continue to Step {{ activeStep + 1 }}</span>
                    <template #trailing>
                        <Icon name="lucide:chevron-right" class="w-3.5 h-3.5" />
                    </template>
                </LazyVButton>

                <!-- Primary Action (Proceed to Escrow Deposit) with Shared VButton & Dynamic Component Support -->
                <slot name="primary-action" :payload="currentPayload" :is-overflow="isOverflow" :submit="handleSubmit">
                    <LazyVButton v-if="primaryActionAs === 'button'" variant="primary" size="sm" role-context="client"
                        :disabled="isOverflow" v-bind="primaryActionProps" class="flex-1 sm:flex-initial"
                        @click="handleSubmit">
                        <template #leading>
                            <Icon name="ph:lock-simple-bold" class="w-3.5 h-3.5" />
                        </template>
                        {{ primaryActionText || 'Proceed to Escrow Deposit' }}
                    </LazyVButton>
                    <component :is="primaryActionAs" v-else :type="primaryActionAs ? undefined : 'submit'"
                        v-bind="primaryActionProps" :disabled="isOverflow" @click="handleSubmit" :class="[
                            'flex-1 sm:flex-initial px-5 py-2 text-xs font-semibold text-white rounded-lg flex items-center justify-center gap-1.5 transition-all shadow-sm',
                            isOverflow
                                ? 'bg-[#8A909C] cursor-not-allowed opacity-60'
                                : 'bg-[#2563C7] hover:bg-[#1D4ED8] active:scale-[0.97] cursor-pointer'
                        ]">
                        <Icon name="ph:lock-simple-bold" class="w-3.5 h-3.5" />
                        <span>{{ primaryActionText || 'Proceed to Escrow Deposit' }}</span>
                    </component>
                </slot>
            </div>
        </div>
    </component>
</template>

<script lang="ts" setup>
import type { MilestoneItem, ProjectBriefData, ProjectFormProps } from '~/types/VProjectForm';

const props = withDefaults(
    defineProps<ProjectFormProps>(),
    {
        readOnly: false,
        step: 2,
        stepItemAs: 'button',
        primaryActionAs: 'button',
        secondaryActionAs: 'button',
        resetActionAs: 'button',
        addMilestoneAs: 'button',
    }
);

const emit = defineEmits<{
    (e: 'update:modelValue', value: ProjectBriefData): void;
    (e: 'submit', value: ProjectBriefData): void;
    (e: 'saveDraft', value: ProjectBriefData): void;
    (e: 'reset'): void;
    (e: 'stepChange', step: number | 'all'): void;
}>();

// Active Wizard Step State
const activeStep = ref<number | 'all'>(props.step ?? 2);

watch(() => props.step, (newVal) => {
    if (newVal !== undefined) {
        activeStep.value = newVal;
    }
});

const activeStepSubtitle = computed(() => {
    switch (activeStep.value) {
        case 1:
            return 'Scope & Technical Details';
        case 2:
            return 'Budget & Deliverables';
        case 3:
            return 'Review & Verification';
        default:
            return 'Full Specification';
    }
});

const setStep = (stepNumber: number | 'all') => {
    activeStep.value = stepNumber;
    emit('stepChange', stepNumber);
};

const nextStep = () => {
    if (typeof activeStep.value === 'number' && activeStep.value < 3) {
        setStep(activeStep.value + 1);
    }
};

const prevStep = () => {
    if (typeof activeStep.value === 'number' && activeStep.value > 1) {
        setStep(activeStep.value - 1);
    }
};

// Core Form State
const title = ref(props.modelValue?.title ?? 'High-Throughput Solana RPC Indexer Pipeline & Gateway');
const scopeMarkdown = ref(
    props.modelValue?.scopeMarkdown ??
    `Implement a zero-lag account event indexing cluster parsing Solana Geyser plugin streams.\nDeliverables:\n- Rust-based ingest worker parsing ~65k TPS raw transactions\n- ScyllaDB persistence schema with write-ahead partitioning\n- High-availability WebSocket subscription gateway with TLS termination`
);
const isPreviewMode = ref(false);
const skillInput = ref('');
const skills = ref<string[]>(props.modelValue?.skills ?? ['rust::wasm', 'tokio', 'solana-core', 'grpc-codegen']);
const skillSuggestions = ['postgresql', 'docker-compose', 'prometheus', 'distributed-tracing'];

const contractType = ref<'fixed' | 'hourly'>(props.modelValue?.contractType ?? 'fixed');
const deliveryWindow = ref(props.modelValue?.deliveryWindow ?? '3 to 6 Months (Enterprise)');
const minBudget = ref(props.modelValue?.minBudget ?? 8000);
const maxBudget = ref(props.modelValue?.maxBudget ?? 10000);

const milestones = ref<MilestoneItem[]>(
    props.modelValue?.milestones ?? [
        { id: 'ms-1', title: 'Architecture Spec & Ingestion', dueDate: '2026-04-15', amount: 4500 },
        { id: 'ms-2', title: 'Indexer Cluster & WebSocket', dueDate: '2026-05-01', amount: 5500 },
    ]
);

// Markdown Editor Actions
const appendMarkdown = (prefix: string, suffix: string = '') => {
    scopeMarkdown.value += `${prefix}${suffix}`;
};

// Skill Tag Actions
const addSkill = (skill: string) => {
    const trimmed = skill.trim();
    if (trimmed && !skills.value.includes(trimmed)) {
        skills.value.push(trimmed);
        skillInput.value = '';
    }
};

const removeSkill = (index: number) => {
    skills.value.splice(index, 1);
};

// Milestone Row Ledger Actions
const addMilestone = () => {
    const nextNum = milestones.value.length + 1;
    milestones.value.push({
        id: `ms-${Date.now()}`,
        title: `Phase 0${nextNum} Deliverable`,
        dueDate: '2026-06-01',
        amount: 2000,
    });
};

const removeMilestone = (index: number) => {
    if (milestones.value.length > 1) {
        milestones.value.splice(index, 1);
    }
};

// Live Calculations & Escrow Telemetry
const totalMilestoneSum = computed(() => {
    return milestones.value.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
});

const variance = computed(() => totalMilestoneSum.value - maxBudget.value);
const isBalanced = computed(() => totalMilestoneSum.value === maxBudget.value);
const isOverflow = computed(() => totalMilestoneSum.value > maxBudget.value);

const coveragePercent = computed(() => {
    if (maxBudget.value <= 0) return 0;
    return Math.min(100, Math.round((totalMilestoneSum.value / maxBudget.value) * 100));
});

const currentPayload = computed<ProjectBriefData>(() => ({
    title: title.value,
    scopeMarkdown: scopeMarkdown.value,
    skills: skills.value,
    contractType: contractType.value,
    deliveryWindow: deliveryWindow.value,
    minBudget: minBudget.value,
    maxBudget: maxBudget.value,
    milestones: milestones.value,
}));

watch(currentPayload, (val) => {
    emit('update:modelValue', val);
}, { deep: true });

// Form Handlers
const handleSubmit = () => {
    if (!isOverflow.value) {
        emit('submit', currentPayload.value);
    }
};

const handleSaveDraft = () => {
    emit('saveDraft', currentPayload.value);
};

const handleReset = () => {
    emit('reset');
};

defineExpose({
    currentPayload,
    activeStep,
    setStep,
    nextStep,
    prevStep,
    addMilestone,
    setOverflowState: () => {
        milestones.value.push({
            id: `ms-mock`,
            title: 'Phase 03 Distributed Re-indexing Engine',
            dueDate: '2026-06-15',
            amount: 4500,
        });
    },
    resetToDefault: () => {
        title.value = 'High-Throughput Solana RPC Indexer Pipeline & Gateway';
        skills.value = ['rust::wasm', 'tokio', 'solana-core', 'grpc-codegen'];
        maxBudget.value = 10000;
        milestones.value = [
            { id: 'ms-1', title: 'Architecture Spec & Ingestion', dueDate: '2026-04-15', amount: 4500 },
            { id: 'ms-2', title: 'Indexer Cluster & WebSocket', dueDate: '2026-05-01', amount: 5500 },
        ];
        activeStep.value = props.step ?? 2;
    },
});
</script>