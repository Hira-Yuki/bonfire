import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FirebaseError } from "firebase/app"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import GithubButton from "../components/GithubButton"
import GoogleButton from "../components/GoogleButton"
import SocialDivider from "../components/SocialDivider"
import {
  Form,
  Input,
  Title,
  Wrapper,
  Error,
  Switcher
}
  from "../styled-components/AuthComponents"

const Login = () => {
  const navigate = useNavigate()
  const [isLoading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { name, value } } = e
    if (name === "email") {
      setEmail(value)
    } else if (name === "password") {
      setPassword(value)
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (isLoading || email === "" || password === "") return
    try {
      setLoading(true)
      await signInWithEmailAndPassword(auth, email, password)
      navigate("/")
    } catch (e) {
      if (e instanceof FirebaseError) {
        setError(e.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Wrapper>
      <Title>Log into Bonfire 🔥</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          value={email}
          name="email"
          placeholder="Email"
          type="email"
          required
        />
        <Input
          onChange={onChange}
          value={password}
          name="password"
          placeholder="Password"
          type="password"
          required
        />
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Log In"}
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        계정이 없으세요? <Link to="/create-account">지금 생성하세요 &rarr;</Link>
      </Switcher>
      <Switcher>
        비밀번호를 잊으셨나요? <Link to="/reset-password">비밀번호 재설정하기 &rarr;</Link>
      </Switcher>
      <SocialDivider />
      <GoogleButton />
      <GithubButton />
    </Wrapper>
  )
}

export default Login