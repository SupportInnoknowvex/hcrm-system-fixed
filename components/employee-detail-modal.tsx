"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, MapPin, Calendar, IndianRupee, User, Edit, Save, X } from "lucide-react"
import { updateEmployee } from "@/lib/hcrm-api"
import type { Employee } from "@/lib/types"

interface EmployeeDetailModalProps {
  employee: Employee
  isOpen: boolean
  onClose: () => void
  onUpdate: (employee: Employee) => void
}

export function EmployeeDetailModal({ employee, isOpen, onClose, onUpdate }: EmployeeDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedEmployee, setEditedEmployee] = useState<Employee>(employee)
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    setLoading(true)
    try {
      const updated = await updateEmployee(employee.id, editedEmployee)
      if (updated) {
        onUpdate(updated)
        setIsEditing(false)
      }
    } catch (error) {
      console.error("Failed to update employee:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditedEmployee(employee)
    setIsEditing(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={employee.photo || "/placeholder.svg"}
                  alt={`${employee.firstName} ${employee.lastName}`}
                />
                <AvatarFallback className="text-lg">
                  {employee.firstName[0]}
                  {employee.lastName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl">
                  {employee.firstName} {employee.lastName}
                </DialogTitle>
                <DialogDescription className="text-lg">
                  {employee.position} • {employee.department}
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={employee.status === "active" ? "default" : "secondary"}
                className={employee.status === "active" ? "bg-green-100 text-green-800" : ""}
              >
                {employee.status}
              </Badge>
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

        <Tabs defaultValue="personal" className="mt-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="employment">Employment</TabsTrigger>
            <TabsTrigger value="emergency">Emergency Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={editedEmployee.firstName}
                        onChange={(e) => setEditedEmployee({ ...editedEmployee, firstName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={editedEmployee.lastName}
                        onChange={(e) => setEditedEmployee({ ...editedEmployee, lastName: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editedEmployee.email}
                        onChange={(e) => setEditedEmployee({ ...editedEmployee, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editedEmployee.phone}
                        onChange={(e) => setEditedEmployee({ ...editedEmployee, phone: e.target.value })}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{employee.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{employee.phone}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {employee.address.street}, {employee.address.city}, {employee.address.state}{" "}
                          {employee.address.zipCode}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="employment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Employment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="position">Position</Label>
                      <Input
                        id="position"
                        value={editedEmployee.position}
                        onChange={(e) => setEditedEmployee({ ...editedEmployee, position: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={editedEmployee.department}
                        onChange={(e) => setEditedEmployee({ ...editedEmployee, department: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="salary">Salary</Label>
                      <Input
                        id="salary"
                        type="number"
                        value={editedEmployee.salary}
                        onChange={(e) =>
                          setEditedEmployee({ ...editedEmployee, salary: Number.parseInt(e.target.value) })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={editedEmployee.status}
                        onValueChange={(value: "active" | "inactive" | "terminated") =>
                          setEditedEmployee({ ...editedEmployee, status: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="terminated">Terminated</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{employee.position}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Started {new Date(employee.startDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{employee.salary.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="emergency" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Emergency Contact</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergencyName">Name</Label>
                      <Input
                        id="emergencyName"
                        value={editedEmployee.emergencyContact.name}
                        onChange={(e) =>
                          setEditedEmployee({
                            ...editedEmployee,
                            emergencyContact: { ...editedEmployee.emergencyContact, name: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyRelationship">Relationship</Label>
                      <Input
                        id="emergencyRelationship"
                        value={editedEmployee.emergencyContact.relationship}
                        onChange={(e) =>
                          setEditedEmployee({
                            ...editedEmployee,
                            emergencyContact: { ...editedEmployee.emergencyContact, relationship: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyPhone">Phone</Label>
                      <Input
                        id="emergencyPhone"
                        value={editedEmployee.emergencyContact.phone}
                        onChange={(e) =>
                          setEditedEmployee({
                            ...editedEmployee,
                            emergencyContact: { ...editedEmployee.emergencyContact, phone: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <strong>{employee.emergencyContact.name}</strong>
                      <p className="text-sm text-muted-foreground">{employee.emergencyContact.relationship}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{employee.emergencyContact.phone}</span>
                    </div>
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
