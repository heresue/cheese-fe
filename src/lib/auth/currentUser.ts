/**
 * 로그인 API 연결 전에는 개발용 게스트 ID를 반환한다.
 * 로그인 연결 후에는 이 함수의 구현만 인증 상태의 사용자 ID로 교체한다.
 */
export function getCurrentUserId() {
  const userId = process.env.NEXT_PUBLIC_DEV_GUEST_USER_ID?.trim();

  if (!userId) {
    throw new Error('NEXT_PUBLIC_DEV_GUEST_USER_ID가 설정되지 않았습니다.');
  }

  return userId;
}
