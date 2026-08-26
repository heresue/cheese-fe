import { useMutation } from '@tanstack/react-query';

import { sendEmailCode } from '@/api/auth.api';

export function useSendEmailCode() {
  return useMutation({
    mutationFn: sendEmailCode,
  });
}
