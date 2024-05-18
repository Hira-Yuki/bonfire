import { styled } from "styled-components"
import { IPost } from "./Timeline"
import { auth, db, storage } from "../firebase"
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { deleteObject, getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";

const Post = ({ username, photo, post, userId, id }: IPost) => {
  const user = auth.currentUser
  const [isEditing, setIsEditing] = useState(false)
  const [editedPost, setEditedPost] = useState(post)
  const [newPhoto, setNewPhoto] = useState<File | null>(null)
  const [newPhotoURL, setNewPhotoURL] = useState(photo)
  const [$removePhoto, set$RemovePhoto] = useState(false)

  const onDelete = async () => {
    const ok = confirm("포스트를 정말로 삭제할까요?")
    if (!ok || user?.uid !== userId) return
    try {
      await deleteDoc(doc(db, "posts", id))
      if (photo) {
        const photoRef = ref(storage, `posts/${user.uid}/${id}`)
        await deleteObject(photoRef)
      }
    } catch (e) {
      console.log(e)
    }
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
    } catch (error) {
      console.log(error)
    } finally {
      set$RemovePhoto(false)
    }
  }

  const removeFile = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    set$RemovePhoto(true)
    setNewPhoto(null)
  }

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        {isEditing ? (
          <div>
            <TextArea
              value={editedPost}
              onChange={(event) => setEditedPost(event.target.value)}
            />
            <SaveButton onClick={onEdit}>Save</SaveButton>
            <CancelButton onClick={() => setIsEditing(false)}>Cancel</CancelButton>
          </div>
        ) : <Payload>{post}</Payload>}
        {
          user?.uid === userId && !isEditing ?
            <>
              <DeleteButton onClick={onDelete}>Delete</DeleteButton>
              <ModifyButton onClick={() => setIsEditing(true)}>Edit</ModifyButton>
            </>
            : null
        }
      </Column>
      <Column>
        {isEditing ? (
          <div>
            <AttachFileLabel htmlFor="new-file">
              {photo ? (
                <ImagePreviewContainer>
                  <Photo
                    src={newPhotoURL}
                    alt="New Post"
                    $removePhoto={$removePhoto}
                  />
                  <RemoveImageButton onClick={removeFile}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                      <path fillRule="evenodd" d="M6.75 3A2.25 2.25 0 0 0 4.5 5.25v.75H3a.75.75 0 0 0 0 1.5h1.5v10.5A2.25 2.25 0 0 0 6.75 20.25h10.5A2.25 2.25 0 0 0 19.5 18V7.5H21a.75.75 0 0 0 0-1.5h-1.5V5.25A2.25 2.25 0 0 0 17.25 3H6.75Zm7.5 13.5a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 1.5 0v7.5Zm-4.5 0a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 1.5 0v7.5Z" clipRule="evenodd" />
                    </svg>
                  </RemoveImageButton>
                </ImagePreviewContainer>
              ) : newPhoto ? (
                <Photo
                  src={newPhotoURL}
                  alt="New Post"
                />
              )
                : (
                  <div>
                    이미지 추가하기
                  </div>
                )
              }
            </AttachFileLabel>
            <AttachFileInput type="file" id="new-file" accept="image/*" onChange={onFileChange} />
          </div>
        ) : (
          photo && (
            <Column>
              {/* Todo: 이미지 보기의 경우 이후 모달 등으로 출력해서 탭 이동이 없도록 개선해볼 수 있음  */}
              <a href={photo} target="_blank">
                <Photo
                  src={photo}
                  alt="Post"
                />
              </a>
            </Column>
          )
        )}
      </Column>
    </Wrapper>
  )
}

export default Post

const Wrapper = styled.section`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`

const Column = styled.div``

interface PhotoProps {
  $removePhoto?: boolean;
}


const Photo = styled.img<PhotoProps>`
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 15px;
  margin-left: auto;
  filter: ${({ $removePhoto }) => $removePhoto ? 'grayscale(100%)' : 'none'};
`

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`

const ModifyButton = styled(DeleteButton)`
  background-color: grey;
  margin-left: 10px;
`;

const AttachFileLabel = styled.label`
  color: #1d9bf0;
  width: 100px;
  height: 100px;
  cursor: pointer;
`

const AttachFileInput = styled.input`
  display: none;
`

const TextArea = styled.textarea`
  display: block;
  margin: 10px 0px;
  font-size: 18px;
  width: 95%;
  border: 2px solid white;
  border-radius: 10px;
  padding: 20px;
  resize: none;
  font-size: 16px;
  color: white;
  background-color: transparent;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`

const SaveButton = styled(DeleteButton)`
  background-color: #1d9bf0;
`

const CancelButton = styled(DeleteButton)`
  background-color: tomato;
  margin-left: 10px;
`

const RemoveImageButton = styled.button`
  position: absolute;
  top: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  border: none;
  border-radius: 50%;
  padding: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    fill: tomato;
    width: 16px;
    height: 16px;
  }
`;

const ImagePreviewContainer = styled.div`
  position: relative;
  width: fit-content;
  height: 120px;
`