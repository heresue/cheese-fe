'use client';

import DocumentPopup from '@/components/common/Popup/DocumentPopup';
import TermsContent from './TermsContent';

type TermsPopupProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function TermsPopup({ isOpen, onClose }: TermsPopupProps) {
  return (
    <DocumentPopup isOpen={isOpen} onClose={onClose} title="치즈 이용약관">
      <TermsContent />
    </DocumentPopup>
  );
}
