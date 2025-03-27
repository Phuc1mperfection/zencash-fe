import React from 'react';
import AuthForm from '../components/AuthForm';

const Login = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login submitted');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-[#001e2b] to-[#023430]">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute left-1/3 w-96 h-96 bg-[#00ed64]/20 rounded-full filter blur-3xl"></div>
        <div className="absolute right-1/3 bottom-0 w-96 h-96 bg-[#00684A]/20 rounded-full filter blur-3xl"></div>
      </div>
      <AuthForm type="login" onSubmit={handleSubmit} />
    </div>
  );
};

export default Login;