import { SocialButton, SocialLogo } from "../styled-components/SocialButtonComponents";
import { SocialLogInHandler } from "../helper/SocialLogInHandler";
import { SOCIAL_PROVIDERS } from "../constants/social";

const GithubButton = () => {
  return (
    <SocialButton onClick={() => SocialLogInHandler(SOCIAL_PROVIDERS.GITHUB)}>
      <SocialLogo src="/github-logo.svg" />
      Continue with Github
    </SocialButton>
  )
}

export default GithubButton