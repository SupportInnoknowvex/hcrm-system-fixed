"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, Search, Download, Filter, User } from "lucide-react"
import { AuthGuard } from "@/components/auth-guard"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { useState } from "react"
import type { AttendanceRecord, Employee } from "@/lib/types"

// Mock attendance data for demonstration
const mockAttendanceRecords: AttendanceRecord[] = [
  {
    id: "ATT001",
    employeeId: "EMP001",
    date: "2024-01-15",
    checkIn: "09:00",
    checkOut: "17:30",
    status: "present",
    workingHours: 8.5,
    overtimeHours: 0.5,
    createdAt: "2024-01-15T09:00:00Z",
  },
  {
    id: "ATT002",
    employeeId: "EMP001",
    date: "2024-01-16",
    checkIn: "09:15",
    checkOut: "17:45",
    status: "late",
    workingHours: 8.5,
    overtimeHours: 0.5,
    createdAt: "2024-01-16T09:15:00Z",
  },
  {
    id: "ATT003",
    employeeId: "EMP002",
    date: "2024-01-15",
    checkIn: "08:45",
    checkOut: "17:00",
    status: "present",
    workingHours: 8.25,
    createdAt: "2024-01-15T08:45:00Z",
  },
  {
    id: "ATT004",
    employeeId: "EMP002",
    date: "2024-01-16",
    status: "on-leave",
    createdAt: "2024-01-16T00:00:00Z",
  },
  {
    id: "ATT005",
    employeeId: "EMP003",
    date: "2024-01-15",
    checkIn: "09:30",
    checkOut: "18:00",
    status: "late",
    workingHours: 8.5,
    overtimeHours: 0.5,
    createdAt: "2024-01-15T09:30:00Z",
  },
]

const mockEmployees: Employee[] = [
  {
    id: "EMP001",
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@company.com",
    phone: "+1-555-0101",
    position: "Software Engineer",
    department: "Engineering",
    startDate: "2023-01-15",
    salary: 75000,
    status: "active",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
    },
    emergencyContact: {
      name: "Jane Smith",
      relationship: "Spouse",
      phone: "+1-555-0102",
    },
    payroll: {
      baseSalary: 75000,
      bonuses: [],
      deductions: [],
      benefits: {
        healthInsurance: { plan: "Premium", employeeContribution: 200, employerContribution: 800 },
        retirement: { plan: "401k", employeeContribution: 5, employerMatch: 3 },
        paidTimeOff: { vacationDays: 20, sickDays: 10, personalDays: 5 },
        otherBenefits: [],
      },
      paySchedule: "bi-weekly" as const,
      taxInformation: {
        federalTaxRate: 22,
        stateTaxRate: 8,
        socialSecurityRate: 6.2,
        medicareRate: 1.45,
      },
    },
    createdAt: "2023-01-15T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
  {
    id: "EMP002",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@company.com",
    phone: "+1-555-0201",
    position: "Marketing Manager",
    department: "Marketing",
    startDate: "2023-03-01",
    salary: 65000,
    status: "active",
    address: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90210",
    },
    emergencyContact: {
      name: "Mike Johnson",
      relationship: "Brother",
      phone: "+1-555-0202",
    },
    payroll: {
      baseSalary: 65000,
      bonuses: [],
      deductions: [],
      benefits: {
        healthInsurance: { plan: "Standard", employeeContribution: 150, employerContribution: 600 },
        retirement: { plan: "401k", employeeContribution: 4, employerMatch: 3 },
        paidTimeOff: { vacationDays: 18, sickDays: 10, personalDays: 3 },
        otherBenefits: [],
      },
      paySchedule: "bi-weekly" as const,
      taxInformation: {
        federalTaxRate: 22,
        stateTaxRate: 9,
        socialSecurityRate: 6.2,
        medicareRate: 1.45,
      },
    },
    createdAt: "2023-03-01T00:00:00Z",
    updatedAt: "2024-01-15T00:00:00Z",
  },
]

function AttendanceReportsContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [dateRange, setDateRange] = useState({ start: "", end: "" })

  const getEmployeeName = (employeeId: string) => {
    const employee = mockEmployees.find((emp) => emp.id === employeeId)
    return employee ? `${employee.firstName} ${employee.lastName}` : "Unknown Employee"
  }

  const getEmployeeDepartment = (employeeId: string) => {
    const employee = mockEmployees.find((emp) => emp.id === employeeId)
    return employee?.department || "Unknown"
  }

  const filteredRecords = mockAttendanceRecords.filter((record) => {
    const employeeName = getEmployeeName(record.employeeId).toLowerCase()
    const matchesSearch =
      employeeName.includes(searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEmployee = selectedEmployee === "all" || record.employeeId === selectedEmployee
    const matchesStatus = selectedStatus === "all" || record.status === selectedStatus

    return matchesSearch && matchesEmployee && matchesStatus
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "present":
        return "default"
      case "late":
        return "secondary"
      case "absent":
        return "destructive"
      case "on-leave":
        return "outline"
      case "half-day":
        return "secondary"
      default:
        return "outline"
    }
  }

  const calculateTotalHours = (employeeId: string) => {
    const employeeRecords = mockAttendanceRecords.filter((record) => record.employeeId === employeeId)
    return employeeRecords.reduce((total, record) => total + (record.workingHours || 0), 0)
  }

  const calculateOvertimeHours = (employeeId: string) => {
    const employeeRecords = mockAttendanceRecords.filter((record) => record.employeeId === employeeId)
    return employeeRecords.reduce((total, record) => total + (record.overtimeHours || 0), 0)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold">Attendance Reports</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <a href="/" className="flex items-center">
                  Back to Dashboard
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Records</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredRecords.length}</div>
              <p className="text-xs text-muted-foreground">Attendance entries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Present Days</CardTitle>
              <User className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredRecords.filter((r) => r.status === "present").length}</div>
              <p className="text-xs text-muted-foreground">Days present</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
              <Clock className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredRecords.filter((r) => r.status === "late").length}</div>
              <p className="text-xs text-muted-foreground">Late entries</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">On Leave</CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredRecords.filter((r) => r.status === "on-leave").length}</div>
              <p className="text-xs text-muted-foreground">Leave days</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Search Employee</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Employee</label>
                <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Employees</SelectItem>
                    {mockEmployees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="present">Present</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="absent">Absent</SelectItem>
                    <SelectItem value="on-leave">On Leave</SelectItem>
                    <SelectItem value="half-day">Half Day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date Range</label>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange((prev) => ({ ...prev, start: e.target.value }))}
                    className="text-sm"
                  />
                  <Input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange((prev) => ({ ...prev, end: e.target.value }))}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Employee Summary */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Employee Summary</CardTitle>
            <CardDescription>Total working hours and overtime by employee</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockEmployees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">
                      {employee.firstName} {employee.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {employee.id} • {employee.department}
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-medium">{calculateTotalHours(employee.id)}h</div>
                      <div className="text-muted-foreground">Total Hours</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">{calculateOvertimeHours(employee.id)}h</div>
                      <div className="text-muted-foreground">Overtime</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">
                        {mockAttendanceRecords.filter((r) => r.employeeId === employee.id).length}
                      </div>
                      <div className="text-muted-foreground">Days</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Attendance Records Table */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
            <CardDescription>Detailed attendance history for all employees</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredRecords.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No attendance records found matching your criteria.
                </div>
              ) : (
                filteredRecords.map((record) => (
                  <div key={record.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{getEmployeeName(record.employeeId)}</div>
                      <div className="text-sm text-muted-foreground">
                        {record.employeeId} • {getEmployeeDepartment(record.employeeId)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {new Date(record.date).toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <Badge variant={getStatusBadgeVariant(record.status)} className="min-w-[80px] justify-center">
                        {record.status.replace("-", " ").toUpperCase()}
                      </Badge>
                      <div className="text-sm text-center min-w-[60px]">
                        {record.checkIn ? (
                          <div>
                            <div className="font-medium">{record.checkIn}</div>
                            <div className="text-muted-foreground">Check In</div>
                          </div>
                        ) : (
                          <div className="text-muted-foreground">-</div>
                        )}
                      </div>
                      <div className="text-sm text-center min-w-[60px]">
                        {record.checkOut ? (
                          <div>
                            <div className="font-medium">{record.checkOut}</div>
                            <div className="text-muted-foreground">Check Out</div>
                          </div>
                        ) : (
                          <div className="text-muted-foreground">-</div>
                        )}
                      </div>
                      <div className="text-sm text-center min-w-[60px]">
                        {record.workingHours ? (
                          <div>
                            <div className="font-medium">{record.workingHours}h</div>
                            <div className="text-muted-foreground">Hours</div>
                          </div>
                        ) : (
                          <div className="text-muted-foreground">-</div>
                        )}
                      </div>
                      {record.overtimeHours && record.overtimeHours > 0 && (
                        <div className="text-sm text-center min-w-[60px]">
                          <div className="font-medium text-primary">+{record.overtimeHours}h</div>
                          <div className="text-muted-foreground">Overtime</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function AttendanceReports() {
  return (
    <AuthGuard>
      <ProtectedRoute allowedRoles={["admin", "hr"]}>
        <AttendanceReportsContent />
      </ProtectedRoute>
    </AuthGuard>
  )
}
