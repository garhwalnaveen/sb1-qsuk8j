import PlatformConnection from '../components/PlatformConnection';

export default function Settings() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-gray-600">
          Manage your account and platform connections
        </p>
      </div>
      
      <div className="rounded-lg border bg-white p-6">
        <PlatformConnection />
      </div>
    </div>
  );
}