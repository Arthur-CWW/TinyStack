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
export function useUpload() {
  const {
    data: signedUrl,
    isLoading,
    mutate: addImage,
  } = api.post.addImage.useMutation();
  const [file, setFile] = useState<File | null>(null);
  const {
    mutate: uploadImage,
    isSuccess,
    data,
  } = useMutation(
    async () => {
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
      return fields.key;
    },
    {
      onSuccess: (imageId) => {
        // The 'data' variable will contain the 'key' from the fields which is the S3 object key
        console.log("Upload successful, image ID:", imageId);
      },
      onError: (error) => {
        console.error("Upload error:", error);
      },
    },
  );

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
    isSuccess,
    imageId: data,
    disabled: isLoading,
  };
}
