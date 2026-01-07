import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useAppDispatch } from '../../app/hooks';
import { addToast } from '../../features/ui/uiSlice';
import { useChangePasswordMutation } from '../../features/auth/authApi';
import { SafeAreaWrapper } from '../../components/layout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { changePasswordSchema, type ChangePasswordFormData } from '../../utils/validators';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Handle back navigation
  const handleBack = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  // Handle form submission
  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      }).unwrap();
      
      dispatch(
        addToast({
          type: 'success',
          message: 'Password changed successfully',
          duration: 3000,
        })
      );
      
      reset();
      navigate('/profile');
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'data' in error
        ? (error.data as { message?: string })?.message || 'Failed to change password'
        : 'Failed to change password';
      dispatch(
        addToast({
          type: 'error',
          message: errorMessage,
        })
      );
    }
  };

  return (
    <SafeAreaWrapper className="flex flex-col min-h-screen bg-bg-secondary">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-white border-b border-gray-200">
        <button
          onClick={handleBack}
          className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Go back"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold text-gray-900">Change Password</h1>
      </div>

      {/* Content */}
      <div className="flex-1 p-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <motion.div variants={itemVariants}>
            <Card>
              <Card.Body>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <Input
                    label="Current Password"
                    type="password"
                    {...register('currentPassword')}
                    error={errors.currentPassword}
                    placeholder="Enter your current password"
                    autoComplete="current-password"
                  />
                  
                  <Input
                    label="New Password"
                    type="password"
                    {...register('newPassword')}
                    error={errors.newPassword}
                    placeholder="Enter your new password"
                    helperText="Must be at least 8 characters with an uppercase letter and number"
                    autoComplete="new-password"
                  />
                  
                  <Input
                    label="Confirm New Password"
                    type="password"
                    {...register('confirmPassword')}
                    error={errors.confirmPassword}
                    placeholder="Confirm your new password"
                    autoComplete="new-password"
                  />

                  <div className="pt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      isLoading={isLoading}
                    >
                      Change Password
                    </Button>
                  </div>
                </form>
              </Card.Body>
            </Card>
          </motion.div>

          {/* Password Requirements Info */}
          <motion.div variants={itemVariants}>
            <div className="p-4 bg-primary-50 rounded-lg">
              <h3 className="text-sm font-medium text-primary-800 mb-2">Password Requirements</h3>
              <ul className="text-sm text-primary-700 space-y-1">
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  At least 8 characters long
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Contains at least one uppercase letter
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Contains at least one number
                </li>
              </ul>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </SafeAreaWrapper>
  );
};

export default ChangePassword;
