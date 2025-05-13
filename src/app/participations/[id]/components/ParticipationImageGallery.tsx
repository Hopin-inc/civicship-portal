import React from 'react';
import { ParticipationImageGalleryClient } from './ParticipationImageGalleryClient';

interface ParticipationImageGalleryProps {
  images: string[];
}

export const ParticipationImageGallery: React.FC<ParticipationImageGalleryProps> = ({
  images,
}) => {
  if (!images || images.length === 0) return null;
  
  return <ParticipationImageGalleryClient images={images} />;
};

export default ParticipationImageGallery;
