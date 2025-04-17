import { Button } from '@/components/ui/button';
import { AsymmetricImageGrid } from '@/components/ui/asymmetric-image-grid';

const emptyImages = [
  {
    url: '/images/tickets/empty-1.jpg',
    alt: '体験の様子1'
  },
  {
    url: '/images/tickets/empty-2.jpg',
    alt: '体験の様子2'
  },
  {
    url: '/images/tickets/empty-3.jpg',
    alt: '体験の様子3'
  }
];

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center text-center mt-8">
      <div className="w-[224px] h-[220px] mb-8">
        <AsymmetricImageGrid images={emptyImages} className="h-full" />
      </div>
      
      <h2 className="text-2xl font-bold mb-3">チケットはありません</h2>
      <p className="text-gray-600 mb-8">
        四国の素敵な88人と関わって<br />
        チケットをもらおう
      </p>
      
      <Button size="lg" className="w-full max-w-[400px] text-base font-bold">
        関わりをみつける
      </Button>
    </div>
  );
} 