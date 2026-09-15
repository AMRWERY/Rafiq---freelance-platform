<template>
  <div>
    <h1
      class="text-2xl text-center p-4 text-gray-700 hover:text-gray-800 hover:underline font-semibold hover:font-bold">
      Client & Developer
    </h1>

    <div class="p-5 max-w-fit border rounded-lg space-y-5">
      <LazyVInput id="sandbox-field" name="Reference" rules="required|min:5" v-model="sandboxValue"
        label="Escrow Disbursement Reference" />

      <div class="flex items-center space-s-2">
        <LazyVButton role-context="developer" variant="primary" size="sm" @click="isModalOpen = true">Open Dialog
        </LazyVButton>

        <LazyVButton role-context="developer" variant="secondary" size="sm" loading>Loading</LazyVButton>
      </div>

      <LazyVDialog v-model="isModalOpen" :size="sandboxSize" :role-context="isDestructive ? 'danger' : currentRole"
        tag="MILESTONE_EXECUTION" stage="Stage 03 / Escrow" title="Release Milestone Payment" :description="showSubtitle
          ? 'Confirm payout authorization of escrow funds to verified engineering team.'
          : undefined
          ">
        <div class="space-y-4 text-xs">
          <div class="bg-[#F7F7F9] border border-[#DEE1E7] p-3 rounded-lg flex justify-between items-center">
            <div>
              <span class="text-[#8A909C] text-[10px] block">CONTRACT ID</span>
              <span class="font-bold text-[#14171F]">CTX-2025-0821-RF</span>
            </div>
            <div class="text-end">
              <span class="text-[#8A909C] text-[10px] block">DISBURSEMENT SUM</span>
              <span class="font-bold text-sm text-[#14171F]">$12,500.00
                <span class="text-[#8A909C] text-[10px]">USD</span></span>
            </div>
          </div>

          <div class="flex items-center gap-1.5 text-[11px] text-[#17A883]">
            <Icon name="lucide:check-circle-2" class="w-3.5 h-3.5" />
            <span>Milestone Deliverable/Q4 passed & signed by tech lead.</span>
          </div>

          <label class="flex items-start gap-2 text-xs text-[#5B6270] cursor-pointer pt-1">
            <input type="checkbox" v-model="agreementChecked" class="mt-0.5 rounded border-[#DEE1E7] text-[#2563C7]" />
            <span>I authorize instant ledger transfer from the multi-sig escrow
              reserve to vendor primary vault.</span>
          </label>

          <!-- Simulated long overflow block -->
          <div v-if="longOverflow"
            class="bg-[#EEF0F4]/60 border border-[#DEE1E7] p-3 rounded-lg text-[11px] text-[#5B6270] space-y-2">
            <div class="font-bold text-[#14171F]">
              Smart Contract Security Verification Audit
            </div>
            <p>
              Multi-signature verification passed on validator nodes (4/5
              signatures confirmed). Gas optimization algorithms were executed
              on root rollup chain.
            </p>
            <p>
              No rollbacks or disputes registered within the statutory 72-hour
              review period.
            </p>
            <p>
              All intellectual property assignments for commit hash `8f90a2c`
              transferred irrevocably to client vault.
            </p>
          </div>
        </div>

        <template #footer="{ close }">
          <div class="flex items-center gap-1.5 text-xs text-[#5B6270]">
            <Icon name="ph:lock-simple-bold" class="w-3.5 h-3.5" />
            <span>256-bit Encrypted</span>
          </div>
          <div class="flex items-center gap-2">
            <LazyVButton type="button" variant="secondary" size="sm" :role-context="currentRole" @click="close">
              Cancel
            </LazyVButton>

            <LazyVButton type="button" variant="primary" size="sm"
              :role-context="isDestructive ? 'danger' : currentRole" @click="close">
              <template #leading>
                <Icon name="lucide:check" class="w-3.5 h-3.5" />
              </template>
              Confirm & Release
            </LazyVButton>
          </div>
        </template>
      </LazyVDialog>

      <div class="flex items-center gap-2">
        <LazyVAvatar name="Amr Mohamed" />

        <LazyVBadge>Badge</LazyVBadge>
      </div>

      <div class="bg-[#F7F7F9] border border-[#DEE1E7] p-3 rounded-lg flex items-center justify-between">
        <LazyVRating v-model="sandboxRating" interactive size="md" :precision="2" show-count
          :count-label="`(${ratingCount} project ratings)`" @change="handleRatingChange" />
      </div>

      <LazyVProfileHeader name="Malik Tehrani" headline="Staff Cloud Architect"
        bio="Distributed systems engineer specializing in high-throughput transactional pipelines, Kafka clustering, and PCI-DSS compliance."
        :avatar-url="photoSrc" :perspective="currentPerspective" :density="sandboxDensity" :hourly-rate="165"
        currency="USD" :rate-type="sandboxRateType" :availability="sandboxAvailability" :verified="sandboxVerified" />

      <!-- Project Filters Sandbox -->
      <LazyVProjectFilters v-model="sandboxProjectFilters" />

      <!-- Select Input & Textarea Sandbox -->
      <div class="bg-white border border-[#DEE1E7] p-5 rounded-xl space-y-4">
        <LazyVSelectInput v-model="sandboxSelectValue" label="Preferred Contract Model"
          placeholder="Select a contract model" :options="[
            { label: 'Fixed Price (Milestones)', value: 'fixed' },
            { label: 'Hourly Rate (/hr)', value: 'hourly' },
          ]" />

        <LazyVTextarea v-model="sandboxTextareaValue" label="Project Notes"
          placeholder="Add any additional notes for the developer..." :rows="4" show-count :max-length="240" />
      </div>

      <!-- OTP Sandbox Module -->
      <div class="bg-white border border-[#DEE1E7] p-5 rounded-xl space-y-4">
        <div class="flex items-center justify-between">
          <div class="space-y-0.5">
            <h3 class="text-sm font-bold text-[#14171F]">
              Two-Factor Authorization Code (OTP)
            </h3>
            <p class="text-xs text-[#5B6270]">
              Dynamic length verification primitive (4 to 6 digits)
            </p>
          </div>
          <div class="flex items-center gap-1 bg-[#EEF0F4] p-1 rounded-lg text-xs font-semibold">
            <button type="button" @click="sandboxOtpLength = 4" :class="[
              'px-2.5 py-1 rounded transition-all cursor-pointer',
              sandboxOtpLength === 4
                ? 'bg-white text-[#2563C7] shadow-sm'
                : 'text-[#5B6270]',
            ]">
              4 Digits
            </button>
            <button type="button" @click="sandboxOtpLength = 6" :class="[
              'px-2.5 py-1 rounded transition-all cursor-pointer',
              sandboxOtpLength === 6
                ? 'bg-white text-[#2563C7] shadow-sm'
                : 'text-[#5B6270]',
            ]">
              6 Digits
            </button>
          </div>
        </div>

        <LazyVOtp v-model="sandboxOtpValue" :length="sandboxOtpLength" :role-context="currentRole"
          helper-text="Enter the cryptographic signing code sent to your authenticator device."
          @complete="handleOtpComplete" />

        <div v-if="sandboxOtpValue" class="text-center text-xs text-[#5B6270]">
          Captured Code:
          <strong class="text-[#2563C7]">{{ sandboxOtpValue }}</strong>
        </div>
      </div>

      <LazyVProjectForm ref="builderRef" />

      <LazyVMilestoneList ref="trackerRef" :perspective="currentPerspective" />

      <LazyVProposalCard perspective="developer" :density="sandboxDensity" />
    </div>
  </div>
