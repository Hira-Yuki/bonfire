import { Link, Outlet, useNavigate } from 'react-router-dom'
import { styled } from '@linaria/react';
import { auth } from '../firebase'
import { HomeIcon, SearchIcon, BellIcon, ProfileIcon, LogoutIcon } from './icons'
import LoginIcon from './icons/LoginIcon';

const Layout = () => {
  const navigate = useNavigate()
  const user = auth.currentUser

  const onLogOut = async () => {
    const confirmLogOut = confirm("정말로 로그아웃 하시겠습니까?")
    if (confirmLogOut) {
      await auth.signOut()
      navigate("/login")
    }
  }
  console.log(user)
  if (user === null) {
    return (
      <Wrapper>
        <Menu>
          <Link to="/">
            <MenuItem>
              {/* 홈 */}
              <HomeIcon />
            </MenuItem>
          </Link>
          <MenuItem onClick={() => navigate("/login")} className='log-in'>
            {/* 로그인 */}
            <LoginIcon />
          </MenuItem>
        </Menu>
        <Outlet />
      </Wrapper>
    )
  } else {
    return (
      <Wrapper>
        <Menu>
          <Link to="/">
            <MenuItem>
              {/* 홈 */}
              <HomeIcon />
            </MenuItem>
          </Link>
          <Link to="/search">
            <MenuItem>
              {/* 검색 */}
              <SearchIcon />
            </MenuItem>
          </Link>
          <Link to="/notices">
            <MenuItem>
              {/* 알림 */}
              <BellIcon />
            </MenuItem>
          </Link>
          <Link to="/profile">
            <MenuItem>
              {/* 프로필 */}
              <ProfileIcon />
            </MenuItem>
          </Link>
          <MenuItem onClick={onLogOut} className='log-out'>
            {/* 로그아웃 */}
            <LogoutIcon />
          </MenuItem>
        </Menu>
        <Outlet />
      </Wrapper>
    )
  }
}

export default Layout

const Wrapper = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 4fr;
  padding: 50px 0px;
  height: 100%;
  width: 100%;
  max-width: 860px;
  /* 작업 중 */
  height: 100vh;
`

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  /* 작업 중 */
  border-right: 1px solid gray;
`

const MenuItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  height: 50px;
  width: 50px;
  border-radius: 50%;
  svg {
    width: 30px;
    fill: white;
  }
  &.log-out {
    border-color: tomato;
    svg {
      fill: tomato;
    }
  }
  &.log-in {
    border-color: #1d9bf0;
    svg {
      fill: #1d9bf0;
    }
  }
`