import { styled } from "styled-components"
import { IPost } from "./Timeline"
import { auth, db, storage } from "../firebase"
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";



const Post = ({ username, photo, post, userId, id }: IPost) => {
  const user = auth.currentUser;
  const onDelete = async () => {
    const ok = confirm("포스트를 정말로 삭제할까요?")
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "posts", id))
      if (photo) {
        const photoRef = ref(storage, `posts/${user.uid}/${id}`)
        await deleteObject(photoRef)
      }
    } catch (e) {
      console.log(e);
    }
  }
  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{post}</Payload>
        {
          user?.uid === userId ? <DeleteButton onClick={onDelete}>Delete</DeleteButton> : null
        }
      </Column>
      <Column>
        {photo ? (
          <a href={photo} target="_blank"><Photo src={photo} /></a>
        ) : null}
      </Column>
    </Wrapper>
  )
}

export default Post

const Wrapper = styled.section`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`

const Column = styled.div``

const Photo = styled.img`
  display: block;
  width: 100px;
  height: 100px;
  border-radius: 15px;
  margin-left: auto;
`

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`
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
`