import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import BubbleMenu from "@tiptap/extension-bubble-menu";
import FloatingMenu from "@tiptap/extension-floating-menu";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";
import { Editor } from "@tiptap/core";

const EditorContentWithDrop = ({ editor }: { editor: Editor }) => {
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleDrop = (event: DragEvent) => {
      event.preventDefault();
      if (event.dataTransfer === null) return;

      const files = event.dataTransfer.files;
      if (files.length === 0) {
        return;
      }
      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        editor.commands.setImage({ src: readerEvent?.target?.result });
      };
      if (files[0]) {
        reader.readAsDataURL(files[0]);
      }
    };

    const contentElement = contentRef.current;
    if (!contentElement) return;
    contentElement.addEventListener("drop", handleDrop);
    return () => {
      contentElement.removeEventListener("drop", handleDrop);
    };
  }, [editor]);

  return <EditorContent editor={editor} ref={contentRef} />;
};
const MyEditor = () => {
  const bubbleMenuRef = useRef<HTMLDivElement>(null);
  const floatingMenuRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      BubbleMenu.configure({
        element: bubbleMenuRef.current,
      }),
      FloatingMenu.configure({
        element: floatingMenuRef.current,
      }),
      Image,
      Dropcursor,
    ],
    content: `
      <h2>Hi there,</h2>
      <p>This is a basic example of <em>tiptap</em> with <strong>Tailwind Typography</strong>.</p>
      <!-- Add more content as needed -->
    <img src="https://source.unsplash.com/8xznAGy4HcY/800x400" />
    <img src="https://source.unsplash.com/K9QHL52rE2k/800x400" />

    `,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
      },
    },
  });

  const [showTooltip, setShowTooltip] = useState(false);
  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const handleExport = () => {
    if (!editor) {
      return;
    }
    const html = editor.getHTML();
    console.log(html);
    // You can further process the HTML or save it as needed
  };
  if (!editor) return null;

  return (
    <div className="container flex flex-col items-center justify-center px-3">
      <div ref={floatingMenuRef} className="flex ">
        <button onClick={() => setShowTooltip(true)}>+</button>
        <button onClick={handleExport}>Export to HTML</button>
      </div>
      <EditorContentWithDrop editor={editor} />
      <div
        ref={bubbleMenuRef}
        className={`tooltip ${showTooltip ? "visible" : ""}`}
        // TODO tooltip class
      >
        <button onClick={() => setShowTooltip(false)}>Close</button>
      </div>
    </div>
  );
};

export default MyEditor;
