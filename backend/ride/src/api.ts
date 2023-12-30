import express, {Request, Response} from 'express';
import Signup from './Signup';
import GetAccount from './GetAccount';

const app = express();
app.use(express.json());

app.post("/signup", async function (req: Request, res: Response) {
	try {
		const input = req.body;
    const signup = new Signup();
		const output = await signup.execute(input);
		res.json(output)
	} catch (error: any) {
		res.status(422).json({message: error.message})
	}
});

app.get("/account/:accountId", async function (req: Request, res: Response) {
	const accountId = req.params.accountId;
  const getAccount = new GetAccount();
	const output = await getAccount.execute(accountId);
	res.json(output)
});

app.listen(3000, () => console.log("http://localhost:3000"));