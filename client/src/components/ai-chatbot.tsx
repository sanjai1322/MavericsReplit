import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIChatbot() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substring(2)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load existing chat history
  const { data: chatHistory } = useQuery({
    queryKey: ["/api/ai/chat", sessionId],
    enabled: isAuthenticated && isOpen,
  });

  // Initialize messages from chat history
  useEffect(() => {
    if (chatHistory?.messages) {
      const formattedMessages = chatHistory.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date()
      }));
      setMessages(formattedMessages);
    } else if (messages.length === 0) {
      // Add welcome message if no history
      setMessages([{
        role: 'assistant',
        content: '👋 Hi! I\'m your AI coding assistant. How can I help you today? I can help with debugging, code explanations, best practices, and more!',
        timestamp: new Date()
      }]);
    }
  }, [chatHistory]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      const response = await apiRequest("POST", "/api/ai/chat", {
        messages: [...messages, { role: 'user', content: userMessage }],
        sessionId
      });
      return response.json();
    },
    onSuccess: (data) => {
      if (data.messages) {
        const formattedMessages = data.messages.map((msg: any) => ({
          ...msg,
          timestamp: new Date()
        }));
        setMessages(formattedMessages);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
      console.error("Chat error:", error);
    },
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !isAuthenticated) return;

    const userMessage = message.trim();
    setMessage("");

    // Add user message immediately
    const newUserMessage: Message = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);

    // Send to AI
    chatMutation.mutate(userMessage);
  };

  const toggleChatbot = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use the AI assistant.",
        variant: "destructive",
      });
      return;
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute bottom-20 right-0 w-80 h-96 glass-morphism rounded-xl shadow-2xl border border-gray-600"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-600 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-[var(--neon-green)] rounded-full animate-pulse"></div>
                <span className="font-orbitron font-bold">AI Assistant</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            
            {/* Messages */}
            <div className="p-4 h-64 overflow-y-auto space-y-3">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    msg.role === 'user' 
                      ? 'bg-[var(--neon-green)] text-[var(--space-900)]' 
                      : 'bg-[var(--space-700)] text-gray-300'
                  }`}>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center mb-1">
                        <i className="fas fa-robot text-[var(--neon-green)] mr-1 text-xs"></i>
                        <span className="text-xs text-[var(--neon-green)]">AI Assistant</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              
              {chatMutation.isPending && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="bg-[var(--space-700)] text-gray-300 p-3 rounded-lg text-sm">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-[var(--neon-green)] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[var(--neon-green)] rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-[var(--neon-green)] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div className="p-4 border-t border-gray-600">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask me anything about coding..."
                  className="flex-1 bg-[var(--space-700)] border border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-[var(--neon-green)] focus:outline-none text-white"
                  disabled={chatMutation.isPending}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || chatMutation.isPending}
                  className="px-3 py-2 bg-[var(--neon-green)] text-[var(--space-900)] rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <i className={`fas ${chatMutation.isPending ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot Toggle Button */}
      <motion.button
        onClick={toggleChatbot}
        className="w-16 h-16 bg-gradient-to-r from-[var(--neon-green)] to-emerald-400 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center animate-pulse-neon"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <i className={`fas ${isOpen ? 'fa-times' : 'fa-robot'} text-[var(--space-900)] text-xl`}></i>
      </motion.button>
    </div>
  );
}
