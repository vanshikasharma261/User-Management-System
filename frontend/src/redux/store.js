import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authslice";
import userReducer from "./userslice";


const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer
    }
});

export default store;