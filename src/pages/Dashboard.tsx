import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { Stats } from "@/components/dashboard/Stats";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { UserManagement } from "@/components/dashboard/UserManagement";
import { ShiftCalendar } from "@/components/shifts/ShiftCalendar";
import { useEffect, useRef } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userManagementRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  useEffect(() => {
    if (location.state?.scrollToUsers && userManagementRef.current) {
      userManagementRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location.state?.scrollToUsers]);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary">Shift Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, Admin</span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 space-y-6">
        <Stats />
        <ShiftCalendar />
        <QuickActions />
        <div ref={userManagementRef}>
          <UserManagement />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;