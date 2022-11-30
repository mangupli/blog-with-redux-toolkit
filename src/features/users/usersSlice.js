import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = 'https://jsonplaceholder.typicode.com/users';

const initialState = [];

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (state, action) => {
    const response = await axios.get(BASE_URL);
    return response.data;
});

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {},
    extraReducers(builder){
        builder
            .addCase(fetchUsers.fulfilled, (state, action) => {
                //overwtire state completely
                return action.payload;
            });
    }
});

export const selectAllUsers = (state) => state.users;

export const selectUserById = (state, userId) => 
    state.users.find(user => user.id === userId);

export default usersSlice.reducer;

