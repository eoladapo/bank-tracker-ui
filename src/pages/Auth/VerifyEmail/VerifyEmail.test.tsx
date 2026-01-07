import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { configureStore } from '@reduxjs/toolkit';
import { VerifyEmail } from './VerifyEmail';
import authReducer from '../../../features/auth/authSlice';
import uiReducer from '../../../features/ui/uiSlice';
import { api } from '../../../features/api/baseApi';

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<object>) => (
      <div {...props}>{children}</div>
    ),
  },
}));

// Mock navigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock the auth API hooks
const mockVerifyEmail = vi.fn();
const mockResendVerification = vi.fn();

vi.mock('../../../features/auth/authApi', () => ({
  useVerifyEmailMutation: () => [
    mockVerifyEmail,
    { isLoading: false },
  ],
  useResendVerificationMutation: () => [
    mockResendVerification,
    { isLoading: false },
  ],
}));

const createTestStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      ui: uiReducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });
};

const renderWithProviders = (
  ui: React.ReactElement,
  { route = '/verify-email', store = createTestStore() } = {}
) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/verify-email" element={ui} />
          <Route path="/dashboard" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('VerifyEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockVerifyEmail.mockReset();
    mockResendVerification.mockReset();
  });

  describe('Component Rendering', () => {
    it('renders the verification page with title', () => {
      renderWithProviders(<VerifyEmail />);
      
      expect(screen.getByText('Verify Your Email')).toBeInTheDocument();
    });

    it('renders 6 input fields for the code', () => {
      renderWithProviders(<VerifyEmail />);
      
      const inputs = screen.getAllByRole('textbox');
      expect(inputs).toHaveLength(6);
    });

    it('renders the resend code button', () => {
      renderWithProviders(<VerifyEmail />);
      
      expect(screen.getByRole('button', { name: /resend code/i })).toBeInTheDocument();
    });

    it('renders navigation links to login and register', () => {
      renderWithProviders(<VerifyEmail />);
      
      expect(screen.getByText('Back to Sign In')).toBeInTheDocument();
      expect(screen.getByText('Create Account')).toBeInTheDocument();
    });

    it('displays email from query params', () => {
      renderWithProviders(<VerifyEmail />, {
        route: '/verify-email?email=test@example.com',
      });
      
      expect(screen.getByText(/test@example.com/)).toBeInTheDocument();
    });

    it('displays generic message when no email provided', () => {
      renderWithProviders(<VerifyEmail />);
      
      expect(screen.getByText(/Enter the 6-digit code sent to your email/)).toBeInTheDocument();
    });
  });


  describe('Error Message Display', () => {
    it('displays error message when verification fails', async () => {
      mockVerifyEmail.mockReturnValue({
        unwrap: () => Promise.reject(new Error('Invalid code')),
      });

      renderWithProviders(<VerifyEmail />);
      
      // Enter all 6 digits to trigger verification
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach((input, index) => {
        fireEvent.change(input, { target: { value: String(index + 1) } });
      });

      await waitFor(() => {
        expect(screen.getByText('Invalid or expired verification code')).toBeInTheDocument();
      });
    });

    it('displays error when resend fails', async () => {
      mockResendVerification.mockReturnValue({
        unwrap: () => Promise.reject(new Error('Failed to resend')),
      });

      renderWithProviders(<VerifyEmail />, {
        route: '/verify-email?email=test@example.com',
      });
      
      const resendButton = screen.getByRole('button', { name: /resend code/i });
      fireEvent.click(resendButton);

      await waitFor(() => {
        expect(screen.getByText('Failed to resend code. Please try again.')).toBeInTheDocument();
      });
    });

    it('displays error when trying to resend without email', async () => {
      renderWithProviders(<VerifyEmail />);
      
      const resendButton = screen.getByRole('button', { name: /resend code/i });
      fireEvent.click(resendButton);

      await waitFor(() => {
        expect(screen.getByText('Email address is required to resend code')).toBeInTheDocument();
      });
    });
  });

  describe('Success Redirect', () => {
    it('redirects to dashboard on successful verification', async () => {
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        isEmailVerified: true,
        createdAt: new Date().toISOString(),
      };

      mockVerifyEmail.mockReturnValue({
        unwrap: () => Promise.resolve({
          user: mockUser,
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
          accessTokenExpiresIn: 3600,
          refreshTokenExpiresIn: 86400,
        }),
      });

      renderWithProviders(<VerifyEmail />);
      
      // Enter all 6 digits to trigger verification
      const inputs = screen.getAllByRole('textbox');
      inputs.forEach((input, index) => {
        fireEvent.change(input, { target: { value: String(index + 1) } });
      });

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
      });
    });

    it('calls verifyEmail with the entered code', async () => {
      mockVerifyEmail.mockReturnValue({
        unwrap: () => Promise.resolve({
          user: { id: '1', email: 'test@example.com', name: 'Test', isEmailVerified: true, createdAt: '' },
          accessToken: 'token',
          refreshToken: 'refresh',
          accessTokenExpiresIn: 3600,
          refreshTokenExpiresIn: 86400,
        }),
      });

      renderWithProviders(<VerifyEmail />);
      
      const inputs = screen.getAllByRole('textbox');
      const code = '123456';
      code.split('').forEach((digit, index) => {
        fireEvent.change(inputs[index], { target: { value: digit } });
      });

      await waitFor(() => {
        expect(mockVerifyEmail).toHaveBeenCalledWith({ token: '123456' });
      });
    });
  });

  describe('Resend Functionality', () => {
    it('calls resendVerification with email when resend button clicked', async () => {
      mockResendVerification.mockReturnValue({
        unwrap: () => Promise.resolve({ message: 'Code sent' }),
      });

      renderWithProviders(<VerifyEmail />, {
        route: '/verify-email?email=test@example.com',
      });
      
      const resendButton = screen.getByRole('button', { name: /resend code/i });
      fireEvent.click(resendButton);

      await waitFor(() => {
        expect(mockResendVerification).toHaveBeenCalledWith({ email: 'test@example.com' });
      });
    });

    it('does not call resendVerification when email is missing', async () => {
      renderWithProviders(<VerifyEmail />);
      
      const resendButton = screen.getByRole('button', { name: /resend code/i });
      fireEvent.click(resendButton);

      await waitFor(() => {
        expect(mockResendVerification).not.toHaveBeenCalled();
      });
    });
  });
});
