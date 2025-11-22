'use client';

import { MessageSquare, PanelLeftClose, PanelLeft, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function Sidebar({
  chatSessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  isOpen,
  onToggle
}) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  const groupedSessions = chatSessions.reduce((groups, session) => {
    const date = formatDate(session.created_at);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(session);
    return groups;
  }, {});

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed lg:relative top-0 left-0 h-screen bg-gray-900 text-white transition-transform duration-300 z-50 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-[260px] flex flex-col`}
      >
        <div className="p-3 border-b border-gray-700 flex items-center justify-between">
          <Button
            onClick={onNewChat}
            className="flex-1 bg-gray-800 hover:bg-gray-700 text-white justify-start gap-2"
          >
            <Plus className="h-4 w-4" />
            New chat
          </Button>
          <Button
            onClick={onToggle}
            size="icon"
            variant="ghost"
            className="ml-2 lg:hidden text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <PanelLeftClose className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-3 space-y-4">
            {Object.entries(groupedSessions).map(([date, sessions]) => (
              <div key={date}>
                <h3 className="text-xs font-semibold text-gray-400 mb-2 px-2">
                  {date}
                </h3>
                <div className="space-y-1">
                  {sessions.map((session) => (
                    <button
                      key={session.id}
                      onClick={() => {
                        onSelectSession(session.id);
                        if (window.innerWidth < 1024) {
                          onToggle();
                        }
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-800 transition-colors flex items-center gap-2 ${
                        currentSessionId === session.id
                          ? 'bg-gray-800'
                          : 'text-gray-300'
                      }`}
                    >
                      <MessageSquare className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{session.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {chatSessions.length === 0 && (
              <div className="text-center text-gray-500 text-sm py-8">
                No chats yet
              </div>
            )}
          </div>
        </ScrollArea>
      </aside>
    </>
  );
}
