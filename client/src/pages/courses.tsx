import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/layout/navigation";
import Footer from "@/components/layout/footer";
import CourseCard from "@/components/course-card";
import AIChatbot from "@/components/ai-chatbot";
import { motion } from "framer-motion";

const categories = [
  { id: 'all', name: 'All', icon: 'fas fa-th-large' },
  { id: 'frontend', name: 'Frontend', icon: 'fab fa-react' },
  { id: 'backend', name: 'Backend', icon: 'fas fa-server' },
  { id: 'fullstack', name: 'Full Stack', icon: 'fas fa-layer-group' },
  { id: 'ai', name: 'AI/ML', icon: 'fas fa-brain' },
  { id: 'blockchain', name: 'Blockchain', icon: 'fab fa-bitcoin' },
];

export default function Courses() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState('all');

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

  const { data: courses, isLoading: coursesLoading } = useQuery({
    queryKey: ["/api/courses", selectedCategory],
    enabled: !!user,
  });

  const { data: userCourses } = useQuery({
    queryKey: ["/api/user/courses"],
    enabled: !!user,
  });

  const enrollMutation = useMutation({
    mutationFn: async (courseId: string) => {
      await apiRequest("POST", `/api/courses/${courseId}/enroll`);
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You have successfully enrolled in the course!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/user/courses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to enroll in course. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--space-900)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[var(--neon-green)]"></div>
      </div>
    );
  }

  const isEnrolled = (courseId: string) => {
    return userCourses?.some((uc: any) => uc.courseId === courseId);
  };

  return (
    <div className="min-h-screen bg-[var(--space-900)]">
      <Navigation />
      
      <main className="pt-20">
        {/* Header */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-20 right-20 w-64 h-64 bg-[var(--neon-blue)] opacity-5 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 left-20 w-48 h-48 bg-[var(--neon-green)] opacity-5 rounded-full blur-3xl animate-float" style={{animationDelay: '1s'}}></div>
          </div>

          <div className="container mx-auto px-6 relative z-10">
            <div className="text-center mb-16">
              <motion.h1 
                className="font-orbitron text-4xl lg:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                AI-Curated Courses
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-300 max-w-3xl mx-auto mb-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Personalized learning paths powered by artificial intelligence
              </motion.p>
              
              {/* Course Filters */}
              <motion.div 
                className="flex flex-wrap justify-center gap-4"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-6 py-2 font-semibold rounded-full transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-[var(--neon-green)] text-[var(--space-900)]'
                        : 'border border-gray-600 text-gray-300 hover:border-[var(--neon-green)] hover:text-[var(--neon-green)]'
                    }`}
                  >
                    <i className={`${category.icon} mr-2`}></i>
                    {category.name}
                  </button>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Courses Grid */}
        <section className="pb-20">
          <div className="container mx-auto px-6">
            {coursesLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[var(--neon-green)]"></div>
              </div>
            ) : courses && courses.length > 0 ? (
              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {courses.map((course: any, index: number) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <CourseCard
                      course={course}
                      isEnrolled={isEnrolled(course.id)}
                      onEnroll={() => enrollMutation.mutate(course.id)}
                      isEnrolling={enrollMutation.isPending}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="text-center">
                <div className="glass-morphism p-12 rounded-xl max-w-md mx-auto">
                  <i className="fas fa-search text-4xl text-[var(--neon-blue)] mb-4"></i>
                  <h3 className="font-orbitron text-xl font-bold mb-4">No Courses Found</h3>
                  <p className="text-gray-300 mb-6">
                    No courses available in the {selectedCategory} category. 
                    Try selecting a different category or check back later.
                  </p>
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="px-6 py-3 bg-gradient-to-r from-[var(--neon-green)] to-emerald-400 text-[var(--space-900)] font-semibold rounded-lg hover:shadow-lg transition-all"
                  >
                    View All Courses
                  </button>
                </div>
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