</template>

<script lang="ts" setup>
// --- Component sandbox state ---
const sandboxValue = ref("");

const isModalOpen = ref(false);
const sandboxSize = ref<"sm" | "md" | "lg">("md");
const currentRole = ref<"client" | "developer">("client");
const isDestructive = ref(false);
const showSubtitle = ref(true);
const agreementChecked = ref(false);
const longOverflow = ref(false);
const sandboxRating = ref(0);
const ratingCount = ref(18);
const hasRated = ref(false);

const photoSrc = ref(
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80",
);
const currentPerspective = ref<"client" | "developer">("client");
const sandboxDensity = ref<"compact" | "standard" | "spotlight">("standard");
const sandboxRateType = ref<"fixed" | "negotiable">("fixed");
const sandboxAvailability = ref<"available" | "busy" | "unavailable">(
  "available",
);
const sandboxVerified = ref(true);

const sandboxProjectFilters = ref({});
const sandboxSelectValue = ref("");
const sandboxTextareaValue = ref("");

const sandboxOtpValue = ref("");
const sandboxOtpLength = ref<4 | 6>(6);
const handleOtpComplete = (code: string) => {
  console.log("OTP Verification Code Completed:", code);
};

// Only counts as a new review the first time the user rates; further clicks
// (changing their mind) still update sandboxRating but don't re-count.
const handleRatingChange = () => {
  if (hasRated.value) return;
  hasRated.value = true;
  ratingCount.value++;
};

useSeoPage({
  title: "Rafiq — Freelance Platform for Clients & Developers",
  description:
    "Rafiq connects clients with skilled freelance developers. Post a project or browse opportunities and start collaborating with confidence.",
  noindex: true,
});
</script>