// Core HRM Data Types

export interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  position: string
  department: string
  startDate: string
  salary: number
  status: "active" | "inactive" | "terminated"
  managerId?: string
  avatar?: string
  address: {
    street: string
    city: string
    state: string
    zipCode: string
  }
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  payroll: {
    baseSalary: number
    hourlyRate?: number
    overtimeRate?: number
    bonuses: {
      type: string
      amount: number
      date: string
      description: string
    }[]
    deductions: {
      type: string
      amount: number
      description: string
    }[]
    benefits: {
      healthInsurance: {
        plan: string
        employeeContribution: number
        employerContribution: number
      }
      retirement: {
        plan: string
        employeeContribution: number
        employerMatch: number
      }
      paidTimeOff: {
        vacationDays: number
        sickDays: number
        personalDays: number
      }
      otherBenefits: {
        name: string
        value: number
        description: string
      }[]
    }
    paySchedule: "weekly" | "bi-weekly" | "monthly" | "semi-monthly"
    taxInformation: {
      federalTaxRate: number
      stateTaxRate: number
      socialSecurityRate: number
      medicareRate: number
    }
  }
  createdAt: string
  updatedAt: string
}

export interface Department {
  id: string
  name: string
  description: string
  managerId: string
  budget: number
  employeeCount: number
  createdAt: string
}

export interface PerformanceReview {
  id: string
  employeeId: string
  reviewerId: string
  period: string
  overallRating: 1 | 2 | 3 | 4 | 5
  goals: string[]
  achievements: string[]
  areasForImprovement: string[]
  comments: string
  status: "draft" | "submitted" | "approved"
  createdAt: string
  updatedAt: string
}

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "hr" | "manager" | "employee"
  employeeId?: string
  permissions: string[]
  createdAt: string
}

export interface HRMetrics {
  totalEmployees: number
  newHires: number
  turnoverRate: number
  averageSalary: number
  departmentBreakdown: { [key: string]: number }
  performanceDistribution: { [key: number]: number }
}

export interface LeaveRequest {
  id: string
  employeeId: string
  type: "vacation" | "sick" | "personal" | "maternity" | "paternity" | "emergency"
  startDate: string
  endDate: string
  days: number
  reason: string
  status: "pending" | "approved" | "rejected"
  approvedBy?: string
  appliedAt: string
  respondedAt?: string
  comments?: string
}

export interface AttendanceRecord {
  id: string
  employeeId: string
  date: string
  checkIn?: string
  checkOut?: string
  status: "present" | "absent" | "late" | "half-day" | "on-leave"
  workingHours?: number
  overtimeHours?: number
  notes?: string
  createdAt: string
}
