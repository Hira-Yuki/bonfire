import { SocialButton, SocialLogo } from "../styled-components/SocialButtonComponents";
import { SocialLogInHandler } from "../helper/SocialLogInHandler";
import { SOCIAL_PROVIDERS } from "../constants/social";

const GoogleButton = () => {
  return (
    <SocialButton onClick={() => SocialLogInHandler(SOCIAL_PROVIDERS.GOOGLE)}>
      <SocialLogo src="/google-logo.svg" />
      Continue with Google
    </SocialButton>
  )
}

export default GoogleButton

