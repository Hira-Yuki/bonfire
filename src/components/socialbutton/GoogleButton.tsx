import { SOCIAL_PROVIDERS } from "../../constants/social"
import { SocialLogInHandler } from "../../helper/SocialLogInHandler"
import { SocialButton, SocialLogo } from "../../styled-components/SocialButtonComponents"

const GoogleButton = () => {
  return (
    <SocialButton onClick={() => SocialLogInHandler(SOCIAL_PROVIDERS.GOOGLE)}>
      <SocialLogo src="/google-logo.svg" />
      Continue with Google
    </SocialButton>
  )
}

export default GoogleButton

