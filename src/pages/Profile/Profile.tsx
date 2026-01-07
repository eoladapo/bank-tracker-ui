import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { logout } from '../../features/auth/authSlice';
import { addToast } from '../../features/ui/uiSlice';
import { useLogoutMutation } from '../../features/auth/authApi';
import { useGetCurrentUserQuery, useUpdateCurrentUserMutation } from '../../features/users/usersApi';
import { MainLayout } from '../../components/layout';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { ConfirmModal } from '../../components/common/Modal';

const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
});

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

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

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  
  const user = useAppSelector((state) => state.auth.user);
  
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // API hooks
  const { data: currentUser, isLoading: isLoadingUser } = useGetCurrentUserQuery();
  const [updateUser, { isLoading: isUpdating }] = useUpdateCurrentUserMutation();
  const [logoutApi, { isLoading: isLoggingOut }] = useLogoutMutation();

  // Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: currentUser?.name || user?.name || '',
      email: currentUser?.email || user?.email || '',
    },
  });

  // Update form when user data loads
  React.useEffect(() => {
    if (currentUser) {
      reset({
        name: currentUser.name,
        email: currentUser.email,
      });
    }
  }, [currentUser, reset]);

  // Navigation handler
  const handleNavigate = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  // Handle edit toggle
  const handleEditToggle = useCallback(() => {
    if (isEditing) {
      // Cancel editing - reset form
      reset({
        name: currentUser?.name || user?.name || '',
        email: currentUser?.email || user?.email || '',
      });
    }
    setIsEditing(!isEditing);
  }, [isEditing, currentUser, user, reset]);

  // Handle profile update
  const onSubmit = async (data: UpdateProfileFormData) => {
    try {
      await updateUser(data).unwrap();
      dispatch(
        addToast({
          type: 'success',
          message: 'Profile updated successfully',
          duration: 3000,
        })
      );
      setIsEditing(false);
    } catch (error: unknown) {
      const errorMessage = error && typeof error === 'object' && 'data' in error
        ? (error.data as { message?: string })?.message || 'Failed to update profile'
        : 'Failed to update profile';
      dispatch(
        addToast({
          type: 'error',
          message: errorMessage,
        })
      );
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logoutApi().unwrap();
    } catch {
      // Continue with logout even if API call fails
    } finally {
      dispatch(logout());
      dispatch(
        addToast({
          type: 'success',
          message: 'Logged out successfully',
          duration: 2000,
        })
      );
      navigate('/login');
    }
  };

  // Handle change password navigation
  const handleChangePassword = useCallback(() => {
    navigate('/profile/change-password');
  }, [navigate]);

  // Loading state
  if (isLoadingUser) {
    return (
      <MainLayout
        userName={user?.name}
        activeNavItem={location.pathname}
        onNavigate={handleNavigate}
        showHeader={false}
        pageKey="profile"
      >
        <div className="p-4 space-y-4">
          <LoadingSkeleton variant="text" width={120} height={32} />
          <LoadingSkeleton variant="card" height={200} />
          <LoadingSkeleton variant="card" height={150} />
        </div>
      </MainLayout>
    );
  }

  const displayUser = currentUser || user;

  return (
    <MainLayout
      userName={user?.name}
      activeNavItem={location.pathname}
      onNavigate={handleNavigate}
      showHeader={false}
      pageKey="profile"
    >
      <div className="p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account settings</p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Profile Info Card */}
          <motion.div variants={itemVariants}>
            <Card>
              <Card.Header>
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEditToggle}
                  >
                    {isEditing ? 'Cancel' : 'Edit'}
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                {isEditing ? (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                      label="Name"
                      {...register('name')}
                      error={errors.name}
                      placeholder="Enter your name"
                    />
                    <Input
                      label="Email"
                      type="email"
                      {...register('email')}
                      error={errors.email}
                      placeholder="Enter your email"
                    />
                    <div className="flex justify-end pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        isLoading={isUpdating}
                      >
                        Save Changes
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="text-base font-medium text-gray-900">{displayUser?.name || '-'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-base font-medium text-gray-900">{displayUser?.email || '-'}</p>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </motion.div>

          {/* Security Card */}
          <motion.div variants={itemVariants}>
            <Card>
              <Card.Header>
                <h2 className="text-lg font-semibold text-gray-900">Security</h2>
              </Card.Header>
              <Card.Body>
                <button
                  onClick={handleChangePassword}
                  className="w-full flex items-center justify-between p-3 -m-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900">Change Password</p>
                      <p className="text-sm text-gray-500">Update your password</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </Card.Body>
            </Card>
          </motion.div>

          {/* Logout Button */}
          <motion.div variants={itemVariants}>
            <Button
              variant="outline"
              fullWidth
              onClick={() => setShowLogoutModal(true)}
              className="border-error text-error hover:bg-red-50"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Logout"
        message="Are you sure you want to logout? You'll need to sign in again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        onConfirm={handleLogout}
        isConfirmLoading={isLoggingOut}
      />
    </MainLayout>
  );
};

export default Profile;
