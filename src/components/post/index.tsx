import { IPost } from "../Timeline"
import { auth, db, storage } from "../../firebase"
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { usePostState } from "../../hooks/usePostState";
import LoadingState from "./LoadingState";
import EditingState from "./EditingState";
import ViewingState from "./ViewingState";
import ImageModal from "./ImageModal";

export default function Post({ username, photo, post, userId, id }: IPost) {
  const user = auth.currentUser
  const {
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
    isModalOpen,
    setIsModalOpen,
  } = usePostState(post, photo);

  const onDelete = async () => {
    const ok = confirm("포스트를 정말로 삭제할까요?")
    if (!ok || user?.uid !== userId) return

    try {
      setIsLoading(true)
      await deleteDoc(doc(db, "posts", id))
      if (photo) {
        const photoRef = ref(storage, `posts/${user.uid}/${id}`)
        await deleteObject(photoRef)
      }
    } catch (e) {
      setError("포스트 삭제에 실패했습니다. 문제가 계속되면 관리자에게 문의해주세요.");
      console.error(e);
    } finally {
      setIsLoading(false)
    }
  }

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedPost(e.target.value)
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    if (files && files.length === 1) {
      const selectedFile = files[0]
      if (selectedFile.size > 1048576) {
        alert("파일 크기가 1MB를 초과합니다. 다른 파일을 선택해 주세요.")
        return
      }
      setNewPhoto(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewPhotoURL(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const onEdit = async () => {
    if (user?.uid !== userId) return;
    try {
      setIsLoading(true)
      const postRef = doc(db, "posts", id);
      await updateDoc(postRef, {
        post: editedPost,
      })

      if ($removePhoto) {
        const photoRef = ref(storage, `posts/${user.uid}/${id}`)
        await deleteObject(photoRef)
        await updateDoc(postRef, {
          photo: null
        })
      }

      if (newPhoto) {
        const photoRef = ref(storage, `posts/${user.uid}/${id}`)
        if (photo) await deleteObject(photoRef)

        const locationRef = ref(storage, `posts/${user.uid}/${id}`)
        const result = await uploadBytes(locationRef, newPhoto)
        const url = await getDownloadURL(result.ref)
        await updateDoc(postRef, {
          photo: url
        })
      }
      setIsEditing(false)
    } catch (e) {
      setError("포스트 업데이트에 실패했습니다. 문제가 계속되면 관리자에게 문의해 주세요.");
      console.error(e);
    } finally {
      set$RemovePhoto(false)
      setIsLoading(false)
    }
  }

  const removeFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    set$RemovePhoto(!$removePhoto)
  }

  const handleModal = () => setIsModalOpen(!isModalOpen);


  if (isLoading) {
    return <LoadingState username={username} error={error} />;
  }

  if (isEditing) {
    return (
      <EditingState
        username={username}
        editedPost={editedPost}
        onChange={onChange}
        onEdit={onEdit}
        onCancel={() => setIsEditing(false)}
        newPhotoURL={newPhotoURL}
        photo={photo}
        newPhoto={newPhoto}
        onFileChange={onFileChange}
        removeFile={removeFile}
        $removePhoto={$removePhoto}
        error={error}
      />
    );
  }

  return (
    <>
      <ViewingState
        username={username}
        post={post}
        photo={photo}
        onDelete={onDelete}
        onEdit={() => setIsEditing(true)}
        userOwnsPost={user?.uid === userId}
        error={error}
        onImageClick={handleModal}
      />
      <ImageModal isOpen={isModalOpen} onClose={handleModal} imageUrl={photo || ''} />

    </>
  );
}