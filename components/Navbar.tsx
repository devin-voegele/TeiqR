'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { LogOut, Settings, User } from 'lucide-react';

interface NavbarProps {
  user?: {
    email?: string;
    user_metadata?: {
      username?: string;
    };
  } | null;
}

export default function Navbar({ user }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const getInitials = () => {
    if (user?.user_metadata?.username) {
      return user.user_metadata.username.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  return (
    <nav className="bg-background/95 border-b border-border/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href={user ? '/app' : '/'} className="text-2xl font-bold bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
              TeiqR
            </Link>
          </div>

          {user && (
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-accent to-purple-500 text-white font-semibold hover:scale-105 transition-transform shadow-lg shadow-accent/20"
                >
                  {getInitials()}
                </button>

                {dropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 bg-card/95 border border-border/50 rounded-xl shadow-2xl backdrop-blur-xl z-20 overflow-hidden">
                      <div className="py-2">
                        <div className="px-4 py-3 text-sm text-gray-400 border-b border-border/50">
                          {user.email}
                        </div>
                        <Link
                          href="/settings"
                          className="flex items-center px-4 py-3 text-sm text-foreground hover:bg-muted/50 transition-all duration-200 group"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Settings className="w-4 h-4 mr-3 text-gray-400 group-hover:text-accent transition-colors" />
                          <span className="group-hover:text-white transition-colors">Settings</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-sm text-foreground hover:bg-muted/50 transition-all duration-200 group"
                        >
                          <LogOut className="w-4 h-4 mr-3 text-gray-400 group-hover:text-red-400 transition-colors" />
                          <span className="group-hover:text-white transition-colors">Log out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
