import type { Component } from "vue";

export type HeaderPerspective = "client" | "developer";

export type HeaderDensity = "compact" | "standard" | "spotlight";

export type AvailabilityStatus = "available" | "busy" | "unavailable";

export interface TalentProfileHeaderProps {
  as?: string | Component;
  name?: string;
  headline?: string;
  bio?: string;
  avatarUrl?: string;
  perspective?: HeaderPerspective;
  density?: HeaderDensity;
  hourlyRate?: number;
  currency?: string;
  rateType?: "fixed" | "negotiable";
  availability?: AvailabilityStatus;
  availabilityText?: string;
  location?: string;
  timezoneOffset?: string;
  localTime?: string;
  jobSuccessRate?: number;
  completedProjects?: number;
  skills?: string[];
  maxVisibleSkills?: number;
  verified?: boolean;
  escrowProtected?: boolean;
  githubHandle?: string;
  githubStars?: string;
  committerRank?: string;
  primaryActionAs?: string | Component;
  secondaryActionAs?: string | Component;
  primaryActionText?: string;
  secondaryActionText?: string;
  primaryActionProps?: Record<string, any>;
  secondaryActionProps?: Record<string, any>;
}
