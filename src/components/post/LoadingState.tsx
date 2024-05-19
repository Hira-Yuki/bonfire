import React from 'react';
import { styled } from '@linaria/react';

interface LoadingStateProps {
  username: string;
  error: string | null;
}

const LoadingState: React.FC<LoadingStateProps> = ({ username, error }) => {
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>업데이트 중...</Payload>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Column>
      <Column>
        <ImagePreviewContainer />
      </Column>
    </Wrapper>
  );
};

export default LoadingState;

const Wrapper = styled.section`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 10px;
  padding-right: 20px;
  font-size: 18px;
  line-height: 1.4;
`;

const ImagePreviewContainer = styled.div`
  position: relative;
  width: fit-content;
  height: 120px;
`;

const ErrorMessage = styled.p`
  color: tomato;
  margin-top: 10px;
`;