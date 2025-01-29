import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { supabase } from '../../../lib/supabase';

interface ChatMessage {
  id: string;
  customerName: string;
  lastMessage: string;
  timestamp: Date;
  unread: boolean;
}

interface ChatHistoryProps {
  onSelectConversation: (conversationId: string) => void;
  activeConversationId: string | null;
}

export default function ChatHistory({ onSelectConversation, activeConversationId }: ChatHistoryProps) {
  const [chats, setChats] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const loadChatHistory = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('chat_history')
      .select('conversation_id, content, timestamp, role')
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error loading chat history:', error);
      setLoading(false);
      return;
    }

    const conversationGroups = data.reduce((acc: Record<string, any[]>, msg: any) => {
      if (!acc[msg.conversation_id]) {
        acc[msg.conversation_id] = [];
      }
      acc[msg.conversation_id].push(msg);
      return acc;
    }, {});

    const formattedChats = Object.entries(conversationGroups).map(([id, messages]) => {
      const firstUserMessage = messages.find(msg => msg.role === 'user');
      const lastMessage = messages[messages.length - 1];
      
      return {
        id,
        customerName: firstUserMessage?.content || `Conversation ${id.slice(0, 4)}`,
        lastMessage: lastMessage.content,
        timestamp: new Date(lastMessage.timestamp),
        unread: false
      };
    });

    setChats(formattedChats);
    setLoading(false);
  };

  useEffect(() => {
    loadChatHistory();

    const subscription = supabase
      .channel('chat_history_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_history' }, () => {
        loadChatHistory();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Chat History</h2>
      </div>
      <div className="divide-y divide-gray-200">
        {loading ? (
          <div className="p-4 text-center text-gray-500">Loading...</div>
        ) : chats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No conversations found.</div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onSelectConversation(chat.id)}
              className={`p-4 hover:bg-gray-50 cursor-pointer ${
                activeConversationId === chat.id ? 'bg-indigo-50' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-medium text-gray-900 line-clamp-1">{chat.customerName}</h3>
                <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                  {format(chat.timestamp, 'MMM d, h:mm a')}
                </span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">{chat.lastMessage}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}