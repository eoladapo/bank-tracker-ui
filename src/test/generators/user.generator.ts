import * as fc from 'fast-check';
import type { User, AuthState, LoginCredentials, RegisterData } from '../../types';

export const userArb: fc.Arbitrary<User> = fc.record({
  id: fc.uuid(),
  email: fc.emailAddress(),
  name: fc.string({ minLength: 1, maxLength: 100 }),
  isEmailVerified: fc.boolean(),
  createdAt: fc.date({ min: new Date('2020-01-01'), max: new Date() }).map(d => d.toISOString()),
});

export const loginCredentialsArb: fc.Arbitrary<LoginCredentials> = fc.record({
  email: fc.emailAddress(),
  password: fc.string({ minLength: 8, maxLength: 100 }),
});

export const registerDataArb: fc.Arbitrary<RegisterData> = fc.record({
  email: fc.emailAddress(),
  password: fc.string({ minLength: 8, maxLength: 100 }),
  name: fc.string({ minLength: 1, maxLength: 100 }),
});

export const authStateArb: fc.Arbitrary<AuthState> = fc.record({
  user: fc.option(userArb, { nil: null }),
  accessToken: fc.option(fc.string({ minLength: 10, maxLength: 500 }), { nil: null }),
  refreshToken: fc.option(fc.string({ minLength: 10, maxLength: 500 }), { nil: null }),
  isAuthenticated: fc.boolean(),
  isLoading: fc.boolean(),
  error: fc.option(fc.string({ minLength: 1, maxLength: 200 }), { nil: null }),
});

export const authenticatedAuthStateArb: fc.Arbitrary<AuthState> = fc.record({
  user: userArb,
  accessToken: fc.string({ minLength: 10, maxLength: 500 }),
  refreshToken: fc.string({ minLength: 10, maxLength: 500 }),
  isAuthenticated: fc.constant(true),
  isLoading: fc.constant(false),
  error: fc.constant(null),
});

export const credentialsPayloadArb = fc.record({
  user: userArb,
  accessToken: fc.string({ minLength: 10, maxLength: 500 }),
  refreshToken: fc.string({ minLength: 10, maxLength: 500 }),
});
