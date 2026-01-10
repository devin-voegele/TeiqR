'use client';

import { Conversation } from '@/types/chat';
import { Plus, MessageSquare, LogOut, Settings, User, Search, Trash2, Edit2, MoreVertical, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface PerplexitySidebarProps {
  conversations: Conversation[];
  currentConversationId?: string;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function PerplexitySidebar({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  user,
  isOpen,
  onClose,
}: PerplexitySidebarProps) {
  const router = useRouter();
  const supabase = createClient();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [contextMenu, setContextMenu] = useState<{ id: string; x: number; y: number } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Reset time to midnight for accurate day comparison
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = nowOnly.getTime() - dateOnly.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    // Show full date for older items
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
  };

  const getDateGroup = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    
    // Reset time to midnight for accurate day comparison
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const nowOnly = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = nowOnly.getTime() - dateOnly.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return 'Previous 7 Days';
    if (diffDays < 30) return 'Previous 30 Days';
    return 'Older';
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this conversation?')) return;
    
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', id);

    if (!error) {
      window.location.reload();
    }
  };

  const handleRename = async (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    
    const { error } = await supabase
      .from('conversations')
      .update({ title: newTitle.trim() })
      .eq('id', id);

    if (!error) {
      setEditingId(null);
      window.location.reload();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedConversations = filteredConversations.reduce((groups, conv) => {
    const group = getDateGroup(conv.created_at);
    if (!groups[group]) groups[group] = [];
    groups[group].push(conv);
    return groups;
  }, {} as Record<string, Conversation[]>);

  const groupOrder = ['Today', 'Yesterday', 'Previous 7 Days', 'Previous 30 Days', 'Older'];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        exit={{ x: -300 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        className="fixed left-0 top-0 h-full w-64 bg-[#0F0F0F] border-r border-[#1F1F1F] flex flex-col z-40 lg:z-0"
      >
        {/* Header */}
        <div className="p-3 border-b border-[#1F1F1F]">
          <button
            onClick={onNewChat}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#2A2A2A] hover:bg-[#3A3A3A] text-gray-300 hover:text-white rounded-lg transition-colors duration-200 text-sm"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        {/* Search */}
        <div className="px-3 py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Conversations */}
        <div className="flex-1 overflow-y-auto px-2 pb-2">
          {filteredConversations.length === 0 ? (
            <div className="text-center text-gray-600 text-sm py-8">
              {searchQuery ? 'No conversations found' : 'No conversations yet'}
            </div>
          ) : (
            <div className="space-y-4">
              {groupOrder.map(groupName => {
                const groupConvs = groupedConversations[groupName];
                if (!groupConvs || groupConvs.length === 0) return null;

                return (
                  <div key={groupName}>
                    <div className="px-3 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      {groupName}
                    </div>
                    <div className="space-y-1">
                      {groupConvs.map((conv) => (
                        <div
                          key={conv.id}
                          className="relative group"
                          onContextMenu={(e) => {
                            e.preventDefault();
                            setContextMenu({ id: conv.id, x: e.clientX, y: e.clientY });
                          }}
                        >
                          {editingId === conv.id ? (
                            <div className="px-3 py-2 bg-[#1F1F1F] rounded-lg">
                              <input
                                type="text"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleRename(conv.id, editTitle);
                                  if (e.key === 'Escape') setEditingId(null);
                                }}
                                onBlur={() => handleRename(conv.id, editTitle)}
                                autoFocus
                                className="w-full bg-transparent text-sm text-white outline-none"
                              />
                            </div>
                          ) : (
                            <div
                              onClick={() => onSelectConversation(conv.id)}
                              className={`w-full text-left px-3 py-2.5 rounded-lg transition-all duration-200 cursor-pointer ${
                                currentConversationId === conv.id
                                  ? 'bg-[#1F1F1F] text-white'
                                  : 'text-gray-400 hover:bg-[#1A1A1A] hover:text-gray-200'
                              }`}
                            >
                              <div className="flex items-start gap-2">
                                <MessageSquare className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{conv.title}</p>
                                  <p className="text-xs text-gray-600 mt-0.5">{formatDate(conv.created_at)}</p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setContextMenu({ id: conv.id, x: e.clientX, y: e.clientY });
                                  }}
                                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[#2A2A2A] rounded transition-all"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Context Menu */}
        <AnimatePresence>
          {contextMenu && (
            <>
              <div
                className="fixed inset-0 z-50"
                onClick={() => setContextMenu(null)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1 }}
                style={{
                  position: 'fixed',
                  left: contextMenu.x,
                  top: contextMenu.y,
                  zIndex: 51,
                }}
                className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg shadow-2xl py-1 min-w-[160px]"
              >
                <button
                  onClick={() => {
                    const conv = conversations.find(c => c.id === contextMenu.id);
                    if (conv) {
                      setEditTitle(conv.title);
                      setEditingId(conv.id);
                    }
                    setContextMenu(null);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-[#2A2A2A] transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  Rename
                </button>
                <button
                  onClick={() => {
                    handleDelete(contextMenu.id);
                    setContextMenu(null);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-[#2A2A2A] transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* User section */}
        <div className="border-t border-[#1F1F1F] p-3">
          <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-[#1A1A1A] transition-colors">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold">
              {user?.email?.substring(0, 2).toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.email}</p>
            </div>
          </div>
          
          <div className="mt-2 space-y-1">
            <Link
              href="/settings"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#1A1A1A] rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#1A1A1A] rounded-lg transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-[#1A1A1A] rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
