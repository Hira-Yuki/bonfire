import { useNavigate } from "react-router-dom";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { SOCIAL_PROVIDERS } from "../constants/social";

export const SocialLogInHandler = async (providerType: string) => {
  const navigate = useNavigate();
  try {
    let provider;
    if (providerType === SOCIAL_PROVIDERS.GOOGLE) {
      provider = new GoogleAuthProvider();
    } else if (providerType === SOCIAL_PROVIDERS.GITHUB) {
      provider = new GithubAuthProvider();
    } else {
      throw new Error("Invalid provider type")
    }
    await signInWithPopup(auth, provider);
    navigate("/"); 
  } catch (error) {
    console.error(error);
  }
};
