import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FirebaseError } from "firebase/app"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import { Wrapper, Title, Input, Switcher, Error, Form } from "../components/AuthComponents"


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

    console.log(email, password)

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
        계정이 없으세요? <Link to="/create-account">계정 생성하기&rarr;</Link>
      </Switcher>
    </Wrapper>
  )
}

export default Login