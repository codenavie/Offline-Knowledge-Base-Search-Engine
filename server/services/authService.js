const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { readUsers, writeUsers, ensureUsersStore } = require("../storage/userStore");

class AuthService {
  constructor() {
    ensureUsersStore();
  }

  getSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error("Missing JWT_SECRET in environment.");
    return secret;
  }

  getExpiry() {
    return process.env.JWT_EXPIRES_IN || "7d";
  }

  sanitizeUser(user) {
    return {
      id: user.id,
      email: user.email,
      createdAt: user.createdAt
    };
  }

  signToken(user) {
    return jwt.sign({ sub: user.id, email: user.email }, this.getSecret(), { expiresIn: this.getExpiry() });
  }

  register({ email, password }) {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedPassword = String(password || "");

    if (!normalizedEmail || !normalizedPassword) {
      throw new Error("Email and password are required.");
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new Error("Invalid email format.");
    }

    if (normalizedPassword.length < 8) {
      throw new Error("Password must be at least 8 characters.");
    }

    const users = readUsers();
    if (users.some((u) => u.email === normalizedEmail)) {
      throw new Error("Email already registered.");
    }

    const hash = bcrypt.hashSync(normalizedPassword, 10);
    const user = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      passwordHash: hash,
      createdAt: new Date().toISOString()
    };

    users.push(user);
    writeUsers(users);

    return {
      user: this.sanitizeUser(user),
      token: this.signToken(user)
    };
  }

  login({ email, password }) {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedPassword = String(password || "");

    if (!normalizedEmail || !normalizedPassword) {
      throw new Error("Email and password are required.");
    }

    const users = readUsers();
    const user = users.find((u) => u.email === normalizedEmail);
    if (!user) throw new Error("Invalid credentials.");

    const matched = bcrypt.compareSync(normalizedPassword, user.passwordHash);
    if (!matched) throw new Error("Invalid credentials.");

    return {
      user: this.sanitizeUser(user),
      token: this.signToken(user)
    };
  }

  verifyToken(token) {
    return jwt.verify(token, this.getSecret());
  }

  findById(userId) {
    const users = readUsers();
    const user = users.find((u) => u.id === userId);
    if (!user) return null;
    return this.sanitizeUser(user);
  }
}

module.exports = new AuthService();
