import { useMutation } from '@tanstack/react-query';

import { uploadFile } from '@/api/files.api';

export function useUploadFile() {
  return useMutation({
    mutationFn: uploadFile,
  });
}
