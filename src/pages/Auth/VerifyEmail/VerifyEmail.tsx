import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppDispatch } from '../../../app/hooks';
import { setCredentials } from '../../../features/auth/authSlice';
import { useVerifyEmailMutation, useResendVerificationMutation } from '../../../features/auth/authApi';
import { addToast } from '../../../features/ui/uiSlice';
import { Button } from '../../../components/common/Button';
import { CodeInput } from '../../../components/common/CodeInput';

export const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';

  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();

  const handleVerify = async (verificationCode: string) => {
    setError('');
    try {
      const result = await verifyEmail({ token: verificationCode }).unwrap();
      dispatch(
        setCredentials({
          user: result.user,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        })
      );
      dispatch(addToast({ type: 'success', message: 'Email verified successfully!' }));
      navigate('/dashboard');
    } catch {
      setError('Invalid or expired verification code');
      setCode('');
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError('Email address is required to resend code');
      return;
    }
    try {
      await resendVerification({ email }).unwrap();
      dispatch(addToast({ type: 'success', message: 'Verification code sent!' }));
    } catch {
      setError('Failed to resend code. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-bg-secondary flex flex-col justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Verify Your Email</h1>
          <p className="mt-2 text-gray-600">
            {email ? `Enter the 6-digit code sent to ${email}` : 'Enter the 6-digit code sent to your email'}
          </p>
        </div>

        <div className="bg-bg-card rounded-2xl shadow-sm p-6">
          <div className="space-y-6">
            <CodeInput
              value={code}
              onChange={setCode}
              onComplete={handleVerify}
              disabled={isVerifying}
              error={!!error}
            />

            {error && (
              <p className="text-center text-red-600 text-sm">{error}</p>
            )}

            <Button
              type="button"
              variant="secondary"
              size="lg"
              fullWidth
              onClick={handleResend}
              isLoading={isResending}
              disabled={isVerifying}
            >
              Resend Code
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center space-y-2">
          <p className="text-gray-600">
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
              Back to Sign In
            </Link>
          </p>
          <p className="text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 hover:text-primary-700 font-medium">
              Create Account
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
