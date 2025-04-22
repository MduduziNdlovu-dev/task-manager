import { useState } from 'react'
import { format } from 'date-fns'
import { CheckCircle, Circle, Clock, AlertTriangle, Pencil, Trash2 } from 'lucide-react'
import type { Task } from '../../lib/api'

interface LoadingState {
  create: boolean
  update: boolean
  delete: boolean
}

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onUpdate: (task: Task) => void
  loading: LoadingState
}

export default function TaskCard({ task, onEdit, onDelete, onUpdate, loading }: TaskCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'todo':
        return <Circle size={16} />
      case 'in-progress':
        return <Clock size={16} />
      case 'completed':
        return <CheckCircle size={16} />
      default:
        return <Circle size={16} />
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            <AlertTriangle size={12} className="mr-1" />
            High
          </span>
        )
      case 'medium':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            Medium
          </span>
        )
      case 'low':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Low
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            {priority}
          </span>
        )
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'todo':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            To Do
          </span>
        )
      case 'in-progress':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            In Progress
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            Completed
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        )
    }
  }

  const updateStatus = (newStatus: string) => {
    onUpdate({ ...task, status: newStatus })
  }

  const toggleCompleted = () => {
    onUpdate({ ...task, completed: !task.completed })
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No due date'
    try {
      return format(new Date(dateString), 'MMM d, yyyy')
    } catch (error) {
      return dateString
    }
  }

  const isOverdue = (dateString: string) => {
    if (!dateString) return false
    const dueDate = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    dueDate.setHours(0, 0, 0, 0)
    return dueDate < today && !task.completed
  }

  return (
    <>
      <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 ${task.completed ? 'opacity-75' : ''}`}>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <h3 className={`text-lg font-semibold line-clamp-2 ${task.completed ? 'line-through text-gray-500' : ''}`}>
              {task.title}
            </h3>
            <div className="relative">
              <button
                onClick={() => setIsDeleteDialogOpen(true)}
                className="p-1 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100"
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={() => onEdit(task)}
                className="p-1 text-gray-500 hover:text-blue-500 rounded-full hover:bg-gray-100 ml-1"
              >
                <Pencil size={16} />
              </button>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {getStatusBadge(task.status)}
            {getPriorityBadge(task.priority)}
            <button
              className="text-xs text-blue-600 hover:underline"
              onClick={toggleCompleted}
              disabled={loading.update}
            >
              {task.completed ? 'Mark Incomplete' : 'Mark Complete'}
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-3 line-clamp-3">{task.description || 'No description provided.'}</p>
          <div className="mt-3 flex items-center">
            <span
              className={`text-xs ${isOverdue(task.dueDate) ? 'text-red-500 font-medium' : 'text-gray-500'}`}
            >
              {isOverdue(task.dueDate) ? 'Overdue: ' : 'Due: '}
              {formatDate(task.dueDate)}
            </span>
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 border-t">
          <div className="relative">
            <select
              value={task.status}
              onChange={(e) => updateStatus(e.target.value)}
              disabled={loading.update}
              className="w-full px-3 py-2 border rounded-md text-sm appearance-none bg-white pr-8"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {isDeleteDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium">Are you sure?</h3>
            <p className="mt-2 text-sm text-gray-500">
              This action cannot be undone. This will permanently delete the task.
            </p>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(task._id)
                  setIsDeleteDialogOpen(false)
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                disabled={loading.delete}
              >
                {loading.delete ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}