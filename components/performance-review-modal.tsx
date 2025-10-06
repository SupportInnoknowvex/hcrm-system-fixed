"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Target, TrendingUp, MessageSquare, Edit, Save, X } from "lucide-react"
import type { PerformanceReview, Employee } from "@/lib/types"

interface PerformanceReviewModalProps {
  review: PerformanceReview
  employee: Employee
  reviewer: Employee
  isOpen: boolean
  onClose: () => void
  onUpdate: (review: PerformanceReview) => void
}

const statusColors = {
  draft: "bg-gray-100 text-gray-800",
  submitted: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
}

const ratingLabels = {
  1: "Needs Improvement",
  2: "Below Expectations",
  3: "Meets Expectations",
  4: "Exceeds Expectations",
  5: "Outstanding",
}

export function PerformanceReviewModal({
  review,
  employee,
  reviewer,
  isOpen,
  onClose,
  onUpdate,
}: PerformanceReviewModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedReview, setEditedReview] = useState<PerformanceReview>(review)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))
      onUpdate(editedReview)
      setIsEditing(false)
    } catch (error) {
      console.error("Failed to update review:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditedReview(review)
    setIsEditing(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl">
                Performance Review - {employee.firstName} {employee.lastName}
              </DialogTitle>
              <DialogDescription className="text-lg">
                {review.period} • Reviewed by {reviewer.firstName} {reviewer.lastName}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={statusColors[review.status]}>{review.status}</Badge>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm" disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="goals">Goals & Achievements</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="development">Development</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Overall Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-primary">{review.overallRating}/5</div>
                    <div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-5 w-5 ${
                              star <= review.overallRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{ratingLabels[review.overallRating]}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Review Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <span className="text-sm font-medium">Employee:</span>
                    <p className="text-sm text-muted-foreground">
                      {employee.firstName} {employee.lastName} • {employee.position}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Reviewer:</span>
                    <p className="text-sm text-muted-foreground">
                      {reviewer.firstName} {reviewer.lastName} • {reviewer.position}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Period:</span>
                    <p className="text-sm text-muted-foreground">{review.period}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Last Updated:</span>
                    <p className="text-sm text-muted-foreground">{new Date(review.updatedAt).toLocaleDateString()}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Goals Set
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {review.goals.map((goal, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="h-2 w-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm">{goal}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Key Achievements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {review.achievements.map((achievement, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm">{achievement}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Manager Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editedReview.comments}
                    onChange={(e) => setEditedReview({ ...editedReview, comments: e.target.value })}
                    rows={4}
                    placeholder="Add your feedback and comments..."
                  />
                ) : (
                  <p className="text-sm leading-relaxed">{review.comments}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="development" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Areas for Improvement</CardTitle>
                <CardDescription>Focus areas for professional development</CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-2">
                    {editedReview.areasForImprovement.map((area, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-orange-500 rounded-full flex-shrink-0"></div>
                        <input
                          type="text"
                          value={area}
                          onChange={(e) => {
                            const newAreas = [...editedReview.areasForImprovement]
                            newAreas[index] = e.target.value
                            setEditedReview({ ...editedReview, areasForImprovement: newAreas })
                          }}
                          className="flex-1 text-sm bg-transparent border-none outline-none"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {review.areasForImprovement.map((area, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <div className="h-2 w-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-sm">{area}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
