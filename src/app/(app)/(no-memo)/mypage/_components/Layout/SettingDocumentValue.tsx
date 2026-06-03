import FileIcon from '@/assets/icons/settings/applications.svg';
import LinkIcon from '@/assets/icons/link.svg';

import type { ProfileDocument } from '../Profiles/types';

export default function SettingDocumentValue({ document }: { document: ProfileDocument }) {
  return (
    <div className="flex flex-col">
      {document.fileUrl && (
        <div className="inline-flex items-center gap-2">
          <FileIcon className="h-3 w-3 text-gray-500" />

          <a
            href={document.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-success leading-[30px] underline"
          >
            {document.fileName}
          </a>
        </div>
      )}

      {document.url && (
        <div className="inline-flex items-center gap-2">
          <LinkIcon className="h-3 w-3 text-gray-500" />

          <a
            href={document.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-success leading-[30px] underline"
          >
            {document.urlLabel}
          </a>
        </div>
      )}
    </div>
  );
}
