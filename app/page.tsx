"use client";

import { supabase } from "@/lib/supabaseClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserPlus,
  TrendingUp,
  Building2,
  Calendar,
  BarChart3,
  LogOut,
  FileText,
  Clock,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { AuthGuard } from "@/components/auth-guard";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useState, useEffect } from "react";

function DashboardContent() {
  useEffect(() => {
    loadAttendanceData();
  }, []);
  const { user, logout } = useAuth();
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [attendanceTimes, setAttendanceTimes] = useState<{
    [key: string]: { checkIn?: string; checkOut?: string };
  }>({});
  const [attendanceRecords, setAttendanceRecords] = useState<{
    [key: string]: any[];
  }>({});
  const [employees, setEmployees] = useState([
    {
      id: "EMP001",
      name: "John Smith",
      department: "Engineering",
      status: "Not Checked In",
      checkIn: "",
      checkOut: "",
    },
    {
      id: "EMP002",
      name: "Sarah Johnson",
      department: "Marketing",
      status: "Checked In",
      checkIn: "09:15",
      checkOut: "",
    },
    {
      id: "EMP003",
      name: "Michael Chen",
      department: "Sales",
      status: "Checked Out",
      checkIn: "08:45",
      checkOut: "17:30",
    },
    {
      id: "EMP004",
      name: "Emily Davis",
      department: "HR",
      status: "Not Checked In",
      checkIn: "",
      checkOut: "",
    },
    {
      id: "EMP005",
      name: "David Rodriguez",
      department: "Finance",
      status: "Checked In",
      checkIn: "09:00",
      checkOut: "",
    },
  ]);

  const loadAttendanceData = async () => {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const monthStart = startOfMonth.toISOString().slice(0, 10);
    const today = new Date().toISOString().slice(0, 10);

    const { data, error } = await supabase
      .from("attendance")
      .select("*, users(name, email, role)")
      .gte("date", monthStart)
      .lte("date", today)
      .order("date", { ascending: true });

    if (error) {
      console.error("Error loading attendance:", error);
      return;
    }

    // Group by employee for your existing UI
    const grouped: Record<string, any[]> = {};
    data.forEach((row) => {
      grouped[row.user_id] = grouped[row.user_id] || [];
      grouped[row.user_id].push(row);
    });
    setAttendanceRecords(grouped);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleTimeChange = (
    employeeId: string,
    type: "checkIn" | "checkOut",
    time: string
  ) => {
    setAttendanceTimes((prev) => ({
      ...prev,
      [employeeId]: {
        ...prev[employeeId],
        [type]: time,
      },
    }));
  };

  const handleMarkAttendance = async (
    employeeId: string,
    type: "checkIn" | "checkOut"
  ) => {
    if (user?.role !== "hr") {
      alert("Only HR users can mark attendance.");
      return;
    }

    const now = new Date();
    const today = now.toISOString().slice(0, 10); // YYYY-MM-DD
    const time = now.toTimeString().slice(0, 8); // HH:MM:SS

    // Check if record already exists for this employee today
    const { data: existing, error: checkError } = await supabase
      .from("attendance")
      .select("*")
      .eq("user_id", employeeId)
      .eq("date", today)
      .maybeSingle();

    if (checkError) {
      console.error("Check error:", checkError);
      alert("Failed to check existing attendance.");
      return;
    }

    if (existing) {
      // Update the existing record
      const updateField =
        type === "checkIn" ? { check_in: time } : { check_out: time };
      const { error: updateError } = await supabase
        .from("attendance")
        .update(updateField)
        .eq("id", existing.id);

      if (updateError) {
        console.error("Update error:", updateError);
        alert("Failed to update attendance.");
      } else {
        alert(
          `Attendance ${
            type === "checkIn" ? "check-in" : "check-out"
          } recorded for ${employeeId}.`
        );
      }
    } else {
      // Insert a new record
      const { error: insertError } = await supabase.from("attendance").insert([
        {
          user_id: employeeId,
          date: today,
          [type === "checkIn" ? "check_in" : "check_out"]: time,
        },
      ]);

      if (insertError) {
        console.error("Insert error:", insertError);
        alert("Failed to save attendance.");
      } else {
        alert(
          `Attendance ${
            type === "checkIn" ? "check-in" : "check-out"
          } recorded for ${employeeId}.`
        );
      }
    }

    // Refresh attendance list after saving
    loadAttendanceData();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">HRM System</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {user?.name}
              </span>
              <Badge variant="secondary" className="capitalize">
                {user?.role}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Employees
              </CardTitle>
              <Users className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-muted-foreground">
                +5 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Hires</CardTitle>
              <UserPlus className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Turnover Rate
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8.5%</div>
              <p className="text-xs text-muted-foreground">
                -2.1% from last quarter
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Employee Directory
              </CardTitle>
              <CardDescription>
                View and manage all employee information
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <a href="/employees">
                <Button className="w-full">View Directory</Button>
              </a>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Performance Reviews
              </CardTitle>
              <CardDescription>
                Track and manage employee performance
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <a href="/performance">
                <Button className="w-full">View Reviews</Button>
              </a>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                Analytics Dashboard
              </CardTitle>
              <CardDescription>View HR metrics and insights</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <a href="/analytics">
                <Button className="w-full">View Analytics</Button>
              </a>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Payroll & Compensation
              </CardTitle>
              <CardDescription>
                Manage employee salaries and benefits
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <a href="/payroll">
                <Button className="w-full">View Payroll</Button>
              </a>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Apply for Leave
              </CardTitle>
              <CardDescription>
                Submit leave requests and track status
              </CardDescription>
            </CardHeader>
            <CardContent className="mt-auto">
              <Button
                className="w-full"
                onClick={() => setShowLeaveModal(true)}
              >
                Apply Leave
              </Button>
            </CardContent>
          </Card>

          {(user?.role === "hr" || user?.role === "admin") && (
            <Card className="cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Mark Attendance
                </CardTitle>
                <CardDescription>Mark attendance for employees</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                {user?.role === "hr" && (
                  <Button
                    className="w-full"
                    onClick={() => setShowAttendanceModal(true)}
                  >
                    Mark Attendance
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {(user?.role === "hr" || user?.role === "admin") && (
            <Card className="cursor-pointer hover:shadow-md transition-shadow h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Attendance Reports
                </CardTitle>
                <CardDescription>
                  View detailed attendance history and reports
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto">
                <a href="/attendance-reports">
                  <Button className="w-full">View Reports</Button>
                </a>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates across your organization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="h-2 w-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Sarah Johnson completed onboarding
                  </p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="h-2 w-2 bg-primary/70 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Performance review completed for Michael Chen
                  </p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="h-2 w-2 bg-primary/50 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    New employee David Rodriguez started
                  </p>
                  <p className="text-xs text-muted-foreground">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">Apply for Leave</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Leave Type
                </label>
                <select className="w-full p-2 border rounded-md">
                  <option value="vacation">Vacation</option>
                  <option value="sick">Sick Leave</option>
                  <option value="personal">Personal</option>
                  <option value="emergency">Emergency</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Start Date
                </label>
                <input type="date" className="w-full p-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  End Date
                </label>
                <input type="date" className="w-full p-2 border rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  rows={3}
                  placeholder="Enter reason for leave..."
                ></textarea>
              </div>
              <div className="flex gap-2 pt-4">
                <Button className="flex-1">Submit Request</Button>
                <Button
                  variant="outline"
                  onClick={() => setShowLeaveModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAttendanceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-full max-w-4xl mx-4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              Mark Employee Attendance
            </h2>
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="text-lg font-bold text-primary">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>

              <div className="space-y-3">
                {employees.map((employee) => (
                  <div
                    key={employee.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {employee.id} • {employee.department}
                      </div>
                      {(employee.checkIn || employee.checkOut) && (
                        <div className="text-xs text-muted-foreground mt-1">
                          {employee.checkIn && `In: ${employee.checkIn}`}
                          {employee.checkIn && employee.checkOut && " • "}
                          {employee.checkOut && `Out: ${employee.checkOut}`}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          employee.status === "Checked In"
                            ? "default"
                            : employee.status === "Checked Out"
                            ? "secondary"
                            : "outline"
                        }
                        className="min-w-[100px] justify-center"
                      >
                        {employee.status}
                      </Badge>
                      <div className="flex gap-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-1">
                            <input
                              type="time"
                              className="text-xs p-1 border rounded w-20"
                              placeholder="Check In"
                              value={
                                attendanceTimes[employee.id]?.checkIn || ""
                              }
                              onChange={(e) =>
                                handleTimeChange(
                                  employee.id,
                                  "checkIn",
                                  e.target.value
                                )
                              }
                            />
                            <Button
                              size="sm"
                              variant={
                                employee.status === "Checked In"
                                  ? "secondary"
                                  : "default"
                              }
                              disabled={employee.status === "Checked In"}
                              onClick={() =>
                                handleMarkAttendance(employee.id, "checkIn")
                              }
                            >
                              Check In
                            </Button>
                          </div>
                          <div className="flex items-center gap-1">
                            <input
                              type="time"
                              className="text-xs p-1 border rounded w-20"
                              placeholder="Check Out"
                              value={
                                attendanceTimes[employee.id]?.checkOut || ""
                              }
                              onChange={(e) =>
                                handleTimeChange(
                                  employee.id,
                                  "checkOut",
                                  e.target.value
                                )
                              }
                            />
                            <Button
                              size="sm"
                              variant={
                                employee.status === "Checked Out"
                                  ? "secondary"
                                  : "outline"
                              }
                              disabled={
                                employee.status === "Not Checked In" ||
                                employee.status === "Checked Out"
                              }
                              onClick={() =>
                                handleMarkAttendance(employee.id, "checkOut")
                              }
                            >
                              Check Out
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setShowAttendanceModal(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HRMDashboard() {
  return (
    <AuthGuard>
      <ProtectedRoute>
        <DashboardContent />
      </ProtectedRoute>
    </AuthGuard>
  );
}
