import { styled } from "@linaria/react"

export default function NotFound() {
  return (
    <Wrapper>
      <Header>
        404 Error: Not found
      </Header>
      <Message>
        페이지를 찾을 수 없습니다.
        <br />
        페이지가 삭제되었거나 주소가 올바르지 않습니다.
      </Message>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column; 
  align-items: center; 
  gap: 10px;
`
const Header = styled.h3`
  font-weight: 700;
  font-size: 32px;
  margin: 30px;
  padding: 20px;
  color: tomato;
`

const Message = styled.p`
  font-size: 20px;
`