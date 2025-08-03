import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { X, Bot, Loader2, Send, Settings } from "lucide-react";
import AISetupModal from "./ai-setup-modal";

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
  const [showSetup, setShowSetup] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check AI service status
  const { data: aiStatus } = useQuery({
    queryKey: ["/api/ai/status"],
    enabled: isAuthenticated && isOpen,
  });

  // Load existing chat history
  const { data: chatHistory } = useQuery<{ messages?: Message[] }>({
    queryKey: ["/api/ai/chat", sessionId],
    enabled: isAuthenticated && isOpen,
  });

  // Initialize messages from chat history
  useEffect(() => {
    if (chatHistory?.messages) {
      const formattedMessages = chatHistory.messages.map((msg: Message) => ({
        ...msg,
        timestamp: new Date()
      }));
      setMessages(formattedMessages);
    } else if (messages.length === 0 && aiStatus?.configured) {
      // Add welcome message if no history and AI is configured
      setMessages([{
        role: 'assistant',
        content: '👋 Hi! I\'m your Qwen AI coding assistant. How can I help you today? I can help with debugging, code explanations, optimization, and more!',
        timestamp: new Date()
      }]);
    } else if (messages.length === 0 && !aiStatus?.configured) {
      // Add setup message if AI is not configured
      setMessages([{
        role: 'assistant',
        content: '🤖 Hi! I\'m your AI coding assistant, but I need to be configured first. Click the settings button to provide your Qwen API key.',
        timestamp: new Date()
      }]);
    }
  }, [chatHistory, aiStatus]);

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
                <div className={`w-3 h-3 rounded-full animate-pulse ${aiStatus?.configured ? 'bg-[var(--neon-green)]' : 'bg-yellow-500'}`}></div>
                <span className="font-orbitron font-bold">Qwen AI Assistant</span>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => setShowSetup(true)}
                  className="p-1 hover:bg-gray-700 rounded"
                  title="AI Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
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
                        <Bot className="text-[var(--neon-green)] mr-1 w-3 h-3" />
                        <span className="text-xs text-[var(--neon-green)]">Qwen AI</span>
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
                  placeholder={aiStatus?.configured ? "Ask me anything about coding..." : "Configure AI to start chatting..."}
                  className="flex-1 bg-[var(--space-700)] border border-gray-600 rounded-lg px-3 py-2 text-sm focus:border-[var(--neon-green)] focus:outline-none text-white"
                  disabled={chatMutation.isPending || !aiStatus?.configured}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || chatMutation.isPending || !aiStatus?.configured}
                  className="px-3 py-2 bg-[var(--neon-green)] text-[var(--space-900)] rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {chatMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Setup Modal */}
      <AISetupModal open={showSetup} onOpenChange={setShowSetup} />

      {/* Chatbot Toggle Button */}
      <motion.button
        onClick={toggleChatbot}
        className={`w-16 h-16 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center animate-pulse-neon ${
          aiStatus?.configured 
            ? 'bg-gradient-to-r from-[var(--neon-green)] to-emerald-400' 
            : 'bg-gradient-to-r from-yellow-500 to-orange-500'
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {isOpen ? (
          <X className="text-[var(--space-900)] w-6 h-6" />
        ) : (
          <Bot className="text-[var(--space-900)] w-6 h-6" />
        )}
      </motion.button>
    </div>
  );
}