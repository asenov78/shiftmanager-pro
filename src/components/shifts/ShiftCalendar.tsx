import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Shift {
  id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  status: "scheduled" | "pending-trade" | "completed";
}

export const ShiftCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const queryClient = useQueryClient();

  const { data: shifts = [] } = useQuery({
    queryKey: ['shifts', date?.toISOString()],
    queryFn: async () => {
      if (!date) return [];
      
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .gte('start_time', startOfDay.toISOString())
        .lte('start_time', endOfDay.toISOString())
        .order('start_time');

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'shifts' },
        () => {
          if (date) {
            queryClient.invalidateQueries({ 
              queryKey: ['shifts', date.toISOString()]
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, date]);

  const handleAddShift = () => {
    toast("Shift creation functionality coming soon");
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
                      {new Date(shift.start_time).toLocaleTimeString()} - {new Date(shift.end_time).toLocaleTimeString()}
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