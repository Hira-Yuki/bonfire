import { styled } from "@linaria/react"
import { auth, db, storage } from "../firebase"
import React, { useEffect, useState } from "react"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { updateProfile } from "firebase/auth"
import { collection, getDocs, limit, orderBy, query, where } from "firebase/firestore"
import { IPost } from "../components/Timeline"
import Post from "../components/post/Post"

export default function Profile() {
  const user = auth.currentUser
  const [avatar, setAvatar] = useState(user?.photoURL)
  const [posts, setPosts] = useState<IPost[]>([])

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target
    if (!user) return
    if (files && files.length === 1) {
      const file = files[0]
      const locationRef = ref(storage, `avatars/${user?.uid}`)
      const result = await uploadBytes(locationRef, file)
      const avatarURL = await getDownloadURL(result.ref)
      setAvatar(avatarURL)
      await updateProfile(user, {
        photoURL: avatarURL,
      })
    }
  }

  useEffect(() => {
    const fetchPosts = async () => {
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
    }
    fetchPosts()
  }, [user?.uid, posts])

  return (
    <Wrapper>
      <AvatarUpload htmlFor="avatar">
        {avatar ? (
          <AvatarImg src={avatar} />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
          </svg>
        )}
      </AvatarUpload>
      <AvatarInput id="avatar" type="file" accept="image/*" onChange={handleAvatarChange} />
      <Name>
        {user?.displayName ?? "Anonymous"}
      </Name>
      <Posts>
        {posts.map(post =>
          (<Post key={post.id} {...post} />)
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