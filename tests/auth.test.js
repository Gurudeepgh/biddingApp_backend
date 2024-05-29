const request = require('supertest');
const app = require('../src/app');
const { User } = require('../src/models/userModel');
const bcrypt = require('bcrypt');
const { config } = require('../src/config/config').test;
const { describe, beforeAll, afterAll, it, expect } = require('@jest/globals');
describe('Auth Routes', () => {
  let validUser;

  beforeAll(async () => {
    // Create a valid user for testing
    const hashedPassword = await bcrypt.hash('password123', 10);
    validUser = await User.create({
      username: 'testuser',
      password: hashedPassword,
      email: 'test@example.com',
    });
  });

  afterAll(async () => {
    // Clean up the database after testing
    await User.destroy({ truncate: true });
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          username: 'newuser',
          password: 'password123',
          email: 'new@example.com',
        });

      expect(response.status).toBe(201);
      expect(response.body.message).toBe('User registered successfully');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate a valid user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
    });
  });
});