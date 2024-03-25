import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
interface EditorState {
  html: string;

  setHtml: (html: string) => void;
}

export const useEditorStore = create<EditorState>()(
  devtools(
    persist(
      (set) => ({
        html: "",
        setHtml: (html) => set((state) => ({ html })),
      }),
      { name: "htmlStore" },
    ),
  ),
);
