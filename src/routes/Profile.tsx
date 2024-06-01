import { styled } from "@linaria/react"
import { auth, db, storage } from "../firebase"
import React, { useCallback, useEffect, useState } from "react"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { updateProfile } from "firebase/auth"
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore"
import { IPost } from "../components/Timeline"
import Post from "../components/post/Post"
import { resizeFile } from "../helper/fileControl"
import { FirebaseError } from "firebase/app"
import { useNavigate } from "react-router-dom"
import { useRecoilState } from "recoil"
import { userState } from "../recoil/userAtom"
import NoProfileImage from "../components/icons/NoProfileImage"

export default function Profile() {
  const user = auth.currentUser
  const [userData, setUserData] = useRecoilState(userState);
  const [name, setName] = useState(userData?.username)
  const [avatar, setAvatar] = useState(userData?.profilePictureUrl)
  const [posts, setPosts] = useState<IPost[]>([])
  const [editMode, setEditMode] = useState(false)
  const [isResizing, setIsResizing] = useState(false)

  const navigate = useNavigate()

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target

    try {
      setIsResizing(true)
      if (!user) return
      if (files && files.length === 1) {
        const file = files[0]
        // if (fileSizeChecker(file)) return
        const resizedFile = await resizeFile(file, 512, 512)
        const locationRef = ref(storage, `avatars/${user?.uid}`)
        const result = await uploadBytes(locationRef, resizedFile)
        const avatarURL = await getDownloadURL(result.ref)
        setAvatar(avatarURL)
        await updateProfile(user, {
          photoURL: avatarURL,
        })
        setUserData((prev) => prev ? { ...prev, profilePictureUrl: avatarURL } : null)
      }
    } catch (error) {
      if (error instanceof FirebaseError) {
        alert("이미지를 업로드하는 중 에러가 발생했습니다. 잠시 후 다시 시도해주세요." + error.message)
      }

      console.error(error)
    } finally {
      setIsResizing(false)
    }

  }

  const handleChangeNameClick = async () => {
    if (!user) return;
    setEditMode((prev) => !prev);
    if (!editMode) return;
    try {
      await updateProfile(user, {
        displayName: name,
      });
    } catch (error) {
      if (error instanceof FirebaseError) {
        alert("이름 변경에 실패했습니다. 잠시 후 다시 시도해 보세요." + error.message)
      }
    } finally {
      setEditMode(false)
    }
  };

  const handleName = (event: React.ChangeEvent<HTMLInputElement>) =>
    setName(event.target.value);

  const fetchPosts = useCallback(async () => {
    const postQuery = query(
      collection(db, "posts"),
      where("userId", "==", user?.uid),
      orderBy("createdAt", "desc"),
      limit(20)
    )
    const snapshot = await getDocs(postQuery)
    const posts = snapshot.docs.map(doc => {
      const { post, createdAt, userId, username, photo } = doc.data()
      return {
        post,
        createdAt,
        userId,
        username,
        photo,
        id: doc.id
      }
    })
    setPosts(posts)
  }, [user?.uid]);

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  return (
    <Wrapper>
      {isResizing ? (
        <Resizing>
          업로드 중
        </Resizing>
      ) : (
        <AvatarUpload htmlFor="avatar">
          {avatar ? (
            <AvatarImg src={avatar} />
          ) : (
            <NoProfileImage />
          )}
        </AvatarUpload>
      )
      }
      <AvatarInput
        id="avatar"
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
      />
      {editMode ? (
        <NameInput onChange={handleName} type="text" value={name} />
      ) : (
        <Name>{name ?? "Anonymous"}</Name>
      )}
      <ChangeNameBtn onClick={handleChangeNameClick}>
        {editMode ? "Save" : "Change Name"}
      </ChangeNameBtn>
      <Posts>
        {posts.map(post =>
        (
          <PostContainer key={post.id}>
            <Links key={post.id} onClick={() => navigate(`/post/${post.id}`)}>
              더보기
            </Links>
            <Post {...post} />
          </PostContainer>
        )
        )}
      </Posts>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`

const Resizing = styled.div`
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
`

const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`

const AvatarImg = styled.img`
  width: 100%;
  height: 100%;
`

const AvatarInput = styled.input`
  display: none;
`
const Name = styled.span`
  font-size: 22px;
`

const Posts = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`

const NameInput = styled.input`
  background-color: black;
  font-size: 22px;
  text-align: center;
  color: white;
  border: 1px solid white;
  border-radius: 15px;
`

const ChangeNameBtn = styled.button`
  background-color: #1d9bf0;;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 10px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`

const PostContainer = styled.div`
  position: relative;
`

const Links = styled.div`
  cursor: pointer;
  position: absolute;
  right: 50%;
  top: 15px;
  padding: 5px 10px;
  border-radius: 15px;
  background-color: #1d9bf0;
  opacity: 0.8;
  z-index: 10;
  &:hover,
  &:active {
    opacity: 1;
  };
`
