import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import roomAPI from "../../api/roomAPI";

export const roomAfterLogin = createAsyncThunk(
  "/rooms/getRoomAfterLogin/",
  async () => {
    const data = await roomAPI.getRoomAfterLogin();
    return data.data;
  }
);

const roomSlice = createSlice({
  name: "room",
  initialState: {
    current: roomAfterLogin,
  },
  reducers: {},
  extraReducers: {
    [roomAfterLogin.fulfilled]: (state, action) => {
      state.current = action.payload; //update trên store
    },
  },
});

const { reducer } = roomSlice;
export default reducer;
