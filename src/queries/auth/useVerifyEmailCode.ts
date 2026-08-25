import { verifyEmailCode } from '@/api/auth.api';
import { useMutation } from '@tanstack/react-query';

export function useVerifyEmailCode() {
  return useMutation({
    mutationFn: verifyEmailCode,
  });
}
