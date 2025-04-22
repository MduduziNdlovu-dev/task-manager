import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createTask, updateTask, deleteTask, Task, TaskInput } from '../../lib/api'
import TaskList from './TaskList'
import TaskForm from './TaskForm'
import TaskFilter from './TaskFilter'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { PlusCircle, LogOut } from 'lucide-react'

interface TaskDashboardProps {
  initialTasks: Task[]
}

interface LoadingState {
  create: boolean
  update: boolean
  delete: boolean
}

export default function TaskDashboard({ initialTasks }: TaskDashboardProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState<LoadingState>({
    create: false,
    update: false,
    delete: false,
  })

  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const addTask = async (taskData: TaskInput) => {
    try {
      setLoading((prev) => ({ ...prev, create: true }))

      // Set default values for status if not provided
      if (!taskData.status) {
        taskData.status = 'todo'
      }

      const newTask = await createTask(taskData)
      setTasks([...tasks, newTask])
      setIsFormOpen(false)

      toast.success('Task created successfully')
    } catch (error: any) {
      console.error('Failed to create task:', error)
      toast.error('Failed to create task. Please try again.')

      // Handle unauthorized
      if (error.response?.status === 401) {
        logout()
      }
    } finally {
      setLoading((prev) => ({ ...prev, create: false }))
    }
  }

  const updateTaskHandler = async (task: Task | TaskInput): Promise<void> => {
    const _id = task._id;
    if (!_id) throw new Error("Task ID is required for update.");
  
    const { _id: omit, ...rest } = task;
  
    setLoading(prev => ({ ...prev, update: true }));
    try {
      const updated = await updateTask(_id, rest); // rest is TaskInput
      setTasks(ts => ts.map(t => t._id === _id ? updated : t));
      setIsFormOpen(false);
      toast.success("Task updated");
    } finally {
      setLoading(prev => ({ ...prev, update: false }));
    }
  };
  

  const deleteTaskHandler = async (id: string) => {
    try {
      setLoading((prev) => ({ ...prev, delete: true }))

      await deleteTask(id)
      setTasks(tasks.filter((task) => task._id !== id))

      toast.success('Task deleted successfully')
    } catch (error: any) {
      console.error('Failed to delete task:', error)
      toast.error('Failed to delete task. Please try again.')

      // Handle unauthorized
      if (error.response?.status === 401) {
        logout()
      }
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }))
    }
  }

  const startEditTask = (task: Task) => {
    setEditingTask(task)
    setIsFormOpen(true)
  }

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true
    if (filter === 'completed') return task.completed
    return task.status === filter
  })

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold">Task Manager</h1>
            <p className="text-gray-500">Manage your tasks and stay organized.</p>
          </div>
          <button
            className="px-3 py-2 border rounded-md flex items-center gap-2 hover:bg-gray-100"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>

        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <TaskFilter currentFilter={filter} onFilterChange={setFilter} />
          <button
            onClick={() => setIsFormOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center justify-center gap-2 hover:bg-blue-700"
          >
            <PlusCircle size={16} />
            Add Task
          </button>
        </div>

        <TaskList
          tasks={filteredTasks}
          onEdit={startEditTask}
          onDelete={deleteTaskHandler}
          onUpdate={updateTaskHandler}
          loading={loading}
        />

        <TaskForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false)
            setEditingTask(null)
          }}
          onSubmit={editingTask ? updateTaskHandler : addTask}
          task={editingTask}
          loading={loading.create || loading.update}
        />
      </div>
    </div>
  )
}