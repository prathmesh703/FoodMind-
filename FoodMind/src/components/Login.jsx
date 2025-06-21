import { useState } from 'react';
import  axios  from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);
  const [mssg,setMsg] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!isSignIn){
      if(formData.password != formData.confirmPassword){
        setMsg('password doesnt match');
        return;
      }
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/signup`, {
          name: formData.name, 
          email: formData.email,
          password: formData.password
        });
        setMsg(res.data.msg);
      } catch (err){
        setMsg(err.resposne?.data?.message || 'signup failed');
      }
    }
    else {
      try{
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`,{
          email: formData.email,
          password: formData.password
        });
        localStorage.setItem('token', res.data.token);
        setMsg(res.data.msg);
        navigate('/');
      } catch (err){
        setMsg(err.resposne?.data?.message || 'Login failed')
      }
    }
    
  };

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
    // Reset form data when toggling
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    setMsg('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-400 to-teal-500 p-6">
          <div className="flex items-center justify-center">
            <svg className="h-10 w-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
            </svg>
            <h1 className="text-white text-2xl font-bold ml-2">FoodMind</h1>
          </div>
          <p className="text-white text-center mt-2 opacity-90">Your AI-Powered Diet Buddy</p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex border-b">
          <button
            className={`w-1/2 py-4 text-center font-medium text-sm ${
              isSignIn 
                ? 'text-green-600 border-b-2 border-green-500' 
                : 'text-gray-500 hover:text-green-600'
            }`}
            onClick={() => isSignIn ? null : toggleForm()}
          >
            Sign In
          </button>
          <button
            className={`w-1/2 py-4 text-center font-medium text-sm ${
              !isSignIn 
                ? 'text-green-600 border-b-2 border-green-500' 
                : 'text-gray-500 hover:text-green-600'
            }`}
            onClick={() => !isSignIn ? null : toggleForm()}
          >
            Sign Up
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {!isSignIn && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="John Doe"
                required={!isSignIn}
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="••••••••"
              required
            />
          </div>

          {!isSignIn && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                placeholder="••••••••"
                required={!isSignIn}
              />
            </div>
          )}

          {mssg && (
            <div className={`text-sm font-medium text-center ${mssg.toLowerCase().includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                {mssg}
            </div>
          )}


          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              {isSignIn ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 pb-6 text-center">
          <p className="text-sm text-gray-600">
            {isSignIn ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={toggleForm}
              className="ml-1 font-medium text-green-600 hover:text-green-500"
            >
              {isSignIn ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}