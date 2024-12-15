import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { jwtDecode } from "jwt-decode";  

const AuthService = () => {
    const apiUrl = 'https://best-aitool-backend.vercel.app/auth/login';
    return apiUrl;
};

const getStoredUser = () => {
    const userData = localStorage.getItem("user");
    return userData ? JSON.parse(userData) : null;
};

const storedUser = getStoredUser();
const initialState = {
    isLoggedIn: !!storedUser && !!storedUser.token,
    user: storedUser,
    roles: storedUser ? jwtDecode(storedUser.token).roles : [],
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk('user/loginUser', async ({ username, password }, { rejectWithValue }) => {
    try {
        const response = await axios.post(AuthService(), { username, password });
        if (response.data.token) {
            localStorage.setItem('user', JSON.stringify(response.data));
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('loginTime', Date.now());
        }
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response ? error.response.data : { message: "Unknown error occurred" });
    }
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        logout: (state) => {
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            localStorage.removeItem('loginTime');
            state.isLoggedIn = false;
            state.user = null;
            state.roles = [];
        },
    },
    
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                const token = action.payload.token;
                const decodedToken = jwtDecode(token);
                state.isLoggedIn = true;
                state.user = action.payload;
                state.roles = decodedToken.roles || [];
                state.loading = false;
                state.error = null;

                const logoutAfter = 24 * 60 * 60 * 1000;
                
                setTimeout(() => {
                    state.isLoggedIn = false;
                    state.user = null;
                    state.roles = [];
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    localStorage.removeItem('loginTime');
                }, logoutAfter);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ? action.payload.message || 'Invalid Username and Password' : 'Unknown error';
            });
    },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
