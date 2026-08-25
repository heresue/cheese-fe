import { apiClient } from '@/api/client';

export type UploadedFile = {
  id: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
};

type UploadFileParams = {
  userId: string;
  file: File;
};

export function uploadFile({ userId, file }: UploadFileParams) {
  const formData = new FormData();
  formData.append('file', file);

  return apiClient<UploadedFile>('/backend-api/files', {
    method: 'POST',
    query: { userId },
    body: formData,
  });
}
