const jwt = require('jsonwebtoken');
const Admin = require('../db/schema/Admin.schema');
const request = require('supertest');
const argon2 = require('argon2');
const app = require('../app');
const baseURL = '/api/login';
describe('Admin Login Route Tests', () => {
	// Mock functions and data
	jest.mock('argon2');
	jest.mock('jsonwebtoken');
	const mockAdmin = {
		userName: 'testuser',
		password: 'hashedpassword', // Replace with actual hashed password
		name: 'Test User',
	};

	// Mock Admin.findOne
	Admin.findOne = jest.fn();

	// Mock argon2.verify
	argon2.verify = jest.fn();

	// Mock jwt.sign
	jwt.sign = jest.fn();

	it('should return a token if the login is successful', async () => {
		Admin.findOne.mockResolvedValue(mockAdmin);
		argon2.verify.mockResolvedValue(true);
		jwt.sign.mockReturnValue('mockedToken');
		const response = await request(app)
			.post(baseURL + '/admin')
			.send({ userName: 'testuser', password: 'password' });

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({ success: true, message: 'Successfully! send the token', data: { token: 'mockedToken' } });
	});

	it('should return an error if the user is not found', async () => {
		Admin.findOne.mockResolvedValue(null);

		const response = await request(app)
			.post(baseURL + '/admin')
			.send({ userName: 'nonexistentuser', password: 'password' });

		expect(response.statusCode).toBe(500); // Adjust the expected status code accordingly
		// Add further assertions for the error response
	});

	it('should return an error if password verification fails', async () => {
		Admin.findOne.mockResolvedValue(mockAdmin);
		argon2.verify.mockResolvedValue(false);
		const response = await request(app)
			.post(baseURL + '/admin')
			.send({ userName: 'testuser', password: 'incorrectpassword' });
		expect(response.statusCode).toBe(500);
		expect(response.body.success).toBe(false);
		// Add further assertions for the error response
	});

	it('should handle uncaught errors', async () => {
		Admin.findOne.mockRejectedValue(new Error('Some uncaught error'));

		const response = await request(app)
			.post(baseURL + '/admin')
			.send({ userName: 'testuser', password: 'password' });

		expect(response.statusCode).toBe(500); // Adjust the expected status code accordingly
		// Add further assertions for the error response
	});
});