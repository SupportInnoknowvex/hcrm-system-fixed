"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import type { Employee, PerformanceReview } from "@/lib/types"

interface CreateReviewModalProps {
  isOpen: boolean
  onClose: () => void
  employees: Employee[]
  onCreate: (review: PerformanceReview) => void
}

export function CreateReviewModal({ isOpen, onClose, employees, onCreate }: CreateReviewModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    employeeId: "",
    reviewerId: "",
    period: "",
    overallRating: 3,
    goals: ["", "", ""],
    achievements: ["", "", ""],
    areasForImprovement: ["", ""],
    comments: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const newReview: PerformanceReview = {
        id: Date.now().toString(),
        employeeId: formData.employeeId,
        reviewerId: formData.reviewerId,
        period: formData.period,
        overallRating: formData.overallRating as 1 | 2 | 3 | 4 | 5,
        goals: formData.goals.filter((g) => g.trim()),
        achievements: formData.achievements.filter((a) => a.trim()),
        areasForImprovement: formData.areasForImprovement.filter((a) => a.trim()),
        comments: formData.comments,
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      onCreate(newReview)

      // Reset form
      setFormData({
        employeeId: "",
        reviewerId: "",
        period: "",
        overallRating: 3,
        goals: ["", "", ""],
        achievements: ["", "", ""],
        areasForImprovement: ["", ""],
        comments: "",
      })
    } catch (error) {
      console.error("Failed to create review:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRatingClick = (rating: number) => {
    setFormData({ ...formData, overallRating: rating })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Performance Review</DialogTitle>
          <DialogDescription>Create a new performance review for an employee.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Review Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employeeId">Employee *</Label>
                <Select
                  value={formData.employeeId}
                  onValueChange={(value) => setFormData({ ...formData, employeeId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} - {emp.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="reviewerId">Reviewer *</Label>
                <Select
                  value={formData.reviewerId}
                  onValueChange={(value) => setFormData({ ...formData, reviewerId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select reviewer" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((emp) => (
                      <SelectItem key={emp.id} value={emp.id}>
                        {emp.firstName} {emp.lastName} - {emp.position}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="period">Review Period *</Label>
              <Input
                id="period"
                required
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                placeholder="e.g. Q1 2024, Annual 2024"
              />
            </div>
          </div>

          {/* Overall Rating */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Overall Rating</h3>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button key={rating} type="button" onClick={() => handleRatingClick(rating)} className="p-1">
                  <Star
                    className={`h-8 w-8 ${
                      rating <= formData.overallRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 hover:text-yellow-200"
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-muted-foreground">{formData.overallRating}/5</span>
            </div>
          </div>

          {/* Goals */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Goals</h3>
            {formData.goals.map((goal, index) => (
              <div key={index}>
                <Label htmlFor={`goal-${index}`}>Goal {index + 1}</Label>
                <Input
                  id={`goal-${index}`}
                  value={goal}
                  onChange={(e) => {
                    const newGoals = [...formData.goals]
                    newGoals[index] = e.target.value
                    setFormData({ ...formData, goals: newGoals })
                  }}
                  placeholder="Enter a goal for this review period"
                />
              </div>
            ))}
          </div>

          {/* Achievements */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Key Achievements</h3>
            {formData.achievements.map((achievement, index) => (
              <div key={index}>
                <Label htmlFor={`achievement-${index}`}>Achievement {index + 1}</Label>
                <Input
                  id={`achievement-${index}`}
                  value={achievement}
                  onChange={(e) => {
                    const newAchievements = [...formData.achievements]
                    newAchievements[index] = e.target.value
                    setFormData({ ...formData, achievements: newAchievements })
                  }}
                  placeholder="Enter a key achievement"
                />
              </div>
            ))}
          </div>

          {/* Areas for Improvement */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Areas for Improvement</h3>
            {formData.areasForImprovement.map((area, index) => (
              <div key={index}>
                <Label htmlFor={`improvement-${index}`}>Area {index + 1}</Label>
                <Input
                  id={`improvement-${index}`}
                  value={area}
                  onChange={(e) => {
                    const newAreas = [...formData.areasForImprovement]
                    newAreas[index] = e.target.value
                    setFormData({ ...formData, areasForImprovement: newAreas })
                  }}
                  placeholder="Enter an area for improvement"
                />
              </div>
            ))}
          </div>

          {/* Comments */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Comments</h3>
            <Textarea
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              placeholder="Add detailed feedback and comments about the employee's performance..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
