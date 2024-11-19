import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { PlatformType, SocialAccount } from '../lib/platforms/types';
import { platformConfigs } from '../lib/platforms/config';

interface PlatformState {
  accounts: SocialAccount[];
  loading: boolean;
  error: string | null;
  loadAccounts: () => Promise<void>;
  connectPlatform: (platform: PlatformType) => Promise<void>;
  disconnectPlatform: (accountId: string) => Promise<void>;
}

export const usePlatformStore = create<PlatformState>((set, get) => ({
  accounts: [],
  loading: false,
  error: null,

  loadAccounts: async () => {
    set({ loading: true, error: null });
    try {
      const { data: accounts, error } = await supabase
        .from('social_accounts')
        .select('*');

      if (error) throw error;

      set({
        accounts: accounts.map(account => ({
          id: account.id,
          platform: account.platform,
          platformUsername: account.platform_username,
          connected: new Date(account.expires_at) > new Date(),
        })),
      });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },

  connectPlatform: async (platform: PlatformType) => {
    const config = platformConfigs[platform];
    if (!config) throw new Error('Invalid platform');

    // Generate and store state parameter for security
    const state = crypto.randomUUID();
    sessionStorage.setItem('oauth_state', state);

    // Build OAuth URL
    const params = new URLSearchParams({
      client_id: import.meta.env[`VITE_${platform.toUpperCase()}_CLIENT_ID`],
      redirect_uri: `${window.location.origin}/auth/callback/${platform}`,
      response_type: 'code',
      scope: config.scopes.join(' '),
      state,
    });

    // Redirect to platform's OAuth page
    window.location.href = `${config.authUrl}?${params.toString()}`;
  },

  disconnectPlatform: async (accountId: string) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('social_accounts')
        .delete()
        .eq('id', accountId);

      if (error) throw error;

      set(state => ({
        accounts: state.accounts.filter(account => account.id !== accountId),
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ loading: false });
    }
  },
}));