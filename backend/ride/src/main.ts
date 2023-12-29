import crypto from "crypto";
import pgp from "pg-promise";
import express, {Request, Response} from 'express';
const app = express();
app.use(express.json());

app.post("/signup", async function (req: Request, res: Response) {
	try {
		const input = req.body;
		const output = await signup(input);
		res.json(output)
	} catch (error: any) {
		res.status(422).json({message: error.message})
	}
});

app.get("/account/:accountId", async function (req: Request, res: Response) {
	const accountId = req.params.accountId;
	const output = await getAccount(accountId);
	res.json(output)
});

app.listen(3000, () => console.log("http://localhost:3000"));

function validateCpf (cpf: string) {
	if (!cpf) return false;
	cpf = clean(cpf);
	if (isInvalidLength(cpf)) return false;
	if (allDigitsAreTheSame(cpf)) return false;
	const dg1 = calculateDigit(cpf, 10);
	const dg2 = calculateDigit(cpf, 11);
	return extractCheckDigit(cpf) === `${dg1}${dg2}`;
}

function clean (cpf: string) {
	return cpf.replace(/\D/g, "");
}

function isInvalidLength (cpf: string) {
	return cpf.length !== 11;
}

function allDigitsAreTheSame (cpf: string) {
	return cpf.split("").every(c => c === cpf[0]);
}

function calculateDigit (cpf: string, factor: number) {
	let total = 0;
	for (const digit of cpf) {
		if (factor > 1) total += parseInt(digit) * factor--;
	}
	const rest = total%11;
	return (rest < 2) ? 0 : 11 - rest;
}

function extractCheckDigit (cpf: string) {
	return cpf.slice(9);
}

async function signup (input: any): Promise<any> {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	try {
		const accountId = crypto.randomUUID();
		const [account] = await connection.query("select * from cccat14.account where email = $1", [input.email]);
		if (account) throw new Error("Duplicated account");
		if (isInvalidName(input.name)) throw new Error("Invalid name");
		if (isInvalidEmail(input.email)) throw new Error("Invalid email");
		if (!validateCpf(input.cpf)) throw new Error("Invalid cpf");
		if (input.isDriver && isInvalidCarPlate(input.carPlate)) throw new Error("Invalid car plate");
		await connection.query("insert into cccat14.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [accountId, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver]);
		return {
			accountId
		};
	} finally {
		await connection.$pool.end();
	}
}

function isInvalidName(name: string) {
	return !name.match(/[a-zA-Z] [a-zA-Z]+/);
}

function isInvalidEmail(email: string) {
	return !email.match(/^(.+)@(.+)$/);
}

function isInvalidCarPlate(carPlate: string) {
	return !carPlate.match(/[A-Z]{3}[0-9]{4}/)
}

async function getAccount(accountId: string) {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	const [account] = await connection.query("select * from cccat14.account where account_id = $1", [accountId]);
	await connection.$pool.end();
	return account;
}

async function requestRide(passengerId: string, from: any, to: any) {
	const account = await getAccount(passengerId)
	if (!account || !account.is_passenger) throw new Error("Invalid passenger")
	const uncompletedRides = await getUncompletedRidesFromPassenger(passengerId)
	if (uncompletedRides.length > 0) throw new Error("Passenger has an uncompleted ride")
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	const rideId = crypto.randomUUID();
	await connection.query("insert into cccat14.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)", [rideId, passengerId, from.lat, from.long, to.lat, to.long, "requested", new Date()]);
	return { rideId }
}

async function getRidesFromPassenger(passengerId: string) {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	const [rides] = await connection.query("select * from cccat14.ride where passenger_id = $1", [passengerId]);
	await connection.$pool.end();
	return rides;
}

async function getUncompletedRidesFromPassenger(passengerId: string) {
	const rides = await getRidesFromPassenger(passengerId)
	if (!rides) return []
	return rides.filter((ride: any) => ride.status !== "completed")
}

async function getRide(rideId: string) {
	const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
	const [ride] = await connection.query("select * from cccat14.ride where ride_id = $1", [rideId]);
	await connection.$pool.end();
	return ride;
}