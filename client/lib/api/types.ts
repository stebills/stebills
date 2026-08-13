export interface ApiSuccess<T> {
  error: false;
  message: string;
  data: T;
}

export interface ApiUser {
  _id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  role: string;
  authProvider: 'local' | 'google';
}

export interface AuthResult {
  user: ApiUser;
  token: string;
  isNewUser?: boolean;
}

export interface StellarAccountRecord {
  _id: string;
  user: string;
  publicKey: string;
  label: string;
  accountIndex: number;
  network: 'testnet' | 'mainnet';
  isFunded: boolean;
}
