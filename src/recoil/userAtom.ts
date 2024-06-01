import { atom } from 'recoil';

interface UserState {
  username: string;
  profilePictureUrl: string;
}

export const userState = atom<UserState | null>({
  key: 'userState',
  default: null
});