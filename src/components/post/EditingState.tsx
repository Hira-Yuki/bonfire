import React from 'react';
import { styled } from '@linaria/react';

interface EditingStateProps {
  username: string;
  editedPost: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onEdit: () => void;
  onCancel: () => void;
  newPhotoURL?: string;
  photo?: string | null;
  newPhoto: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeFile: (e: React.MouseEvent<HTMLButtonElement>) => void;
  $removePhoto: boolean;
  error: string | null;
}

const EditingState: React.FC<EditingStateProps> = ({
  username,
  editedPost,
  onChange,
  onEdit,
  onCancel,
  newPhotoURL,
  photo,
  newPhoto,
  onFileChange,
  removeFile,
  $removePhoto,
  error,
}) => {

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <div>
          <TextArea value={editedPost} onChange={onChange} />
          <SaveButton onClick={onEdit}>Save</SaveButton>
          <CancelButton onClick={onCancel}>Cancel</CancelButton>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </div>
      </Column>
      <Column>
        <div>
          <AttachFileLabel htmlFor="new-file">
            {photo ? (
              <ImagePreviewContainer>
                <Photo src={newPhotoURL} alt="New Post" $removePhoto={$removePhoto} />
                <RemoveImageButton onClick={removeFile}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                    <path
                      fillRule="evenodd"
                      d="M6.75 3A2.25 2.25 0 0 0 4.5 5.25v.75H3a.75.75 0 0 0 0 1.5h1.5v10.5A2.25 2.25 0 0 0 6.75 20.25h10.5A2.25 2.25 0 0 0 19.5 18V7.5H21a.75.75 0 0 0 0-1.5h-1.5V5.25A2.25 2.25 0 0 0 17.25 3H6.75Zm7.5 13.5a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 1.5 0v7.5Zm-4.5 0a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 1.5 0v7.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </RemoveImageButton>
              </ImagePreviewContainer>
            ) : newPhoto ? (
              <Photo src={newPhotoURL} alt="New Post" />
            ) : (
              <div>이미지 추가하기</div>
            )}
          </AttachFileLabel>
          <AttachFileInput type="file" id="new-file" accept="image/*" onChange={onFileChange} />
        </div>
      </Column>
    </Wrapper>
  );
};

export default EditingState;

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

const TextArea = styled.textarea`
  display: block;
  margin: 10px 0px;
  font-size: 18px;
  width: 95%;
  border: 2px solid white;
  border-radius: 10px;
  padding: 20px;
  resize: none;
  font-size: 16px;
  color: white;
  background-color: transparent;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;

  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;

const SaveButton = styled.button`
  background-color: #1d9bf0;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const CancelButton = styled(SaveButton)`
  background-color: tomato;
  margin-left: 10px;
`;

const AttachFileLabel = styled.label`
  color: #1d9bf0;
  width: 100px;
  height: 100px;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

interface PhotoProps {
  $removePhoto?: boolean;
}

const Photo = styled.img<PhotoProps>`
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 15px;
  margin-left: auto;
  filter: ${({ $removePhoto }) => ($removePhoto ? "grayscale(100%)" : "none")};
`;

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

const ImagePreviewContainer = styled.div`
  position: relative;
  width: fit-content;
  height: 120px;
`;

const ErrorMessage = styled.p`
  color: tomato;
  margin-top: 10px;
`;