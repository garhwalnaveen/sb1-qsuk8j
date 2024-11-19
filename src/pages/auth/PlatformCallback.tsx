import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { platformConfigs } from '../../lib/platforms/config';
import { usePlatformStore } from '../../stores/platformStore';

export default function PlatformCallback() {
  const navigate = useNavigate();
  const { platform } = useParams<{ platform: string }>();
  const [error, setError] = useState<string | null>(null);
  const loadAccounts = usePlatformStore(state => state.loadAccounts);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        if (!platform || !platformConfigs[platform]) {
          throw new Error('Invalid platform');
        }

        // Verify state parameter
        const storedState = sessionStorage.getItem('oauth_state');
        const urlParams = new URLSearchParams(window.location.search);
        const state = urlParams.get('state');
        const code = urlParams.get('code');

        if (!storedState || !state || storedState !== state) {
          throw new Error('Invalid state parameter');
        }

        if (!code) {
          throw new Error('No authorization code received');
        }

        // Exchange code for tokens using Edge Function
        const { data, error: exchangeError } = await supabase.functions.invoke('exchange-token', {
          body: { platform, code },
        });

        if (exchangeError) throw exchangeError;

        // Store the connection in the database
        const { error: dbError } = await supabase
          .from('social_accounts')
          .upsert({
            platform,
            access_token: data.accessToken,
            refresh_token: data.refreshToken,
            expires_at: new Date(Date.now() + data.expiresIn * 1000).toISOString(),
            platform_user_id: data.userId,
            platform_username: data.username,
          });

        if (dbError) throw dbError;

        // Reload accounts and redirect
        await loadAccounts();
        navigate('/settings');
      } catch (err) {
        setError((err as Error).message);
      } finally {
        sessionStorage.removeItem('oauth_state');
      }
    };

    handleCallback();
  }, [platform, navigate, loadAccounts]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="rounded-lg bg-red-50 p-4">
          <p className="text-sm text-red-800">Failed to connect: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-500" />
        <p className="mt-2 text-sm text-gray-600">Connecting to {platform}...</p>
      </div>
    </div>
  );
}