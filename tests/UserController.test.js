import Code from 'code';
import Lab from 'lab';
import { server } from '../src/index';
import { validUserData, connectAndResetDb, badUserData } from './helpers';

const { expect } = Code;
const lab = Lab.script();
const { describe, it, before } = lab;

describe('User', () => {
  before(async () => {
    await connectAndResetDb();
  });

  describe('registering', () => {
    it('should get token for valid registration input', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/register',
        payload: validUserData
      });

      expect(response.statusCode).to.equal(200);
      expect(response.result).contain('token');
    });

    it('should see error message for bad input data', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/register',
        payload: badUserData
      });

      expect(response.statusCode).to.equal(400);
      expect(response.result.fields).contain('email');
    });

    it('should see error message for already existing user', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/register',
        payload: validUserData
      });

      expect(response.statusCode).to.equal(409);
      expect(response.result.message).to.equal('User already exists');
    });
  })

  describe('logging in', () => {
    it('should see token if login is successful', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/login',
        payload: validUserData
      });

      expect(response.statusCode).to.equal(200);
      expect(response.result).to.contain('token');
    });

    it('should see helpful error message for bad input data', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/login',
        payload: badUserData
      });

      expect(response.statusCode).to.equal(400);
      expect(response.result.fields).to.contain('email');
    });

    it('should see unauthorization message for wrong login credentials', async () => {
      const response = await server.inject({
        method: 'POST',
        url: '/api/login',
        payload: { ...validUserData, password: 'wrong' }
      });

      expect(response.statusCode).to.equal(401);
      expect(response.result.message).to.contain('Incorrect credentials!');
    });
  });

});


exports.lab = lab;
