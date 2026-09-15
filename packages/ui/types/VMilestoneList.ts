export type MilestoneState =
  | "pending"
  | "in_progress"
  | "submitted"
  | "approved"
  | "paid";

export type TrackerPerspective = "client" | "developer";

export interface MilestoneItem {
  id: string;
  sequence: number;
  title: string;
  description: string;
  amount: number;
  dueDate: string;
  state: MilestoneState;
  evidenceText?: string;
  proofTx?: string;
  slaCountdown?: string;
}

export interface MilestoneTrackerProps {
  contractId?: string;
  title?: string;
  subtitle?: string;
  perspective?: TrackerPerspective;
  milestones?: MilestoneItem[];
}
