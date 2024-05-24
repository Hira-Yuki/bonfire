import { addDoc, collection, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { styled } from '@linaria/react';
import { auth, db, storage } from "../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { fileSizeChecker } from "../helper/fileControl";
import { FirebaseError } from "firebase/app";
import DeleteButton from "./icons/DeleteButton";
import AddPhotoButton from "./icons/AddPhotoButton";

const MAX_POST_LENGTH = 300

const PostForm = () => {
  const [isLoading, setLoading] = useState(false)
  const [post, setPost] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const remainingChars = MAX_POST_LENGTH - post.length // post가 변경되면 리랜더링 되므로 state로 관리하지 않음


  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPost(e.target.value)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    if (files && files.length === 1) {
      const file = files[0]
      if (fileSizeChecker(file)) return
      setFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(files[0])
    }
  }

  const handleRemoveFile = () => {
    setFile(null)
    setPreview(null)
  }

  const clearForm = () => {
    setPost("")
    handleRemoveFile()
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const user = auth.currentUser
    if (!user || isLoading || post === "" || post.length > MAX_POST_LENGTH) return
    try {
      setLoading(true)
      const doc = await addDoc(collection(db, "posts"), {
        post,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      })
      if (file) {
        const locationRef = ref(storage, `posts/${user.uid}/${doc.id}`)
        const result = await uploadBytes(locationRef, file)
        const url = await getDownloadURL(result.ref)
        await updateDoc(doc, {
          photo: url
        })
      }
      clearForm()
    } catch (error) {
      if (error instanceof FirebaseError) {
        alert(error.message)
      }
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const onCancel = () => {
    const confirmCancel = confirm("작성 중이던 포스트를 모두 지울까요?")

    if (confirmCancel) {
      clearForm()
    }
  }

  return (
    <Form onSubmit={onSubmit}>
      <ButtonContainer>
        <CancelButton type="button" value="취소" onClick={onCancel} />
        <SubmitButton
          type="submit"
          value={isLoading ? "Posting..." : "작성하기"}
        />
      </ButtonContainer>
      <Divider />
      <TextArea
        required
        rows={5}
        onChange={onChange}
        value={post}
        placeholder="무슨 일이 일어나고 있나요?" />
      {preview ? (
        <ImagePreviewContainer>
          <ImagePreview src={preview} alt="Preview" />
          <RemoveImageButton onClick={handleRemoveFile}>
            {/* 이미지 삭제 */}
            <DeleteButton />
          </RemoveImageButton>
        </ImagePreviewContainer>
      ) : (
        null
      )}
      <Divider />
      <OptionsWrapper>
        <AttachFileButton htmlFor="file">
          {/* 사진 첨부 */}
          <AddPhotoButton />
        </AttachFileButton>
        <AttachFileInput
          onChange={handleFileChange}
          type="file"
          id="file"
          accept="image/*"
        />
        <CharCount $remaining={remainingChars}>
          {remainingChars}
        </CharCount>
        <CircularProgress $percent={(remainingChars / MAX_POST_LENGTH) * 100} />
      </OptionsWrapper>
    </Form>
  )
}

export default PostForm;

const Divider = styled.div`
  margin-top: 10px;
  height: 0px;
  border: 1px solid rgba(174, 174, 174, 0.8);
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`

const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  width: 25px;
  cursor: pointer;
`

const AttachFileInput = styled.input`
  display: none;
`

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`

const CancelButton = styled.input`
  color: #1d9bf0;
  font-size: 16px;
  border: none;
  background-color: transparent;
  width: 120px;
  padding: 10px 0px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`

const SubmitButton = styled.input`
  width: 120px;
  background-color: #1d9bf0;
  color: white;
  border: none;
  padding: 10px 0px;
  border-radius: 20px;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.9;
  }
`

const OptionsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 70px;
  padding: 10px;
  gap: 10px;
`

const ImagePreviewContainer = styled.div`
  position: relative;
  width: fit-content;
  height: 120px;
`

const ImagePreview = styled.img`
  max-height: 100%;
  max-width: 100%;
  border-radius: 10px;
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

interface CharCountProps {
  $remaining: number;
}

const CharCount = styled.span<CharCountProps>`
  color: ${props => props.$remaining <= 0 ? "red" : props.$remaining < 100 ? "orange" : "white"};
  margin-left: auto;
  font-size: 16px;
`
const CircularProgress = styled.div<{ $percent: number }>`
  position: relative;
  width: 40px;
  height: 40px;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: conic-gradient(
      #e6e6e6 0deg,
      #e6e6e6 ${props => props.$percent * 3.6}deg,
      ${props => props.$percent <= 0
    ? "red"
    : props.$percent >= (MAX_POST_LENGTH - 200) / MAX_POST_LENGTH * 100
      ? "#1d9bf0"
      : "orange"} ${props => props.$percent * 3.6}deg
    );
  }

  &:before {
    content: '';
    position: absolute;
    top: 4px;
    left: 4px;
    width: 32px;
    height: 32px;
    background: #2b2b2b;
    border-radius: 50%;
    z-index: 1;
  }
`;