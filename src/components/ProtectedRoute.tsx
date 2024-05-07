import { Navigate } from "react-router-dom"
import { auth } from "../firebase"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {

  const user = auth.currentUser
  // auth의 currentUser는 로그인된 경우 user정보를 아닌 경우 null을 반환함
  // null이 반환되는 경우 비 로그인 사용자이므로 로그인 유저만 접근 가능한 페이지로 이동할 수 없도록 함
  if (user === null) {
    return <Navigate to="/login" />
  }
  return children
}

export default ProtectedRoute