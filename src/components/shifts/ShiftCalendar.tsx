import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Calendar as CalendarIcon, Plus } from "lucide-react";

interface Shift {
  id: number;
  userId: number;
  date: Date;
  startTime: string;
  endTime: string;
  status: "scheduled" | "pending-trade" | "completed";
}

export const ShiftCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { toast } = useToast();
  const [shifts] = useState<Shift[]>([
    {
      id: 1,
      userId: 1,
      date: new Date(),
      startTime: "09:00",
      endTime: "17:00",
      status: "scheduled",
    },
  ]);

  const handleAddShift = () => {
    toast({
      title: "Add Shift",
      description: "Shift creation functionality coming soon",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Shift Calendar</CardTitle>
        <Button onClick={handleAddShift}>
          <Plus className="mr-2 h-4 w-4" />
          Add Shift
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
          <div className="flex-1">
            <h3 className="font-semibold flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              Shifts for {date?.toLocaleDateString()}
            </h3>
            {shifts.length > 0 ? (
              <ul className="mt-4 space-y-2">
                {shifts.map((shift) => (
                  <li
                    key={shift.id}
                    className="p-3 bg-secondary rounded-lg flex justify-between items-center"
                  >
                    <span>
                      {shift.startTime} - {shift.endTime}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {shift.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground mt-4">
                No shifts scheduled for this date
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};