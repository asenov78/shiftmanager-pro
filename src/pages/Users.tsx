import { UserManagement } from "@/components/dashboard/UserManagement";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Users = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <UserManagement />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Users;