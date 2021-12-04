import { createSlice } from "@reduxjs/toolkit";
const listUserSlice = createSlice({
  name: "listUser",
  initialState: {
    listUser: [],
  },
  reducers: {
    addListUser(state, action) {
      const newUser = action.payload;
      const index = state.listUser.findIndex((x) => x.id === newUser.id);
      if (index >= 0) {
        //có rồi thì ko push
      } else {
        //chưa có thì push
        state.listUser.push(newUser);
      }
    },
    removeListUser(state, action) {
      const idNeedToRemove = action.payload.idNeedToRemove;
      state.listUser = state.listUser.filter((x) => x.id !== idNeedToRemove);
    },
  },
});

const { actions, reducer } = listUserSlice;
export const { addListUser, removeListUser } = actions;
export default reducer;
