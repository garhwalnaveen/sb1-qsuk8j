import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { Bold, Italic, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onImageUpload?: (file: File) => Promise<string>;
}

export default function RichTextEditor({ content, onChange, onImageUpload }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onImageUpload) {
      const url = await onImageUpload(file);
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-gray-50 border-b px-4 py-2 flex gap-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('bold') ? 'bg-gray-200' : ''
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('italic') ? 'bg-gray-200' : ''
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            const url = window.prompt('Enter URL');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          className={`p-2 rounded hover:bg-gray-200 ${
            editor.isActive('link') ? 'bg-gray-200' : ''
          }`}
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <label className="p-2 rounded hover:bg-gray-200 cursor-pointer" title="Add Image">
          <ImageIcon className="w-4 h-4" />
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleImageUpload}
          />
        </label>
      </div>
      <EditorContent editor={editor} className="prose max-w-none p-4" />
    </div>
  );
}