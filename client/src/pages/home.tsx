import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import AIChatbot from "@/components/ai-chatbot";
import YouTubeCourseCard from "@/components/youtube-course-card";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { BookOpen, Trophy, Users, Brain, TrendingUp, Play } from "lucide-react";
import { fadeInUp, staggerFadeIn, initScrollAnimations, neonPulse } from "@/lib/gsap-animations";
import type { Course } from "@shared/schema";

export default function Home() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const coursesRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

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

  const { data: userCourses } = useQuery({
    queryKey: ["/api/user/courses"],
    enabled: !!user,
  });

  const { data: leaderboard } = useQuery({
    queryKey: ["/api/leaderboard"],
    enabled: !!user,
  });

  const { data: allCourses } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
    enabled: !!user,
  });

  // Course enrollment mutation
  const enrollMutation = useMutation({
    mutationFn: async (courseId: string) => {
      const response = await apiRequest("POST", `/api/courses/${courseId}/enroll`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/courses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/leaderboard"] });
      toast({
        title: "Success!",
        description: "Successfully enrolled in course. You earned 50 XP!",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to enroll in course. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Initialize GSAP animations
  useEffect(() => {
    initScrollAnimations();
    
    if (coursesRef.current) {
      const courseCards = coursesRef.current.querySelectorAll('.course-card');
      staggerFadeIn(courseCards as NodeListOf<HTMLElement>, 0.1);
    }
    
    if (statsRef.current) {
      fadeInUp(statsRef.current);
    }
  }, [allCourses]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--space-900)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--neon-green)]"></div>
      </div>
    );
  }

  const userRank = Array.isArray(leaderboard) ? leaderboard.findIndex((u: any) => u.id === user?.id) + 1 : 0;
  const enrolledCourseIds = Array.isArray(userCourses) ? userCourses.map((uc: any) => uc.courseId) : [];

  return (
    <div className="min-h-screen bg-[var(--space-900)]">
      <Navigation />
      
      <main className="pt-20">
        {/* Welcome Hero */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-10 right-10 w-64 h-64 bg-[var(--neon-green)] opacity-5 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-10 left-10 w-48 h-48 bg-[var(--neon-blue)] opacity-5 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-12">
              <motion.h1 
                className="font-orbitron text-4xl lg:text-6xl font-bold mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                Welcome back, 
                <span className="bg-gradient-to-r from-[var(--neon-green)] to-[var(--neon-blue)] bg-clip-text text-transparent">
                  {user?.firstName || 'Developer'}
                </span>!
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-300 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Continue your AI-powered coding journey. Your progress awaits!
              </motion.p>
            </div>

            {/* User Stats */}
            <motion.div 
              className="grid md:grid-cols-4 gap-6 mb-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div className="glass-morphism p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-[var(--neon-green)] mb-2">{user?.xp || 0}</div>
                <p className="text-gray-300">Total XP</p>
              </div>
              <div className="glass-morphism p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-[var(--neon-blue)] mb-2">#{userRank || '--'}</div>
                <p className="text-gray-300">Global Rank</p>
              </div>
              <div className="glass-morphism p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-purple-400 mb-2">{Array.isArray(userCourses) ? userCourses.length : 0}</div>
                <p className="text-gray-300">Courses Enrolled</p>
              </div>
              <div className="glass-morphism p-6 rounded-xl text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{user?.badges?.length || 0}</div>
                <p className="text-gray-300">Badges Earned</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-16 bg-[var(--space-800)]">
          <div className="container mx-auto px-6">
            <h2 className="font-orbitron text-3xl font-bold text-center mb-12">Quick Actions</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Link href="/courses">
                <motion.div 
                  className="glass-morphism p-8 rounded-xl text-center card-glow cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[var(--neon-green)] to-emerald-400 rounded-full flex items-center justify-center">
                    <BookOpen className="text-[var(--space-900)] w-8 h-8" />
                  </div>
                  <h3 className="font-orbitron text-xl font-bold mb-4 text-[var(--neon-green)]">Browse Courses</h3>
                  <p className="text-gray-300">Discover new AI-curated learning paths and expand your skills</p>
                </motion.div>
              </Link>

              <Link href="/ide">
                <motion.div 
                  className="glass-morphism p-8 rounded-xl text-center card-glow cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-[var(--neon-blue)] to-blue-400 rounded-full flex items-center justify-center">
                    <Brain className="text-[var(--space-900)] w-8 h-8" />
                  </div>
                  <h3 className="font-orbitron text-xl font-bold mb-4 text-[var(--neon-blue)]">Open IDE</h3>
                  <p className="text-gray-300">Start coding with our intelligent IDE and AI assistant</p>
                </motion.div>
              </Link>

              <Link href="/leaderboard">
                <motion.div 
                  className="glass-morphism p-8 rounded-xl text-center card-glow cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Trophy className="text-white w-8 h-8" />
                  </div>
                  <h3 className="font-orbitron text-xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    View Leaderboard
                  </h3>
                  <p className="text-gray-300">See how you rank against other developers worldwide</p>
                </motion.div>
              </Link>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="py-16">
          <div className="container mx-auto px-6">
            <h2 className="font-orbitron text-3xl font-bold text-center mb-12">Continue Learning</h2>
            
            {Array.isArray(userCourses) && userCourses.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userCourses.slice(0, 3).map((userCourse: any) => (
                  <div key={userCourse.id} className="glass-morphism rounded-xl overflow-hidden">
                    <div className="p-6">
                      <h3 className="font-orbitron text-xl font-bold mb-2">{userCourse.course.title}</h3>
                      <p className="text-gray-300 text-sm mb-4">{userCourse.course.description}</p>
                      
                      <div className="mb-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{userCourse.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-[var(--neon-green)] to-emerald-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${userCourse.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <button className="w-full px-4 py-2 bg-gradient-to-r from-[var(--neon-green)] to-emerald-400 text-[var(--space-900)] font-semibold rounded-lg hover:shadow-lg transition-all">
                        Continue Course
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                <div className="glass-morphism p-12 rounded-xl max-w-md mx-auto">
                  <i className="fas fa-book-open text-4xl text-[var(--neon-green)] mb-4"></i>
                  <h3 className="font-orbitron text-xl font-bold mb-4">No Courses Yet</h3>
                  <p className="text-gray-300 mb-6">Start your learning journey by enrolling in your first course!</p>
                  <Link href="/courses">
                    <button className="px-6 py-3 bg-gradient-to-r from-[var(--neon-green)] to-emerald-400 text-[var(--space-900)] font-semibold rounded-lg hover:shadow-lg transition-all">
                      Browse Courses
                    </button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Featured YouTube Courses */}
        <section className="py-16 bg-[var(--space-800)]">
          <div className="container mx-auto px-6">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="font-orbitron text-3xl font-bold mb-4">
                Featured YouTube Courses
              </h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Learn from the best programming channels on YouTube with curated courses
              </p>
            </motion.div>
            
            <div ref={coursesRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.isArray(allCourses) && allCourses.slice(0, 6).map((course) => (
                <div key={course.id} className="course-card">
                  <YouTubeCourseCard
                    course={course}
                    isEnrolled={enrolledCourseIds.includes(course.id)}
                    onEnroll={() => enrollMutation.mutate(course.id)}
                    isEnrolling={enrollMutation.isPending}
                  />
                </div>
              ))}
            </div>

            {Array.isArray(allCourses) && allCourses.length > 6 && (
              <div className="text-center mt-12">
                <Link href="/courses">
                  <button className="px-8 py-3 bg-gradient-to-r from-[var(--neon-blue)] to-blue-400 text-white font-semibold rounded-lg hover:shadow-lg transition-all">
                    View All Courses
                  </button>
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
      <AIChatbot />
    </div>
  );
}
