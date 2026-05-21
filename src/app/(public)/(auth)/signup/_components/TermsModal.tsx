'use client';

import DocumentModal from '../../_components/DocumentModal';
import TermsContent from './TermsContent';

type TermsModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <DocumentModal isOpen={isOpen} onClose={onClose} title="치즈 이용약관">
      <TermsContent />
    </DocumentModal>
  );
}
