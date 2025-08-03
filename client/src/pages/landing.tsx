import { motion } from "framer-motion";
import { useEffect } from "react";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import HeroSection from "@/components/hero-section";
import HowItWorks from "@/components/how-it-works";
import AIChatbot from "@/components/ai-chatbot";
import { Brain, Code, Trophy } from "lucide-react";
import { initScrollAnimations, cleanupAnimations } from "@/lib/gsap-animations";

export default function Landing() {
  useEffect(() => {
    initScrollAnimations();
    
    return () => {
      cleanupAnimations();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--space-900)]">
      <Navigation />
      
      <main className="relative">
        {/* Background Effects */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 bg-[var(--neon-green)] opacity-10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-[var(--neon-blue)] opacity-10 rounded-full blur-xl animate-float" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 opacity-5 rounded-full blur-3xl"></div>
        </div>

        <HeroSection />
        <HowItWorks />

        {/* Features Preview Section */}
        <section className="py-20 relative">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="font-orbitron text-4xl lg:text-5xl font-bold mb-6">
                Experience the Future of Coding
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Our platform combines cutting-edge AI with an intuitive learning experience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                className="glass-morphism p-8 rounded-xl text-center card-glow"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[var(--neon-green)] to-emerald-400 rounded-full flex items-center justify-center">
                  <Brain className="text-[var(--space-900)] w-8 h-8" />
                </div>
                <h3 className="font-orbitron text-xl font-bold mb-4 text-[var(--neon-green)]">AI-Powered Learning</h3>
                <p className="text-gray-300">
                  Get personalized coding assistance and real-time feedback from our advanced AI tutor
                </p>
              </motion.div>

              <motion.div 
                className="glass-morphism p-8 rounded-xl text-center card-glow"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[var(--neon-blue)] to-blue-400 rounded-full flex items-center justify-center">
                  <Code className="text-[var(--space-900)] w-8 h-8" />
                </div>
                <h3 className="font-orbitron text-xl font-bold mb-4 text-[var(--neon-blue)]">Smart IDE</h3>
                <p className="text-gray-300">
                  Code in our intelligent environment with syntax highlighting, autocomplete, and AI debugging
                </p>
              </motion.div>

              <motion.div 
                className="glass-morphism p-8 rounded-xl text-center card-glow"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Trophy className="text-white w-8 h-8" />
                </div>
                <h3 className="font-orbitron text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Gamified Progress
                </h3>
                <p className="text-gray-300">
                  Earn XP, unlock badges, and compete with developers worldwide on our leaderboard
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-[var(--neon-green)]/10 to-[var(--neon-blue)]/10"></div>
          </div>
          
          <div className="container mx-auto px-6 text-center relative z-10">
            <h2 className="font-orbitron text-4xl lg:text-5xl font-bold mb-6">
              Ready to Transform Your 
              <span className="bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-blue)] bg-clip-text text-transparent"> Coding Journey?</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
              Join thousands of developers who are already mastering code with AI assistance. 
              Start your journey today and become the developer you've always wanted to be.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <motion.button 
                className="px-10 py-5 bg-gradient-to-r from-[var(--neon-green)] to-emerald-400 text-[var(--space-900)] font-bold text-xl glow-button rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/api/login'}
              >
                <i className="fas fa-rocket mr-3"></i>
                Start Learning Now
              </motion.button>
              <motion.button 
                className="px-10 py-5 border-2 border-[var(--neon-blue)] text-[var(--neon-blue)] hover:bg-[var(--neon-blue)] hover:text-[var(--space-900)] font-bold text-xl transition-all rounded-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/api/login'}
              >
                <i className="fas fa-calendar mr-3"></i>
                Join Next Hackathon
              </motion.button>
            </div>
            
            <div className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-4xl font-bold text-[var(--neon-green)] mb-2">50,000+</div>
                <p className="text-gray-300">Active Developers</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-[var(--neon-blue)] mb-2">100,000+</div>
                <p className="text-gray-300">Projects Built</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-400 mb-2">1M+</div>
                <p className="text-gray-300">AI Interactions</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <AIChatbot />
    </div>
  );
}
