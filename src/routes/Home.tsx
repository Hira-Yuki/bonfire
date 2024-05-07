import { auth } from "../firebase"

/**
 * 
 * protected-route 테스트...
 */
const Home = () => {
  const logOut = () =>{
    auth.signOut()
    
  }
  return (
    <h1>
      <button onClick={logOut}>log Out</button>
    </h1>
  )
}

export default Home