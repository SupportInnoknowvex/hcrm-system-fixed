"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  Users,
  UserPlus,
  UserMinus,
  DollarSign,
  Calendar,
  ArrowLeft,
  BarChart3,
  Download,
} from "lucide-react"
import { getHRMetrics, getEmployees, getDepartments } from "@/lib/hcrm-api"
import type { HRMetrics, Employee, Department } from "@/lib/types"
import Link from "next/link"

// Mock additional analytics data
const monthlyHiringData = [
  { month: "Jan", hires: 8, departures: 3, netGrowth: 5 },
  { month: "Feb", hires: 12, departures: 5, netGrowth: 7 },
  { month: "Mar", hires: 15, departures: 4, netGrowth: 11 },
  { month: "Apr", hires: 10, departures: 8, netGrowth: 2 },
  { month: "May", hires: 18, departures: 6, netGrowth: 12 },
  { month: "Jun", hires: 14, departures: 7, netGrowth: 7 },
]

const salaryDistribution = [
  { range: "$40-60k", count: 25, percentage: 20 },
  { range: "$60-80k", count: 45, percentage: 36 },
  { range: "$80-100k", count: 35, percentage: 28 },
  { range: "$100-120k", count: 15, percentage: 12 },
  { range: "$120k+", count: 5, percentage: 4 },
]

const performanceTrends = [
  { quarter: "Q1 2023", avgRating: 3.2, reviews: 45 },
  { quarter: "Q2 2023", avgRating: 3.4, reviews: 48 },
  { quarter: "Q3 2023", avgRating: 3.6, reviews: 52 },
  { quarter: "Q4 2023", avgRating: 3.8, reviews: 55 },
  { quarter: "Q1 2024", avgRating: 4.0, reviews: 58 },
  { quarter: "Q2 2024", avgRating: 4.1, reviews: 60 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export default function AnalyticsPage() {
  const [hrMetrics, setHrMetrics] = useState<HRMetrics | null>(null)
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState("6months")

  useEffect(() => {
    const loadData = async () => {
      try {
        const [metricsData, employeesData, departmentsData] = await Promise.all([
          getHRMetrics(),
          getEmployees(),
          getDepartments(),
        ])
        setHrMetrics(metricsData)
        setEmployees(employeesData)
        setDepartments(departmentsData)
      } catch (error) {
        console.error("Failed to load analytics data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!hrMetrics) {
    return <div>Failed to load analytics data</div>
  }

  const departmentData = Object.entries(hrMetrics.departmentBreakdown).map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / hrMetrics.totalEmployees) * 100),
  }))

  const performanceData = Object.entries(hrMetrics.performanceDistribution).map(([rating, count]) => ({
    rating: `${rating} Stars`,
    count,
    percentage: Math.round((count / Object.values(hrMetrics.performanceDistribution).reduce((a, b) => a + b, 0)) * 100),
  }))

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">HR Analytics Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">Last Month</SelectItem>
                  <SelectItem value="3months">Last 3 Months</SelectItem>
                  <SelectItem value="6months">Last 6 Months</SelectItem>
                  <SelectItem value="1year">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hrMetrics.totalEmployees}</div>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">+{hrMetrics.newHires} this month</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Turnover Rate</CardTitle>
              <UserMinus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hrMetrics.turnoverRate}%</div>
              <div className="flex items-center gap-1 text-xs">
                <TrendingDown className="h-3 w-3 text-green-600" />
                <span className="text-green-600">-2.1% from last quarter</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Salary</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${hrMetrics.averageSalary.toLocaleString()}</div>
              <div className="flex items-center gap-1 text-xs">
                <TrendingUp className="h-3 w-3 text-blue-600" />
                <span className="text-blue-600">+3.2% from last year</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Hires</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hrMetrics.newHires}</div>
              <div className="flex items-center gap-1 text-xs">
                <Calendar className="h-3 w-3 text-muted-foreground" />
                <span className="text-muted-foreground">This month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workforce">Workforce</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Department Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Department Distribution</CardTitle>
                  <CardDescription>Employee count by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name} (${percentage}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Monthly Hiring Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Hiring Trends</CardTitle>
                  <CardDescription>Monthly hires vs departures</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={monthlyHiringData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="hires" fill="#00C49F" name="Hires" />
                      <Bar dataKey="departures" fill="#FF8042" name="Departures" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Performance Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Rating Distribution</CardTitle>
                <CardDescription>Distribution of employee performance ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={performanceData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="rating" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="workforce" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Salary Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Salary Distribution</CardTitle>
                  <CardDescription>Employee count by salary range</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={salaryDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="range" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#FFBB28" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Department Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Department Details</CardTitle>
                  <CardDescription>Detailed breakdown by department</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {departmentData.map((dept, index) => (
                      <div key={dept.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          />
                          <span className="font-medium">{dept.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">{dept.count} employees</span>
                          <Badge variant="secondary">{dept.percentage}%</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Growth Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Workforce Growth</CardTitle>
                <CardDescription>Net employee growth over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyHiringData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="netGrowth" stroke="#00C49F" fill="#00C49F" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Performance Trends</CardTitle>
                  <CardDescription>Average performance rating over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="quarter" />
                      <YAxis domain={[0, 5]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="avgRating"
                        stroke="#8884D8"
                        strokeWidth={3}
                        dot={{ fill: "#8884D8", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Review Completion */}
              <Card>
                <CardHeader>
                  <CardTitle>Review Completion Rate</CardTitle>
                  <CardDescription>Number of completed reviews per quarter</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performanceTrends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="quarter" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="reviews" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Performance Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Summary</CardTitle>
                <CardDescription>Current performance metrics across the organization</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">4.1</div>
                    <p className="text-sm text-muted-foreground">Average Rating</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">85%</div>
                    <p className="text-sm text-muted-foreground">Reviews Completed</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">92%</div>
                    <p className="text-sm text-muted-foreground">Goal Achievement</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
