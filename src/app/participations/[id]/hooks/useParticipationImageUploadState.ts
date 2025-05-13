'use client';

import { useState, useCallback } from 'react';

export const useParticipationImageUploadState = () => {
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isAddPhotosModalOpen, setIsAddPhotosModalOpen] = useState<boolean>(false);

  const handleUploadSuccess = useCallback(() => {
    setUploadSuccess(true);
    setUploadError(null);
    setIsAddPhotosModalOpen(false);
    setTimeout(() => setUploadSuccess(false), 3000);
  }, []);

  const handleUploadError = useCallback((error: string) => {
    setUploadError(error);
    setTimeout(() => setUploadError(null), 3000);
  }, []);

  const togglePhotosModal = useCallback(() => {
    setIsAddPhotosModalOpen(prev => !prev);
  }, []);

  return {
    uploadSuccess,
    uploadError,
    isAddPhotosModalOpen,
    handleUploadSuccess,
    handleUploadError,
    togglePhotosModal,
  };
};
