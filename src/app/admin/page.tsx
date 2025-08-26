import AdminDashboard from "@/components/AdminDashboard";

export default function AdminPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">
          Manage alumni, events, and platform settings
        </p>
      </div>
      
      <AdminDashboard />
    </div>
  );
}
