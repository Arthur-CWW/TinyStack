import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import BubbleMenu from "@tiptap/extension-bubble-menu";
import FloatingMenu from "@tiptap/extension-floating-menu";
import { useRef, useState } from "react";

const Editor = () => {
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
    ],
    content: `
      <h2>Hi there,</h2>
      <p>This is a basic example of <em>tiptap</em> with <strong>Tailwind Typography</strong>.</p>
      <!-- Add more content as needed -->
    `,
    editorProps: {
      attributes: {
        class:
          "prose dark:prose-invert prose-sm sm:prose-base lg:prose-lg xl:prose-2xl m-5 focus:outline-none",
      },
    },
  });

  const [showTooltip, setShowTooltip] = useState(false);

  const handleExport = () => {
    const html = editor.getHTML();
    console.log(html);
    // You can further process the HTML or save it as needed
  };

  return (
    <div className="editor-container">
      <EditorContent editor={editor} />
      <div
        id="bubble-menu"
        ref={bubbleMenuRef}
        className={`tooltip ${showTooltip ? "visible" : ""}`}
      >
        <button onClick={() => setShowTooltip(false)}>Close</button>
      </div>
      <div ref={floatingMenuRef} className="floating-menu">
        <button onClick={() => setShowTooltip(true)}>+</button>
        <button onClick={handleExport}>Export to HTML</button>
      </div>
    </div>
  );
};

export default Editor;
