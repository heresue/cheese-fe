'use client';

import { useEffect, useRef, type ReactNode } from 'react';

import { Color, TextStyle } from '@tiptap/extension-text-style';
import ImageExtension from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Placeholder } from '@tiptap/extensions';

import LinkIcon from '@/assets/icons/common/link.svg';

type MemoRichEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

type ToolbarButtonProps = {
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: ReactNode;
  onClick: () => void;
};

const TEXT_COLORS = ['#111111', '#6B7280', '#EB5B49', '#F4A12C', '#9CC04B', '#5B9EF7', '#9B59D0'];

function cn(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(' ');
}

function ToolbarButton({ active, disabled, label, children, onClick }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex h-[32px] min-w-[32px] items-center justify-center rounded-[4px] px-[6px] text-[18px] leading-none font-medium transition-colors',
        active
          ? 'bg-gray-200 text-gray-950'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-950',
        disabled && 'cursor-not-allowed opacity-40',
      )}
    >
      {children}
    </button>
  );
}

function AlignLeftIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-[20px] w-[20px]">
      <path
        d="M4 5h12M4 9h8M4 13h12M4 17h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AlignCenterIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-[20px] w-[20px]">
      <path
        d="M4 5h12M6 9h8M4 13h12M6 17h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AlignRightIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-[20px] w-[20px]">
      <path
        d="M4 5h12M8 9h8M4 13h12M8 17h8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AlignJustifyIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-[20px] w-[20px]">
      <path
        d="M4 5h12M4 9h12M4 13h12M4 17h12"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function AddImageIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" className="h-[20px] w-[20px]">
      <path
        d="M4 15.5h12a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1H4a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="m4 13 3.2-3.2 2.2 2.2 2.9-2.9L16 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M13.5 6.8h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function MemoEditorToolbar({ editor }: { editor: Editor | null }) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const disabled = !editor;

  const handleSetLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('링크를 입력해주세요.', previousUrl ?? '');

    if (url === null) return;

    if (url.trim() === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run();
  };

  const handleAddImage = (file?: File) => {
    if (!editor || !file) return;

    const reader = new FileReader();

    reader.onload = () => {
      editor
        .chain()
        .focus()
        .setImage({
          src: String(reader.result),
        })
        .run();
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="flex h-[54px] items-center gap-[8px] border-b border-gray-300 px-[32px]">
      <ToolbarButton
        label="굵게"
        disabled={disabled}
        active={editor?.isActive('bold')}
        onClick={() => editor?.chain().focus().toggleBold().run()}
      >
        B
      </ToolbarButton>

      <ToolbarButton
        label="기울임"
        disabled={disabled}
        active={editor?.isActive('italic')}
        onClick={() => editor?.chain().focus().toggleItalic().run()}
      >
        <span className="italic">I</span>
      </ToolbarButton>

      <ToolbarButton
        label="밑줄"
        disabled={disabled}
        active={editor?.isActive('underline')}
        onClick={() => editor?.chain().focus().toggleUnderline().run()}
      >
        <span className="underline">U</span>
      </ToolbarButton>

      <ToolbarButton
        label="취소선"
        disabled={disabled}
        active={editor?.isActive('strike')}
        onClick={() => editor?.chain().focus().toggleStrike().run()}
      >
        <span className="line-through">S</span>
      </ToolbarButton>

      <div className="mx-[4px] flex items-center gap-[6px]">
        {TEXT_COLORS.map((color) => (
          <button
            key={color}
            type="button"
            aria-label={`${color} 글자색`}
            disabled={disabled}
            onClick={() => editor?.chain().focus().setColor(color).run()}
            className="h-[18px] w-[18px] rounded-[4px] border border-gray-300 disabled:opacity-40"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>

      <ToolbarButton
        label="링크"
        disabled={disabled}
        active={editor?.isActive('link')}
        onClick={handleSetLink}
      >
        <LinkIcon className="h-[18px] w-[18px]" aria-hidden="true" />
      </ToolbarButton>

      <ToolbarButton
        label="왼쪽 정렬"
        disabled={disabled}
        active={editor?.isActive({ textAlign: 'left' })}
        onClick={() => editor?.chain().focus().setTextAlign('left').run()}
      >
        <AlignLeftIcon />
      </ToolbarButton>

      <ToolbarButton
        label="가운데 정렬"
        disabled={disabled}
        active={editor?.isActive({ textAlign: 'center' })}
        onClick={() => editor?.chain().focus().setTextAlign('center').run()}
      >
        <AlignCenterIcon />
      </ToolbarButton>

      <ToolbarButton
        label="오른쪽 정렬"
        disabled={disabled}
        active={editor?.isActive({ textAlign: 'right' })}
        onClick={() => editor?.chain().focus().setTextAlign('right').run()}
      >
        <AlignRightIcon />
      </ToolbarButton>

      <ToolbarButton
        label="양쪽 정렬"
        disabled={disabled}
        active={editor?.isActive({ textAlign: 'justify' })}
        onClick={() => editor?.chain().focus().setTextAlign('justify').run()}
      >
        <AlignJustifyIcon />
      </ToolbarButton>

      <ToolbarButton
        label="이미지 추가"
        disabled={disabled}
        onClick={() => imageInputRef.current?.click()}
      >
        <AddImageIcon />
      </ToolbarButton>

      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];

          handleAddImage(file);
          event.target.value = '';
        }}
      />
    </div>
  );
}

export function MemoRichEditor({ value, onChange }: MemoRichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      ImageExtension.configure({
        inline: false,
        allowBase64: true,
      }),
      Placeholder.configure({
        placeholder: '메모를 입력하세요',
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          'memo-rich-editor min-h-[210px] w-full outline-none text-[16px] leading-[24px] font-medium text-gray-700',
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() === value) return;

    editor.commands.setContent(value || '', {
      emitUpdate: false,
    });
  }, [editor, value]);

  return (
    <div>
      <MemoEditorToolbar editor={editor} />

      <div className="px-[64px] pt-[24px] pb-[48px]">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
