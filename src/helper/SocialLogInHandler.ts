import { useNavigate } from "react-router-dom";
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase";
import { SOCIAL_PROVIDERS, SocialProviderType } from "../constants/social";
import { FirebaseError } from "firebase/app";

export const SocialLogInHandler = async (providerType: SocialProviderType) => {
  const navigate = useNavigate();
  try {
    let provider;
    switch (providerType) {
      case SOCIAL_PROVIDERS.GOOGLE:
        provider = new GoogleAuthProvider();
        break;
      case SOCIAL_PROVIDERS.GITHUB:
        provider = new GithubAuthProvider();
        break;
      default:
        throw new Error("Invalid provider type");
    }
    await signInWithPopup(auth, provider);
    navigate("/"); 
  } catch (error) {
    if (error instanceof FirebaseError) {
      alert(error.message)
    }
    console.error(error);
  }
};
