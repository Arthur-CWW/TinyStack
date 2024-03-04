import { useState, useEffect } from "react";

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

interface SaveState {
  updating: boolean;
  setUpdating: (val: boolean) => void;
}

export const useProfileStore = create<SaveState>()((set) => ({
  updating: false,
  setUpdating: (val) => set(() => ({ updating: val })),
}));
