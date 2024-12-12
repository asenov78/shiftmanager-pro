import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, Clock, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface StatCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  onClick?: () => void;
}

const StatCard = ({ title, value, description, icon: Icon, onClick }: StatCardProps) => (
  <Card 
    className={`hover:shadow-lg transition-shadow ${onClick ? 'cursor-pointer' : ''}`}
    onClick={onClick}
  >
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export const Stats = () => {
  const navigate = useNavigate();

  const { data: employeeCount = 0 } = useQuery({
    queryKey: ['employeeCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'Employee');
      
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: departmentCount = 0 } = useQuery({
    queryKey: ['departmentCount'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('departments')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  const stats = [
    {
      title: "Total Employees",
      value: employeeCount.toString(),
      icon: Users,
      description: "Active employees",
      onClick: () => navigate("/dashboard", { state: { scrollToUsers: true } })
    },
    {
      title: "Departments",
      value: departmentCount.toString(),
      icon: Building,
      description: "Across organization",
      onClick: () => navigate("/dashboard", { state: { scrollToDepartments: true } })
    },
    {
      title: "Active Shifts",
      value: "12",
      icon: Clock,
      description: "Current week",
    },
    {
      title: "Upcoming Changes",
      value: "3",
      icon: Calendar,
      description: "Pending approvals",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};