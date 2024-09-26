import { Faker, en, en_HK, vi } from '@faker-js/faker';
import axios from 'axios';

const faker = new Faker({
  locale: [en, vi],
});

const gender = faker.helpers.arrayElement(['FEMALE', 'MALE']);
const http = axios.create({
  baseURL: 'http://localhost:8000',
});
function getCombinations(array) {
  const combinations = [];

  // Lặp qua từng phần tử trong mảng
  for (let i = 0; i < array.length; i++) {
    for (let j = i + 1; j < array.length; j++) {
      combinations.push([array[i], array[j]]);
    }
  }

  return combinations;
}
const numberArray = Array.from({ length: 10 }, (_, index) => index + 1);

const memberIdPairList = getCombinations(numberArray);

// Sử dụng faker để random chọn 1 cặp từ mảng
const randomPair = faker.helpers.arrayElement(memberIdPairList);

console.log(randomPair);

// ACCOUNT
export function createAccountData() {
  return {
    email: faker.internet.email(),
    password: '112233',
    lastName: faker.person.lastName(),
    firstName: faker.person.firstName(),
    gender: gender,
    birthDate: faker.date.birthdate(),
  };
}

export const usersData = faker.helpers.multiple(createAccountData, {
  count: 10,
});

const createAccountApi = async () => {
  for (const user of usersData) {
    const data = await http
      .post('/auth/register', user)
      .then((data) => console.log(data.data))
      .catch((err) => console.log(err.response?.data.error));
  }
};

// CONVERSATION
export function createConversationData() {
  const randomPair = faker.helpers.arrayElement(memberIdPairList);
  return {
    memberIdList: randomPair,
  };
}

export const conversationData = faker.helpers.multiple(createConversationData, {
  count: 1000,
});

const createConversationApi = async () => {
  for (const conversation of conversationData) {
    const data = await http
      .post('/conversation', conversation)
      .then((data) => console.log(data.data))
      .catch((err) => console.log(err.response?.data.error));
  }
};

// SEND FIRST MESSAGE

export const sendFirstMessageData = faker.helpers.multiple(
  () => {
    const randomPair = faker.helpers.arrayElement(memberIdPairList);

    const senderId = faker.helpers.arrayElement(randomPair);
    return {
      content: faker.lorem.sentence(),
      senderId: senderId,
      memberIdList: randomPair,
    };
  },
  {
    count: 2,
  },
);

export const sendMessageData = faker.helpers.multiple(
  () => {
    const randomPair = faker.helpers.arrayElement(memberIdPairList);

    const senderId = faker.helpers.arrayElement(randomPair);
    return {
      content: faker.lorem.sentence(),
      senderId: senderId,
      conversationId: randomPair,
    };
  },
  {
    count: 2,
  },
);

const createSendFirstMessageApi = async () => {
  for (const msg of sendMessageData) {
    console.log('🚀 ~ createSendMessageApi ~ msg:', msg);
    const data = await http
      .post('/message/send', msg)
      .then((data) => console.log(data.data))
      .catch((err) => console.log(err.response?.data.error));
  }
};

const getConversationList = async (userId: number) => {
  const conversationIdList = [];
  const data = await http
    .get(`/conversation/user/${userId}`)
    .then((data) => {
      conversationIdList.push(
        data.data.conversationList.map((item) => item.id),
      );
    })
    .catch((err) => console.log(err.response?.data.error));

  return conversationIdList;
};
const createSendMessageApi = async (
  count: number,
  pairId: number[],
  conversationId: string,
) => {
  for (let i = 1; i < count; i++) {
    const senderId = faker.helpers.arrayElement(pairId);
    const dataBody = {
      content: faker.lorem.sentence(),
      senderId: senderId,
      conversationId: conversationId,
    };

    const config = {
      headers: {
        authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJudmFAIiwiaWF0IjoxNzI3MDc5OTMxLCJleHAiOjE3Mjc2ODQ3MzF9.jb1dvffkkGRd4t1r2zfLxz8ueRU6fdweCtMONaYZi44`, // Thêm token vào header
      },
    };
    const data = await http
      .post('/message/send', dataBody, config)
      .then((data) => console.log(data.data))
      .catch((err) => console.log(err.response?.data.error));
  }
};
createSendMessageApi(10, [1, 2], '66f125a35df046ab588905b5');
// createAccountApi();
// createConversationApi();
