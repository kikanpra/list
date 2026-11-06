import React, { useState } from 'react';
import { User } from 'firebase/auth';
import { loginWithGoogle, logoutUser } from '../lib/firebase';
import { Cloud, LogIn, LogOut, Loader2, Check } from 'lucide-react';

interface AuthButtonProps {
  user: User | null;
  loading: boolean;
  onLoginSuccess?: () => void;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ user, loading, onLoginSuccess }) => {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await loginWithGoogle();
      onLoginSuccess?.();
    } catch (err) {
      console.error('Sign in error:', err);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutUser();
      setShowDropdown(false);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#1664B0] bg-[#EFE8DE] rounded-xl border border-[#1664B0]/20">
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
        <span className="hidden sm:inline">Checking cloud...</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown((prev) => !prev)}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#EFE8DE] border border-[#1664B0]/25 hover:border-[#1664B0] transition-all cursor-pointer shadow-xs"
          title={`Signed in as ${user.email} (Cloud Synced)`}
        >
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || 'User'}
              referrerPolicy="no-referrer"
              className="w-6 h-6 rounded-full object-cover border border-[#1664B0]/30"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-[#1664B0] text-white flex items-center justify-center text-xs font-bold">
              {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
            </div>
          )}

          <div className="hidden md:flex flex-col text-left leading-none">
            <span className="text-xs font-bold text-[#111827] max-w-[100px] truncate">
              {user.displayName?.split(' ')[0] || 'User'}
            </span>
            <span className="text-[10px] text-[#1664B0] font-semibold flex items-center gap-1">
              <Cloud className="w-2.5 h-2.5 text-[#1664B0]" />
              Cloud Synced
            </span>
          </div>
        </button>

        {showDropdown && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
            />
            <div className="absolute right-0 mt-2 w-64 bg-[#EFE8DE] rounded-2xl border-2 border-[#1664B0]/20 shadow-xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="pb-2 mb-2 border-b border-[#1664B0]/15">
                <p className="text-xs font-bold text-[#111827] truncate">
                  {user.displayName || 'Google User'}
                </p>
                <p className="text-[11px] text-[#111827]/60 truncate">{user.email}</p>
                <div className="flex items-center gap-1.5 text-[11px] text-[#1664B0] font-semibold mt-1">
                  <Check className="w-3 h-3 text-[#D21624]" />
                  <span>Tasks synced to Firebase</span>
                </div>
              </div>

              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-[#D21624] hover:bg-[#D21624]/10 rounded-xl transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={isSigningIn}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold tracking-wider uppercase bg-[#EFE8DE] text-[#1664B0] border border-[#1664B0] hover:bg-white active:scale-[0.98] transition-all cursor-pointer shadow-xs"
      title="Connect with Google to save tasks permanently in your Firebase cloud database"
    >
      {isSigningIn ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span className="hidden sm:inline">Connecting...</span>
        </>
      ) : (
        <>
          <Cloud className="w-3.5 h-3.5 text-[#1664B0]" />
          <span>Connect Cloud</span>
        </>
      )}
    </button>
  );
};
