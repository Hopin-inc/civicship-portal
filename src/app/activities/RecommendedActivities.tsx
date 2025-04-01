'use client'

export const RecommendedActivities = () => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">おすすめの関わり</h3>
        <span className="text-sm text-blue-500">2</span>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg overflow-hidden">
          <div className="relative aspect-square">
            <img
              src="/images/activities/newyork.jpg"
              alt="伝統建築が作り出す写真館"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="p-2">
            <p className="text-sm font-medium line-clamp-2">伝統建築が作り出す写真館</p>
            <p className="text-xs text-gray-600">最後は音楽プリント</p>
            <p className="text-xs text-gray-600">6,000ポイント</p>
          </div>
        </div>
        <div className="rounded-lg overflow-hidden">
          <div className="relative aspect-square">
            <img
              src="/images/activities/lantern.jpg"
              alt="明知に古道で提灯は野うさぎクラフトづくり"
              className="object-cover w-full h-full"
            />
          </div>
          <div className="p-2">
            <p className="text-sm font-medium line-clamp-2">明知に古道で提灯は野うさぎクラフトづくり</p>
            <p className="text-xs text-gray-600">坂出市（香川県）</p>
          </div>
        </div>
      </div>
    </div>
  )
} 