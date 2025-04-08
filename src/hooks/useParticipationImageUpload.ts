import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { PARTICIPATION_IMAGE_BULK_UPDATE } from '@/graphql/mutations/participationImage';
import { filesToBase64 } from '@/utils/file';
import { ImageInput } from '@/gql/graphql';
import { useAuth } from '@/contexts/AuthContext';

interface UseParticipationImageUploadProps {
  participationId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export const useParticipationImageUpload = ({
  participationId,
  onSuccess,
  onError,
}: UseParticipationImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const [bulkUpdateImages] = useMutation(PARTICIPATION_IMAGE_BULK_UPDATE, {
    onCompleted: () => {
      setIsUploading(false);
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      setIsUploading(false);
      setError(error);
      if (onError) onError(error);
    },
  });

  const uploadImages = async (files: File[], comment?: string) => {
    try {
      if (!user?.id) {
        throw new Error('ユーザーが認証されていません');
      }

      setIsUploading(true);
      setError(null);

      // Convert files to base64
      const base64Strings = await filesToBase64(files);

      // Create image inputs
      const imageInputs: ImageInput[] = base64Strings.map((base64, index) => ({
        base64,
        caption: comment || undefined,
      }));

      // Upload images
      await bulkUpdateImages({
        variables: {
          input: {
            participationId,
            create: imageInputs,
          },
          permission: {
            userId: user.id,
          },
        },
      });
    } catch (err) {
      setIsUploading(false);
      const error = err instanceof Error ? err : new Error('Failed to upload images');
      setError(error);
      if (onError) onError(error);
    }
  };

  return {
    uploadImages,
    isUploading,
    error,
  };
}; 