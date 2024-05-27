import { styled } from "@linaria/react"
import { SearchIcon } from "../components/icons"
import { Suspense, useEffect, useState } from "react"
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { IPost } from "../components/Timeline";
import { FirebaseError } from "firebase/app";
import debounce from "../helper/Debounce";
import React from "react";

const Post = React.lazy(() => import("../components/post/Post"));


export default function Search() {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    const debouncedSearch = debounce(async (value: string) => {
      if (value.length === 0) return;
      try {
        setLoading(true);
        const q = query(
          collection(db, "posts"),
          where("username", ">=", value),
          where("username", "<=", value + "\uf8ff"),
          limit(10)
        );
        const querySnapshot = await getDocs(q);
        const searchResults: IPost[] = [];
        querySnapshot.forEach((doc) => {
          searchResults.push({ ...doc.data(), id: doc.id } as IPost);
        });
        setResults(searchResults);
      } catch (error) {
        if (error instanceof FirebaseError) {
          alert(error.message);
        }
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, 300);

    debouncedSearch(searchTerm);

    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm]);

  const onChangeSearchTerm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    if (!loading && results.length === 0 && searchTerm.length > 0) {
      setEmpty(true);
    } else {
      setEmpty(false);
    }
  }, [loading, results, searchTerm]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSearchTerm("")
  }

  return (
    <Wrapper>
      <Form onSubmit={onSubmit}>
        <Row>
          <TextInput
            type="text"
            placeholder="검색"
            value={searchTerm}
            onChange={onChangeSearchTerm}
          />
          <SearchButton type="submit">
            <SearchIcon />
          </SearchButton>
        </Row>
      </Form>
      <Results>
        {loading && <div>Loading...</div>}
        {empty && !loading && <div>검색 결과가 없습니다.</div>}
        {results.map((post) => (
          <Suspense fallback={<div>Loading...</div>}>
            <Post key={post.id} {...post} />
          </Suspense>
        ))}
      </Results>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: scroll;
  grid-template-rows: 1fr 5fr;
`

const Form = styled.form`
  display: flex;
  gap: 10px;
  width: 100%;
  margin: 10px auto;
  height: 40px;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin: 10px 5px;
  gap: 5px;
  width: 100%;
  height: 100%;
  align-content: center;
  justify-content: center;
  align-items: center;
`

const TextInput = styled.input`
  height: 40px;
  width: 100%;
  max-width: 420px;
  border: 2px solid white;
  border-radius: 25px;
  padding: 10px 25px;
  font-size: 16px;
  color: white;
  background-color: black;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
    Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  &::placeholder {
    padding: 10px;
    font-size: 16px;
    color: #aaa;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`
const SearchButton = styled.button`
  background-color: transparent;
  width: 40px;
  height: 40px;
  border: none;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  svg {
    width: 100%;
    height: 100%;
    fill: #1d9bf0;
  }
`;

const Results = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  overflow-y: scroll;
`;
