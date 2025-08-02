import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AIAssistantProps {
  code: string;
  language: string;
}

interface CodeAssistanceResponse {
  suggestion: string;
  improvedCode?: string;
  explanation: string;
}

const assistanceTypes = [
  {
    id: 'debug',
    title: 'Debug Code',
    description: 'Find and fix bugs in your code',
    icon: 'fas fa-bug',
    color: 'text-red-400',
    buttonColor: 'bg-red-500 hover:bg-red-600'
  },
  {
    id: 'optimize',
    title: 'Optimize Code',
    description: 'Improve performance and best practices',
    icon: 'fas fa-rocket',
    color: 'text-[var(--neon-blue)]',
    buttonColor: 'bg-[var(--neon-blue)] hover:bg-blue-600'
  },
  {
    id: 'explain',
    title: 'Explain Code',
    description: 'Get detailed explanations of how code works',
    icon: 'fas fa-lightbulb',
    color: 'text-yellow-400',
    buttonColor: 'bg-yellow-500 hover:bg-yellow-600'
  },
  {
    id: 'generate',
    title: 'Generate Function',
    description: 'Create new functions based on requirements',
    icon: 'fas fa-magic',
    color: 'text-purple-400',
    buttonColor: 'bg-purple-500 hover:bg-purple-600'
  }
];

export default function AIAssistant({ code, language }: AIAssistantProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeResponse, setActiveResponse] = useState<CodeAssistanceResponse | null>(null);
  const [question, setQuestion] = useState("");
  const [showQuestionInput, setShowQuestionInput] = useState<string | null>(null);

  const assistanceMutation = useMutation({
    mutationFn: async ({ type, userQuestion }: { type: string; userQuestion?: string }) => {
      const response = await apiRequest("POST", "/api/ai/code-assistance", {
        code,
        language,
        question: userQuestion,
        type
      });
      return response.json();
    },
    onSuccess: (data: CodeAssistanceResponse) => {
      setActiveResponse(data);
      setShowQuestionInput(null);
      setQuestion("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to get AI assistance. Please try again.",
        variant: "destructive",
      });
      console.error("AI assistance error:", error);
    },
  });

  const handleAssistanceRequest = (type: string, userQuestion?: string) => {
    if (!code.trim()) {
      toast({
        title: "No Code",
        description: "Please write some code first before requesting assistance.",
        variant: "destructive",
      });
      return;
    }

    assistanceMutation.mutate({ type, userQuestion });
  };

  const handleQuestionSubmit = (type: string) => {
    if (question.trim()) {
      handleAssistanceRequest(type, question.trim());
    }
  };

  return (
    <div className="bg-[var(--space-800)] h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-600">
        <h3 className="font-orbitron font-bold text-[var(--neon-green)] mb-4">AI Assistant</h3>
        
        {/* AI Assistance Buttons */}
        <div className="space-y-3">
          {assistanceTypes.map((type) => (
            <div key={type.id}>
              <motion.button
                onClick={() => {
                  if (type.id === 'generate') {
                    setShowQuestionInput(showQuestionInput === type.id ? null : type.id);
                  } else {
                    handleAssistanceRequest(type.id);
                  }
                }}
                disabled={assistanceMutation.isPending}
                className="w-full text-left p-3 bg-[var(--space-700)] hover:bg-[var(--space-600)] rounded-lg text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <i className={`${type.icon} ${type.color} mr-3`}></i>
                    <div>
                      <div className="font-semibold text-white">{type.title}</div>
                      <div className="text-xs text-gray-400">{type.description}</div>
                    </div>
                  </div>
                  {assistanceMutation.isPending && (
                    <i className="fas fa-spinner fa-spin text-[var(--neon-green)]"></i>
                  )}
                </div>
              </motion.button>

              {/* Question Input for Generate Function */}
              <AnimatePresence>
                {showQuestionInput === type.id && (
                  <motion.div
                    className="mt-2 p-3 bg-[var(--space-900)] rounded-lg border border-gray-600"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <textarea
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Describe the function you want to generate..."
                      className="w-full bg-transparent border border-gray-600 rounded px-3 py-2 text-sm text-white focus:border-[var(--neon-green)] focus:outline-none resize-none"
                      rows={3}
                    />
                    <div className="flex space-x-2 mt-2">
                      <button
                        onClick={() => handleQuestionSubmit(type.id)}
                        disabled={!question.trim() || assistanceMutation.isPending}
                        className="px-3 py-1 bg-[var(--neon-green)] text-[var(--space-900)] text-sm font-semibold rounded hover:shadow-lg transition-all disabled:opacity-50"
                      >
                        Generate
                      </button>
                      <button
                        onClick={() => setShowQuestionInput(null)}
                        className="px-3 py-1 border border-gray-600 text-gray-300 text-sm rounded hover:border-gray-500 transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
      
      {/* AI Response */}
      <div className="flex-1 p-4 overflow-y-auto">
        <AnimatePresence>
          {activeResponse ? (
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Suggestion */}
              <div className="bg-[var(--space-700)] p-4 rounded-lg">
                <h4 className="text-[var(--neon-green)] font-semibold mb-2 flex items-center">
                  <i className="fas fa-lightbulb mr-2"></i>
                  Suggestion
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed">{activeResponse.suggestion}</p>
              </div>

              {/* Improved Code */}
              {activeResponse.improvedCode && (
                <div className="bg-[var(--space-700)] p-4 rounded-lg">
                  <h4 className="text-[var(--neon-blue)] font-semibold mb-2 flex items-center">
                    <i className="fas fa-code mr-2"></i>
                    Improved Code
                  </h4>
                  <pre className="bg-[var(--space-900)] p-3 rounded text-sm text-gray-300 overflow-x-auto">
                    <code>{activeResponse.improvedCode}</code>
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(activeResponse.improvedCode || '');
                      toast({
                        title: "Copied!",
                        description: "Code copied to clipboard.",
                      });
                    }}
                    className="mt-2 px-3 py-1 bg-[var(--neon-blue)] text-[var(--space-900)] text-xs font-semibold rounded hover:shadow-lg transition-all"
                  >
                    <i className="fas fa-copy mr-1"></i>
                    Copy Code
                  </button>
                </div>
              )}

              {/* Explanation */}
              <div className="bg-[var(--space-700)] p-4 rounded-lg">
                <h4 className="text-purple-400 font-semibold mb-2 flex items-center">
                  <i className="fas fa-info-circle mr-2"></i>
                  Explanation
                </h4>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {activeResponse.explanation}
                </p>
              </div>

              {/* Clear Response */}
              <button
                onClick={() => setActiveResponse(null)}
                className="w-full px-3 py-2 border border-gray-600 text-gray-400 text-sm rounded hover:border-gray-500 hover:text-gray-300 transition-all"
              >
                Clear Response
              </button>
            </motion.div>
          ) : (
            <div className="text-center text-gray-500 text-sm mt-8">
              <i className="fas fa-robot text-4xl mb-4 opacity-50"></i>
              <p>Select an assistance option above to get AI help with your code.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
