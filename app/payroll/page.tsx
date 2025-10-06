"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, IndianRupee, TrendingUp, Edit, Building2, ArrowLeft } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { AuthGuard } from "@/components/auth-guard"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { mockEmployees } from "@/lib/mock-data"

function PayrollContent() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [editingEmployee, setEditingEmployee] = useState<any>(null)

  const filteredEmployees = mockEmployees.filter((employee) => {
    const matchesSearch =
      (employee.name?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (employee.email?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (employee.employeeId?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment
    return matchesSearch && matchesDepartment
  })

  const totalPayroll = filteredEmployees.reduce((sum, emp) => sum + emp.salary, 0)
  const averageSalary = filteredEmployees.length > 0 ? totalPayroll / filteredEmployees.length : 0

  const departments = Array.from(new Set(mockEmployees.map((emp) => emp.department)))

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const handleSalaryUpdate = (employeeId: string, newSalary: number, incentives: number) => {
    // In a real app, this would update the database
    console.log(`Updating salary for ${employeeId} to ${newSalary} with incentives ${incentives}`)
    setEditingEmployee(null)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <a href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </a>
              </Button>
              <div className="flex items-center gap-2">
                <IndianRupee className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold">Payroll & Compensation</h1>
              </div>
            </div>
            <Badge variant="secondary" className="capitalize">
              {user?.role}
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Monthly Payroll</CardTitle>
              <IndianRupee className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalPayroll)}</div>
              <p className="text-xs text-muted-foreground">{filteredEmployees.length} employees</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(averageSalary)}</div>
              <p className="text-xs text-muted-foreground">Per employee</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Departments</CardTitle>
              <Building2 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{departments.length}</div>
              <p className="text-xs text-muted-foreground">Active departments</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Employee Payroll</CardTitle>
            <CardDescription>Manage employee salaries and compensation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Employee Payroll Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Monthly Salary (₹)</TableHead>
                    <TableHead>Annual Salary (₹)</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEmployees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-medium text-primary">
                              {employee.name
                                ? employee.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                : "??"}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium">{employee.name || "Unknown"}</div>
                            <div className="text-sm text-muted-foreground">{employee.employeeId || "N/A"}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{employee.department}</TableCell>
                      <TableCell>{employee.position}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(employee.salary)}</TableCell>
                      <TableCell className="font-medium">{formatCurrency(employee.salary * 12)}</TableCell>
                      <TableCell>
                        <Badge variant={employee.status === "Active" ? "default" : "secondary"}>
                          {employee.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => setEditingEmployee(employee)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Salary - {employee.name}</DialogTitle>
                              <DialogDescription>
                                Update salary and compensation details for this employee.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="salary">Monthly Salary (₹)</Label>
                                <Input
                                  id="salary"
                                  type="number"
                                  defaultValue={employee.salary}
                                  placeholder="Enter monthly salary in rupees"
                                />
                              </div>
                              <div>
                                <Label htmlFor="incentives">Monthly Incentives (₹)</Label>
                                <Input
                                  id="incentives"
                                  type="number"
                                  defaultValue={0}
                                  placeholder="Enter monthly incentives"
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button variant="outline">Cancel</Button>
                                <Button onClick={() => handleSalaryUpdate(employee.id, employee.salary, 0)}>
                                  Update Salary
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

export default function PayrollPage() {
  return (
    <AuthGuard>
      <ProtectedRoute allowedRoles={["admin", "hr"]}>
        <PayrollContent />
      </ProtectedRoute>
    </AuthGuard>
  )
}
