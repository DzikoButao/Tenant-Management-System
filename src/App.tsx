import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { useState } from "react";
import Dashboard from "./components/Dashboard";
import TenantProfiles from "./components/TenantProfiles";
import LeaseTracking from "./components/LeaseTracking";
import PaymentProcessing from "./components/PaymentProcessing";
import MaintenanceRequests from "./components/MaintenanceRequests";

export default function App() {
  const [activeModule, setActiveModule] = useState("dashboard");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Authenticated>
        <Header activeModule={activeModule} setActiveModule={setActiveModule} />
        <main className="flex-1 p-6">
          <ModuleContent activeModule={activeModule} />
        </main>
      </Authenticated>
      
      <Unauthenticated>
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="w-full max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                Tenant Management System
              </h1>
              <p className="text-xl text-gray-600">
                Streamlined property management for college students
              </p>
            </div>
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
      
      <Toaster />
    </div>
  );
}

function Header({ activeModule, setActiveModule }: { 
  activeModule: string; 
  setActiveModule: (module: string) => void; 
}) {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  
  const modules = [
    { id: "dashboard", name: "Dashboard", icon: "📊" },
    { id: "tenants", name: "Tenant Profiles", icon: "👥" },
    { id: "leases", name: "Lease Tracking", icon: "📋" },
    { id: "payments", name: "Payments", icon: "💳" },
    { id: "maintenance", name: "Maintenance", icon: "🔧" },
  ];

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <h1 className="text-2xl font-bold text-blue-600">TenantHub</h1>
            <nav className="hidden md:flex space-x-1">
              {modules.map((module) => (
                <button
                  key={module.id}
                  onClick={() => setActiveModule(module.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeModule === module.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-2">{module.icon}</span>
                  {module.name}
                </button>
              ))}
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              Welcome, {loggedInUser?.email?.split('@')[0] || "Admin"}
            </span>
            <SignOutButton />
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex space-x-1 overflow-x-auto">
            {modules.map((module) => (
              <button
                key={module.id}
                onClick={() => setActiveModule(module.id)}
                className={`px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                  activeModule === module.id
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}
              >
                <span className="mr-1">{module.icon}</span>
                {module.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}

function ModuleContent({ activeModule }: { activeModule: string }) {
  switch (activeModule) {
    case "dashboard":
      return <Dashboard />;
    case "tenants":
      return <TenantProfiles />;
    case "leases":
      return <LeaseTracking />;
    case "payments":
      return <PaymentProcessing />;
    case "maintenance":
      return <MaintenanceRequests />;
    default:
      return <Dashboard />;
  }
}
