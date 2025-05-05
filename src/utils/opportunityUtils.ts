import { Opportunity } from '@/types';
import { OpportunityCardProps } from '@/components/features/opportunity/OpportunityCard';

export const mapOpportunityToCardProps = (node: Opportunity): OpportunityCardProps => ({
  id: node.id,
  title: node.title,
  price: node.feeRequired || null,
  location: node.place?.name || '場所未定',
  imageUrl: node.images?.[0] || null,
  community: {
    id: node.community?.id || '',
  },
  isReservableWithTicket: node.isReservableWithTicket || false,
});
