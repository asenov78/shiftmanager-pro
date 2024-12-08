import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock } from "lucide-react";

export const QuickActions = () => {
  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Button className="w-full" size="lg">
          <Calendar className="mr-2 h-4 w-4" />
          View Schedule
        </Button>
        <Button className="w-full" size="lg">
          <Users className="mr-2 h-4 w-4" />
          Manage Employees
        </Button>
        <Button className="w-full" size="lg">
          <Clock className="mr-2 h-4 w-4" />
          Shift Requests
        </Button>
      </div>
    </div>
  );
};