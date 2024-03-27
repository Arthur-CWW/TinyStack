import { type ClassValue, clsx } from "clsx";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { api } from "~/utils/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function timeAgo(date: Date) {
  const now = new Date();
  const diffInSeconds = Math.floor((+now - +date) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInYears > 0) {
    return `${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`;
  } else if (diffInMonths > 0) {
    return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
  } else if (diffInDays > 0) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  } else {
    return "Just now";
  }
}
import { useMutation } from "@tanstack/react-query";
import { useToast } from "~/components/ui/use-toast";
export function useUpload() {
  const { toast } = useToast();
  const {
    data: signedUrl,
    isLoading,
    mutate: addImage,
  } = api.post.addImage.useMutation({
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Signing failed",
        description: error.message,
      });
    },
  });
  const [file, setFile] = useState<File | null>(null);
  async function uploadImage() {
    // Needs to be wrapped in  useMutation, after using the hook
    if (!signedUrl || !file) {
      console.error("no signed url or file");
      return;
    }
    const { url, fields } = signedUrl;
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
    formData.append("file", file);

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    // console.log("response", response);
    // console.log("key", fields.key);
    return fields.key;
  }

  return {
    uploadImage,
    signImage: (image: File | undefined | null) => {
      if (!image) return;
      setFile(image);
      addImage({
        filename: image.name,
        contentTypeId: image.type,
      });
    },
    disabled: isLoading,
  };
}
