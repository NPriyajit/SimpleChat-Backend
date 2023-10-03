const request = require('supertest');
const app = require('../app');
const Group = require('../db/schema/Group.schema');
const jwt = require('jsonwebtoken');
const { default: mongoose } = require('mongoose');

const baseURL = '/api/groups'
// JWT Hash Mock
const JWT_SECRET = process.env?.JWT_SECRET ?? 'secret';
const mockToken = jwt.sign({ role: 'user', name: 'test' }, JWT_SECRET, { expiresIn: '1h' });



describe('GET /', () => {
	beforeAll(() => {
		mongoose.connect(process.env.DB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
	});

	// afterAll(async () => {
	// 	await mongoose.connection.close();
	// });

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should fetch all groups successfully', async () => {
		// Mock the behavior of the Group.find method
		const mockGroups = [
			{ name: 'Group 1' },
			{ name: 'Group 2' },
		];
		jest.spyOn(Group, 'find').mockResolvedValue(mockGroups);

		const response = await request(app).get(baseURL + '/').set('Authorization', mockToken);

		expect(response.status).toBe(200);
		expect(response.body.message).toBe('Successfully! fetched all the groups');
		expect(response.body.data).toEqual(mockGroups);
	});

});