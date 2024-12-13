import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ShiftCalendarHeader } from "./ShiftCalendarHeader";
import { ShiftCalendarView } from "./ShiftCalendarView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const ShiftCalendar = () => {
  const [date, setDate] = useState(new Date());
  const queryClient = useQueryClient();

  const { data: shifts = [], isLoading } = useQuery({
    queryKey: ["shifts", date],
    queryFn: async () => {
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

      const { data, error } = await supabase
        .from("shifts")
        .select("*, profiles(name)")
        .gte("start_time", startOfMonth.toISOString())
        .lte("end_time", endOfMonth.toISOString());

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Loading shifts...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shift Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        <ShiftCalendarHeader 
          date={date} 
          onDateChange={setDate} 
        />
        <ShiftCalendarView 
          shifts={shifts} 
          date={date}
          queryClient={queryClient}
        />
      </CardContent>
    </Card>
  );
};