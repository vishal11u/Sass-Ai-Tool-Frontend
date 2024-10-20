import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../slice/AuthSlice";

const Store = configureStore({
    reducer: {
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    }),
});

export default Store;