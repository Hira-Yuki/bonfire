import { deleteDoc, doc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { deleteObject, ref } from "firebase/storage";

export const getRef = async (id: string) => {
  const user = auth.currentUser;
  return ref(storage, `posts/${user?.uid}/${id}`);
};
// Firestore에서 포스트를 삭제하는 함수
export const deletePostFromFirestore = async (id: string) => {
  await deleteDoc(doc(db, "posts", id));
};

export const deleteCommentsFromFirestore = async (originalPostId:string, id: string) => {
  await deleteDoc(doc(db, "posts", originalPostId, "comments", id));
}
// Storage에서 포스트의 사진을 삭제하는 함수
export const deletePhotoFromStorage = async (id: string) => {
  const photoRef = await getRef(id);
  await deleteObject(photoRef);
};

export const deleteCommentsPhotoFromStorage = async (originalPostId:string,id: string) => {
  const photoRef = ref(storage, `posts/comments/${originalPostId}/${id}`);
  await deleteObject(photoRef);
}

// 사용자의 권한을 확인하는 함수
export const isNotCurrentUser = (userId: string): boolean => {
  const user = auth.currentUser;
  return user?.uid !== userId;
};