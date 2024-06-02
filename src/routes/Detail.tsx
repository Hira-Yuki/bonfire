import { useNavigate, useParams } from "react-router-dom";
import { IPost } from "../components/Timeline";
import { Suspense, useCallback, useEffect, useState } from "react";
import React from "react";
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase";
import { styled } from "@linaria/react";
import { MAX_POST_LENGTH } from "../constants/maxlangth";
import { AddPhotoButton, DeleteButton } from "../components/icons";
import { fileSizeChecker } from "../helper/fileControl";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { FirebaseError } from "firebase/app";

const Post = React.lazy(() => import('../components/post/Post'));

// TODO: 이미지 수정, 삭제가 되지 않는 문제 수정 필요
export default function Detail() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<null | IPost>(null)
  const [comments, setComments] = useState<IPost[]>([]);
  const [reply, setReply] = useState("")
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState("")
  const [trigger, setTrigger] = useState(false)
  const user = auth.currentUser

  const navigate = useNavigate()
  const remainingChars = MAX_POST_LENGTH - reply.length // post가 변경되면 리랜더링 되므로 state로 관리하지 않음

  const fetchDocument = useCallback(async () => {
    if (id === undefined) {
      navigate("/not-found")
      return
    }
    try {
      const docRef = doc(db, "posts", id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const { post, createdAt, userId, username, photo } = docSnap.data()
        setPost({ post, createdAt, userId, username, photo, id });
      } else {
        navigate("/not-found");
      }
    } catch (error) {
      navigate("/not-found");
    }
  }, [id, navigate])

  const fetchComments = useCallback(async () => {
    if (id === undefined) return;
    try {
      const commentsRef = collection(db, "posts", id, "comments");
      const commentsQuery = query(commentsRef, orderBy("createdAt","asc")); // 코멘트는 오래된 코멘트가 위로
      const commentsSnap = await getDocs(commentsQuery);
      const commentsList = commentsSnap.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      })) as IPost[];
      setComments(commentsList);
    } catch (error) {
      console.error("Error fetching comments: ", error);
    }
  }, [id]);

  useEffect(() => {
    fetchDocument()
    fetchComments()
  }, [id, fetchDocument, fetchComments, trigger])

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setReply(e.target.value)
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const user = auth.currentUser
    if (!user || loading || reply === "" || reply.length > MAX_POST_LENGTH) return
    try {
      setLoading(true)
      const commentsRef = collection(db, "posts", id!, "comments");
      const commentDoc = await addDoc(commentsRef, {
        post: reply,
        createdAt: Date.now(),
        username: user.displayName || "Anonymous",
        userId: user.uid,
      });
      if (file) {
        const locationRef = ref(storage, `posts/comments/${id}/${commentDoc.id}`);
        const result = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(result.ref);
        await updateDoc(commentDoc, { photo: url });
      }
      clearForm()
      fetchComments()
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError("댓글 작성에 실패했습니다." + err.message)
        console.error(error);
        alert(error);
      }
      setError("알수 없는 에러가 발생했습니다." + error)
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const onCancel = () => {
    const confirmCancel = confirm("작성 중이던 댓긍을 모두 지울까요?")

    if (confirmCancel) {
      clearForm()
    }
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
    handleRemoveFile()
    setReply("")
  }

const handleTrigger = ()=> {
  setTrigger(!trigger)
}

  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <Wrapper>
        {post && <Post {...post} />}
        <Divider />
        <Form onSubmit={onSubmit}>
          <ButtonContainer>
            <CancelButton type="button" value="취소" onClick={onCancel} />
            <SubmitButton
              type="submit"
              value={loading ? "Posting..." : "댓글 달기"}
            />
          </ButtonContainer>
          <Reply
            required
            rows={5}
            onChange={onChange}
            value={reply}
            disabled={!user}
            placeholder="댓글을 달아보세요." />
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
        <Divider />
        <CommentsSection>
          {comments.map(comment => (
            <Post key={comment.id} {...comment} isComments={true} originalPostId={id} handleTrigger={handleTrigger}/>
          ))}
        </CommentsSection>
      </Wrapper>
    </Suspense>
  )
}

const Divider = styled.div`
  margin-top: 10px;
  height: 0px;
  border: 1px solid rgba(174, 174, 174, 0.8);
`

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Reply = styled.textarea`
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

const CommentsSection = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
`;