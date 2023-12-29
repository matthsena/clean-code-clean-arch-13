import axios from "axios";
axios.defaults.validateStatus = function () {
  return true;
}
// import crypto from 'crypto';

test.each(['97456321558', '71428793860', '87748248800'])(
  'Deve criar uma conta para o passageiro pela API',
  async function (cpf: string) {
    // given
    const inputSignup = {
      name: 'John Doe',
      email: `john.doe${Math.random()}@gmail.com`,
      cpf,
      isPassenger: true,
      password: '123456',
    };
    // when
    const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup)
    const outputSignup = responseSignup.data;
    const responseGetAccount = await axios.get(`http://localhost:3000/account/${outputSignup.accountId}`) 
    const outputGetAccount = responseGetAccount.data;
    // then
    expect(outputSignup.accountId).toBeDefined();
    expect(outputGetAccount.name).toBe(inputSignup.name);
    expect(outputGetAccount.email).toBe(inputSignup.email);
  }
);

test('Não deve criar uma conta se o nome for inválido', async function () {
  // given
  const inputSignup = {
    name: 'John',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    isPassenger: true,
    password: '123456',
  };
  // when
  const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup)
  const outputSignup = responseSignup.data;
  // then
  expect(responseSignup.status).toBe(422);
  expect(outputSignup.message).toBe('Invalid name');
});

test('Não deve criar uma conta se o email for inválido', async function () {
  // given
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}`,
    cpf: '97456321558',
    isPassenger: true,
    password: '123456',
  };
  // when
  const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup)
  const outputSignup = responseSignup.data;
  // then
  expect(responseSignup.status).toBe(422);
  expect(outputSignup.message).toBe('Invalid email');
});

test.each(['', undefined, null, '11111111111', '111', '11111111111111'])(
  'Não deve criar uma conta se o cpf for inválido',
  async function (cpf: any) {
    // given
    const inputSignup = {
      name: 'John Doe',
      email: `john.doe${Math.random()}@gmail.com`,
      cpf,
      isPassenger: true,
      password: '123456',
    };
    // when
    const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup)
    const outputSignup = responseSignup.data;
    // then
    expect(responseSignup.status).toBe(422);
    expect(outputSignup.message).toBe('Invalid cpf');
  }
);

test('Não deve criar uma conta se o email for duplicado', async function () {
  // given
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    isPassenger: true,
    password: '123456',
  };
  // when
  await axios.post("http://localhost:3000/signup", inputSignup)
  const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup)
  const outputSignup = responseSignup.data;
  // then
  expect(responseSignup.status).toBe(422);
  expect(outputSignup.message).toBe('Duplicated account');
});

test('Deve criar uma conta para o motorista', async function () {
  // given
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    carPlate: 'AAA9999',
    isPassenger: false,
    isDriver: true,
    password: '123456',
  };
  // when
  const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup)
  const outputSignup = responseSignup.data;
  const responseGetAccount = await axios.get(`http://localhost:3000/account/${outputSignup.accountId}`) 
  const outputGetAccount = responseGetAccount.data;
  // then
  expect(outputSignup.accountId).toBeDefined();
  expect(outputGetAccount.name).toBe(inputSignup.name);
  expect(outputGetAccount.email).toBe(inputSignup.email);
});

test('Não deve criar uma conta para o motorista com a placa inválida', async function () {
  // given
  const inputSignup = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '97456321558',
    carPlate: 'AAA999',
    isPassenger: false,
    isDriver: true,
    password: '123456',
  };
  // when
  const responseSignup = await axios.post("http://localhost:3000/signup", inputSignup)
  const outputSignup = responseSignup.data;
  // then
  expect(responseSignup.status).toBe(422);
  expect(outputSignup.message).toBe('Invalid car plate');
});

// test('Tenta solicitar uma corrida para um passageiro invalido', async function () {
//   const latLong = { lat: 1, long: 1 };
//   await expect(() =>
//     requestRide(crypto.randomUUID(), latLong, latLong)
//   ).rejects.toThrow(new Error('Invalid passenger'));
// });

// test('Tenta solicitar uma corrida para um passageiro com corrida em andamento', async function () {
//   const latLong = { lat: 1, long: 1 };
//   await expect(() =>
//     requestRide('c5de7213-4128-482b-8707-97be6e9caf96', latLong, latLong)
//   ).rejects.toThrow(new Error('Passenger has an uncompleted ride'));
// });

// test('Solicita uma corrida', async function () {
//   // given
//   const passengerId = '46b2dd23-8c82-4611-b720-5a27623e3b1a';
//   const latLong = { lat: 1, long: 1 };
//   // when
//   const { rideId } = await requestRide(passengerId, latLong, latLong);
//   const ride = await getRide(rideId);
//   // assert / then
//   expect(rideId).toBe(ride.ride_id);
// });
