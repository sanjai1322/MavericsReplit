import { motion } from "framer-motion";
import { Rocket, Trophy, Users, Brain, Award, Bot, Code } from "lucide-react";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <motion.h1 
              className="font-orbitron text-5xl lg:text-7xl font-black mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            >
              Master Code with 
              <span className="bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-blue)] bg-clip-text text-transparent animate-pulse-neon"> AI</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
            >
              Your AI-Powered Journey to Becoming an 
              <span className="text-[var(--neon-blue)] font-semibold">Elite Developer</span> Starts Now
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              <Link href="/signup">
                <motion.button 
                  className="px-8 py-4 bg-gradient-to-r from-[var(--neon-green)] to-emerald-400 text-[var(--space-900)] font-bold text-lg glow-button rounded-lg flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Rocket className="w-5 h-5 mr-2" />
                  Start Learning
                </motion.button>
              </Link>
              <Link href="/signin">
                <motion.button 
                  className="px-8 py-4 border-2 border-[var(--neon-blue)] text-[var(--neon-blue)] hover:bg-[var(--neon-blue)] hover:text-[var(--space-900)] font-bold text-lg transition-all rounded-lg flex items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trophy className="w-5 h-5 mr-2" />
                  Sign In
                </motion.button>
              </Link>
            </motion.div>
            
            <motion.div 
              className="mt-12 flex items-center justify-center lg:justify-start space-x-8 text-sm text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              <div className="flex items-center">
                <Users className="w-4 h-4 text-[var(--neon-green)] mr-2" />
                <span>50K+ Developers</span>
              </div>
              <div className="flex items-center">
                <Brain className="w-4 h-4 text-[var(--neon-blue)] mr-2" />
                <span>AI-Powered Learning</span>
              </div>
              <div className="flex items-center">
                <Award className="w-4 h-4 text-purple-400 mr-2" />
                <span>Industry Certified</span>
              </div>
            </motion.div>
          </div>
          
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            {/* AI Coding Illustration */}
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&h=800" 
                alt="Modern developer workspace with multiple monitors and coding setup" 
                className="rounded-2xl shadow-2xl animate-float w-full max-w-lg mx-auto" 
              />
              
              {/* Floating AI Elements */}
              <motion.div 
                className="absolute -top-4 -right-4 glass-morphism p-4 rounded-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              >
                <Bot className="text-[var(--neon-green)] w-8 h-8" />
                <p className="text-xs mt-1">AI Assistant</p>
              </motion.div>
              
              <motion.div 
                className="absolute -bottom-4 -left-4 glass-morphism p-4 rounded-xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
              >
                <Code className="text-[var(--neon-blue)] w-8 h-8" />
                <p className="text-xs mt-1">Smart IDE</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
