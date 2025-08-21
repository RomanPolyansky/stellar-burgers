import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TUser } from "@utils-types";
import { log } from "console";

type LoginState = {
  user: TUser | null;
  error: string | null;
};

const initialState: LoginState = {
  user: null,
  error: null
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  selectors: {
    selectIsLoggedIn: (state) => state.user !== null,
    selectUser: (state) => state.user,
  },
  reducers: {
    loginSuccess: (state, action: PayloadAction<TUser>) => {
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.error = null;
    },
  },
});

export const { loginSuccess, loginFailure, logout } = loginSlice.actions;

export const { selectIsLoggedIn, selectUser } = loginSlice.selectors;

export default loginSlice.reducer;
