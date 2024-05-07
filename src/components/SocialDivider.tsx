import { styled } from "styled-components"

const SocialDivider = () => {
  return (
    <Divider />
  )
}

export default SocialDivider

const Divider = styled.hr`
    width: 100%;
    margin-top: 40px;
    margin-bottom: 10px;
    border-color: gray;
    opacity: 0.8;
`