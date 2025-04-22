import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { format } from 'date-fns'
import type { Task, TaskInput } from '../../lib/api'

interface TaskFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (task: Task | TaskInput) => Promise<void>
  task?: Task | null
  loading: boolean
}

interface FormErrors {
  title?: string
  dueDate?: string
}

export default function TaskForm({ isOpen, onClose, onSubmit, task, loading }: TaskFormProps) {
  const [formData, setFormData] = useState<TaskInput>({
    title: '',
    description: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    priority: 'medium',
    status: 'todo',
  })

  const [errors, setErrors] = useState<FormErrors>({
    title: '',
    dueDate: '',
  })

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      // Format the date for the input field (YYYY-MM-DD)
      const formattedDate = task.dueDate ? format(new Date(task.dueDate), 'yyyy-MM-dd') : ''

      setFormData({
        title: task.title,
        description: task.description,
        dueDate: formattedDate,
        priority: task.priority,
        status: task.status,
      })
    } else {
      setFormData({
        title: '',
        description: '',
        dueDate: format(new Date(), 'yyyy-MM-dd'),
        priority: 'medium',
        status: 'todo',
      })
    }
    setErrors({ title: '', dueDate: '' })
  }, [task, isOpen])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when user types
    if (name === 'title' && value.trim() !== '') {
      setErrors((prev) => ({ ...prev, title: '' }))
    }
    if (name === 'dueDate' && value.trim() !== '') {
      setErrors((prev) => ({ ...prev, dueDate: '' }))
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors: FormErrors = { title: '', dueDate: '' }
    let hasErrors = false

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
      hasErrors = true
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required'
      hasErrors = true
    }

    if (hasErrors) {
      setErrors(newErrors)
      return
    }

    if (task) {
      onSubmit({ ...task, ...formData })
    } else {
      onSubmit(formData)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-semibold">{task ? 'Edit Task' : 'Create New Task'}</h2>
        <p className="text-sm text-gray-500 mt-1">
          {task ? 'Update your task details below.' : 'Fill out the form below to create a new task.'}
        </p>
        
        <form onSubmit={handleSubmit} className="mt-4">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`mt-1 w-full px-3 py-2 border rounded-md ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter task title"
                disabled={loading}
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter task description (optional)"
                rows={4}
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="dueDate" className="block text-sm font-medium">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                id="dueDate"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
                className={`mt-1 w-full px-3 py-2 border rounded-md ${
                  errors.dueDate ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.dueDate && <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="priority" className="block text-sm font-medium">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled={loading}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md"
                  disabled={loading}
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⟳</span>
                  {task ? 'Updating...' : 'Creating...'}
                </>
              ) : task ? (
                'Update Task'
              ) : (
                'Create Task'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}