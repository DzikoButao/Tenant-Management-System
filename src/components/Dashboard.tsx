import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Dashboard() {
  const tenantStats = useQuery(api.tenants.getStats);
  const leaseStats = useQuery(api.leases.getStats);
  const paymentStats = useQuery(api.payments.getStats);
  const maintenanceStats = useQuery(api.maintenance.getStats);

  if (!tenantStats || !leaseStats || !paymentStats || !maintenanceStats) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const stats = [
    {
      title: "Total Tenants",
      value: tenantStats.total,
      subtitle: `${tenantStats.active} active, ${tenantStats.pending} pending`,
      icon: "👥",
      color: "bg-blue-500",
    },
    {
      title: "Active Leases",
      value: leaseStats.active,
      subtitle: `${leaseStats.total} total leases`,
      icon: "📋",
      color: "bg-green-500",
    },
    {
      title: "Monthly Revenue",
      value: `$${paymentStats.totalRevenue.toLocaleString()}`,
      subtitle: `$${paymentStats.pendingAmount.toLocaleString()} pending`,
      icon: "💰",
      color: "bg-yellow-500",
    },
    {
      title: "Maintenance Requests",
      value: maintenanceStats.open + maintenanceStats.inProgress,
      subtitle: `${maintenanceStats.urgent} urgent`,
      icon: "🔧",
      color: "bg-red-500",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Monitor your property management metrics at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center text-white text-xl`}>
                {stat.icon}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
            <p className="text-xs text-gray-500">{stat.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Payment received</p>
                <p className="text-xs text-gray-500">John Doe - Rent payment for March</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">📋</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">New lease signed</p>
                <p className="text-xs text-gray-500">Sarah Smith - Apartment 2B</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-sm">🔧</span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Maintenance completed</p>
                <p className="text-xs text-gray-500">Fixed heating in Unit 3A</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left">
              <div className="text-2xl mb-2">👤</div>
              <p className="text-sm font-medium text-gray-900">Add Tenant</p>
              <p className="text-xs text-gray-500">Register new tenant</p>
            </button>
            <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left">
              <div className="text-2xl mb-2">📋</div>
              <p className="text-sm font-medium text-gray-900">Create Lease</p>
              <p className="text-xs text-gray-500">New lease agreement</p>
            </button>
            <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-colors text-left">
              <div className="text-2xl mb-2">💳</div>
              <p className="text-sm font-medium text-gray-900">Record Payment</p>
              <p className="text-xs text-gray-500">Log rent payment</p>
            </button>
            <button className="p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-left">
              <div className="text-2xl mb-2">🔧</div>
              <p className="text-sm font-medium text-gray-900">Maintenance</p>
              <p className="text-xs text-gray-500">View requests</p>
            </button>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts & Notifications</h3>
        <div className="space-y-3">
          {maintenanceStats.urgent > 0 && (
            <div className="flex items-center space-x-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-sm">⚠️</span>
              </div>
              <div>
                <p className="text-sm font-medium text-red-900">
                  {maintenanceStats.urgent} urgent maintenance request{maintenanceStats.urgent > 1 ? 's' : ''}
                </p>
                <p className="text-xs text-red-600">Requires immediate attention</p>
              </div>
            </div>
          )}
          {paymentStats.overdue > 0 && (
            <div className="flex items-center space-x-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 text-sm">💰</span>
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-900">
                  {paymentStats.overdue} overdue payment{paymentStats.overdue > 1 ? 's' : ''}
                </p>
                <p className="text-xs text-yellow-600">Follow up required</p>
              </div>
            </div>
          )}
          {tenantStats.pending > 0 && (
            <div className="flex items-center space-x-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm">👥</span>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">
                  {tenantStats.pending} pending tenant application{tenantStats.pending > 1 ? 's' : ''}
                </p>
                <p className="text-xs text-blue-600">Review and approve</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
