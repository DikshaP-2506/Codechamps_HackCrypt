export default function UnauthorizedPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-orange-100">
      <div className="text-center p-8 bg-white rounded-xl shadow-2xl max-w-md">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Access Denied</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this resource.
        </p>
        <a
          href="/"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
        >
          Go to Home
        </a>
      </div>
    </div>
  );
}
