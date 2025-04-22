import { Circle, Clock, CheckCircle, LayoutGrid } from 'lucide-react'

interface TaskFilterProps {
  currentFilter: string
  onFilterChange: (filter: string) => void
}

export default function TaskFilter({ currentFilter, onFilterChange }: TaskFilterProps) {
  const filters = [
    { id: 'all', label: 'All Tasks', icon: LayoutGrid },
    { id: 'todo', label: 'To Do', icon: Circle },
    { id: 'in-progress', label: 'In Progress', icon: Clock },
    { id: 'completed', label: 'Completed', icon: CheckCircle },
  ]

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => {
        const Icon = filter.icon
        return (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-3 py-2 text-sm rounded-md flex items-center gap-2 ${
              currentFilter === filter.id
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 hover:bg-gray-100'
            }`}
          >
            <Icon size={16} />
            {filter.label}
          </button>
        )
      })}
    </div>
  )
}