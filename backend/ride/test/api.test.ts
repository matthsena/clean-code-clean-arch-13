import axios from "axios";

axios.defaults.validateStatus = function () {
  return true;
}

test(
  'Deve criar uma conta para o passageiro pela API',
  async function () {
    // given
    const inputSignup = {
      name: 'John Doe',
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: "97456321558",
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