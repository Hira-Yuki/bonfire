import { QueryDocumentSnapshot, collection, getDocs, limit, onSnapshot, orderBy, query, startAfter } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { styled } from '@linaria/react';
import { db } from "../firebase";
import Post from "./post/Post";
import { useNavigate } from "react-router-dom";

export interface IPost {
  id: string;
  photo?: string;
  post: string;
  userId: string;
  username: string;
  createdAt: number;
}

const Timeline = () => {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const navigate = useNavigate()

  const PAGE_SIZE = 5;

  const getData = async (lastDoc: QueryDocumentSnapshot | null = null) => {
    try {
      let postQuery
      if (lastDoc) {
        postQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"), startAfter(lastDoc), limit(PAGE_SIZE));
      } else {
        postQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(PAGE_SIZE));
      }

      const querySnapshot = await getDocs(postQuery);
      const data: IPost[] = [];
      querySnapshot.forEach((doc) => {
        data.push({ ...doc.data(), id: doc.id } as IPost);
      });

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];
      const hasMore = querySnapshot.docs.length === PAGE_SIZE;

      return { data, lastVisible, hasMore };
    } catch (error) {
      console.error("Error fetching data: ", error);
      return { data: [], lastVisible: null, hasMore: false };
    }
  };

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return; // 중복 로딩 및 더 이상 데이터가 없는 경우 방지
    setLoading(true);
    const { data, lastVisible, hasMore: newHasMore } = await getData(lastDoc);
    setPosts((prevItems) => {
      // 중복 데이터 방지
      const existingIds = new Set(prevItems.map(post => post.id));
      const newPosts = data.filter(post => !existingIds.has(post.id));
      return [...prevItems, ...newPosts];
    });
    setLastDoc(lastVisible);
    setHasMore(newHasMore);
    setLoading(false);
  }, [lastDoc, loading, hasMore]);

  useEffect(() => {
    loadMore();
  }, [loadMore]);

  useEffect(() => {
    const postQuery = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(PAGE_SIZE));
    const unsubscribe = onSnapshot(postQuery, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const data = { ...change.doc.data(), id: change.doc.id } as IPost;
        if (change.type === "added") {
          setPosts((prevPosts) => {
            const existingIds = new Set(prevPosts.map(post => post.id));
            if (!existingIds.has(data.id)) {
              return [data, ...prevPosts];
            }
            return prevPosts;
          });
        } else if (change.type === "removed") {
          setPosts((prevPosts) => prevPosts.filter(post => post.id !== change.doc.id));
        } else if (change.type === "modified") {
          setPosts((prevPosts) => prevPosts.map(post => post.id === data.id ? data : post));
        }
      });
    });

    return () => unsubscribe();
  }, []);


  const lastItemRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, loadMore, hasMore]
  );

  return (
    <Wrapper>
      {
        posts.map((post, index) => {
          if (posts.length === index + 1) {
            return (
              <PostContainer ref={lastItemRef} key={post.id}>
                <Links key={post.id} onClick={() => navigate(`/post/${post.id}`)}>
                  더보기
                </Links>
                <Post {...post} />
              </PostContainer>
            );
          } else {
            return (
              <PostContainer key={post.id}>
                <Links key={post.id} onClick={() => navigate(`/post/${post.id}`)}>
                  더보기
                </Links>
                <Post {...post} />
              </PostContainer>
            );
          }
        })
      }
      {loading && <p>Loading...</p>}
      {!hasMore && <p>No more posts</p>}
    </Wrapper>
  );
}

export default Timeline;

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
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

