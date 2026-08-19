/**
 * 로그인 API 연결 전, 개발 환경에서만 게스트 ID를 반환한다.
 * 운영 환경에서는 백엔드 세션으로 인증된 사용자 ID를 사용해야 한다.
 */
export function getCurrentUserId() {
  if (process.env.NODE_ENV !== 'development') {
    throw new Error('개발용 게스트 ID는 운영 환경에서 사용할 수 없습니다.');
  }

  const userId = process.env.NEXT_PUBLIC_DEV_GUEST_USER_ID?.trim();

  if (!userId) {
    throw new Error('NEXT_PUBLIC_DEV_GUEST_USER_ID가 설정되지 않았습니다.');
  }

  return userId;
}
