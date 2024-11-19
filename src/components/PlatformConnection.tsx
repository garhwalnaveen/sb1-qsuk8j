import { useState } from 'react';
import { AlertCircle, Loader2, LogOut } from 'lucide-react';
import { usePlatformStore } from '../stores/platformStore';
import { platformConfigs } from '../lib/platforms/config';
import type { PlatformType } from '../lib/platforms/types';

export default function PlatformConnection() {
  const { accounts, loading, error, connectPlatform, disconnectPlatform } = usePlatformStore();
  const [connecting, setConnecting] = useState<PlatformType | null>(null);

  const handleConnect = async (platform: PlatformType) => {
    setConnecting(platform);
    try {
      await connectPlatform(platform);
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (accountId: string) => {
    await disconnectPlatform(accountId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-400" />
          <p className="ml-3 text-sm text-red-800">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Connected Platforms</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.values(platformConfigs).map((config) => {
          const account = accounts.find((a) => a.platform === config.name);
          
          return (
            <div
              key={config.name}
              className="rounded-lg border p-4 shadow-sm"
              style={{ borderColor: config.color + '40' }}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-medium" style={{ color: config.color }}>
                  {config.displayName}
                </h3>
                {account ? (
                  <button
                    onClick={() => handleDisconnect(account.id)}
                    className="text-gray-400 hover:text-gray-500"
                    title="Disconnect"
                  >
                    <LogOut className="h-5 w-5" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleConnect(config.name)}
                    disabled={connecting === config.name}
                    className="rounded-md bg-white px-3 py-1.5 text-sm font-medium shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    {connecting === config.name ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      'Connect'
                    )}
                  </button>
                )}
              </div>
              {account && (
                <p className="mt-2 text-sm text-gray-600">
                  Connected as @{account.platformUsername}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}