import AccountDAO from "../src/AccountDAO";
import AccountDAODatabase from "../src/AccountDAODatabase";
import GetAccount from "../src/GetAccount"
import GetRide from "../src/GetRide";
import Logger from "../src/Logger";
import LoggerConsole from "../src/LoggerConsole";
import RequestRide from "../src/RequestRide";
import RideDAODatabase from "../src/RideDAODatabase";
import Signup from "../src/Signup";
import sinon from "sinon"

let signup: Signup
let getAccount: GetAccount
let requestRide: RequestRide;
let getRide: GetRide;

beforeEach(() => {
	const accountDAO = new AccountDAODatabase();
	const rideDAO = new RideDAODatabase();
	const logger = new LoggerConsole();
  signup = new Signup(accountDAO, logger);
  getAccount = new GetAccount(accountDAO);
	requestRide = new RequestRide(rideDAO, logger);
	getRide = new GetRide(rideDAO, logger);
})

test("Deve solicitar uma corrida", async function () {
	// given
	const inputSignup = {
		name: "John Doe",
		email: `john.doe${Math.random()}@gmail.com`,
		cpf: "71428793860",
		isPassenger: true,
		password: "123456"
	};
	// when
	const outputSignup = await signup.execute(inputSignup);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		fromLat: -23.533773,
		fromLong: -46.625290,
		toLat: -23.538450,
		toLong: -46.632026
	}

	const outputRequestRide = await requestRide.execute(inputRequestRide)
	expect(outputRequestRide.rideId).toBeDefined();
	const outputGetRide = await getRide.execute(outputRequestRide.rideId)
	console.log(outputGetRide)
});
