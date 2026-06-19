import { DocumentLinkItem } from '@/components/common/DocumentLinkItem';

import { cn } from '@/lib/cn';

import FileIcon from '@/assets/icons/common/file.svg';
import LinkIcon from '@/assets/icons/common/link.svg';

import type { ProfileDocument } from '../Profiles/types';

type SettingDocumentValueProps = {
  document: ProfileDocument;
  className?: string;
};

export default function SettingDocumentValue({ document, className }: SettingDocumentValueProps) {
  return (
    <div className={cn('flex flex-col', className)}>
      {document.fileUrl && (
        <DocumentLinkItem
          href={document.fileUrl}
          label={document.fileName}
          icon={<FileIcon className="h-3 w-3 text-gray-500" />}
        />
      )}

      {document.url && (
        <DocumentLinkItem
          href={document.url}
          label={document.urlLabel ?? document.url}
          icon={<LinkIcon className="h-3 w-3 text-gray-500" />}
        />
      )}
    </div>
  );
}
