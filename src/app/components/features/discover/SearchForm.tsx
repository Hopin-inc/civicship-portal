import { Search } from 'lucide-react'

export default function SearchForm() {
  return (
    <div className="w-full px-4 py-2">
      <div className="relative">
        <input
          type="text"
          placeholder="タップして検索する"
          className="w-full rounded-full border border-gray-300 py-2 pl-10 pr-4 focus:border-primary focus:outline-none"
        />
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
      </div>
    </div>
  )
} 