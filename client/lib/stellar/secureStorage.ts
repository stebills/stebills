import { storage } from '@/lib/utils';

export interface StoredStellarAccount {
  publicKey: string;
  label: string;
  accountIndex: number;
}

const mnemonicKey = (userId: string) => `stellar_mnemonic_${userId}`;
const accountsKey = (userId: string) => `stellar_accounts_${userId}`;

export async function saveMnemonic(userId: string, mnemonic: string): Promise<void> {
  await storage.setItem(mnemonicKey(userId), mnemonic);
}

export async function getMnemonic(userId: string): Promise<string | null> {
  return storage.getItem(mnemonicKey(userId));
}

export async function clearMnemonic(userId: string): Promise<void> {
  await storage.removeItem(mnemonicKey(userId));
}

export async function saveAccounts(
  userId: string,
  accounts: StoredStellarAccount[]
): Promise<void> {
  await storage.setItem(accountsKey(userId), accounts);
}

export async function getAccounts(userId: string): Promise<StoredStellarAccount[]> {
  const accounts = await storage.getItem(accountsKey(userId));
  return accounts ?? [];
}

export async function clearAccounts(userId: string): Promise<void> {
  await storage.removeItem(accountsKey(userId));
}
