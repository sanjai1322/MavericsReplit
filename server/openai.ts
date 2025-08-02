// Re-export Gemini AI functions to maintain compatibility with existing imports
export {
  getCodeAssistance,
  chatWithAI,
  generateCourseThumbnail,
  generateCourseContent,
  type AIMessage,
  type CodeAssistanceRequest,
  type CodeAssistanceResponse
} from "./gemini";
