import TaskCard from './TaskCard'
import type { Task } from '../../lib/api'

interface LoadingState {
  create: boolean
  update: boolean
  delete: boolean
}

interface TaskListProps {
  tasks: Task[]
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
  onUpdate: (task: Task) => void
  loading: LoadingState
}

export default function TaskList({ tasks, onEdit, onDelete, onUpdate, loading }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg border-dashed">
        <h3 className="text-lg font-medium">No tasks found</h3>
        <p className="text-sm text-gray-500 mt-1">Get started by creating a new task.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
          onUpdate={onUpdate}
          loading={loading}
        />
      ))}
    </div>
  )
}