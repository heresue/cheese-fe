import { resetPassword } from '@/api/auth.api';
import { useMutation } from '@tanstack/react-query';

export function useResetPassword() {
  return useMutation({
    mutationFn: resetPassword,
  });
}
