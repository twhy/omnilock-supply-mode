import { hd, config, helpers } from '@ckb-lumos/lumos';
const { mnemonic, ExtendedPrivateKey, AddressType } = hd;

config.initializeConfig(config.TESTNET);

function generateAccount() {
  const mne = mnemonic.generateMnemonic();
  const seed = mnemonic.mnemonicToSeedSync(mne);
  const secretKey = ExtendedPrivateKey.fromSeed(seed).privateKeyInfo(AddressType.Receiving, 0).privateKey;
  const publicKey = hd.key.privateToPublic(secretKey);
  const script = config.TESTNET.SCRIPTS.SECP256K1_BLAKE160;
  const lock = {
    args: hd.key.publicKeyToBlake160(publicKey),
    codeHash: script.CODE_HASH,
    hashType: script.HASH_TYPE,
  }
  const address = helpers.encodeToAddress(lock);
  return {
    mnemonic: mne,
    address,
    secretKey,
    publicKey,
  }
}

async function main() {
  const tom = generateAccount();
  const bob = generateAccount();
  const may = generateAccount();

  console.log('Tom:', tom);
  console.log('Bob:', bob);
  console.log('May:', may);
}

main();