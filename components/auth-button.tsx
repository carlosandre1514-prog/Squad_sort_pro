'use client';

import { getAuthService, getGoogleProvider, signInWithPopup, signOut } from '@/lib/firebase';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';
import { User } from 'firebase/auth';

interface AuthButtonProps {
  user: User | null;
}

export function AuthButton({ user }: AuthButtonProps) {
  const handleLogin = async () => {
    const auth = getAuthService();
    if (!auth) return;
    try {
      await signInWithPopup(auth, getGoogleProvider());
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  const handleLogout = async () => {
    const auth = getAuthService();
    if (!auth) return;
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  if (user) {
    return (
      <div className="flex items-center justify-between p-3 bg-slate-950/50 border border-slate-800 rounded-2xl w-full">
        <div className="flex items-center gap-3">
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-green-500/30" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
              <UserIcon size={16} className="text-slate-500" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white truncate max-w-[100px] uppercase tracking-tighter">
              {user.displayName?.split(' ')[0] || 'Usuário'}
            </span>
            <span className="text-[8px] font-bold text-green-500 uppercase tracking-widest">Nuvem Ativa</span>
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="p-2 text-slate-500 hover:text-red-400 transition-colors"
          title="Sair"
        >
          <LogOut size={16} />
        </button>
      </div>
    );
  }

  return (
    <button 
      onClick={handleLogin}
      className="w-full flex items-center justify-center gap-2 p-3 bg-green-600 hover:bg-green-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-[0.98]"
    >
      <LogIn size={14} />
      Salvar na Nuvem
    </button>
  );
}
