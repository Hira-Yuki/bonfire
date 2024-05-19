import { useState } from "react";

export const usePostState = (initialPost: string, initialPhoto?: string) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState(initialPost);
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [newPhotoURL, setNewPhotoURL] = useState(initialPhoto);
  const [$removePhoto, set$RemovePhoto] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  return {
    isEditing,
    setIsEditing,
    editedPost,
    setEditedPost,
    newPhoto,
    setNewPhoto,
    newPhotoURL,
    setNewPhotoURL,
    $removePhoto,
    set$RemovePhoto,
    isLoading,
    setIsLoading,
    error,
    setError,
  };
};
