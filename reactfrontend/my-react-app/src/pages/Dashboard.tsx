import { useState, useEffect } from 'react'
import { fetchTasks } from '../lib/api'
import TaskDashboard from '../components/tasks/TaskDashboard'
import { useAuth } from '../contexts/AuthContext'
import toast from 'react-hot-toast'
import type { Task } from '../lib/api'

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const { logout } = useAuth()

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true)
        const fetchedTasks = await fetchTasks()
        setTasks(fetchedTasks)
      } catch (error: any) {
        console.error('Failed to fetch tasks:', error)
        toast.error('Failed to load tasks. Please try again.')

        // If unauthorized, logout
        if (error.response?.status === 401) {
          logout()
        }
      } finally {
        setLoading(false)
      }
    }

    loadTasks()
  }, [logout])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        <span className="ml-2">Loading tasks...</span>
      </div>
    )
  }

  return <TaskDashboard initialTasks={tasks} />
}