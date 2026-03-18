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
            return thunkAPI.rejectWithValue({
                message: data.message,
                status: response.status
            });
        }
        return data.data;
    }
    catch (err) {
        console.log("there is error in fetch users: ", err);
        return thunkAPI.rejectWithValue("Error while fetching users");
    }

});


export const deleteUser = createAsyncThunk('users/deleteUser', async (userId, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    try {
        const response = await fetch(`${API_URL}/api/users/${userId}`, {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + token,
            },

        });
        const result = await response.json();
        if (!response.ok) {
            return thunkAPI.rejectWithValue({
                message: result.message,
                status: result.status
            });
        }
        return userId;
    }
    catch (err) {
        console.log("Error while deleting user: ", err);
        return thunkAPI.rejectWithValue("Deleting user failed");
    }

});


export const createUser = createAsyncThunk('users/createUser', async (newUser, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    try {
        const response = await fetch(`${API_URL}/api/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify(newUser)
        });
        const result = await response.json();
        if (!response.ok) {
            return thunkAPI.rejectWithValue({
                message: result.message,
                status: response.status,
                ...(result.data && { data: result.data })
            });
        }
        return result.data;

    }
    catch (err) {
        console.log("error while creating a user", err);
        return thunkAPI.rejectWithValue("Creating user failed")
    }
});


export const updateUser = createAsyncThunk('users/updateUser', async (data, thunkAPI) => {
    const token = thunkAPI.getState().auth.token;
    try {
        const response = await fetch(`${API_URL}/api/users/${data.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
            body: JSON.stringify({ firstName: data.firstName, email: data.email, status: data.status })
        });

        const result = await response.json();
        if (!response.ok) {
            return thunkAPI.rejectWithValue({
                message: result.message,
                status: response.status,
                ...(result.data && { data: result.data })
            })
        }
        return result.data;
    }
    catch (err) {
        console.log("error while updating user: ", err);
        return thunkAPI.rejectWithValue("Error while updating user");

    }

})

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
        }).addCase(deleteUser.fulfilled, (state, action) => {
            state.users = state.users.filter((user) => user._id != action.payload)
        }).addCase(deleteUser.rejected, (state, action) => {
            state.error = action.payload
        }).addCase(createUser.fulfilled, (state, action) => {
            console.log("Action payload in createUser.fulfilled: ", action.payload);
            state.users.push(action.payload);
        }).addCase(createUser.rejected, (state, action) => {
            console.log("Action payload in rejection of createUser: ", action.payload);
            state.error = action.payload?.data;
        }).addCase(updateUser.fulfilled, (state, action) => {
            console.log("Action payload in updateUser is : ", action.payload);
            let index = state.users.findIndex((u) => u._id == action.payload._id);
            state.users[index] = action.payload;
        }).addCase(updateUser.rejected, (state, action) => {
            console.log("Action payload in rejection of updateeUser: ", action.payload);
            state.error = action.payload?.data;
        })
    }
});


export default userSlice.reducer;