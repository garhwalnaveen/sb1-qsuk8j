export type PlatformType = 'twitter' | 'facebook' | 'instagram' | 'linkedin';

export interface PlatformConfig {
  name: PlatformType;
  displayName: string;
  color: string;
  scopes: string[];
  authUrl: string;
  tokenUrl: string;
}

export interface SocialAccount {
  id: string;
  platform: PlatformType;
  platformUsername: string;
  connected: boolean;
}

export interface PlatformPost {
  content: string;
  mediaUrls?: string[];
  platformSpecificData?: Record<string, unknown>;
}