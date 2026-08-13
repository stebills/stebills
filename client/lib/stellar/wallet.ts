import '@/lib/polyfills';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { Horizon, Keypair, StrKey } from '@stellar/stellar-sdk';

// SEP-0005: Stellar HD accounts are derived under m/44'/148'/{accountIndex}'.
const STELLAR_SEP5_COIN_TYPE = 148;

export type StellarNetwork = 'testnet' | 'mainnet';

export const STELLAR_NETWORK: StellarNetwork = 'testnet';

const HORIZON_URL =
  STELLAR_NETWORK === 'testnet'
    ? 'https://horizon-testnet.stellar.org'
    : 'https://horizon.stellar.org';

const FRIENDBOT_URL = 'https://friendbot.stellar.org';

const server = new Horizon.Server(HORIZON_URL);

export interface StellarAccountKeys {
  publicKey: string;
  secretKey: string;
}

export function generateMnemonic(): string {
  // 256 bits of entropy -> 24-word mnemonic
  return bip39.generateMnemonic(256, undefined, bip39.wordlists.english);
}

export function validateMnemonic(mnemonic: string): boolean {
  return bip39.validateMnemonic(mnemonic.trim(), bip39.wordlists.english);
}

export function deriveAccount(mnemonic: string, accountIndex: number): StellarAccountKeys {
  if (!validateMnemonic(mnemonic)) {
    throw new Error('Invalid mnemonic');
  }

  const seed = bip39.mnemonicToSeedSync(mnemonic.trim()).toString('hex');
  const path = `m/44'/${STELLAR_SEP5_COIN_TYPE}'/${accountIndex}'`;
  const { key } = derivePath(path, seed);

  const keypair = Keypair.fromRawEd25519Seed(Buffer.from(key));

  return { publicKey: keypair.publicKey(), secretKey: keypair.secret() };
}

export function isValidPublicKey(publicKey: string): boolean {
  return StrKey.isValidEd25519PublicKey(publicKey);
}

export async function fundTestnetAccount(publicKey: string): Promise<void> {
  if (STELLAR_NETWORK !== 'testnet') {
    throw new Error('Friendbot funding is only available on testnet');
  }

  const response = await fetch(`${FRIENDBOT_URL}?addr=${encodeURIComponent(publicKey)}`);

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Friendbot funding failed: ${body}`);
  }
}

export interface StellarAccountInfo {
  exists: boolean;
  balances: { assetType: string; assetCode?: string; balance: string }[];
}

export async function getAccountInfo(publicKey: string): Promise<StellarAccountInfo> {
  try {
    const account = await server.accounts().accountId(publicKey).call();

    return {
      exists: true,
      balances: account.balances.map((b: any) => ({
        assetType: b.asset_type,
        assetCode: b.asset_code,
        balance: b.balance,
      })),
    };
  } catch (error: any) {
    if (error?.response?.status === 404) {
      return { exists: false, balances: [] };
    }
    throw error;
  }
}
