import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

// In-memory fallback database for development before Atlas connection is established
const mockUsers = [
  {
    _id: 'mock-user-ankit-001',
    id: 'mock-user-ankit-001',
    name: 'Ankit',
    email: 'ankit@lpu.in',
    aliases: ['12513583', 'ankit@lpu.in', 'student@campus.edu', 'elena.vance@university.edu', '2024-8841', 'student@university.edu', 'student@study.edu'],
    studentId: '12513583',
    // Hash for 'StudySanctuary2025#'
    passwordHash: '$2a$10$wTfU90y1u1B0P8n1b6N3qOiK/fG4U8Zp.F24aU.MhYyvBwGgZ6d62',
    role: 'STUDENT',
    department: 'Lovely Professional University (LPU) — School of Computer Science & Engineering',
    academicStanding: 'Undergraduate',
    rfidCardUid: 'RFID-12513583-A',
    weeklyQuotaHours: 25.0,
    usedQuotaHours: 8.5,
    noShowStrikes: 0,
    avatarUrl: '',
    createdAt: new Date().toISOString(),
  },
  {
    _id: 'mock-admin-001',
    id: 'mock-admin-001',
    name: 'Dr. Arthur Pendelton',
    email: 'admin@library.univ.edu',
    aliases: ['admin@library.campus.edu', 'admin@campus.edu', 'admin@library.univ.edu', 'admin@study.edu'],
    studentId: 'ADMIN-001',
    passwordHash: '$2a$10$wTfU90y1u1B0P8n1b6N3qOiK/fG4U8Zp.F24aU.MhYyvBwGgZ6d62',
    role: 'ADMIN',
    department: 'LPU Central Library Operations & Administration',
    academicStanding: 'Faculty / Postdoc',
    rfidCardUid: 'RFID-ADMIN-ROOT',
    weeklyQuotaHours: 99.0,
    usedQuotaHours: 0.0,
    noShowStrikes: 0,
    avatarUrl: '',
    createdAt: new Date().toISOString(),
  },
];

export const findUserById = (id) => {
  return mockUsers.find((u) => u._id === id || u.id === id);
};

