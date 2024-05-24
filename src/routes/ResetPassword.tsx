import { useState } from "react"
import { Form, Input, Title, Wrapper, Error, Switcher } from "../styled-components/AuthComponents";
import { FirebaseError } from "firebase/app";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

const ResetPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setLoading] = useState(false)

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = e
    setEmail(value)
  }

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")

    if (isLoading || email === "") return
    try {
      setLoading(true)
      await sendPasswordResetEmail(auth, email)
      alert("입력하신 이메일로 비밀번호 재설정 메일을 발송했습니다.")
      navigate("/")
    } catch (error) {
      if (error instanceof FirebaseError) {
        setError(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Wrapper>
      <Title>비밀번호 찾기</Title>
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
          type="submit"
          value={isLoading ? "Loading..." : "Reset Password"}
        />
      </Form>
      {error !== "" ? <Error>{error}</Error> : null}
      <Switcher>
        <Link to="/login">&larr; 뒤로가기 </Link>
      </Switcher>
    </Wrapper>
  )
}

export default ResetPassword