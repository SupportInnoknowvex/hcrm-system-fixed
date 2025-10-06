// Authentication utilities and mock auth system

const DEMO_CREDENTIALS = {
  admin: process.env.NEXT_PUBLIC_ADMIN_EMAIL,
  hr: process.env.NEXT_PUBLIC_HR_EMAIL,
  manager: process.env.NEXT_PUBLIC_MANAGER_EMAIL,
  employee: process.env.NEXT_PUBLIC_EMPLOYEE_EMAIL,
  password: process.env.NEXT_PUBLIC_DEMO_PASSWORD,
};

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "hr" | "manager" | "employee";
  employeeId?: string;
  permissions: string[];
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    email: DEMO_CREDENTIALS.admin,
    name: "System Admin",
    role: "admin",
    permissions: ["*", "users:create", "users:update", "users:delete", "system:manage"],
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "2",
    email: DEMO_CREDENTIALS.hr,
    name: "HR Manager",
    role: "hr",
    permissions: [
      "employees:read",
      "employees:write",
      "performance:read",
      "performance:write",
      "analytics:read:basic",
    ],
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "3",
    email: DEMO_CREDENTIALS.manager,
    name: "Department Manager",
    role: "manager",
    employeeId: "3",
    permissions: [
      "employees:read",
      "performance:read",
      "performance:write:team",
      "analytics:read:basic",
    ],
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "4",
    email: DEMO_CREDENTIALS.employee,
    name: "Regular Employee",
    role: "employee",
    employeeId: "1",
    permissions: ["employees:read:own", "performance:read:own"],
    createdAt: "2024-01-01T00:00:00Z",
  },
];

// Mock authentication functions
export async function signIn(email: string, password: string): Promise<User> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const user = mockUsers.find((u) => u.email === email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  // In a real app, you'd verify the password hash
  if (password !== DEMO_CREDENTIALS.password) {
    throw new Error("Invalid email or password");
  }

  return user;
}

export async function createUserAccount(
  email: string,
  password: string,
  name: string,
  role: "hr" | "manager" | "employee",
  createdBy: User
): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Only admin can create accounts
  if (!hasPermission(createdBy, "users:create")) {
    throw new Error(
      "Unauthorized: Only administrators can create user accounts"
    );
  }

  // Check if user already exists
  if (mockUsers.find((u) => u.email === email)) {
    throw new Error("User already exists");
  }

  // Define role-based permissions
  const rolePermissions: Record<string, string[]> = {
    hr: [
      "employees:read",
      "employees:write",
      "performance:read",
      "performance:write",
      "analytics:read:basic",
    ],
    manager: [
      "employees:read",
      "performance:read",
      "performance:write:team",
      "analytics:read:basic",
    ],
    employee: ["employees:read:own", "performance:read:own"],
  };

  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    role,
    permissions: rolePermissions[role],
    createdAt: new Date().toISOString(),
  };

  mockUsers.push(newUser);
  return newUser;
}

export async function signOut(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (typeof window !== "undefined") {
    localStorage.removeItem("currentUser");
  }
}

export async function getCurrentUser(): Promise<User | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Prevent errors when running on the server (SSR)
  if (typeof window === "undefined") return null;

  const storedUser = localStorage.getItem("currentUser");
  return storedUser ? JSON.parse(storedUser) : null;
}


export function hasPermission(user: User | null, permission: string): boolean {
  if (!user) return false;

  // Admin has all permissions
  if (user.permissions.includes("*")) return true;

  // Check specific permission
  return user.permissions.includes(permission);
}

export function canAccessRoute(user: User | null, route: string): boolean {
  if (!user) return false;

  const routePermissions: Record<string, string> = {
    "/employees": "employees:read",
    "/performance": "performance:read",
    "/analytics": "analytics:read:basic",
    "/admin": "users:create", // Admin only
    "/admin/users": "users:create", // Admin only
    "/admin/system": "system:manage", // Admin only
    "/analytics/advanced": "analytics:read:advanced", // Admin only
  };

  const requiredPermission = routePermissions[route];
  if (!requiredPermission) return true; // Public route

  return hasPermission(user, requiredPermission);
}

export function canPerformSensitiveOperation(
  user: User | null,
  operation: string
): boolean {
  if (!user) return false;

  const sensitiveOperations: Record<string, string> = {
    "delete:employee": "employees:delete", // Admin only
    "modify:salary": "employees:salary", // Admin only
    "access:payroll": "payroll:access", // Admin only
    "export:data": "data:export", // Admin only
    "system:settings": "system:manage", // Admin only
  };

  const requiredPermission = sensitiveOperations[operation];
  if (!requiredPermission) return false;

  return hasPermission(user, requiredPermission);
}

export async function getAllUsers(): Promise<User[]> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  return mockUsers.filter((user) => user.id !== "1"); // Don't show admin user in list
}

export async function updateUser(
  userId: string,
  updates: Partial<User>,
  updatedBy: User
): Promise<User> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!hasPermission(updatedBy, "users:update")) {
    throw new Error(
      "Unauthorized: Only administrators can update user accounts"
    );
  }

  const userIndex = mockUsers.findIndex((u) => u.id === userId);
  if (userIndex === -1) {
    throw new Error("User not found");
  }

  mockUsers[userIndex] = { ...mockUsers[userIndex], ...updates };
  return mockUsers[userIndex];
}

export async function deleteUser(
  userId: string,
  deletedBy: User
): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (!hasPermission(deletedBy, "users:delete")) {
    throw new Error(
      "Unauthorized: Only administrators can delete user accounts"
    );
  }

  const userIndex = mockUsers.findIndex((u) => u.id === userId);
  if (userIndex === -1) {
    throw new Error("User not found");
  }

  // Don't allow deleting admin user
  if (mockUsers[userIndex].role === "admin") {
    throw new Error("Cannot delete administrator account");
  }

  mockUsers.splice(userIndex, 1);
}