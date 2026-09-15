export type ProposalPerspective = "client" | "developer";

export type ProposalDensity = "compact" | "standard" | "expanded";

export type BidStatus = "pending" | "shortlisted" | "accepted" | "declined";

export interface ProposalData {
  id: string;
  candidateName: string;
  candidateAvatar?: string;
  starRating: number;
  verifiedContractsCount: number;
  committerBadge?: string;
  completionRate: number;
  status: BidStatus;
  submittedTimeAgo: string;
  bidAmount: number;
  currency: string;
  milestonesCount: number;
  timelineDays: number;
  targetDeliveryDate: string;
  escrowGuaranteed: boolean;
  abstractText: string;
  wordCount: number;
  skills: string[];
  budgetVariancePercent?: number;
  clientViewedTimeAgo?: string;
  competitorsInQueue?: number;
}
