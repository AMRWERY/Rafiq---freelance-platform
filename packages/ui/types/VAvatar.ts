export type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

export type AvatarRoleContext = "client" | "developer" | "neutral";

export type AvatarPresence = "online" | "away" | "busy" | "offline" | "none";

export interface AvatarProps {
  src?: string;
  name?: string;
  alt?: string;
  size?: AvatarSize;
  roleContext?: AvatarRoleContext;
  presence?: AvatarPresence;
  verified?: boolean;
}
