import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, type IUser } from '../models/User.model.js';
import { ApiError } from '../utils/apiError.js';
import { env } from '../config/env.js';
import { SYSTEM_ACHIEVEMENTS } from '../constants/achievements.js';

export interface JwtPayload {
  id: string;
  email: string;
}

export class AuthService {
  static async register(name: string, email: string, password: string): Promise<{ token: string; user: IUser }> {
    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw ApiError.conflict('An account with this email address already exists.');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const initialAchievements = SYSTEM_ACHIEVEMENTS.map((a) => ({
      ...a,
      isEarned: false,
      earnedAt: null,
    }));

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      avatar: '🧑‍💻',
      joinedAt: new Date(),
      onboardingCompleted: false,
      progress: {
        completedNodeIds: [],
        inProgressNodeIds: [],
        completedProjectIds: [],
        completedResourceIds: [],
        currentPhase: 1,
        totalProgress: 0,
        weeklyGoalHours: 15,
        hoursThisWeek: 0,
        streak: 0,
        longestStreak: 0,
        lastActiveDate: new Date(),
      },
      stats: {
        totalHoursLearned: 0,
        skillsAcquired: 0,
        projectsCompleted: 0,
        resourcesConsumed: 0,
        careerReadinessScore: 0,
      },
      achievements: initialAchievements,
      comparedCareerIds: [],
    });

    const token = this.generateToken(user);
    return { token, user };
  }

  static async login(email: string, password: string): Promise<{ token: string; user: IUser }> {
    const normalizedEmail = email.toLowerCase().trim();

    // Explicitly select password for comparison
    const user = await User.findOne({ email: normalizedEmail }).select('+password');
    if (!user || !user.password) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password.');
    }

    const token = this.generateToken(user);
    return { token, user };
  }

  static generateToken(user: IUser): string {
    const payload: JwtPayload = {
      id: user._id.toString(),
      email: user.email,
    };

    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as any,
    });
  }

  static verifyToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    } catch {
      throw ApiError.unauthorized('Invalid or expired authentication token.');
    }
  }

  static async getUserById(id: string): Promise<IUser> {
    const user = await User.findById(id);
    if (!user) {
      throw ApiError.notFound('User not found.');
    }
    return user;
  }
}
