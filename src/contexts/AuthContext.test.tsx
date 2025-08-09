import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@/test/utils';
import { AuthProvider, useAuth } from './AuthContext';
import { ReactNode } from 'react';

// Mock Supabase
const mockUser = {
  id: 'user123',
  email: 'test@example.com',
  aud: 'authenticated',
  role: 'authenticated',
  app_metadata: {},
  user_metadata: {},
  created_at: '2024-01-01',
  updated_at: '2024-01-01'
};

const mockSupabase = {
  auth: {
    getSession: vi.fn(() => Promise.resolve({
      data: { session: { user: mockUser } },
      error: null
    })),
    signInWithPassword: vi.fn(() => Promise.resolve({
      data: { user: mockUser },
      error: null
    })),
    signUp: vi.fn(() => Promise.resolve({
      data: { user: mockUser },
      error: null
    })),
    signOut: vi.fn(() => Promise.resolve({ error: null })),
    onAuthStateChange: vi.fn(() => ({
      data: { subscription: { unsubscribe: vi.fn() } }
    }))
  }
};

vi.mock('@/integrations/supabase/client', () => ({
  supabase: mockSupabase
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should provide initial state', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.user).toBeNull();
    expect(result.current.loading).toBe(true);
  });

  it('should handle successful login', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.signIn('test@example.com', 'password');
    });
    
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password'
    });
  });

  it('should handle successful signup', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.signUp('test@example.com', 'password');
    });
    
    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password'
    });
  });

  it('should handle sign out', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.signOut();
    });
    
    expect(mockSupabase.auth.signOut).toHaveBeenCalled();
  });

  it('should handle authentication errors', async () => {
    const errorMessage = 'Invalid credentials';
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { user: null },
      error: { message: errorMessage }
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await expect(result.current.signIn('wrong@email.com', 'wrongpassword'))
      .rejects.toThrow(errorMessage);
  });

  it('should establish session on mount', async () => {
    mockSupabase.auth.getSession.mockResolvedValueOnce({
      data: { session: { user: mockUser } },
      error: null
    });

    const { result } = renderHook(() => useAuth(), { wrapper });
    
    // Wait for session to be established
    await vi.waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    
    expect(mockSupabase.auth.getSession).toHaveBeenCalled();
  });

  it('should set up auth state change listener', () => {
    renderHook(() => useAuth(), { wrapper });
    
    expect(mockSupabase.auth.onAuthStateChange).toHaveBeenCalled();
  });
});
