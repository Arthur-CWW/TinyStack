import { type ForwardedRef } from "react";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  imagePlugin,
  toolbarPlugin,
  frontmatterPlugin,
  linkDialogPlugin,
  linkPlugin,
  tablePlugin,
  BoldItalicUnderlineToggles,
  UndoRedo,
  ListsToggle,
  InsertImage,
  CreateLink,
  CodeToggle,
  InsertTable,
  InsertCodeBlock,
} from "@mdxeditor/editor";

import "@mdxeditor/editor/style.css";
// Home.Layout = Navbar;
const defaultSnippetContent = `
export default function App() {
  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
`.trim();

export async function expressImageUploadHandler(image: File) {
  const formData = new FormData();
  formData.append("image", image);
  const response = await fetch("/uploads/new", {
    method: "POST",
    body: formData,
  });
  const json = (await response.json()) as { url: string };
  return json.url;
}
function MDEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <MDXEditor
      plugins={[
        // Example Plugin Usage
        toolbarPlugin({
          toolbarContents: () => (
            <div className="flex gap-2">
              <UndoRedo />
              <BoldItalicUnderlineToggles />
              <ListsToggle />
              <InsertImage />
              <CreateLink />
              <InsertTable />
              <CodeToggle />
              <InsertCodeBlock />
            </div>
          ),
        }),
        listsPlugin(),
        quotePlugin(),
        headingsPlugin({ allowedHeadingLevels: [1, 2, 3] }),
        linkPlugin(),
        linkDialogPlugin(),
        imagePlugin({
          imageAutocompleteSuggestions: [
            "https://via.placeholder.com/150",
            "https://via.placeholder.com/150",
          ],
          imageUploadHandler: async () =>
            // TOOO: Fix this
            Promise.resolve("https://picsum.photos/200/300"),
        }),
        tablePlugin(),
        thematicBreakPlugin(),
        frontmatterPlugin(),
        // codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
        // codeMirrorPlugin({
        //   codeBlockLanguages: {
        //     js: "JavaScript",
        //     css: "CSS",
        //     txt: "Plain Text",
        //     tsx: "TypeScript",
        //     "": "Unspecified",
        //   },
        // }),
        markdownShortcutPlugin(),
      ]}
      {...props}
      ref={editorRef}
    />
  );
}
