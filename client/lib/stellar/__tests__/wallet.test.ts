import {
  generateMnemonic,
  validateMnemonic,
  deriveAccount,
  isValidPublicKey,
  fundTestnetAccount,
  getAccountInfo,
} from '../wallet';

describe('stellar wallet crypto core', () => {
  it('generates a valid 24-word mnemonic', () => {
    const mnemonic = generateMnemonic();
    expect(mnemonic.trim().split(/\s+/)).toHaveLength(24);
    expect(validateMnemonic(mnemonic)).toBe(true);
  });

  it('derives deterministic, distinct keypairs per account index', () => {
    const mnemonic = generateMnemonic();

    const account0 = deriveAccount(mnemonic, 0);
    const account0Again = deriveAccount(mnemonic, 0);
    const account1 = deriveAccount(mnemonic, 1);

    expect(account0.publicKey).toBe(account0Again.publicKey);
    expect(account0.secretKey).toBe(account0Again.secretKey);
    expect(account0.publicKey).not.toBe(account1.publicKey);
    expect(isValidPublicKey(account0.publicKey)).toBe(true);
    expect(account0.publicKey.startsWith('G')).toBe(true);
    expect(account0.secretKey.startsWith('S')).toBe(true);
  });

  // Hits the real Stellar Testnet (Friendbot + Horizon) to confirm the
  // network plumbing works end-to-end. Skipped by default since it needs
  // connectivity; run with RUN_NETWORK_TESTS=1 to include it.
  (process.env.RUN_NETWORK_TESTS ? it : it.skip)(
    'funds and reads back a freshly derived testnet account',
    async () => {
      const mnemonic = generateMnemonic();
      const account = deriveAccount(mnemonic, 0);

      await fundTestnetAccount(account.publicKey);

      const info = await getAccountInfo(account.publicKey);
      expect(info.exists).toBe(true);
      expect(info.balances.some((b) => b.assetType === 'native')).toBe(true);
    },
    20000
  );
});
