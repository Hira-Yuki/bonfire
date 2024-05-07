import { SocialButton, SocialLogo } from "./styles/SocialButtonComponents";
import { SocialLogInHandler } from "../helper/SocialLogInHandler";
import { SOCIAL_PROVIDERS } from "../constants/social";

const GithubButton = () => {
  return (
    <SocialButton onClick={() => SocialLogInHandler(SOCIAL_PROVIDERS.GITHUB)}>
      <SocialLogo src="/public/github-logo.svg" />
      Continue with Github
    </SocialButton>
  )
}

export default GithubButton