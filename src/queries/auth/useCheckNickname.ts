import { useMutation } from '@tanstack/react-query';

import { checkNickname } from '@/api/auth.api';

export function useCheckNickname() {
  return useMutation({
    mutationFn: checkNickname,
  });
}
