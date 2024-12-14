import { QueryClient } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";

interface Shift {
  id: string;
  start_time: string;
  end_time: string;
  profiles: {
    full_name: string;
  };
}

interface ShiftCalendarViewProps {
  shifts: Shift[];
  date: Date;
  queryClient: QueryClient;
}

export const ShiftCalendarView = ({ shifts, date, queryClient }: ShiftCalendarViewProps) => {
  const modifiers = {
    shift: shifts.map((shift) => new Date(shift.start_time)),
  };

  const modifiersStyles = {
    shift: {
      backgroundColor: "#1e40af",
      color: "white",
    },
  };

  return (
    <Calendar
      mode="single"
      selected={date}
      month={date}
      className="rounded-md border"
      modifiers={modifiers}
      modifiersStyles={modifiersStyles}
      onMonthChange={(newDate) => {
        queryClient.invalidateQueries({
          queryKey: ["shifts", newDate],
        });
      }}
    />
  );
};