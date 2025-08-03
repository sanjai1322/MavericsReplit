import { motion } from "framer-motion";
import { Bot, Clock, Users, Server, Layers, Brain, Bitcoin, Code } from "lucide-react";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    level: string;
    duration: string;
    category: string;
    thumbnailUrl?: string;
    enrolled: number;
    aiGenerated: boolean;
  };
  isEnrolled: boolean;
  onEnroll: () => void;
  isEnrolling: boolean;
}

const levelColors = {
  beginner: "bg-blue-500",
  intermediate: "bg-green-500", 
  advanced: "bg-purple-500"
};

const categoryIcons = {
  frontend: Code,
  backend: Server,
  fullstack: Layers,
  ai: Brain,
  blockchain: Bitcoin,
  default: Code
};

export default function CourseCard({ course, isEnrolled, onEnroll, isEnrolling }: CourseCardProps) {
  const levelColor = levelColors[course.level as keyof typeof levelColors] || "bg-gray-500";
  const CategoryIcon = categoryIcons[course.category as keyof typeof categoryIcons] || categoryIcons.default;

  return (
    <motion.div 
      className="glass-morphism rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {/* Course Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-[var(--space-700)] to-[var(--space-800)] flex items-center justify-center overflow-hidden">
        {course.thumbnailUrl ? (
          <img 
            src={course.thumbnailUrl} 
            alt={course.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.parentElement?.appendChild(
                Object.assign(document.createElement('div'), {
                  className: 'w-full h-full flex items-center justify-center',
                  innerHTML: `<div class="w-16 h-16 text-[var(--neon-green)] opacity-50 flex items-center justify-center"><svg class="w-16 h-16" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"/></svg></div>`
                })
              );
            }}
          />
        ) : (
          <CategoryIcon className="w-16 h-16 text-[var(--neon-green)] opacity-50" />
        )}
        
        {/* AI Generated Badge */}
        {course.aiGenerated && (
          <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <Bot className="w-3 h-3 mr-1" />
            AI Generated
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Course Meta */}
        <div className="flex items-center justify-between mb-3">
          <span className={`px-3 py-1 ${levelColor} text-white text-xs font-semibold rounded-full capitalize`}>
            {course.level}
          </span>
          <span className="text-[var(--neon-green)] text-sm flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {course.duration}
          </span>
        </div>

        {/* Course Title */}
        <h3 className="font-orbitron text-xl font-bold mb-2 text-white line-clamp-2">
          {course.title}
        </h3>

        {/* Course Description */}
        <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
          {course.description}
        </p>
        
        {/* Course Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-400">
            <Users className="w-4 h-4 mr-1" />
            <span>{course.enrolled.toLocaleString()} enrolled</span>
          </div>
          
          {isEnrolled ? (
            <button 
              disabled
              className="px-4 py-2 bg-gray-600 text-gray-400 font-semibold text-sm rounded-lg cursor-not-allowed"
            >
              <i className="fas fa-check mr-1"></i>
              Enrolled
            </button>
          ) : (
            <button 
              onClick={onEnroll}
              disabled={isEnrolling}
              className="px-4 py-2 bg-gradient-to-r from-[var(--neon-green)] to-emerald-400 text-[var(--space-900)] font-semibold text-sm rounded-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isEnrolling ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-1"></i>
                  Enrolling...
                </>
              ) : (
                <>
                  <i className="fas fa-play mr-1"></i>
                  Start Course
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
