import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import BubbleMenu from "@tiptap/extension-bubble-menu";
import FloatingMenu from "@tiptap/extension-floating-menu";
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";
import { Editor } from "@tiptap/react";
import { useDebounce, useDebouncedCallback } from "use-debounce";

import { useEditorStore } from "~/utils/stores";
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
        const result = readerEvent?.target?.result;
        if (typeof result === "string") {
          //TODO Need to figure out why I need this to be a string
          editor.commands.setImage({ src: result });
        } else if (result instanceof ArrayBuffer) {
          console.log("ArrayBuffer", result);
        }
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

import { useProfileStore } from "~/utils/stores";
const MyEditor = () => {
  const bubbleMenuRef = useRef<HTMLDivElement>(null);
  const floatingMenuRef = useRef<HTMLDivElement>(null);
  const { setUpdating: notify } = useProfileStore();

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
    onUpdate: (editor) => notify(true),

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
    // TODO add toolbar
    if (!editor) return;
    const url = window.prompt("URL");

    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const { setHtml } = useEditorStore();

  const [debouncedEditor] = useDebounce(editor?.getHTML(), 2000);

  useEffect(() => {
    if (debouncedEditor) {
      setHtml(debouncedEditor);
      notify(false);
    }
  }, [debouncedEditor]);
  if (!editor) return null;

  return (
    <div className=" flex flex-col items-center justify-center px-3">
      {/* <div ref={floatingMenuRef} className="flex ">
        <button onClick={() => setShowTooltip(true)}>+</button>
        <button onClick={handleExport}>Export to HTML</button>
      </div> */}
      {/* on debounce saveHtml*/}
      {/* <button onClick={saveHtml}>Save</button> */}

      <EditorContentWithDrop editor={editor} />
      {/* <div
        ref={bubbleMenuRef}
        className={`tooltip ${showTooltip ? "visible" : ""}`}
        // TODO tooltip class
      >
        <button onClick={() => setShowTooltip(false)}>Close</button>
      </div> */}
    </div>
  );
};

export default MyEditor;
