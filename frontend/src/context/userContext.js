import {persist} from "zustand/middleware";
import { create } from "zustand";

const userStore = create(
  persist((set) => ({
    user: null,
    isAuth : false,
    login: (user) => set(() => ({ user , isAuth : true })),
    logout: () => set(() => ({ user : null , isAuth : false })),
  })),
  {
    name: "user-storage",
  }
);

export {userStore};
