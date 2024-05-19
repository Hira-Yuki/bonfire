import { styled } from '@linaria/react';
import React, { Suspense } from "react";
import LoadingScreen from "../components/LoadingScreen";

const PostForm = React.lazy(() => import("../components/PostForm"));
const Timeline = React.lazy(() => import("../components/Timeline"));

const Home = () => {

  return (
    <Suspense fallback={<LoadingScreen/>}>
      <Wrapper>
        <PostForm />
        <Timeline />
      </Wrapper>
    </Suspense>
  )
}

export default Home

const Wrapper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: scroll;
  grid-template-rows: 1fr 5fr;
`