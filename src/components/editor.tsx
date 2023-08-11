import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";

import { useCallback, useEffect, useRef } from "react";
import { AiOutlineBold, AiOutlineItalic } from "react-icons/ai";
import { BiCodeAlt, BiSolidImageAlt } from "react-icons/bi";
import { HiArrowLeft, HiArrowRight, HiDownload } from "react-icons/hi";

type Props = {
  content: string;
  fileName: string;
};

export const Editor = ({ content, fileName }: Props) => {
  const prev = useRef("");
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Image,
    ],
    content: content,
    editable: true,
    editorProps: {
      attributes: {
        class: "prose dark:prose-invert prose-sm focus:outline-none max-w-none",
      },
    },
  });

  const handleToggleBold = useCallback(() => {
    editor?.chain().focus().toggleBold().run();
  }, [editor]);

  const handleToggleItalic = useCallback(() => {
    editor?.chain().focus().toggleItalic().run();
  }, [editor]);

  const handleToggleCode = useCallback(() => {
    editor?.chain().focus().toggleCode().run();
  }, [editor]);

  const handleAddImage = useCallback(() => {
    const url = window.prompt("URL");

    if (url) {
      editor?.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const handleDownloadFile = useCallback(() => {
    function downloadStringAsFile(filename: string, content: string) {
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;

      document.body.appendChild(link);
      link.click();

      URL.revokeObjectURL(url);
      document.body.removeChild(link);
    }
    return downloadStringAsFile(fileName, content);
  }, [content, fileName]);

  useEffect(() => {
    if (editor && content) {
      const diff = content.slice(prev.current.length);
      prev.current = content;
      editor.chain().insertContent(diff).run();
    }
  }, [editor, content]);

  return (
    <div>
      <div className="rounded-lg border overflow-hidden bg-white">
        <div className="bg-gray-50 p-2 border-b flex justify-between items-center">
          <div>
            <button
              className="p-2 hover:bg-gray-200 rounded-md"
              onClick={handleToggleBold}
            >
              <AiOutlineBold />
            </button>
            <button
              className="p-2 hover:bg-gray-200 rounded-md"
              onClick={handleToggleItalic}
            >
              <AiOutlineItalic />
            </button>
            <button
              className="p-2 hover:bg-gray-200 rounded-md"
              onClick={handleAddImage}
            >
              <BiSolidImageAlt />
            </button>
            <button
              className="p-2 hover:bg-gray-200 rounded-md"
              onClick={handleToggleCode}
            >
              <BiCodeAlt />
            </button>
            <p className="inline-block shrink-0 bg-gray-400 w-[1.5px] mx-2 h-4"></p>
            <button
              className="p-2 hover:bg-gray-200 rounded-md"
              onClick={handleDownloadFile}
            >
              <HiDownload />
            </button>
          </div>
          <div className="flex justify-between gap-2 items-center">
            <p className="text-sm text-gray-600">{fileName}</p>
            <p className="inline-block shrink-0 bg-gray-400 w-[1px] mx-2 h-4"></p>
            <p className="text-sm text-gray-500">Revision 3/3</p>
            <div>
              <button className="p-1 hover:bg-gray-200 rounded-md text-gray-400">
                <HiArrowLeft />
              </button>
              <button className="p-1 hover:bg-gray-200 rounded-md text-gray-400">
                <HiArrowRight />
              </button>
            </div>
          </div>
        </div>
        <div className="p-4">
          <EditorContent
            editor={editor}
            className="focus:outline-none active:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
