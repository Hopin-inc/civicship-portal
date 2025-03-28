import Image from 'next/image'
import SearchTrigger from '../components/search/SearchTrigger'
import OpportunityCard from '../components/features/discover/OpportunityCard'
import FeaturedSection from '../components/features/discover/FeaturedSection'

const SAMPLE_OPPORTUNITIES = [
  {
    id: 1,
    title: '解体屋さんから廃材を授かる会',
    price: 2000,
    location: '高松市',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96',
  },
  {
    id: 2,
    title: '古民家でお茶会体験',
    price: 3500,
    location: '丸亀市',
    imageUrl: 'https://images.unsplash.com/photo-1545579133-99bb5ab189bd',
  },
  {
    id: 3,
    title: '地元漁師と行く朝市ツアー',
    price: 4000,
    location: '坂出市',
    imageUrl: 'https://images.unsplash.com/photo-1595475207225-428b62bda831',
  },
  {
    id: 4,
    title: '讃岐うどん打ち体験',
    price: 5000,
    location: '善通寺市',
    imageUrl: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624',
  },
  {
    id: 5,
    title: 'オリーブ収穫体験',
    price: 3000,
    location: '小豆島',
    imageUrl: 'https://images.unsplash.com/photo-1445772022590-54c27e67c049',
  },
  {
    id: 6,
    title: '瀬戸内海釣り体験',
    price: 6000,
    location: '観音寺市',
    imageUrl: 'https://images.unsplash.com/photo-1500827015942-53a963056420',
  },
  {
    id: 7,
    title: '盆栽作り体験',
    price: 7000,
    location: '高松市',
    imageUrl: 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f',
  },
  {
    id: 8,
    title: '金刀比羅宮参拝ガイドツアー',
    price: 2500,
    location: 'こんぴら',
    imageUrl: 'https://images.unsplash.com/photo-1614566704030-fb4230ba8b8f',
  },
  {
    id: 9,
    title: '塩作り体験',
    price: 4500,
    location: '坂出市',
    imageUrl: 'https://images.unsplash.com/photo-1519500528352-2d1460777fee',
  },
  {
    id: 10,
    title: '骨董品市場ツアー',
    price: 3000,
    location: '高松市',
    imageUrl: 'https://images.unsplash.com/photo-1472289065668-ce650ac443d2',
  }
]

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="sticky top-0 z-10 bg-white px-4 py-3 shadow-sm">
        <SearchTrigger />
      </div>
      
      {/* おすすめの体験一覧 */}
      <FeaturedSection opportunities={SAMPLE_OPPORTUNITIES.slice(0, 5)} />

      {/* もうすぐ開催 */}
      <section className="mt-8 px-4">
        <h2 className="text-xl font-bold">もうすぐ開催</h2>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {SAMPLE_OPPORTUNITIES.slice(0, 5).map((opportunity) => (
            <OpportunityCard key={opportunity.id} {...opportunity} />
          ))}
        </div>
      </section>

      {/* 特集 */}
      <section className="mt-8 px-4">
        <h2 className="text-xl font-bold">特集</h2>
        <div className="mt-4 flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {SAMPLE_OPPORTUNITIES.slice(5, 10).map((opportunity) => (
            <OpportunityCard key={opportunity.id} {...opportunity} />
          ))}
        </div>
      </section>

      {/* すべての体験 */}
      <section className="mt-8 px-4 pb-8">
        <h2 className="text-xl font-bold">すべての体験</h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {SAMPLE_OPPORTUNITIES.map((opportunity) => (
            <OpportunityCard key={opportunity.id} {...opportunity} vertical />
          ))}
        </div>
      </section>
    </div>
  )
}
