import { faker } from '@faker-js/faker';
import axios from 'axios';

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

const memberIdList = getCombinations(numberArray);

// Sử dụng faker để random chọn 1 cặp từ mảng
const randomPair = faker.helpers.arrayElement(memberIdList);

console.log(randomPair);

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

export function createConversationData() {
  const randomPair = faker.helpers.arrayElement(memberIdList);
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
// createAccountApi();
createConversationApi();