/**
 * @desc    Register a new student account
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      studentId,
      password,
      department,
      academicStanding,
      rfidCardUid,
    } = req.body;

    // Validation
    if (!name || !email || !studentId || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, student ID, and password are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    // Check if MongoDB is connected
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      // Check existing user in MongoDB
      const existingUser = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { studentId: studentId.trim() }],
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'An account with that email or Student ID already exists.',
        });
      }

      const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase().trim(),
        studentId: studentId.trim(),
        password,
        department: department || 'College of Engineering & Technology — Computer Science',
        academicStanding: academicStanding || 'Undergraduate',
        rfidCardUid: rfidCardUid || `RFID-${studentId.replace(/[^0-9]/g, '').slice(-4) || 'AUTO'}`,
        weeklyQuotaHours: 25.0,
        usedQuotaHours: 0.0,
      });

      const token = generateToken({
        id: user._id,
        role: user.role,
        studentId: user.studentId,
        email: user.email,
      });

      return res.status(201).json({
        success: true,
        message: 'Student account registered successfully.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          studentId: user.studentId,
          role: user.role,
          department: user.department,
          academicStanding: user.academicStanding,
          rfidCardUid: user.rfidCardUid,
          weeklyQuotaHours: user.weeklyQuotaHours,
          usedQuotaHours: user.usedQuotaHours,
          noShowStrikes: user.noShowStrikes,
        },
      });
    } else {
      // Memory Store Fallback
      const existing = mockUsers.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() ||
          u.studentId.toLowerCase() === studentId.toLowerCase()
      );

      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'An account with that email or Student ID already exists.',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);
      const newMockUser = {
        _id: `mock-user-${Date.now()}`,
        id: `mock-user-${Date.now()}`,
        name: name.trim(),
        email: email.toLowerCase().trim(),
        studentId: studentId.trim(),
        passwordHash,
        role: 'STUDENT',
        department: department || 'College of Engineering & Technology — Computer Science',
        academicStanding: academicStanding || 'Undergraduate',
        rfidCardUid: rfidCardUid || `RFID-${studentId.replace(/[^0-9]/g, '').slice(-4) || 'AUTO'}`,
        weeklyQuotaHours: 25.0,
        usedQuotaHours: 0.0,
        noShowStrikes: 0,
        avatarUrl: '',
        createdAt: new Date().toISOString(),
      };

      mockUsers.push(newMockUser);

      const token = generateToken({
        id: newMockUser._id,
        role: newMockUser.role,
        studentId: newMockUser.studentId,
        email: newMockUser.email,
      });

      return res.status(201).json({
        success: true,
        message: 'Student account registered successfully (Dev memory store).',
        token,
        user: {
          id: newMockUser._id,
          name: newMockUser.name,
          email: newMockUser.email,
          studentId: newMockUser.studentId,
          role: newMockUser.role,
          department: newMockUser.department,
          academicStanding: newMockUser.academicStanding,
          rfidCardUid: newMockUser.rfidCardUid,
          weeklyQuotaHours: newMockUser.weeklyQuotaHours,
          usedQuotaHours: newMockUser.usedQuotaHours,
          noShowStrikes: newMockUser.noShowStrikes,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Authenticate student / admin & return JWT
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide university email or student ID, and password.',
      });
    }

    const cleanIdentifier = identifier.trim().toLowerCase();
    const isDbConnected = mongoose.connection.readyState === 1;

    if (isDbConnected) {
      // Find in MongoDB by email or student ID
      const user = await User.findOne({
        $or: [{ email: cleanIdentifier }, { studentId: identifier.trim() }],
      });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Please verify your email or student ID.',
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Password does not match.',
        });
      }

      const token = generateToken({
        id: user._id,
        role: user.role,
        studentId: user.studentId,
        email: user.email,
      });

      return res.status(200).json({
        success: true,
        message: 'Authentication successful.',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          studentId: user.studentId,
          role: user.role,
          department: user.department,
          academicStanding: user.academicStanding,
          rfidCardUid: user.rfidCardUid,
          weeklyQuotaHours: user.weeklyQuotaHours,
          usedQuotaHours: user.usedQuotaHours,
          noShowStrikes: user.noShowStrikes,
        },
      });
    } else {
      // Memory Store Fallback
      const user = mockUsers.find(
        (u) =>
          u.email.toLowerCase() === cleanIdentifier ||
          u.studentId.toLowerCase() === cleanIdentifier ||
          (u.aliases && u.aliases.some((a) => a.toLowerCase() === cleanIdentifier))
      );

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. User not found.',
        });
      }

      // Check password using bcrypt or allow demo password
      let isMatch = false;
      if (user.passwordHash) {
        isMatch = await bcrypt.compare(password, user.passwordHash);
      }
      // Dev fallback: allow common test passwords for demo convenience
      if (!isMatch && (password === 'StudySanctuary2025#' || password === 'password123' || password === 'admin123' || password === '••••••••••••')) {
        isMatch = true;
      }

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials. Password does not match.',
        });
      }

      const token = generateToken({
        id: user._id,
        role: user.role,
        studentId: user.studentId,
        email: user.email,
      });

      return res.status(200).json({
        success: true,
        message: 'Authentication successful (Dev memory store).',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          studentId: user.studentId,
          role: user.role,
          department: user.department,
          academicStanding: user.academicStanding,
          rfidCardUid: user.rfidCardUid,
          weeklyQuotaHours: user.weeklyQuotaHours,
          usedQuotaHours: user.usedQuotaHours,
          noShowStrikes: user.noShowStrikes,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get currently logged in user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = async (req, res, next) => {
  try {
    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Log out user / invalidate session
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = async (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'User logged out successfully.',
  });
};

export default {
  register,
  login,
  getMe,
  logout,
  findUserById,
};

