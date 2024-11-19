import { PlatformConfig } from './types';

export const platformConfigs: Record<string, PlatformConfig> = {
  twitter: {
    name: 'twitter',
    displayName: 'Twitter',
    color: '#1DA1F2',
    scopes: ['tweet.read', 'tweet.write', 'users.read'],
    authUrl: 'https://twitter.com/i/oauth2/authorize',
    tokenUrl: 'https://api.twitter.com/2/oauth2/token',
  },
  facebook: {
    name: 'facebook',
    displayName: 'Facebook',
    color: '#1877F2',
    scopes: ['pages_show_list', 'pages_read_engagement', 'pages_manage_posts'],
    authUrl: 'https://www.facebook.com/v12.0/dialog/oauth',
    tokenUrl: 'https://graph.facebook.com/v12.0/oauth/access_token',
  },
  linkedin: {
    name: 'linkedin',
    displayName: 'LinkedIn',
    color: '#0A66C2',
    scopes: ['r_liteprofile', 'w_member_social'],
    authUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    tokenUrl: 'https://www.linkedin.com/oauth/v2/accessToken',
  },
  instagram: {
    name: 'instagram',
    displayName: 'Instagram',
    color: '#E4405F',
    scopes: ['instagram_basic', 'instagram_content_publish'],
    authUrl: 'https://api.instagram.com/oauth/authorize',
    tokenUrl: 'https://api.instagram.com/oauth/access_token',
  },
};