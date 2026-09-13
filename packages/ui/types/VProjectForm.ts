import type { Component } from "vue";

export interface MilestoneItem {
  id: string;
  title: string;
  dueDate: string;
  amount: number;
}

export interface ProjectBriefData {
  title: string;
  scopeMarkdown: string;
  skills: string[];
  contractType: "fixed" | "hourly";
  deliveryWindow: string;
  minBudget: number;
  maxBudget: number;
  milestones: MilestoneItem[];
}

export interface ProjectFormProps {
  modelValue?: Partial<ProjectBriefData>;
  readOnly?: boolean;
  step?: number | "all";
  as?: string | Component;
  stepItemAs?: string | Component;
  skillChipAs?: string | Component;
  primaryActionAs?: string | Component;
  secondaryActionAs?: string | Component;
  resetActionAs?: string | Component;
  addMilestoneAs?: string | Component;
  primaryActionText?: string;
  secondaryActionText?: string;
  primaryActionProps?: Record<string, any>;
  secondaryActionProps?: Record<string, any>;
  resetActionProps?: Record<string, any>;
  addMilestoneProps?: Record<string, any>;
}
