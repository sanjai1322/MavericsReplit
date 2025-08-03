import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Bot, Clock, Users, Play, ExternalLink } from "lucide-react";
import { fadeInUp, cardHoverEffect } from "@/lib/gsap-animations";
import type { Course } from "@shared/schema";

interface YouTubeCourseCardProps {
  course: Course;
  isEnrolled: boolean;
  onEnroll: () => void;
  isEnrolling: boolean;
}

const levelColors = {
  beginner: "bg-blue-500",
  intermediate: "bg-green-500", 
  advanced: "bg-purple-500"
};

export default function YouTubeCourseCard({ course, isEnrolled, onEnroll, isEnrolling }: YouTubeCourseCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const levelColor = levelColors[course.level as keyof typeof levelColors] || "bg-gray-500";

  useEffect(() => {
    if (cardRef.current) {
      fadeInUp(cardRef.current);
      cardHoverEffect(cardRef.current);
    }
  }, []);

  const handleWatchVideo = () => {
    if (course.youtubeVideoUrl) {
      window.open(course.youtubeVideoUrl, '_blank');
    }
  };

  return (
    <motion.div 
      ref={cardRef}
      className="glass-morphism rounded-xl overflow-hidden transition-all duration-300 group"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* YouTube Video Thumbnail */}
      <div className="relative h-48 overflow-hidden">
        {course.thumbnailUrl ? (
          <div className="relative w-full h-full">
            <img 
              src={course.thumbnailUrl} 
              alt={course.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleWatchVideo}
                className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transform hover:scale-110 transition-all duration-300"
              >
                <Play className="w-8 h-8 ml-1" fill="currentColor" />
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[var(--space-700)] to-[var(--space-800)] flex items-center justify-center">
            <Play className="w-16 h-16 text-[var(--neon-green)] opacity-50" />
          </div>
        )}
        
        {/* YouTube Badge */}
        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded-full flex items-center">
          <ExternalLink className="w-3 h-3 mr-1" />
          YouTube
        </div>

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

        {/* YouTube Channel */}
        {course.youtubeChannelName && (
          <p className="text-red-400 text-sm mb-2 flex items-center">
            <ExternalLink className="w-3 h-3 mr-1" />
            {course.youtubeChannelName}
          </p>
        )}

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
            <span>{(course.enrolled || 0).toLocaleString()} enrolled</span>
          </div>
          
          <div className="flex space-x-2">
            {/* Watch on YouTube Button */}
            <button
              onClick={handleWatchVideo}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors duration-200 flex items-center"
            >
              <Play className="w-3 h-3 mr-1" />
              Watch
            </button>
            
            {/* Enroll Button */}
            {isEnrolled ? (
              <button className="px-4 py-2 bg-[var(--neon-green)] text-[var(--space-900)] rounded-lg font-semibold text-sm cursor-default">
                Enrolled
              </button>
            ) : (
              <button
                onClick={onEnroll}
                disabled={isEnrolling}
                className="px-4 py-2 bg-gradient-to-r from-[var(--neon-blue)] to-blue-400 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isEnrolling ? "Enrolling..." : "Enroll"}
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}