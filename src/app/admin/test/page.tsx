export default function AdminTestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900">Admin Test Page</h1>
        <p className="mt-4 text-gray-600">
          If you see this page, the admin routes are working.
        </p>
        <p className="mt-2 text-sm text-gray-400">
          Deployed at: {new Date().toISOString()}
        </p>
      </div>
    </div>
  );
}
