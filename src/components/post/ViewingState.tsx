import React from 'react';
import { styled } from "styled-components";

interface ViewingStateProps {
  username: string;
  post: string;
  photo?: string | null;
  onDelete: () => void;
  onEdit: () => void;
  userOwnsPost: boolean;
  error: string | null;
}

const ViewingState: React.FC<ViewingStateProps> = ({
  username,
  post,
  photo,
  onDelete,
  onEdit,
  userOwnsPost,
  error,
}) => {
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{post}</Payload>
        {userOwnsPost && (
          <ModifyWrapper>
            <DeleteButton onClick={onDelete}>Delete</DeleteButton>
            <ModifyButton onClick={onEdit}>Edit</ModifyButton>
          </ModifyWrapper>
        )}
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </Column>
      <Column>
        {photo && (
          <Column>
            <a href={photo} target="_blank">
              <Photo src={photo} alt="Post" />
            </a>
          </Column>
        )}
      </Column>
    </Wrapper>
  );
};

export default ViewingState;

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
`;

const ModifyButton = styled(DeleteButton)`
  background-color: grey;
  margin-left: 10px;
`;

const Photo = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 15px;
  margin-left: auto;
`;

const ModifyWrapper = styled.div`
  margin-top: auto;
  display: flex;
  align-items: center;
`;

const ErrorMessage = styled.p`
  color: tomato;
  margin-top: 10px;
`;