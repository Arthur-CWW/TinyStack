import { useState, useEffect } from "react";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
interface BearState {
  bears: number;
  increase: (by: number) => void;
}

export const useBearStore = create<BearState>()(
  devtools(
    persist(
      (set) => ({
        bears: 0,
        increase: (by) => set((state) => ({ bears: state.bears + by })),
      }),
      { name: "bearStore" },
    ),
  ),
);
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

interface ProfileState {
  updating: boolean;
  setUpdating: (val: boolean) => void;
}

export const useProfileStore = create<ProfileState>()((set) => ({
  updating: false,
  setUpdating: (val) => set(() => ({ updating: val })),
}));
