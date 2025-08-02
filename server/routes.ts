import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  getCodeAssistance, 
  chatWithAI, 
  generateCourseThumbnail, 
  generateCourseContent,
  type CodeAssistanceRequest,
  type AIMessage 
} from "./openai";
import { 
  insertCourseSchema, 
  insertUserCourseSchema, 
  insertAiChatSchema,
  insertCodeSnippetSchema 
} from "@shared/schema";
import { z } from "zod";

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
      const courses = await storage.getCourses(category);
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
        { role: 'assistant' as const, content: response }
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

      res.json({ response, messages: updatedMessages });
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
