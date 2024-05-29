const request = require('supertest');
const app = require('../src/app');
const { Item } = require('../src/models/itemModel');
const { User } = require('../src/models/userModel');
const jwt = require('jsonwebtoken');
const { config } = require('../src/config/config');

describe('Item Routes', () => {
  let token;
  let adminToken;

  beforeAll(async () => {
    // Create a regular user and an admin user for testing
    const regularUser = await User.create({
      username: 'testuser',
      password: 'password123',
      email: 'test@example.com',
    });

    const adminUser = await User.create({
      username: 'adminuser',
      password: 'password123',
      email: 'admin@example.com',
      role: 'admin',
    });

    // Generate JWT tokens for the users
    token = jwt.sign({ userId: regularUser.id, role: regularUser.role }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });

    adminToken = jwt.sign({ userId: adminUser.id, role: adminUser.role }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  });

  afterAll(async () => {
    // Clean up the database after testing
    await User.destroy({ truncate: true });
    await Item.destroy({ truncate: true });
  });

  describe('GET /api/items', () => {
    it('should return a list of items', async () => {
      const response = await request(app).get('/api/items');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('items');
    });
  });

  describe('POST /api/items', () => {
    it('should create a new item for an admin user', async () => {
      const response = await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Test Item',
          description: 'This is a test item',
          startingPrice: 10.99,
          endTime: '2023-06-30T12:00:00Z',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('should not create a new item for a regular user', async () => {
      const response = await request(app)
        .post('/api/items')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Test Item',
          description: 'This is a test item',
          startingPrice: 10.99,
          endTime: '2023-06-30T12:00:00Z',
        });

      expect(response.status).toBe(403);
    });
  });
});