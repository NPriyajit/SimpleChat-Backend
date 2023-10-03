const request = require('supertest');
const argon2 = require('argon2');
const app = require('../app');
const User = require('../db/schema/User.schema');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');

const baseURL = '/api/admin'
// JWT Hash Mock
const JWT_SECRET = process.env?.JWT_SECRET ?? 'secret';
const mockToken = jwt.sign({ role: 'admin', name: 'test' }, JWT_SECRET, { expiresIn: '1h' });

describe('Admin > Create User Tests', () => {
	// Mock functions and data
	jest.mock('argon2');
	const mockUser = {
		name: 'Test User',
		phone: '1234567890',
		email: 'test@example.com',
		description: 'Test description',
		userName: 'testuser',
	};

	// Mock User.collection.insertOne
	User.collection = {
		insertOne: jest.fn(),
	};

	// Mock argon2.hash
	argon2.hash = jest.fn();

	it('should return Unauthorized - Token is missing if token is not valid', async () => {
		User.collection.insertOne.mockResolvedValue({ acknowledged: true, insertedId: 'mockedId' });
		argon2.hash.mockResolvedValue('mockedHash');

		const response = await request(app)
			.post(baseURL + '/user')
			.send(mockUser);
		expect(response.statusCode).toBe(401);
		expect(response.body.message).toEqual('Unauthorized - Token is missing');
	});

	it('should add a new user and return success', async () => {
		User.collection.insertOne.mockResolvedValue({ acknowledged: true, insertedId: 'mockedId' });
		argon2.hash.mockResolvedValue('mockedHash');

		const response = await request(app)
			.post(baseURL + '/user')
			.set('Authorization', mockToken)
			.send(mockUser);

		expect(response.statusCode).toBe(200);
		expect(response.body).toEqual({ message: 'Successfully! Added new user', data: { id: 'mockedId' }, success: true });
	});

	it('should handle duplicate key error', async () => {
		User.collection.insertOne.mockRejectedValue({ code: 11000 });

		const response = await request(app)
			.post(baseURL + '/user')
			.set('Authorization', mockToken)
			.send(mockUser);

		expect(response.statusCode).toBe(500);
	});

	it('should handle other errors', async () => {
		User.collection.insertOne.mockRejectedValue(new Error('Some uncaught error'));

		const response = await request(app)
			.post(baseURL + '/user')
			.set('Authorization', mockToken)
			.send(mockUser);

		expect(response.statusCode).toBe(500);
	});
});


describe('User Update Middleware', () => {
	beforeAll(() => {
		mongoose.connect(process.env.DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	});

	afterAll(async () => {
		await mongoose.connection.close();
		jest.clearAllMocks();
	});

	it('should update user when valid data is provided', async () => {
		const mockUser = {
			name: 'John Doe',
			phone: '700-856-7890',
			email: 'johdoe@example.com',
			description: 'Updated user description',
			userName: 'johnny',
			password: await argon2.hash('password')
		};

		const insertedUser = await User.create(mockUser);
		const userId = insertedUser._id.toString();

		const updatedUserData = {
			name: 'Updated Name',
			phone: '987-654-3210',
			email: 'updated@example.com',
			description: 'New description',
		};

		const response = await request(app)
			.put(`${baseURL}/user/${userId}`)
			.set('Authorization', mockToken)
			.send(updatedUserData);

		expect(response.status).toBe(200);
		expect(response.body.message).toBe('Successfully! Updated user');
		const updatedUser = await User.findById(userId);
		expect(updatedUser.name).toBe(updatedUserData.name);
		expect(updatedUser.phone).toBe(updatedUserData.phone);
		expect(updatedUser.email).toBe(updatedUserData.email);
		expect(updatedUser.description).toBe(updatedUserData.description);
	});

	it('should return an error when invalid ID is provided', async () => {
		const invalidUserId = 'invalidId123';

		const response = await request(app)
			.put(`${baseURL}/user/${invalidUserId}`)
			.set('Authorization', mockToken)
			.send({ name: 'Updated Name' });

		expect(response.status).toBe(500);
		expect(response.body.message).toBe('Uncaught error! something went wrong!');
	});

});