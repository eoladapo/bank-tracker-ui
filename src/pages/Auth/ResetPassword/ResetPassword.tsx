import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppDispatch } from '../../../app/hooks';
import { useResetPasswordMutation } from '../../../features/auth/authApi';
import { addToast } from '../../../features/ui/uiSlice';
import { Input } from '../../../components/common/Input';
import { Button } from '../../../components/common/Button';
import { resetPasswordSchema, type ResetPasswordFormData } from '../../../utils/validators';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      dispatch(
        addToast({
          type: 'error',
          message: 'Invalid reset link. Please request a new one.',
        })
      );
      return;
    }

    try {
      await resetPassword({
        token,
        newPassword: data.newPassword,
      }).unwrap();
      
      setIsSuccess(true);
      dispatch(
        addToast({
          type: 'success',
          message: 'Password reset successfully!',
        })
      );
    } catch {
      dispatch(
        addToast({
          type: 'error',
          message: 'Failed to reset password. The link may have expired.',
        })
      );
    }
  };

  // Invalid token state
  if (!token) {
    return (
      <div className="min-h-screen bg-bg-secondary flex flex-col justify-center px-4 py-12 safe-area-inset-top safe-area-inset-bottom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md mx-auto text-center"
        >
          {/* Error Icon */}
          <div className="w-16 h-16 mx-auto mb-6 bg-error/10 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-error"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h1>
          <p className="text-gray-600 mb-6">
            This password reset link is invalid or has expired.
          </p>

          <Link
            to="/forgot-password"
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Request a new reset link
          </Link>
        </motion.div>
      </div>
    );
  }

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-bg-secondary flex flex-col justify-center px-4 py-12 safe-area-inset-top safe-area-inset-bottom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md mx-auto text-center"
        >
          {/* Success Icon */}
          <div className="w-16 h-16 mx-auto mb-6 bg-success/10 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-success"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Reset!</h1>
          <p className="text-gray-600 mb-6">
            Your password has been successfully reset.
          </p>

          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </motion.div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Reset Password</h1>
          <p className="mt-2 text-gray-600">Enter your new password below</p>
        </div>

        {/* Form */}
        <div className="bg-bg-card rounded-2xl shadow-sm p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="New Password"
              type="password"
              placeholder="Enter new password"
              autoComplete="new-password"
              helperText="At least 8 characters with uppercase and number"
              error={errors.newPassword}
              {...register('newPassword')}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="Confirm new password"
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
              Reset Password
            </Button>
          </form>
        </div>

        {/* Back to Login */}
        <p className="mt-6 text-center text-gray-600">
          Remember your password?{' '}
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

export default ResetPassword;
