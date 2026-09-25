// app.test.js
const request = require('supertest');
const app = require('./app');
const { sequelize } = require('./models');

beforeAll(async () => {
     try {
          // 1. Authenticate connection to the test database
          await sequelize.authenticate();

          // 2. Sync database schemas. 
          // Use { force: true } only if you want to drop tables and recreate them fresh for the suite.
          // Alternatively, use { alter: true } or skip syncing if you manage via migrations.
          await sequelize.sync({ force: true });
          console.log('Test Database connected and synced successfully.');
     } catch (error) {
          console.error('Unable to connect to the test database:', error);
          process.exit(1);
     }
});

// Test Suite
describe('API Unit/Integration Tests', () => {

     // Test Case 1: Health endpoint
     it('GET /api/v1/health should return 200 OK', async () => {
          const res = await request(app).get('/api/v1/health');

          expect(res.statusCode).toBe(200);
          expect(res.body).toHaveProperty('status', 'UP');
     });

     // Test Case 2: User creation success path
     it('POST /users should create a user when name and email is provided', async () => {
          const payload = { name: 'Alice', email: `alice${Date.now()}@gmail.com` }
          const res = await request(app)
               .post('/users')
               .send(payload);

          // Explicitly logging for the HTML reporter's console capture engine
          console.log(`[REQUEST] POST /api/v1/users \nPayload: ${JSON.stringify(payload, null, 2)}`);
          console.log(`[RESPONSE] Status: ${res.statusCode} \nBody: ${JSON.stringify(res.body, null, 2)}`);

          expect(res.statusCode).toBe(201);
          expect(res.body).toHaveProperty('id');
          expect(res.body).toHaveProperty('name');
          expect(res.body).toHaveProperty('email');
          expect(res.body).toHaveProperty('gender');


          expect(res.body.name).toBe('Alice');
          const Status = Object.freeze({
               MALE: 'male',
               FEMALE: 'female'
          });
          expect(res.body.gender).toBe(Status.FEMALE);
     });




})


afterAll(async () => {
     // CRITICAL: Close the Sequelize connection pool.
     // If you omit this step, Jest will hang indefinitely because the database connection stays alive.
     await sequelize.close();
});