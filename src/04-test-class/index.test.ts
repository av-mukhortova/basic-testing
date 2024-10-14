// Uncomment the code below and write your tests
import {
  BankAccount,
  getBankAccount,
  InsufficientFundsError,
  SynchronizationFailedError,
  TransferFailedError,
} from '.';
import lodash from 'lodash';

describe('BankAccount', () => {
  test('should create account with initial balance', () => {
    const initialBalance = 8000;
    const bankAccount: BankAccount = getBankAccount(initialBalance);
    expect(bankAccount.getBalance()).toBe(initialBalance);
  });

  test('should throw InsufficientFundsError error when withdrawing more than balance', () => {
    const initialBalance = 3000;
    const bankAccount: BankAccount = getBankAccount(initialBalance);
    expect(() => bankAccount.withdraw(initialBalance + 100)).toThrowError(
      InsufficientFundsError,
    );
  });

  test('should throw error when transferring more than balance', () => {
    const initialBalance = 10;
    const bankAccount: BankAccount = getBankAccount(initialBalance);
    const accountForTransfering: BankAccount = getBankAccount(initialBalance);
    expect(() =>
      bankAccount.transfer(initialBalance + 100, accountForTransfering),
    ).toThrowError(InsufficientFundsError);
  });

  test('should throw error when transferring to the same account', () => {
    const initialBalance = 100;
    const bankAccount: BankAccount = getBankAccount(initialBalance);
    expect(() =>
      bankAccount.transfer(initialBalance, bankAccount),
    ).toThrowError(TransferFailedError);
  });

  test('should deposit money', () => {
    const initialBalance = 1000000;
    const bankAccount: BankAccount = getBankAccount(initialBalance);
    const balance = bankAccount.getBalance();
    const deposit = 1000;
    expect(bankAccount.deposit(deposit).getBalance()).toBe(balance + deposit);
  });

  test('should withdraw money', () => {
    const initialBalance = 100000;
    const bankAccount: BankAccount = getBankAccount(initialBalance);
    const balance = bankAccount.getBalance();
    const withdraw = 1000;
    expect(bankAccount.withdraw(withdraw).getBalance()).toBe(
      balance - withdraw,
    );
  });

  test('should transfer money', () => {
    const initialBalance = 14000;
    const bankAccount: BankAccount = getBankAccount(initialBalance);
    const accountForTransfering: BankAccount = getBankAccount(initialBalance);
    const balance = bankAccount.getBalance();
    const destinationBalance = bankAccount.getBalance();
    const transfer = 500;
    expect(
      bankAccount.transfer(transfer, accountForTransfering).getBalance(),
    ).toBe(balance - transfer);

    expect(accountForTransfering.getBalance()).toBe(
      destinationBalance + transfer,
    );
  });

  test('fetchBalance should return number in case if request did not failed', async () => {
    const initialBalance = 20000;
    const bankAccount: BankAccount = getBankAccount(initialBalance);
    const fetchedBalance = 1000;
    jest
      .spyOn(lodash, 'random')
      .mockReturnValueOnce(fetchedBalance)
      .mockReturnValueOnce(100);
    const res = await bankAccount.fetchBalance();
    expect(res).toBe(fetchedBalance);
  });

  test('should set new balance if fetchBalance returned number', async () => {
    const initialBalance = 30000;
    const bankAccount: BankAccount = getBankAccount(initialBalance);
    const fetchedBalance = 5000;
    jest
      .spyOn(bankAccount, 'fetchBalance')
      .mockResolvedValueOnce(fetchedBalance);

    await bankAccount.synchronizeBalance();
    expect(bankAccount.getBalance()).toBe(fetchedBalance);
  });

  test('should throw SynchronizationFailedError if fetchBalance returned null', async () => {
    const initialBalance = 50000;
    const bankAccount: BankAccount = getBankAccount(initialBalance);
    jest.spyOn(bankAccount, 'fetchBalance').mockResolvedValueOnce(null);
    const res = await bankAccount.synchronizeBalance.bind(bankAccount);
    expect(res).rejects.toThrow(SynchronizationFailedError);
  });
});
