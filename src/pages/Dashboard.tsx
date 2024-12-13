import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Stats } from "@/components/dashboard/Stats";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { UserManagement } from "@/components/dashboard/UserManagement";
import { DepartmentManagement } from "@/components/dashboard/DepartmentManagement";
import { ShiftCalendar } from "@/components/shifts/ShiftCalendar";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const updateActiveSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      // Update or create active session
      const { error } = await supabase
        .from('active_sessions')
        .upsert(
          { 
            user_id: session.user.id,
            last_seen: new Date().toISOString()
          },
          { 
            onConflict: 'user_id',
            ignoreDuplicates: false 
          }
        );

      if (error) {
        console.error("Error updating active session:", error);
      }
    };

    // Update session immediately and then every minute
    updateActiveSession();
    const interval = setInterval(updateActiveSession, 60000);

    return () => {
      clearInterval(interval);
    };
  }, [navigate]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <Stats />
            <ShiftCalendar />
            <QuickActions />
            <UserManagement />
            <DepartmentManagement />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;