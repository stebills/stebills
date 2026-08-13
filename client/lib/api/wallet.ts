import apiClient from './client';
import { ApiSuccess, StellarAccountRecord } from './types';
import { StellarNetwork } from '@/lib/stellar/wallet';

export async function registerAccount(
  publicKey: string,
  accountIndex: number,
  label: string,
  network: StellarNetwork = 'testnet'
): Promise<StellarAccountRecord> {
  const { data } = await apiClient.post<ApiSuccess<StellarAccountRecord>>('/wallet/accounts', {
    publicKey,
    accountIndex,
    label,
    network,
  });
  return data.data;
}

export async function listAccounts(): Promise<StellarAccountRecord[]> {
  const { data } = await apiClient.get<ApiSuccess<StellarAccountRecord[]>>('/wallet/accounts');
  return data.data;
}

export async function renameAccount(id: string, label: string): Promise<StellarAccountRecord> {
  const { data } = await apiClient.patch<ApiSuccess<StellarAccountRecord>>(
    `/wallet/accounts/${id}`,
    { label }
  );
  return data.data;
}

export async function deleteAccount(id: string): Promise<void> {
  await apiClient.delete(`/wallet/accounts/${id}`);
}

export async function getNextAccountIndex(): Promise<number> {
  const { data } = await apiClient.get<ApiSuccess<{ nextIndex: number }>>(
    '/wallet/accounts/next-index'
  );
  return data.data.nextIndex;
}
