'use client';

import { useState } from 'react';
import { Button } from '@/components/common/Button';
import { Input, InputActionButton } from '@/components/common/Input';
import DocumentPopup from '@/components/common/Popup/DocumentPopup';
import ConfirmPopup from '@/components/common/Popup/ConfirmPopup';
import { Checkbox } from '@/components/common/Checkbox';

export default function TestPage() {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const openTerms = () => setIsTermsOpen(true);
  const closeTerms = () => setIsTermsOpen(false);

  const openConfirm = () => setIsConfirmOpen(true);
  const closeConfirm = () => setIsConfirmOpen(false);

  return (
    <div className="flex items-start justify-center gap-12 p-10">
      <section className="flex w-[440px] flex-col justify-center gap-5">
        <h1 className="font-bold">Button Component</h1>

        <div className="flex flex-col gap-3">
          <Button onClick={openTerms}>약관 팝업 열기</Button>
          <Button onClick={openConfirm}>확인 팝업 열기</Button>
        </div>

        <div className="bg-white p-4">
          <Button variant="circle" aria-label="Google로 로그인">
            <img src="/icons/google.svg" alt="" className="h-5 w-5" />
          </Button>
        </div>

        <h1 className="font-bold">Checkbox Component</h1>

        <Checkbox />
        <Checkbox checked />
      </section>

      <section className="flex w-[440px] flex-col justify-center gap-5">
        <h2 className="font-bold">Input Component</h2>

        <Input />
        <Input placeholder="플레이스홀더" />
        <Input disabled value={'disabled'} />
        <Input errorMessage="경고문구" />
        <Input successMessage="성공문구" />
        <Input rightAddon={<InputActionButton>인증하기</InputActionButton>} />
      </section>

      {/* DocumentPopup */}
      <DocumentPopup isOpen={isTermsOpen} onClose={closeTerms} title="치즈 이용약관">
        <div className="text-text text-left text-[14px] leading-[22px]">
          <p className="whitespace-pre-wrap">
            본 이용약관(이하 “약관”)은 치즈(이하 “회사”)가 제공하는 치즈 서비스(이하 “서비스”)의
            이용과 관련하여 회사와 이용자 간의 권리·의무 및 책임사항, 기타 필요한 사항을 규정합니다.
          </p>

          <div className="my-6 h-px w-full bg-gray-200" />

          <h3 className="text-[16px] font-bold">제1조 (목적)</h3>
          <p className="mt-2">
            이 약관은 서비스의 이용 조건 및 절차, 회사와 이용자의 권리·의무 및 책임사항, 서비스
            이용과 관련된 기본적인 사항을 규정함을 목적으로 합니다.
          </p>

          <h3 className="mt-6 text-[16px] font-bold">제2조 (정의)</h3>
          <p className="mt-2">이 약관에서 사용하는 용어의 정의는 다음과 같습니다.</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>“회사”란 서비스를 운영하고 제공하는 주체를 의미합니다.</li>
            <li>“서비스”란 회사가 제공하는 웹사이트 및 관련 기능 전반을 의미합니다.</li>
            <li>“이용자”란 본 약관에 따라 서비스를 이용하는 회원 또는 비회원을 의미합니다.</li>
            <li>“회원”이란 계정을 생성하여 서비스를 이용하는 자를 의미합니다.</li>
            <li>
              “콘텐츠”란 이용자가 서비스 내에 게시하거나 제공하는 글, 이미지, 파일 등을 의미합니다.
            </li>
          </ul>

          <h3 className="mt-6 text-[16px] font-bold">제3조 (약관의 효력 및 변경)</h3>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>
              본 약관은 서비스 화면에 게시하거나 기타의 방법으로 이용자에게 공지함으로써 효력이
              발생합니다.
            </li>
            <li>
              회사는 관련 법령을 위반하지 않는 범위에서 약관을 변경할 수 있으며, 변경 시 적용일자 및
              변경사유를 명시하여 사전 공지합니다.
            </li>
            <li>
              이용자는 변경된 약관에 동의하지 않을 경우 서비스 이용을 중단하고 회원 탈퇴를 요청할 수
              있습니다. 변경 공지 후 일정 기간 내에 명시적 거부 의사를 표시하지 않는 경우, 변경
              약관에 동의한 것으로 간주될 수 있습니다(테스트 문구).
            </li>
          </ol>

          <h3 className="mt-6 text-[16px] font-bold">제4조 (회원가입)</h3>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>
              회원가입은 이용자가 약관에 동의하고 회사가 정한 절차에 따라 계정을 생성하면
              완료됩니다.
            </li>
            <li>
              회사는 다음 각 호에 해당하는 경우 회원가입을 거부하거나 사후에 취소할 수 있습니다.
            </li>
          </ol>
          <ul className="mt-3 list-disc space-y-1 pl-10">
            <li>타인의 정보를 도용한 경우</li>
            <li>허위 정보를 입력한 경우</li>
            <li>서비스 운영을 고의로 방해하거나 정상적인 제공에 지장을 주는 경우</li>
          </ul>

          <h3 className="mt-6 text-[16px] font-bold">제5조 (서비스 제공 및 변경)</h3>
          <p className="mt-2">회사는 다음의 서비스를 제공합니다(테스트용 예시).</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>치즈 웹서비스 관련 기능</li>
            <li>콘텐츠 게시 및 공유 기능</li>
            <li>기타 회사가 정하는 기능</li>
          </ul>
          <p className="mt-3">
            회사는 서비스 개선을 위해 기능을 추가·변경할 수 있으며, 필요한 경우 사전 공지 또는 사후
            공지할 수 있습니다(테스트 문구).
          </p>

          <h3 className="mt-6 text-[16px] font-bold">제6조 (서비스 이용의 제한)</h3>
          <p className="mt-2">회사는 아래에 해당하는 경우 서비스 이용을 제한할 수 있습니다.</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>법령 또는 공공질서에 위반되는 행위</li>
            <li>타인의 권리를 침해하는 행위</li>
            <li>서비스 운영을 방해하는 행위</li>
            <li>계정 도용, 비정상적인 접근 시도 등 보안상 위험이 있는 행위(테스트 문구)</li>
          </ul>
          <p className="mt-3">
            이용 제한 사유가 해소되지 않거나 중대한 위반이 확인되는 경우, 회사는 계정 이용을 정지
            또는 삭제할 수 있습니다.
          </p>

          <h3 className="mt-6 text-[16px] font-bold">제7조 (이용자의 의무)</h3>
          <p className="mt-2">이용자는 다음과 같은 행위를 해서는 안 됩니다.</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            <li>타인의 정보 도용</li>
            <li>불법 또는 유해 콘텐츠 게시</li>
            <li>서비스의 정상 운영을 방해하는 행위</li>
            <li>회사 및 제3자의 지식재산권 침해</li>
            <li>광고·스팸·사기 등 부정 행위</li>
          </ul>

          <h3 className="mt-6 text-[16px] font-bold">제8조 (콘텐츠의 권리)</h3>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>이용자가 서비스에 게시한 콘텐츠의 권리는 이용자에게 있습니다.</li>
            <li>
              이용자는 회사가 서비스 운영, 품질 개선, 기능 제공, 홍보를 위해 필요한 범위에서 해당
              콘텐츠를 사용할 수 있도록 허락합니다(테스트 문구).
            </li>
            <li>불법 또는 유해 콘텐츠는 사전 통지 없이 삭제될 수 있습니다.</li>
          </ol>

          <h3 className="mt-6 text-[16px] font-bold">제9조 (개인정보 보호)</h3>
          <p className="mt-2">
            회사는 개인정보 보호 관련 법령을 준수하며, 개인정보 처리방침은 서비스 내 별도 페이지를
            통해 안내합니다.
          </p>

          <h3 className="mt-6 text-[16px] font-bold">제10조 (면책)</h3>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>
              회사는 천재지변, 시스템 장애, 통신 장애 등 불가항력 사유로 인해 서비스를 제공할 수
              없는 경우 책임을 지지 않습니다.
            </li>
            <li>
              회사는 이용자 간 또는 이용자와 제3자 간 분쟁에 개입하지 않으며, 이에 대한 책임을 지지
              않습니다(테스트 문구).
            </li>
            <li>
              이용자가 서비스 이용 중 발생한 손해에 대하여 회사는 고의 또는 중대한 과실이 없는 한
              책임을 지지 않습니다.
            </li>
          </ol>

          <h3 className="mt-6 text-[16px] font-bold">제11조 (분쟁 해결)</h3>
          <p className="mt-2">
            회사와 이용자 간 분쟁은 가능한 상호 협의하여 해결합니다. 협의가 이루어지지 않을 경우
            관련 법령 및 관할 법원에 따릅니다.
          </p>

          <div className="my-6 h-px w-full bg-gray-200" />

          <h3 className="text-[16px] font-bold">부칙</h3>
          <p className="mt-2">
            본 약관은 <span className="font-semibold">YYYY년 MM월 DD일</span>부터 시행합니다.
          </p>

          {/* 길이 테스트용 더미 문단 */}
          <p className="text-text-muted mt-6">
            (테스트용) 아래 문단은 스크롤 길이 테스트를 위한 더미 텍스트입니다. 실제 서비스에서는
            삭제해 주세요. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
            nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>
      </DocumentPopup>

      {/* ConfirmPopup */}
      <ConfirmPopup
        isOpen={isConfirmOpen}
        onClose={closeConfirm}
        title="비밀번호 변경 완료"
        description="비밀번호가 변경되었습니다"
        primaryText="로그인하러 가기"
        onPrimaryClick={() => {
          closeConfirm();
        }}
      ></ConfirmPopup>
    </div>
  );
}
