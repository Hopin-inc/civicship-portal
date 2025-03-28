import { FC } from 'react'
import { MapPin, Calendar, Users } from 'lucide-react'

interface SearchFormProps {
  onOpenModal: () => void
  selectedLocation?: string
  selectedDate?: Date
  selectedGuests?: number
}

const SearchForm: FC<SearchFormProps> = ({
  onOpenModal,
  selectedLocation,
  selectedDate,
  selectedGuests
}) => {
  return (
    <div className="w-full">
      <div className="flex flex-col space-y-4">
        <div 
          onClick={onOpenModal}
          className="flex items-center space-x-2 p-4 bg-white rounded-lg shadow cursor-pointer"
        >
          <MapPin className="h-5 w-5 text-gray-500" />
          <div className="flex-1">
            <div className="text-sm text-gray-500">どこに行きますか？</div>
            <div className="text-gray-700">
              {selectedLocation || '未定'}
            </div>
          </div>
        </div>

        <div 
          onClick={onOpenModal}
          className="flex items-center space-x-2 p-4 bg-white rounded-lg shadow cursor-pointer"
        >
          <Calendar className="h-5 w-5 text-gray-500" />
          <div className="flex-1">
            <div className="text-sm text-gray-500">日付</div>
            <div className="text-gray-700">
              {selectedDate ? selectedDate.toLocaleDateString() : '日付を追加'}
            </div>
          </div>
        </div>

        <div 
          onClick={onOpenModal}
          className="flex items-center space-x-2 p-4 bg-white rounded-lg shadow cursor-pointer"
        >
          <Users className="h-5 w-5 text-gray-500" />
          <div className="flex-1">
            <div className="text-sm text-gray-500">人数</div>
            <div className="text-gray-700">
              {selectedGuests ? `${selectedGuests}人` : '人数を指定'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchForm 