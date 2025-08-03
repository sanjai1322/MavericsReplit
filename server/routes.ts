import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  getCodeAssistance, 
  chatWithAI, 
  generateCourseThumbnail, 
  generateCourseContent,
  qwenService,
  type CodeAssistanceRequest,
  type AIMessage 
} from "./qwen";
import { 
  insertCourseSchema, 
  insertUserCourseSchema, 
  insertAiChatSchema,
  insertCodeSnippetSchema 
} from "@shared/schema";
import { z } from "zod";

// YouTube course seeding function
async function seedYouTubeCourses(storage: any) {
  const youTubeCourses = [
    {
      title: "Complete React Tutorial for Beginners",
      description: "Learn React from scratch with this comprehensive tutorial. Perfect for beginners who want to build modern web applications.",
      level: "beginner",
      duration: "3h 45m",
      category: "frontend",
      youtubeVideoId: "DLX62G4lc44",
      youtubeChannelName: "freeCodeCamp.org",
      youtubeVideoUrl: "https://www.youtube.com/watch?v=DLX62G4lc44",
      thumbnailUrl: "https://img.youtube.com/vi/DLX62G4lc44/maxresdefault.jpg",
      enrolled: 15420,
      aiGenerated: false
    },
    {
      title: "Node.js & Express Backend Development",
      description: "Master backend development with Node.js and Express. Build RESTful APIs and learn server-side programming.",
      level: "intermediate",
      duration: "4h 20m",
      category: "backend",
      youtubeVideoId: "fBNz5xF-Kx4",
      youtubeChannelName: "Programming with Mosh",
      youtubeVideoUrl: "https://www.youtube.com/watch?v=fBNz5xF-Kx4",
      thumbnailUrl: "https://img.youtube.com/vi/fBNz5xF-Kx4/maxresdefault.jpg",
      enrolled: 8750,
      aiGenerated: false
    },
    {
      title: "Full Stack MERN App Development",
      description: "Build a complete full-stack application using MongoDB, Express, React, and Node.js. Deploy to production.",
      level: "advanced",
      duration: "6h 15m",
      category: "fullstack",
      youtubeVideoId: "ngc9gnuJeEY",
      youtubeChannelName: "Traversy Media",
      youtubeVideoUrl: "https://www.youtube.com/watch?v=ngc9gnuJeEY",
      thumbnailUrl: "https://img.youtube.com/vi/ngc9gnuJeEY/maxresdefault.jpg",
      enrolled: 12340,
      aiGenerated: false
    },
    {
      title: "Machine Learning with Python",
      description: "Introduction to machine learning using Python. Learn algorithms, data preprocessing, and model evaluation.",
      level: "intermediate",
      duration: "5h 30m",
      category: "ai",
      youtubeVideoId: "7eh4d6sabA0",
      youtubeChannelName: "Python Engineer",
      youtubeVideoUrl: "https://www.youtube.com/watch?v=7eh4d6sabA0",
      thumbnailUrl: "https://img.youtube.com/vi/7eh4d6sabA0/maxresdefault.jpg",
      enrolled: 9680,
      aiGenerated: false
    },
    {
      title: "Blockchain Development Tutorial",
      description: "Learn blockchain development from basics to advanced. Build your first cryptocurrency and smart contracts.",
      level: "advanced",
      duration: "4h 50m",
      category: "blockchain",
      youtubeVideoId: "M576WGiDBdQ",
      youtubeChannelName: "Dapp University",
      youtubeVideoUrl: "https://www.youtube.com/watch?v=M576WGiDBdQ",
      thumbnailUrl: "https://img.youtube.com/vi/M576WGiDBdQ/maxresdefault.jpg",
      enrolled: 6420,
      aiGenerated: false
    },
    {
      title: "Advanced JavaScript Concepts",
      description: "Deep dive into advanced JavaScript concepts including closures, prototypes, async programming, and more.",
      level: "advanced",
      duration: "3h 25m",
      category: "frontend",
      youtubeVideoId: "Mus_vwhTCq0",
      youtubeChannelName: "JavaScript Mastery",
      youtubeVideoUrl: "https://www.youtube.com/watch?v=Mus_vwhTCq0",
      thumbnailUrl: "https://img.youtube.com/vi/Mus_vwhTCq0/maxresdefault.jpg",
      enrolled: 11250,
      aiGenerated: false
    },
    {
      title: "Python Django REST Framework",
      description: "Build powerful REST APIs with Django REST Framework. Perfect for backend developers.",
      level: "intermediate",
      duration: "4h 10m",
      category: "backend",
      youtubeVideoId: "c708Nf0cHrs",
      youtubeChannelName: "Very Academy",
      youtubeVideoUrl: "https://www.youtube.com/watch?v=c708Nf0cHrs",
      thumbnailUrl: "https://img.youtube.com/vi/c708Nf0cHrs/maxresdefault.jpg",
      enrolled: 7890,
      aiGenerated: false
    },
    {
      title: "AI Chatbot Development",
      description: "Create intelligent chatbots using natural language processing and machine learning techniques.",
      level: "advanced",
      duration: "3h 40m",
      category: "ai",
      youtubeVideoId: "RuVac3VdNYE",
      youtubeChannelName: "Tech With Tim",
      youtubeVideoUrl: "https://www.youtube.com/watch?v=RuVac3VdNYE",
      thumbnailUrl: "https://img.youtube.com/vi/RuVac3VdNYE/maxresdefault.jpg",
      enrolled: 5640,
      aiGenerated: false
    }
  ];

  // Create courses in parallel for better performance
  const coursePromises = youTubeCourses.map(course => storage.createCourse(course));
  await Promise.all(coursePromises);
  
  console.log(`Seeded ${youTubeCourses.length} YouTube courses`);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Course routes
  app.get('/api/courses', async (req, res) => {
    try {
      const category = req.query.category as string;
      let courses = await storage.getCourses(category);
      
      // If no courses exist, seed with YouTube courses
      if (courses.length === 0) {
        await seedYouTubeCourses(storage);
        courses = await storage.getCourses(category);
      }
      
      res.json(courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
      res.status(500).json({ message: "Failed to fetch courses" });
    }
  });

  app.get('/api/courses/:id', async (req, res) => {
    try {
      const course = await storage.getCourse(req.params.id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      console.error("Error fetching course:", error);
      res.status(500).json({ message: "Failed to fetch course" });
    }
  });

  app.post('/api/courses', isAuthenticated, async (req, res) => {
    try {
      const courseData = insertCourseSchema.parse(req.body);
      
      // Generate AI content if requested
      if (req.body.generateAI) {
        const aiContent = await generateCourseContent(
          courseData.title, 
          courseData.level, 
          courseData.category
        );
        courseData.description = aiContent.description;
        courseData.duration = aiContent.duration;
        courseData.aiGenerated = true;

        // Generate thumbnail
        try {
          const thumbnail = await generateCourseThumbnail(courseData.title, courseData.category);
          courseData.thumbnailUrl = thumbnail.url;
        } catch (error) {
          console.warn("Failed to generate thumbnail:", error);
        }
      }

      const course = await storage.createCourse(courseData);
      res.json(course);
    } catch (error) {
      console.error("Error creating course:", error);
      res.status(500).json({ message: "Failed to create course" });
    }
  });

  app.post('/api/courses/:id/enroll', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const courseId = req.params.id;
      
      const enrollment = await storage.enrollInCourse({
        userId,
        courseId,
        progress: 0,
        completed: false,
      });

      // Award XP for enrollment
      await storage.updateUserXP(userId, 50);

      res.json(enrollment);
    } catch (error) {
      console.error("Error enrolling in course:", error);
      res.status(500).json({ message: "Failed to enroll in course" });
    }
  });

  app.get('/api/user/courses', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userCourses = await storage.getUserCourses(userId);
      res.json(userCourses);
    } catch (error) {
      console.error("Error fetching user courses:", error);
      res.status(500).json({ message: "Failed to fetch user courses" });
    }
  });

  // Leaderboard routes
  app.get('/api/leaderboard', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const leaderboard = await storage.getLeaderboard(limit);
      res.json(leaderboard);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ message: "Failed to fetch leaderboard" });
    }
  });

  // AI Assistant routes
  app.post('/api/ai/code-assistance', isAuthenticated, async (req, res) => {
    try {
      const assistanceRequest: CodeAssistanceRequest = req.body;
      const response = await getCodeAssistance(assistanceRequest);
      res.json(response);
    } catch (error) {
      console.error("Error getting code assistance:", error);
      res.status(500).json({ message: "Failed to get code assistance" });
    }
  });

  // Update API key endpoint
  app.post('/api/ai/update-key', isAuthenticated, async (req, res) => {
    try {
      const { apiKey } = req.body;
      if (!apiKey) {
        return res.status(400).json({ message: "API key is required" });
      }
      
      qwenService.updateApiKey(apiKey);
      res.json({ message: "API key updated successfully", configured: true });
    } catch (error) {
      console.error("Error updating API key:", error);
      res.status(500).json({ message: "Failed to update API key" });
    }
  });

  // Check AI service status
  app.get('/api/ai/status', isAuthenticated, async (req, res) => {
    try {
      const configured = qwenService.isConfigured();
      res.json({ 
        configured, 
        service: 'Qwen/Qwen2.5-Coder-32B-Instruct',
        message: configured ? 'AI service is ready' : 'Please provide your Qwen API key to enable AI features'
      });
    } catch (error) {
      console.error("Error checking AI status:", error);
      res.status(500).json({ message: "Failed to check AI status" });
    }
  });

  app.post('/api/ai/chat', isAuthenticated, async (req: any, res) => {
    try {
      const { messages, sessionId } = req.body;
      const userId = req.user.claims.sub;

      // Validate messages
      const aiMessages: AIMessage[] = messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await chatWithAI(aiMessages);

      // Store the conversation
      const updatedMessages = [
        ...aiMessages,
        { role: 'assistant' as const, content: response.content }
      ];

      try {
        const existingChat = await storage.getAiChat(userId, sessionId);
        if (existingChat) {
          await storage.updateAiChat(userId, sessionId, updatedMessages);
        } else {
          await storage.createAiChat({
            userId,
            sessionId,
            messages: updatedMessages
          });
        }
      } catch (chatError) {
        console.warn("Failed to store chat:", chatError);
      }

      res.json({ response: response.content, messages: updatedMessages });
    } catch (error) {
      console.error("Error in AI chat:", error);
      res.status(500).json({ message: "Failed to process AI chat" });
    }
  });

  app.get('/api/ai/chat/:sessionId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionId = req.params.sessionId;
      
      const chat = await storage.getAiChat(userId, sessionId);
      res.json(chat || { messages: [] });
    } catch (error) {
      console.error("Error fetching chat:", error);
      res.status(500).json({ message: "Failed to fetch chat" });
    }
  });

  // Code snippet routes
  app.post('/api/code-snippets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const snippetData = insertCodeSnippetSchema.parse(req.body);
      
      const snippet = await storage.createCodeSnippet({
        ...snippetData,
        userId,
      });

      // Award XP for saving code
      await storage.updateUserXP(userId, 10);

      res.json(snippet);
    } catch (error) {
      console.error("Error creating code snippet:", error);
      res.status(500).json({ message: "Failed to create code snippet" });
    }
  });

  app.get('/api/code-snippets', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const snippets = await storage.getUserCodeSnippets(userId);
      res.json(snippets);
    } catch (error) {
      console.error("Error fetching code snippets:", error);
      res.status(500).json({ message: "Failed to fetch code snippets" });
    }
  });

  app.get('/api/code-snippets/:id', isAuthenticated, async (req, res) => {
    try {
      const snippet = await storage.getCodeSnippet(req.params.id);
      if (!snippet) {
        return res.status(404).json({ message: "Code snippet not found" });
      }
      res.json(snippet);
    } catch (error) {
      console.error("Error fetching code snippet:", error);
      res.status(500).json({ message: "Failed to fetch code snippet" });
    }
  });

  // XP and gamification routes
  app.post('/api/user/award-xp', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { amount, reason } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid XP amount" });
      }

      const user = await storage.updateUserXP(userId, amount);
      res.json({ user, awarded: amount, reason });
    } catch (error) {
      console.error("Error awarding XP:", error);
      res.status(500).json({ message: "Failed to award XP" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
