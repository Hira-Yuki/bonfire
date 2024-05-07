import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth"
import { useState } from "react"
import { auth } from "../firebase"
import { Link, useNavigate } from "react-router-dom"
import { FirebaseError } from "firebase/app"
import { Wrapper, Title, Input, Switcher, Error, Form } from "../components/styles/AuthComponents"
import GithubButton from "../components/GithubButton"
import GoogleButton from "../components/GoogleButton"
import SocialDivider from "../components/SocialDivider"

// const errors = {
//   "auth/email-already-in-use" : "이미 존재하는 이메일 주소입니다."
// }

const CreateAccount = () => {
  const navigate = useNavigate()
  const [isLoading, setLoading] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { name, value } } = e
    if (name === "name") {
      setName(value)
    } else if (name === "email") {
      setEmail(value)
    } else if (name === "password") {
      setPassword(value)
    } else if (name === "confirmPassword") {
      setConfirmPassword(value)
    }
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    if (confirmPassword === "" || confirmPassword !== password) {
      setError("입력한 암호를 정확히 확인해주세요.")
      return
    }

    if (isLoading || name === "" || email === "" || password === "") return
    try {
      setLoading(true)
      // firebase를 이용해서 유저 계정을 생성
      const credentials = await createUserWithEmailAndPassword(auth, email, password)
      // 유저 계정 생성시 이름이 필요하지 않음, 가입시 입력 받은 것을 이용해서 바로 업데이트 해줌
      await updateProfile(credentials.user, { displayName: name, })
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
      <Title>Join Bonfire 🔥</Title>
      <Form onSubmit={onSubmit}>
        <Input
          onChange={onChange}
          value={name}
          name="name"
          placeholder="Name"
          type="text"
          required
        />
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
          onChange={onChange}
          value={confirmPassword}
          name="confirmPassword"
          placeholder="Confirm Password"
          type="password"
          required
        />
        <Input
          type="submit"
          value={isLoading ? "Loading..." : "Create Account"}
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        이미 계정이 있으세요? <Link to="/login">로그인 하기 &rarr;</Link>
      </Switcher>
      <SocialDivider />
      <GoogleButton />
      <GithubButton />
    </Wrapper>
  )
}

export default CreateAccount