import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppDispatch } from '../../../app/hooks';
import { setCredentials, setError } from '../../../features/auth/authSlice';
import { useRegisterMutation } from '../../../features/auth/authApi';
import { addToast } from '../../../features/ui/uiSlice';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { registerSchema, type RegisterFormData } from '../../../utils/validators';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [registerUser, { isLoading }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
      }).unwrap();
      
      dispatch(
        setCredentials({
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        })
      );
      
      dispatch(
        addToast({
          type: 'success',
          message: 'Account created! Please verify your email.',
        })
      );
      
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = 'Registration failed. Please try again.';
      dispatch(setError(errorMessage));
      dispatch(
        addToast({
          type: 'error',
          message: errorMessage,
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col justify-center px-4 py-12 safe-area-inset-top safe-area-inset-bottom">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-2 text-gray-600">Start your financial journey with SpendWise</p>
        </div>

        {/* Form */}
        <div className="bg-bg-card rounded-2xl shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              error={errors.name}
              {...register('name')}
            />

            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              error={errors.email}
              {...register('email')}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create a password"
              autoComplete="new-password"
              helperText="At least 8 characters with uppercase and number"
              error={errors.password}
              {...register('password')}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
              autoComplete="new-password"
              error={errors.confirmPassword}
              {...register('confirmPassword')}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </form>
        </div>

        {/* Login Link */}
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
