"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Plus, Filter, Calendar, Star, TrendingUp, ArrowLeft, Target } from "lucide-react"
import { getEmployees, getDepartments } from "@/lib/hcrm-api"
import type { Employee, Department, PerformanceReview } from "@/lib/types"
import Link from "next/link"
import { PerformanceReviewModal } from "@/components/performance-review-modal"
import { CreateReviewModal } from "@/components/create-review-modal"

// Mock performance reviews data
const mockPerformanceReviews: PerformanceReview[] = [
  {
    id: "1",
    employeeId: "1",
    reviewerId: "3",
    period: "Q4 2024",
    overallRating: 4,
    goals: ["Complete React migration", "Mentor junior developers", "Improve code review process"],
    achievements: [
      "Successfully migrated 3 major components",
      "Mentored 2 junior developers",
      "Reduced code review time by 30%",
    ],
    areasForImprovement: ["Time management", "Documentation"],
    comments:
      "Sarah has shown excellent technical leadership and mentoring skills. Her work on the React migration was outstanding.",
    status: "approved",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-20T14:30:00Z",
  },
  {
    id: "2",
    employeeId: "2",
    reviewerId: "4",
    period: "Q4 2024",
    overallRating: 3,
    goals: ["Launch new marketing campaign", "Increase social media engagement", "Develop content strategy"],
    achievements: ["Launched successful Q4 campaign", "Increased engagement by 25%"],
    areasForImprovement: ["Analytics skills", "Cross-team collaboration"],
    comments:
      "Michael has delivered solid results this quarter. Focus on developing analytical skills for better campaign optimization.",
    status: "submitted",
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-18T11:15:00Z",
  },
]

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  submitted: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
}

const ratingColors = {
  1: "text-red-600",
  2: "text-orange-600",
  3: "text-yellow-600",
  4: "text-blue-600",
  5: "text-green-600",
}

export default function PerformancePage() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [reviews, setReviews] = useState<PerformanceReview[]>(mockPerformanceReviews)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDepartment, setSelectedDepartment] = useState<string>("all")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")
  const [selectedReview, setSelectedReview] = useState<PerformanceReview | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [employeesData, departmentsData] = await Promise.all([getEmployees(), getDepartments()])
        setEmployees(employeesData)
        setDepartments(departmentsData)
      } catch (error) {
        console.error("Failed to load data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const getEmployeeById = (id: string) => employees.find((emp) => emp.id === id)
  const getReviewerById = (id: string) => employees.find((emp) => emp.id === id)

  const filteredReviews = reviews.filter((review) => {
    const employee = getEmployeeById(review.employeeId)
    if (!employee) return false

    const matchesSearch =
      employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.period.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = selectedDepartment === "all" || employee.department === selectedDepartment
    const matchesStatus = selectedStatus === "all" || review.status === selectedStatus

    return matchesSearch && matchesDepartment && matchesStatus
  })

  const upcomingReviews = employees.filter((emp) => {
    const hasRecentReview = reviews.some(
      (review) =>
        review.employeeId === emp.id && new Date(review.createdAt) > new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    )
    return !hasRecentReview
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading performance data...</p>
        </div>
      </div>
    )
  }

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
                <TrendingUp className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">Performance Management</h1>
              </div>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Review
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reviews.length}</div>
              <p className="text-xs text-muted-foreground">This quarter</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length).toFixed(1)}
              </div>
              <p className="text-xs text-muted-foreground">Out of 5.0</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingReviews.length}</div>
              <p className="text-xs text-muted-foreground">Due this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{reviews.filter((r) => r.status === "approved").length}</div>
              <p className="text-xs text-muted-foreground">Approved reviews</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reviews" className="space-y-6">
          <TabsList>
            <TabsTrigger value="reviews">All Reviews</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Reviews</TabsTrigger>
            <TabsTrigger value="analytics">Performance Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="reviews" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Search & Filter Reviews
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search reviews..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.name}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center text-sm text-muted-foreground">
                    {filteredReviews.length} reviews
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Reviews List */}
            <div className="grid gap-4">
              {filteredReviews.map((review) => {
                const employee = getEmployeeById(review.employeeId)
                const reviewer = getReviewerById(review.reviewerId)
                if (!employee || !reviewer) return null

                return (
                  <Card
                    key={review.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedReview(review)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
                            <TrendingUp className="h-6 w-6 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {employee.firstName} {employee.lastName}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {employee.position} • {employee.department}
                            </p>
                            <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                              <span>Period: {review.period}</span>
                              <span>
                                Reviewer: {reviewer.firstName} {reviewer.lastName}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.overallRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                              <span className={`ml-2 font-medium ${ratingColors[review.overallRating]}`}>
                                {review.overallRating}/5
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {new Date(review.updatedAt).toLocaleDateString()}
                            </div>
                          </div>
                          <Badge className={statusColors[review.status]}>{review.status}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Employees Due for Review</CardTitle>
                <CardDescription>Employees who haven't had a performance review in the last 90 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {upcomingReviews.map((employee) => (
                    <div key={employee.id} className="flex items-center justify-between p-4 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium">
                            {employee.firstName} {employee.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {employee.position} • {employee.department}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => setShowCreateModal(true)}>
                        Schedule Review
                      </Button>
                    </div>
                  ))}
                  {upcomingReviews.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      All employees have recent performance reviews.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = reviews.filter((r) => r.overallRating === rating).length
                      const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0
                      return (
                        <div key={rating} className="flex items-center gap-3">
                          <div className="flex items-center gap-1 w-16">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{rating}</span>
                          </div>
                          <div className="flex-1 bg-muted rounded-full h-2">
                            <div
                              className="bg-primary rounded-full h-2 transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground w-12">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Department Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {departments.map((dept) => {
                      const deptReviews = reviews.filter((review) => {
                        const employee = getEmployeeById(review.employeeId)
                        return employee?.department === dept.name
                      })
                      const avgRating =
                        deptReviews.length > 0
                          ? deptReviews.reduce((sum, r) => sum + r.overallRating, 0) / deptReviews.length
                          : 0

                      return (
                        <div key={dept.id} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{dept.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{avgRating.toFixed(1)}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">({deptReviews.length} reviews)</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Performance Review Detail Modal */}
      {selectedReview && (
        <PerformanceReviewModal
          review={selectedReview}
          employee={getEmployeeById(selectedReview.employeeId)!}
          reviewer={getReviewerById(selectedReview.reviewerId)!}
          isOpen={!!selectedReview}
          onClose={() => setSelectedReview(null)}
          onUpdate={(updatedReview) => {
            setReviews(reviews.map((r) => (r.id === updatedReview.id ? updatedReview : r)))
            setSelectedReview(updatedReview)
          }}
        />
      )}

      {/* Create Review Modal */}
      <CreateReviewModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        employees={employees}
        onCreate={(newReview) => {
          setReviews([...reviews, newReview])
          setShowCreateModal(false)
        }}
      />
    </div>
  )
}
