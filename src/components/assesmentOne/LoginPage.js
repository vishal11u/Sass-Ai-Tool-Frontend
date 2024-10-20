import React, { useEffect, useState } from 'react';
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { toast } from "sonner";
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../reduxAuth/slice/AuthSlice';
import { toast } from 'sonner';
import { CircularProgress } from '@mui/material';

const LoginPage = ({
    setRegister
}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoggedIn, loading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (e) => {
        // console.log("jdhudbdb", username, password);
        dispatch(loginUser({ username, password }))
            .unwrap()
            .then(() => {
                navigate('/');
            })
            .catch((error) => {
                toast.error('Login Error:', error);
                navigate('/login');
            });
        e.preventDefault();
        // try {
        //     const res = await axios.post('http://localhost:5000/api/auth/login', { username, password });
        //     localStorage.setItem('token', res.data.token);
        //     navigate('/data');
        //     toast.success("Login Successfully")
        // } catch (err) {
        //     // toast.error(err.response.data);
        //     toast.error("Invalid Username and Password");
        //     // console.log("subcyycgyc", err);
        // }
    };

    const handleClick = () => {
        setRegister(true);
        navigate('/register');
    };

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                <div>
                    <h2 className="text-center text-3xl font-extrabold text-gray-900">Login in to your account</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                autoComplete="username"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Username or Email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {loading ? <CircularProgress size={18} color="inherit" /> : "Login"}
                        </button>
                    </div>
                    <div className='text-center font-medium text-red-500 text-[15px] w-full'>
                        {error && typeof error === 'object' ? error.message : error}
                    </div>
                </form>
                <div className="-mt-0">
                    <p className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button type='button' onClick={handleClick} className="font-medium text-indigo-600 hover:text-indigo-500">
                            Sign up
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
