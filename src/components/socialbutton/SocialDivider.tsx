import { styled } from "styled-components"

export default function SocialDivider () {
  return (
    <Divider />
  )
}

const Divider = styled.hr`
    width: 100%;
    margin-top: 40px;
    margin-bottom: 10px;
    border-color: gray;
    opacity: 0.5;
`