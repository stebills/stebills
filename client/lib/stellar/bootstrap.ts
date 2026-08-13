import {
  generateMnemonic,
  deriveAccount,
  fundTestnetAccount,
  validateMnemonic,
  STELLAR_NETWORK,
} from './wallet';
import {
  saveMnemonic,
  getMnemonic,
  saveAccounts,
  getAccounts,
  StoredStellarAccount,
} from './secureStorage';
import * as walletApi from '@/lib/api/wallet';

export async function createWalletForUser(userId: string) {
  const mnemonic = generateMnemonic();
  const account = deriveAccount(mnemonic, 0);

  await fundTestnetAccount(account.publicKey);

  const record = await walletApi.registerAccount(
    account.publicKey,
    0,
    'Main Account',
    STELLAR_NETWORK
  );

  await saveMnemonic(userId, mnemonic);
  await saveAccounts(userId, [
    { publicKey: record.publicKey, label: record.label, accountIndex: record.accountIndex },
  ]);

  return { mnemonic, account: record };
}

export async function addAccountForUser(userId: string, label: string) {
  const mnemonic = await getMnemonic(userId);
  if (!mnemonic) {
    throw new Error('No wallet found on this device for this user');
  }

  const existing = await getAccounts(userId);
  const nextIndex = existing.length
    ? Math.max(...existing.map((a) => a.accountIndex)) + 1
    : 0;

  const account = deriveAccount(mnemonic, nextIndex);
  await fundTestnetAccount(account.publicKey);

  const record = await walletApi.registerAccount(
    account.publicKey,
    nextIndex,
    label,
    STELLAR_NETWORK
  );

  const updated: StoredStellarAccount[] = [
    ...existing,
    { publicKey: record.publicKey, label: record.label, accountIndex: record.accountIndex },
  ];
  await saveAccounts(userId, updated);

  return record;
}

export async function hasLocalWallet(userId: string): Promise<boolean> {
  const mnemonic = await getMnemonic(userId);
  return Boolean(mnemonic);
}

export async function importWalletForUser(userId: string, mnemonic: string) {
  if (!validateMnemonic(mnemonic)) {
    throw new Error('Invalid seed phrase');
  }

  const remoteAccounts = await walletApi.listAccounts();

  if (remoteAccounts.length > 0) {
    const account0 = deriveAccount(mnemonic, 0);
    const matches = remoteAccounts.some((a) => a.publicKey === account0.publicKey);
    if (!matches) {
      throw new Error('This seed phrase does not match your account');
    }
  }

  await saveMnemonic(userId, mnemonic.trim());

  const restored: StoredStellarAccount[] = remoteAccounts.map((a) => ({
    publicKey: a.publicKey,
    label: a.label,
    accountIndex: a.accountIndex,
  }));

  await saveAccounts(userId, restored);

  return restored;
}
