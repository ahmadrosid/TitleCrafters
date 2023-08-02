import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import * as Y from "yjs";

import { useCallback } from "react";
import { AiOutlineBold, AiOutlineItalic } from "react-icons/ai";
import { BiCodeAlt, BiSolidImageAlt } from "react-icons/bi";
import { HiArrowLeft, HiArrowRight, HiDownload } from "react-icons/hi";
import { IndexeddbPersistence } from "y-indexeddb";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { Button } from "@/components/ui/button";

type Props = {
  content: string;
  fileName: string;
  user: CursorUser;
};

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; ++i) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

const randomRoomName = "example#1234";
const ydoc = new Y.Doc();
const provider = new HocuspocusProvider({
  url: "ws://127.0.0.1:4444",
  name: randomRoomName,
  document: ydoc,
});

new IndexeddbPersistence(randomRoomName, ydoc);

type CursorUser = {
  name: string;
  color: string;
};

export const Editor1 = ({ content, fileName, user }: Props) => {
  // const prev = useRef("");
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      Collaboration.configure({
        document: ydoc,
      }),
      CollaborationCursor.configure({ provider, user }),
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

  const hanldePopulateRandomtText = useCallback(async () => {
    const sampleData = `Stale while revalidate is a caching strategy used in web development. It allows a cached response to be served to a user while simultaneously revalidating the cached response with the server to check if it is still valid. If the cached response is still valid, it is served to the user. If it is no longer valid, the server provides an updated response, which is then stored in the cache for future use. This strategy helps improve performance by reducing the need for frequent server requests while ensuring that the cached data remains up to date.`;

    const wait = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));
    const datas = sampleData.split(" ");
    for (let i = 0; i < datas.length; i++) {
      const randomMs = Math.floor(Math.random() * 90);
      await wait(randomMs);
      editor
        ?.chain()
        .focus()
        .insertContent(datas[i] + " ")
        .run();
    }
  }, [editor]);

  // useEffect(() => {
  //   if (editor && content) {
  //     const diff = content.slice(prev.current.length);
  //     prev.current = content;
  //     editor.chain().focus().insertContent(diff).run();
  //   }
  // }, [editor, content]);

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
            <p className="text-sm text-gray-600">{user.name}</p>
            <p className="inline-block shrink-0 bg-gray-400 w-[1px] mx-2 h-4"></p>
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
        <div className="p-2">
          <EditorContent
            editor={editor}
            className="focus:outline-none active:outline-none"
          />
        </div>
      </div>
      <div className="py-4 flex gap-4">
        <Button>
          {editor
            ? `(${editor.storage.collaborationCursor.users.length} user${
                editor.storage.collaborationCursor.users.length === 1
                  ? ""
                  : ")'s"
              } online in ${randomRoomName}`
            : "offline"}
        </Button>
        <Button onClick={hanldePopulateRandomtText}>Generate text</Button>
      </div>
    </div>
  );
};

export const Editor = ({ content, fileName }: Omit<Props, "user">) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Editor1
        content={content}
        fileName={fileName}
        user={{
          name: "Assistant#" + crypto.randomUUID().split("-")[0],
          color: getRandomColor(),
        }}
      />
      <Editor1
        content={content}
        fileName={fileName}
        user={{
          name: "Assistant#" + crypto.randomUUID().split("-")[0],
          color: getRandomColor(),
        }}
      />
    </div>
  );
};
