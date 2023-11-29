import mongoose, { Types } from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../src/app';
import request from 'supertest';
import {
  createMissionColission,
  createMissionExceedsLand,
  createMissionSuccessfully,
} from '../mock/mission.mock';
import Mission, { IMission } from '../../src/model/Mission';
import User, { IUser } from '../../src/model/User';
import Land, { ILand } from '../../src/model/Land';
import Rover, { IRover } from '../../src/model/Rover';

let mongod: MongoMemoryServer;
let token: string;
let missionId: string | undefined;
let userId: string | undefined;
let landId: string | undefined;
let rover1Id: string | undefined;
let rover2Id: string | undefined;

async function getToken() {
  await request(app)
    .post('/users')
    .send({
      name: 'Luiz Verissimo',
      email: 'luizverissimosouza@gmail.com',
      password: '123',
    })
    .set('content-type', 'application/json');

  const user: IUser | null = await User.getModel()
    .findOne({ name: 'Luiz Verissimo' })
    .lean();
  userId = user?._id?.toString();

  const response = await request(app)
    .post('/sessions')
    .send({
      email: 'luizverissimosouza@gmail.com',
      password: '123',
    })
    .set('content-type', 'application/json');
  token = response.body.token;
}

async function createLand() {
  const userIdParsed = new Types.ObjectId(userId);
  const land = new Land({
    name: 'land 1',
    horizontalRange: 10,
    verticalRange: 9,
    userId: userIdParsed,
  });
  await land.newModel().save();

  const getLand: ILand | null = await Land.getModel()
    .findOne({ name: 'land 1' })
    .lean();
  landId = getLand?._id?.toString();
}
async function createRovers() {
  const userIdParsed = new Types.ObjectId(userId);
  const rover1 = new Rover({
    name: 'rover 1',
    userId: userIdParsed,
  });
  await rover1.newModel().save();

  const rover2 = new Rover({
    name: 'rover 2',
    userId: userIdParsed,
  });
  await rover2.newModel().save();

  const getRover1: IRover | null = await Rover.getModel()
    .findOne({ name: 'rover 1' })
    .lean();
  rover1Id = getRover1?._id?.toString();

  const getRover2: IRover | null = await Rover.getModel()
    .findOne({ name: 'rover 2' })
    .lean();
  rover2Id = getRover2?._id?.toString();
}

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = await mongod.getUri();
  await mongoose.connect(uri);
  await getToken();
  await createLand();
  await createRovers();
});
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});
// afterEach(async () => {
//   const collections = mongoose.connection.collections;
//   for (const key in collections) {
//     const collection = collections[key];
//     await collection.deleteMany();
//   }
// });

describe('Mission Controller', () => {
  describe('create mission', () => {
    it('should return 200 and the mission created', async () => {
      const missionJSON = createMissionSuccessfully(
        landId,
        userId,
        rover1Id,
        rover2Id,
      );
      const response = await request(app)
        .post('/missions')
        .send(missionJSON)
        .set('content-type', 'application/json')
        .set('Authorization', token);

      expect(response.status).toBe(200);
      const mission: IMission | null = await Mission.getModel()
        .findOne({ name: 'mission 1' })
        .lean();
      missionId = mission?._id?.toString();
    });
  });

  describe('Execute mission succefully', () => {
    it('should return 200 and check results', async () => {
      const response = await request(app)
        .get(`/missions/execute/${missionId}`)
        .set('Authorization', token);
      expect(response.status).toBe(200);
      expect(response.body.resultsMission[0].current_orientation).toBe('N');
      expect(response.body.resultsMission[0].current_possition_x).toBe(1);
      expect(response.body.resultsMission[0].current_possition_y).toBe(3);
      expect(response.body.resultsMission[1].current_orientation).toBe('S');
      expect(response.body.resultsMission[1].current_possition_x).toBe(2);
      expect(response.body.resultsMission[1].current_possition_y).toBe(3);
    });
  });

  describe('Execute mission error', () => {
    it('should return 400 and exceeds land', async () => {
      const missionJSON = createMissionExceedsLand(landId, userId, rover1Id);
      const responseCreate = await request(app)
        .post('/missions')
        .send(missionJSON)
        .set('content-type', 'application/json')
        .set('Authorization', token);
      expect(responseCreate.status).toBe(200);

      const mission: IMission | null = await Mission.getModel()
        .findOne({ name: 'mission 2' })
        .lean();
      missionId = mission?._id?.toString();

      const responseExecute = await request(app)
        .get(`/missions/execute/${missionId}`)
        .set('Authorization', token);

      expect(responseExecute.status).toBe(400);
      expect(responseExecute.body.message).toBe(
        'The rover exceeds the limits of plateau.',
      );
    });
  });

  describe('Execute mission error', () => {
    it('should return 400 and colid rovers', async () => {
      const missionJSON = createMissionColission(
        landId,
        userId,
        rover1Id,
        rover2Id,
      );
      const responseCreate = await request(app)
        .post('/missions')
        .send(missionJSON)
        .set('content-type', 'application/json')
        .set('Authorization', token);
      expect(responseCreate.status).toBe(200);

      const mission: IMission | null = await Mission.getModel()
        .findOne({ name: 'mission 3' })
        .lean();
      missionId = mission?._id?.toString();

      const responseExecute = await request(app)
        .get(`/missions/execute/${missionId}`)
        .set('Authorization', token);

      expect(responseExecute.status).toBe(400);
      expect(responseExecute.body.message).toBe('Rovers will collid!');
    });
  });
});
