import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Stats } from "@/components/dashboard/Stats";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { ShiftCalendar } from "@/components/shifts/ShiftCalendar";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const updateActiveSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      const { error } = await supabase
        .from('active_sessions')
        .upsert(
          { 
            user_id: session.user.id,
            last_seen: new Date().toISOString()
          },
          { 
            onConflict: 'user_id'
          }
        );

      if (error) {
        console.error("Error updating active session:", error);
        toast.error("Failed to update session status");
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
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;