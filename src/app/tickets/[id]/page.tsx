import Image from 'next/image'

interface TicketProps {
  hostName: string;
  ticketCount: number;
  purpose: string;
  requests: string[];
}

export default function TicketDetailPage() {
  // This would normally come from an API or database
  const ticketData: TicketProps = {
    hostName: "田中 花子",
    ticketCount: 2,
    purpose: "田中花子さんが主催する\n体験に無料参加できる",
    requests: [
      "だれが誘ってくれると嬉しい。",
      "当日の様子を写真に撮って、投稿しよう。関わりを残せるよ。"
    ]
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex-1 text-center">
            <h1 className="text-lg font-medium">NEO88祭</h1>
            <p className="text-xs text-gray-500">https://app.kyosodao.io/</p>
          </div>
          <div className="flex items-center space-x-4 absolute right-4">
            <button className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
            <button className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20 px-4 pb-6">
        <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-xl mb-1">
              {ticketData.hostName}さんから
            </h2>
            <p>招待チケットが届きました</p>
          </div>

          <div className="flex justify-center mb-8">
            <div className="w-32 h-32 rounded-full overflow-hidden relative">
              <Image
                src="/placeholder-profile.jpg"
                alt="Host profile"
                fill
                className="object-cover"
              />
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex">
              <span className="text-gray-600 w-16">枚数</span>
              <span>{ticketData.ticketCount}枚</span>
            </div>
            
            <div className="flex">
              <span className="text-gray-600 w-16">用途</span>
              <span className="whitespace-pre-line flex-1">{ticketData.purpose}</span>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg mb-8 relative">
            <h3 className="font-bold mb-3">
              お願い🙏
            </h3>
            <ul className="space-y-2">
              {ticketData.requests.map((request, index) => (
                <li key={index} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{request}</span>
                </li>
              ))}
            </ul>
          </div>

          <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-full font-bold hover:bg-blue-700 transition-colors">
            関わりを見つける
          </button>
        </div>
      </main>
    </div>
  );
}
