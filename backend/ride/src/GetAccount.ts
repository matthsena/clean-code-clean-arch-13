import AccountDAO from "./AccountDAO";

export default class GetAccount {
	accountDAO: AccountDAO;

	constructor(accountDAO: AccountDAO) {
		this.accountDAO = accountDAO;
	}

	async execute(accountId: string) {
		const account = await this.accountDAO.getById(accountId);
		return account;
	}
}