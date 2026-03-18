import { asyncThunkCreator, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
const API_URL = import.meta.env.VITE_API_URL;

export const loginUser = createAsyncThunk('loginUser', async ({ email, password }, thunkAPI) => {
    try {
        let response = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password })
        });

        let data = await response.json();
        if (!response.ok) {
            return thunkAPI.rejectWithValue(data);
        }
        let decoded = jwtDecode(data.token);
        return {
            token: data.token,
            role: decoded.role
        }

    }
    catch (err) {
        console.log("Error in loginUser: ", err);
        return thunkAPI.rejectWithValue("Login Failed");
    }


});


const initialState = {
    token: localStorage.getItem('token') || null,
    role: null,
    status: null,
    error: null
}


let authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {
        logOut: (state) => {
            state.token = null;
            state.status = null;
            localStorage.removeItem('token');
        }
    },
    extraReducers: (builder) => {
        builder.addCase(loginUser.pending, (state) => {
            state.status = "pending"
        }).addCase(loginUser.fulfilled, (state, action) => {
            state.status = "success";
            state.token = action.payload.token;
            state.role = action.payload.role;
            localStorage.setItem('token', state.token);
        }).addCase(loginUser.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload;
        })
    }
});

export const { logOut } = authSlice.actions;
export default authSlice.reducer;