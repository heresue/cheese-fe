import { Button } from '@/components/common/Button';
import { BaseModal } from '@/components/common/Modal';

import CloseIcon from '@/assets/icons/common/close.svg';
import ShareIcon from '@/assets/icons/common/contact.svg';
import EditIcon from '@/assets/icons/common/edit.svg';

type ApplyModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ApplyModal({ isOpen, onClose }: ApplyModalProps) {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <section className="bg-bg-white flex w-[540px] flex-col gap-[10px] rounded-xl border border-gray-400 px-8 pt-5 pb-15">
        <header className="flex justify-end">
          <button type="button" onClick={onClose} aria-label="닫기" className="py-[7px]">
            <CloseIcon className="w-4 text-gray-700" />
          </button>
        </header>

        <div className="flex flex-col gap-6">
          {/* contents */}
          <div className="flex flex-col gap-[26px]">
            <div>
              <h2 className="text-[24px] leading-6 font-bold">
                2026년 스타트업 인턴 부문 경력직 채용
              </h2>
              <p className="text-[12px] leading-5 text-gray-600">
                아래의 정보가 상대방에게 전달됩니다
              </p>
            </div>

            <div className="flex flex-col gap-6">
              <section className="flex flex-col gap-5">
                <h3 className="font-bold">이력서, 기타문서, 자기소개서</h3>

                <div className="flex justify-between px-3">
                  <ul className="flex flex-col gap-2 text-[14px] leading-[30px]">
                    {/* 사용자가 마이페이지에 등록한 이력서, 기타문서, 자기소개서 파일들 */}
                    <li>김치즈 포트폴리오 URL</li>
                    <li>김치즈 자기소개서</li>
                    <li>김치즈 이력서</li>
                  </ul>

                  <Button
                    variant="outlineLightGray"
                    size={38}
                    paddingX={9}
                    className="gap-[7px] text-gray-500"
                  >
                    <EditIcon className="w-[14px]" />
                    변경
                  </Button>
                </div>
              </section>

              <section className="flex flex-col gap-5">
                <h3 className="font-bold">내 이메일, 주소</h3>
                <div className="flex justify-between px-3">
                  <ul className="flex flex-col gap-2 text-[14px] leading-[30px] text-gray-700">
                    {/* 사용자가 마이페이지에 등록한 이메일, 주소 정보 */}
                    <li>cheese@gmail.com</li>
                    <li>서울특별시</li>
                  </ul>
                  <Button
                    variant="outlineLightGray"
                    size={38}
                    paddingX={9}
                    className="gap-[7px] text-gray-500"
                  >
                    <EditIcon className="w-[14px]" />
                    변경
                  </Button>
                </div>
              </section>
            </div>
          </div>

          {/* 안내사항 */}
          <div className="bg-bg-3 rounded-[10px] p-3">
            <ul className="list-disc pl-5 text-[12px] leading-5 text-gray-700">
              <li>개인정보 제출에 동의할 경우에만 [지원하기]를 진행해주세요</li>
              <li>동의하지 않을 경우 지원이 불가능합니다</li>
              <li>[지원하기]를 진행하시면 개인정보 제공에 대한 설명을 숙지하신걸로 판단합니다</li>
            </ul>
          </div>

          {/* 지원하기 버튼 */}
          <footer className="flex justify-center">
            <Button size={54} width={182} className="flex gap-3">
              <ShareIcon className="h-[13px]" />
              지원하기
            </Button>
          </footer>
        </div>
      </section>
    </BaseModal>
  );
}
