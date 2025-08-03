import { Code, Twitter, Github, MessageCircle, Linkedin, Bot } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[var(--space-800)] border-t border-gray-700 py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <Code className="text-[var(--neon-green)] w-8 h-8" />
              <span className="font-orbitron text-xl font-bold">
                GenAI<span className="text-[var(--neon-blue)]">Code</span>
              </span>
            </div>
            <p className="text-gray-300 mb-6">
              Empowering developers worldwide with AI-powered learning and coding assistance.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-[var(--neon-green)] transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[var(--neon-green)] transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[var(--neon-green)] transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[var(--neon-green)] transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-orbitron font-bold mb-6 text-[var(--neon-green)]">Platform</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Courses</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">IDE Playground</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Hackathons</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Leaderboard</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">AI Assistant</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-orbitron font-bold mb-6 text-[var(--neon-blue)]">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">API Reference</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Tutorials</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Community</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-orbitron font-bold mb-6 text-purple-400">Company</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-300 hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 GenAI Code Platform. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <span>Built with ❤️ and AI</span>
            <span className="flex items-center">
              <Bot className="text-[var(--neon-green)] mr-1 w-4 h-4" />
              Powered by GPT-4
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
