import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import CodeEditor from "@/components/ide/code-editor";
import AIAssistant from "@/components/ide/ai-assistant";
import AIChatbot from "@/components/ai-chatbot";
import { motion } from "framer-motion";

export default function IDE() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [code, setCode] = useState(`import React from 'react';

const App = () => {
  return (
    <div className="app">
      <h1>Hello, AI World!</h1>
    </div>
  );
};

export default App;`);
  const [language, setLanguage] = useState('javascript');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput('');
    
    // Simulate code execution
    setTimeout(() => {
      setOutput(`✓ Compiled successfully!
✓ No TypeScript errors found
✓ All tests passed

> Ready to serve at http://localhost:3000`);
      setIsRunning(false);
    }, 2000);
  };

  const handleDebugCode = async () => {
    toast({
      title: "Debug Mode",
      description: "AI debugging assistant activated. Check the assistant panel for suggestions.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--space-900)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--neon-green)]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--space-900)]">
      <Navigation />
      
      <main className="pt-20">
        {/* Header */}
        <section className="py-12 bg-[var(--space-800)]">
          <div className="container mx-auto px-6">
            <div className="text-center">
              <motion.h1 
                className="font-orbitron text-4xl lg:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                AI-Powered IDE
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-300 max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Code with confidence using our intelligent development environment
              </motion.p>
            </div>
          </div>
        </section>

        {/* IDE Interface */}
        <section className="py-8">
          <div className="container mx-auto px-6">
            <motion.div 
              className="max-w-7xl mx-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="glass-morphism rounded-xl overflow-hidden">
                {/* IDE Header */}
                <div className="bg-[var(--space-700)] px-6 py-4 flex items-center justify-between border-b border-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="font-mono text-sm text-gray-300">main.jsx</span>
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="bg-[var(--space-900)] border border-gray-600 rounded px-3 py-1 text-sm text-gray-300 focus:border-[var(--neon-green)] focus:outline-none"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="typescript">TypeScript</option>
                      <option value="python">Python</option>
                      <option value="java">Java</option>
                      <option value="cpp">C++</option>
                    </select>
                  </div>
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={handleRunCode}
                      disabled={isRunning}
                      className="px-4 py-2 bg-[var(--neon-green)] text-[var(--space-900)] text-sm font-semibold rounded hover:shadow-lg transition-all disabled:opacity-50"
                    >
                      <i className={`fas ${isRunning ? 'fa-spinner fa-spin' : 'fa-play'} mr-1`}></i> 
                      {isRunning ? 'Running...' : 'Run'}
                    </button>
                    <button 
                      onClick={handleDebugCode}
                      className="px-4 py-2 bg-[var(--neon-blue)] text-[var(--space-900)] text-sm font-semibold rounded hover:shadow-lg transition-all"
                    >
                      <i className="fas fa-bug mr-1"></i> Debug
                    </button>
                  </div>
                </div>
                
                <div className="grid lg:grid-cols-3 min-h-[600px]">
                  {/* Code Editor */}
                  <div className="lg:col-span-2">
                    <CodeEditor
                      value={code}
                      onChange={setCode}
                      language={language}
                    />
                  </div>
                  
                  {/* AI Assistant Panel */}
                  <div className="border-l border-gray-600">
                    <AIAssistant
                      code={code}
                      language={language}
                    />
                  </div>
                </div>
                
                {/* Output Panel */}
                <div className="bg-[var(--space-800)] border-t border-gray-600 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-orbitron font-bold text-[var(--neon-blue)]">Output</h4>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      {output && (
                        <>
                          <i className="fas fa-check-circle text-green-400"></i>
                          <span>Build successful</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="bg-[var(--space-900)] p-4 rounded-lg font-mono text-sm text-green-400 min-h-[120px] overflow-auto">
                    {output ? (
                      <pre>{output}</pre>
                    ) : (
                      <div className="text-gray-500 italic">Output will appear here when you run your code...</div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
      <AIChatbot />
    </div>
  );
}
