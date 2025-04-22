import axios from "axios";

// ─── AUTH TYPES & CALLS ──────────────────────────────────────────────────────

export interface UserCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

// ─── TASK TYPES ────────────────────────────────────────────────────────────────

export interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate: string;          // ISO date string
  priority: string;
  status: string
  // other fields if you have them, e.g. userId, priority, etc.
}

export interface TaskInput {
  title: string;
  description: string;
  completed?: boolean;
  dueDate: string;
  priority: string;
}

// ─── AXIOS INSTANCE ──────────────────────────────────────────────────────────

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── AUTH CALLS ───────────────────────────────────────────────────────────────

export const login = async (credentials: UserCredentials): Promise<string> => {
  const res = await API.post<{ token: string }>("/auth/login", credentials);
  return res.data.token;
};

export const register = async (userData: RegisterData): Promise<string> => {
  const res = await API.post<{ token: string }>("/auth/register", userData);
  return res.data.token;
};

// ─── TASK CALLS ───────────────────────────────────────────────────────────────

/**
 * Fetch all tasks.
 */
export const fetchTasks = async (): Promise<Task[]> => {
  const res = await API.get<Task[]>("/tasks");
  return res.data;
};

/**
 * Fetch a single task by its ID.
 */
export const fetchTaskById = async (id: string): Promise<Task> => {
  const res = await API.get<Task>(`/tasks/${id}`);
  return res.data;
};

/**
 * Create a new task.
 */
export const createTask = async (taskData: TaskInput): Promise<Task> => {
  const res = await API.post<Task>("/tasks", taskData);
  return res.data;
};

/**
 * Update an existing task.
 */
export const updateTask = async (id: string, taskData: TaskInput): Promise<Task> => {
  const res = await API.put<Task>(`/tasks/${id}`, taskData);
  return res.data;
};

/**
 * Delete a task.
 */
export const deleteTask = async (id: string): Promise<void> => {
  await API.delete(`/tasks/${id}`);
};

export default API;
