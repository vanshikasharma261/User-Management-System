import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"


const API_URL = import.meta.env.VITE_API_URL;
const initialState = {
    users: [],
    status: null,
    error: null
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    try {
        const response = await fetch(`${API_URL}/api/users`, {
            method: "GET",
            headers: {
                "Authorization": "Bearer " + token,
            },
        });

        const data = await response.json();
        if (!response.ok) {
            return thunkAPI.rejectWithValue(data);
        }
        return data.data;
    }
    catch (err) {
        console.log("there is error in fetch users: ", err);
        return thunkAPI.rejectWithValue("Error while fetching users");
    }

});

let userSlice = createSlice({
    name: "users",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUsers.pending, (state) => {
            state.status = "pending"
        }).addCase(fetchUsers.fulfilled, (state, action) => {
            state.status = "success";
            state.users = action.payload;
        }).addCase(fetchUsers.rejected, (state, action) => {
            state.status = "failed";
            state.error = action.payload;
        })
    }
});


export default userSlice.reducer;