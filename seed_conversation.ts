import { Faker, en, en_HK, vi } from '@faker-js/faker';
import axios from 'axios';
const config = {
  headers: {
    authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgsImVtYWlsIjoibnZhNjExMjAwMkBnbWFpbC5jb20iLCJpYXQiOjE3Mjc0NDgyNDEsImV4cCI6MTcyODA1MzA0MX0.04c_1Gm2GqCqrrP7RNh40nYAbuiGmQotIGK7vbJtMVg`, // Thêm token vào header
  },
};
const faker = new Faker({
  locale: [en, vi],
});

const gender = faker.helpers.arrayElement(['FEMALE', 'MALE']);
const http = axios.create({
  baseURL: 'http://localhost:8000/api',
});

const userIdList = Array.from({ length: 18 }, (_, index) => index + 1);
const genMemberIdPairList = () => {
  const combinations = [];

  // Lặp qua từng phần tử trong mảng
  for (let i = 0; i < userIdList.length; i++) {
    for (let j = i + 1; j < userIdList.length; j++) {
      combinations.push([userIdList[i], userIdList[j]]);
    }
  }

  return combinations;
};
const memberIdPairList = genMemberIdPairList();

export class ConversationSeed {
  static async createConversationApi() {
    const randomPair = faker.helpers.arrayElement(memberIdPairList);
    const conversation = {
      memberIdList: faker.helpers.arrayElement(memberIdPairList),
      senderId: faker.helpers.arrayElement(randomPair),
      content: faker.lorem.text(),
    };
    const data = await http
      .post('/message/send', conversation, config)
      .then((data) => console.log(data.data))
      .catch((err) => console.log(err.response?.data.error));
  }
}

async function startGen(genFunct: () => Promise<void>, count: number) {
  for (let i = 0; i < count; i++) {
    genFunct();
  }
}

startGen(async () => ConversationSeed.createConversationApi(), 1000);
