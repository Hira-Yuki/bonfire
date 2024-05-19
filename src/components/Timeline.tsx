import { Unsubscribe, collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { styled } from "styled-components";
import { db } from "../firebase";
import Post from "./post";

export interface IPost {
  id: string;
  photo?: string;
  post: string;
  userId: string;
  username: string;
  createdAt: number;
}
const Timeline = () => {
  const [posts, setPosts] = useState<IPost[]>([])

  useEffect(() => {
    let unsubscribe: Unsubscribe | null = null
    const fetchPosts = async () => {
      const postsQuery = query(
        collection(db, "posts"),
        orderBy("createdAt", "desc"),
        limit(20),
      )
      unsubscribe = await onSnapshot(postsQuery, (snapshot) => {
        const posts = snapshot.docs.map((doc) => {
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
      })
    }
    fetchPosts()
    return () => {
      unsubscribe && unsubscribe()
    }
  }, [])
  return (
    <Wrapper>
      {
        posts.map(post => <Post key={post.id} {...post} />)
      }
    </Wrapper>
  )
}

export default Timeline

const Wrapper = styled.div`
  display:flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
`