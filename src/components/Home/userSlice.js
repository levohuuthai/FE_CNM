import signinAPI from "../../api/signinAPI";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const signin = createAsyncThunk("user/signin", async (payload) => {
  const data = await signinAPI.signIn(payload);
  localStorage.setItem("token", data.data.accessToken);
  localStorage.setItem("user", JSON.stringify(data.data.user));
  localStorage.setItem("refreshToken", data.data.refreshToken);
  // console.log(data);
  return data.data.user;
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    current: JSON.parse(localStorage.getItem("user")),
  },
  reducers: {},
  extraReducers: {
    [signin.fulfilled]: (state, action) => {
      state.current = action.payload; //update trên store
    },
  },
});

const { reducer } = userSlice;
export default reducer;
