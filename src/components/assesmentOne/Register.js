import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import CircularProgress from '@mui/material/CircularProgress';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const Register = ({ setRegister }) => {
    const [formData, setFormData] = useState({ username: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const role = "superAdmin";

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { username, password, confirmPassword } = formData;

        if (password !== confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        setLoading(true);
        try {
            await axios.post('https://best-aitool-backend.vercel.app/auth/signup', { username, password, confirmPassword, role });
            toast.success("Registered successfully!");
            navigate('/login');
            setRegister(false);
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Registration failed. Please try again.";
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigateToLogin = () => {
        setRegister(false);
        navigate('/login');
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-center text-3xl font-extrabold text-gray-900">Create New Account</h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <InputField
                            id="username"
                            name="username"
                            type="text"
                            label="Username"
                            value={formData.username}
                            onChange={handleInputChange}
                            placeholder="Username"
                        />
                        <PasswordField
                            id="password"
                            name="password"
                            label="Password"
                            value={formData.password}
                            onChange={handleInputChange}
                            showPassword={showPassword}
                            togglePasswordVisibility={togglePasswordVisibility}
                            placeholder="Password"
                        />
                        <PasswordField
                            id="confirmPassword"
                            name="confirmPassword"
                            label="Confirm Password"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            showPassword={showPassword}
                            togglePasswordVisibility={togglePasswordVisibility}
                            placeholder="Confirm Password"
                        />
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {loading ? <CircularProgress size={18} color="inherit" /> : "Register"}
                        </button>
                    </div>
                </form>
                <div className="mt-6">
                    <p className="text-center text-sm text-gray-600">
                        Already have an account?{' '}
                        <a href="/login" onClick={handleNavigateToLogin} className="font-medium text-indigo-600 hover:text-indigo-500">
                            Log in
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

const InputField = ({ id, name, type, label, value, onChange, placeholder }) => (
    <div>
        <label htmlFor={id} className="sr-only">{label}</label>
        <input
            id={id}
            name={name}
            type={type}
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
    </div>
);

const PasswordField = ({ id, name, label, value, onChange, showPassword, togglePasswordVisibility, placeholder }) => (
    <div className="relative">
        <label htmlFor={id} className="sr-only">{label}</label>
        <input
            id={id}
            name={name}
            type={showPassword ? "text" : "password"}
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        />
        <div
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 cursor-pointer"
            onClick={togglePasswordVisibility}
        >
            {showPassword ? <VisibilityOff /> : <Visibility />}
        </div>
    </div>
);

export default Register;

