import { GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { styled } from "styled-components"
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

const GoogleButton = () => {
  const navigate = useNavigate()
  const onClick = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/")
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Button onClick={onClick}>
      <Logo src="/public/google-logo.svg" />
      Continue with Google
    </Button>
  )
}

export default GoogleButton

const Button = styled.span`
  background-color: white;
  font-weight: 500;
  width: 90%;
  color: black;
  margin-top: 20px;
  padding: 10px 20px;
  border-radius: 50px;
  border: 0;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

const Logo = styled.img`
  height: 25px;
`