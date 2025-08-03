import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Mail, Lock, Chrome, Github, User, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function SignIn() {
  const handleGoogleLogin = () => {
    window.location.href = "/api/login";
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, redirect to main login since we use Replit auth
    handleGoogleLogin();
  };

  return (
    <div className="min-h-screen bg-[var(--space-900)] flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[var(--neon-blue)] rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[var(--neon-green)] rounded-full opacity-20 blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="gradient-border card-glow">
          <div className="gradient-border-content">
            <CardHeader className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-[var(--neon-blue)] to-purple-500 rounded-full flex items-center justify-center"
              >
                <User className="w-8 h-8 text-white" />
              </motion.div>
              <CardTitle className="font-orbitron text-2xl font-bold text-white">
                Welcome Back
              </CardTitle>
              <CardDescription className="text-gray-300">
                Sign in to continue your coding journey
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Google Sign In Button */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <Button
                  onClick={handleGoogleLogin}
                  className="w-full bg-white hover:bg-gray-100 text-gray-900 font-medium transition-all duration-300 transform hover:scale-105"
                  size="lg"
                >
                  <Chrome className="w-5 h-5 mr-2" />
                  Continue with Google
                </Button>
              </motion.div>

              {/* Divider */}
              <div className="relative">
                <Separator className="bg-gray-700" />
                <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[var(--space-800)] px-2 text-sm text-gray-400">
                  or
                </span>
              </div>

              {/* Email/Password Form */}
              <motion.form
                onSubmit={handleFormSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="pl-10 bg-[var(--space-800)] border-gray-700 text-white placeholder-gray-400 focus:border-[var(--neon-blue)]"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="pl-10 bg-[var(--space-800)] border-gray-700 text-white placeholder-gray-400 focus:border-[var(--neon-blue)]"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Link href="/forgot-password" className="text-sm text-[var(--neon-blue)] hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[var(--neon-blue)] to-purple-500 hover:from-[var(--neon-blue)]/80 hover:to-purple-500/80 text-white font-medium transition-all duration-300 transform hover:scale-105"
                  size="lg"
                >
                  Sign In
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.form>

              {/* Sign Up Link */}
              <div className="text-center">
                <span className="text-gray-400">Don't have an account? </span>
                <Link href="/signup" className="text-[var(--neon-green)] hover:underline font-medium">
                  Sign up
                </Link>
              </div>
            </CardContent>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}