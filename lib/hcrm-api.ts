// Mock API functions for HCRM operations
import type { Employee, Department, HRMetrics } from "./types"
import { mockEmployees, mockDepartments } from "./mock-data"

// Employee operations
export async function getEmployees(): Promise<Employee[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockEmployees
}

export async function getEmployee(id: string): Promise<Employee | null> {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockEmployees.find((emp) => emp.id === id) || null
}

export async function createEmployee(employee: Omit<Employee, "id" | "createdAt" | "updatedAt">): Promise<Employee> {
  await new Promise((resolve) => setTimeout(resolve, 800))
  const newEmployee: Employee = {
    ...employee,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  mockEmployees.push(newEmployee)
  return newEmployee
}

export async function updateEmployee(id: string, updates: Partial<Employee>): Promise<Employee | null> {
  await new Promise((resolve) => setTimeout(resolve, 600))
  const index = mockEmployees.findIndex((emp) => emp.id === id)
  if (index === -1) return null

  mockEmployees[index] = {
    ...mockEmployees[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  }
  return mockEmployees[index]
}

// Department operations
export async function getDepartments(): Promise<Department[]> {
  await new Promise((resolve) => setTimeout(resolve, 400))
  return mockDepartments
}

// Analytics
export async function getHRMetrics(): Promise<HRMetrics> {
  await new Promise((resolve) => setTimeout(resolve, 600))

  const totalEmployees = mockEmployees.length
  const departmentBreakdown = mockEmployees.reduce(
    (acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1
      return acc
    },
    {} as { [key: string]: number },
  )

  const averageSalary = mockEmployees.reduce((sum, emp) => sum + emp.salary, 0) / totalEmployees

  return {
    totalEmployees,
    newHires: 5, // Mock data
    turnoverRate: 8.5, // Mock data
    averageSalary: Math.round(averageSalary),
    departmentBreakdown,
    performanceDistribution: { 1: 2, 2: 5, 3: 8, 4: 12, 5: 6 }, // Mock data
  }
}
