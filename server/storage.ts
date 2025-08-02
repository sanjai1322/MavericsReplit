import {
  users,
  courses,
  userCourses,
  aiChats,
  codeSnippets,
  type User,
  type UpsertUser,
  type Course,
  type InsertCourse,
  type UserCourse,
  type InsertUserCourse,
  type AiChat,
  type InsertAiChat,
  type CodeSnippet,
  type InsertCodeSnippet,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserXP(userId: string, xp: number): Promise<User>;
  getLeaderboard(limit?: number): Promise<User[]>;

  // Course operations
  getCourses(category?: string): Promise<Course[]>;
  getCourse(id: string): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;
  enrollInCourse(enrollment: InsertUserCourse): Promise<UserCourse>;
  getUserCourses(userId: string): Promise<(UserCourse & { course: Course })[]>;

  // AI chat operations
  createAiChat(chat: InsertAiChat): Promise<AiChat>;
  getAiChat(userId: string, sessionId: string): Promise<AiChat | undefined>;
  updateAiChat(userId: string, sessionId: string, messages: any[]): Promise<AiChat>;

  // Code snippet operations
  createCodeSnippet(snippet: InsertCodeSnippet): Promise<CodeSnippet>;
  getUserCodeSnippets(userId: string): Promise<CodeSnippet[]>;
  getCodeSnippet(id: string): Promise<CodeSnippet | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserXP(userId: string, xp: number): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        xp: sql`${users.xp} + ${xp}`,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();
    
    // Update rank based on XP
    await this.updateUserRanks();
    
    return user;
  }

  async updateUserRanks(): Promise<void> {
    const usersWithXP = await db
      .select()
      .from(users)
      .orderBy(desc(users.xp));

    for (let i = 0; i < usersWithXP.length; i++) {
      await db
        .update(users)
        .set({ rank: i + 1 })
        .where(eq(users.id, usersWithXP[i].id));
    }
  }

  async getLeaderboard(limit: number = 100): Promise<User[]> {
    return await db
      .select()
      .from(users)
      .orderBy(desc(users.xp))
      .limit(limit);
  }

  // Course operations
  async getCourses(category?: string): Promise<Course[]> {
    const query = db.select().from(courses);
    
    if (category && category !== 'all') {
      return await query.where(eq(courses.category, category)).orderBy(desc(courses.createdAt));
    }
    
    return await query.orderBy(desc(courses.createdAt));
  }

  async getCourse(id: string): Promise<Course | undefined> {
    const [course] = await db.select().from(courses).where(eq(courses.id, id));
    return course;
  }

  async createCourse(course: InsertCourse): Promise<Course> {
    const [newCourse] = await db
      .insert(courses)
      .values(course)
      .returning();
    return newCourse;
  }

  async enrollInCourse(enrollment: InsertUserCourse): Promise<UserCourse> {
    // Check if already enrolled
    const [existing] = await db
      .select()
      .from(userCourses)
      .where(
        and(
          eq(userCourses.userId, enrollment.userId),
          eq(userCourses.courseId, enrollment.courseId)
        )
      );

    if (existing) {
      return existing;
    }

    const [userCourse] = await db
      .insert(userCourses)
      .values(enrollment)
      .returning();

    // Increment enrolled count
    await db
      .update(courses)
      .set({ enrolled: sql`${courses.enrolled} + 1` })
      .where(eq(courses.id, enrollment.courseId));

    return userCourse;
  }

  async getUserCourses(userId: string): Promise<(UserCourse & { course: Course })[]> {
    return await db
      .select()
      .from(userCourses)
      .leftJoin(courses, eq(userCourses.courseId, courses.id))
      .where(eq(userCourses.userId, userId))
      .then(rows => rows.map(row => ({
        ...row.user_courses,
        course: row.courses!
      })));
  }

  // AI chat operations
  async createAiChat(chat: InsertAiChat): Promise<AiChat> {
    const [aiChat] = await db
      .insert(aiChats)
      .values(chat)
      .returning();
    return aiChat;
  }

  async getAiChat(userId: string, sessionId: string): Promise<AiChat | undefined> {
    const [chat] = await db
      .select()
      .from(aiChats)
      .where(
        and(
          eq(aiChats.userId, userId),
          eq(aiChats.sessionId, sessionId)
        )
      );
    return chat;
  }

  async updateAiChat(userId: string, sessionId: string, messages: any[]): Promise<AiChat> {
    const [chat] = await db
      .update(aiChats)
      .set({ 
        messages,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(aiChats.userId, userId),
          eq(aiChats.sessionId, sessionId)
        )
      )
      .returning();
    return chat;
  }

  // Code snippet operations
  async createCodeSnippet(snippet: InsertCodeSnippet): Promise<CodeSnippet> {
    const [codeSnippet] = await db
      .insert(codeSnippets)
      .values(snippet)
      .returning();
    return codeSnippet;
  }

  async getUserCodeSnippets(userId: string): Promise<CodeSnippet[]> {
    return await db
      .select()
      .from(codeSnippets)
      .where(eq(codeSnippets.userId, userId))
      .orderBy(desc(codeSnippets.createdAt));
  }

  async getCodeSnippet(id: string): Promise<CodeSnippet | undefined> {
    const [snippet] = await db.select().from(codeSnippets).where(eq(codeSnippets.id, id));
    return snippet;
  }
}

export const storage = new DatabaseStorage();
