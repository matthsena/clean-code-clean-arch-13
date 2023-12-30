import AccountDAO from "../src/AccountDAO";
import AccountDAODatabase from "../src/AccountDAODatabase";
import GetAccount from "../src/GetAccount"
import Logger from "../src/Logger";
import LoggerConsole from "../src/LoggerConsole";
import Signup from "../src/Signup";
import sinon from "sinon"

let signup: Signup
let getAccount: GetAccount

beforeEach(() => {
	const accountDAO = new AccountDAODatabase();
	const logger = new LoggerConsole();
  signup = new Signup(accountDAO, logger);
  getAccount = new GetAccount(accountDAO);
})

test("Deve criar uma conta para o passageiro com stub", async function () {
	const stubAccountDAOSave = sinon.stub(AccountDAODatabase.prototype, "save").resolves()
	const stubAccountDAOGetByEmail = sinon.stub(AccountDAODatabase.prototype, "getByEmail").resolves(null)
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "71428793860",
		isPassenger: true,
		password: "123456"
	};
	const stubAccountDAOGetById = sinon.stub(AccountDAODatabase.prototype, "getById").resolves(inputSignup)
	// when
	const outputSignup = await signup.execute(inputSignup);
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	// then
	expect(outputSignup.accountId).toBeDefined();
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
	// restore
	stubAccountDAOSave.restore()
	stubAccountDAOGetById.restore()
	stubAccountDAOGetByEmail.restore()
});

test("Deve criar uma conta para o passageiro  com mock", async function () {
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "71428793860",
		isPassenger: true,
		password: "123456"
	};
	// mock
	const mockLogger = sinon.mock(LoggerConsole.prototype)
	mockLogger.expects("log").withArgs(`Signup ${inputSignup.name}`).once();
	// when
	const outputSignup = await signup.execute(inputSignup);
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	// then
	expect(outputSignup.accountId).toBeDefined();
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
	// verify
	mockLogger.verify()
	mockLogger.restore()
});

test("Não deve criar uma conta se o nome for inválido", async function () {
	// given
	const inputSignup = {
		name: "John",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	// when
	await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve criar uma conta se o email for inválido", async function () {
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	// when
	await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid email"));
});

test.each([
	"",
	undefined,
	null,
	"11111111111",
	"111",
	"11111111111111"
])("Não deve criar uma conta se o cpf for inválido", async function (cpf: any) {
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf,
		isPassenger: true,
		password: "123456"
	};
	// when
	await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Não deve criar uma conta se o email for duplicado", async function () {
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		isPassenger: true,
		password: "123456"
	};
	// when
	await signup.execute(inputSignup);
	await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Duplicated account"));
});

test("Deve criar uma conta para o motorista", async function () {
	const sypLogger = sinon.spy(LoggerConsole.prototype, "log")
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA9999",
		isPassenger: false,
		isDriver: true,
		password: "123456"
	};
	// when
	const outputSignup = await signup.execute(inputSignup);
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	// then
	expect(outputSignup.accountId).toBeDefined();
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
	expect(sypLogger.calledOnce).toBeTruthy()
	expect(sypLogger.calledWith(`Signup ${inputSignup.name}`)).toBeTruthy()
	// restore
	sypLogger.restore()
});

test("Não deve criar uma conta para o motorista com a placa inválida", async function () {
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "97456321558",
		carPlate: "AAA999",
		isPassenger: false,
		isDriver: true,
		password: "123456"
	};
	// when
	await expect(() => signup.execute(inputSignup)).rejects.toThrow(new Error("Invalid car plate"));
});

test("Deve criar uma conta para o passageiro com fake", async function () {
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "71428793860",
		isPassenger: true,
		password: "123456"
	};

	const accountDAO: AccountDAO = {
		async save(account: any): Promise<void> {
		},
		async getById(accountId: string): Promise<any> {
			return inputSignup
		},
		async getByEmail(email: string): Promise<any> {
			return null
		}
	}

	const logger: Logger = {
		log(message: string): void {
		}
	}

	const signup = new Signup(accountDAO, logger);
	const getAccount = new GetAccount(accountDAO);
	// when
	const outputSignup = await signup.execute(inputSignup);
	const outputGetAccount = await getAccount.execute(outputSignup.accountId);
	// then
	expect(outputSignup.accountId).toBeDefined();
	expect(outputGetAccount.name).toBe(inputSignup.name);
	expect(outputGetAccount.email).toBe(inputSignup.email);
});