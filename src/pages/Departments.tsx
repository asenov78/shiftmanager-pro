import { DepartmentManagement } from "@/components/dashboard/DepartmentManagement";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";

const Departments = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <DepartmentManagement />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Departments;