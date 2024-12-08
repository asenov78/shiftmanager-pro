import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Clock, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const stats = [
    {
      title: "Total Employees",
      value: "23",
      icon: Users,
      description: "Active employees",
    },
    {
      title: "Departments",
      value: "4",
      icon: Building,
      description: "Across organization",
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
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-primary">Shift Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, Admin</span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
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

        {/* Upcoming Shifts Preview */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Today's Shifts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-gray-500 py-8">
                Shift calendar will be implemented here...
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;