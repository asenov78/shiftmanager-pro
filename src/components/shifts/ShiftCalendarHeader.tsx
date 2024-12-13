import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { toast } from "sonner";

interface ShiftCalendarHeaderProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export const ShiftCalendarHeader = ({ date, onDateChange }: ShiftCalendarHeaderProps) => {
  const handlePreviousMonth = () => {
    onDateChange(new Date(date.getFullYear(), date.getMonth() - 1));
  };

  const handleNextMonth = () => {
    onDateChange(new Date(date.getFullYear(), date.getMonth() + 1));
  };

  const handleAddShift = () => {
    toast("Shift creation functionality coming soon");
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold">
          {date.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <Button variant="outline" size="icon" onClick={handleNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <Button onClick={handleAddShift}>
        <Plus className="h-4 w-4 mr-2" />
        Add Shift
      </Button>
    </div>
  );
};