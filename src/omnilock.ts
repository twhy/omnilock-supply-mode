import { hd, utils, config, helpers, RPC, Input, Indexer, commons, HashType } from '@ckb-lumos/lumos';
import { bytes, blockchain, Uint8, Uint64, Uint128 } from '@ckb-lumos/lumos/codec';
import { tom, CKB_RPC_URL, CKB_INDEXER_URL } from './constant';

const { hexify } = bytes;
const { computeScriptHash } = utils;

config.initializeConfig(config.TESTNET);

const { XUDT, OMNILOCK } = config.TESTNET.SCRIPTS;

const TYPE_ID = {
  codeHash: "0x00000000000000000000000000000000000000000000000000545950455f4944",
  hashType: "type" as HashType,
  args: hexify(new Uint8Array(32)),   // 32 bytes placeholder
};

function generateTypeIdArgs(input: Input, index: number) {
  const hasher = new utils.CKBHasher();
  hasher.update(blockchain.CellInput.pack(input));
  hasher.update(Uint64.pack(index));
  return hasher.digestHex();
}

async function main() {
  const rpc = new RPC(CKB_RPC_URL);
  const indexer = new Indexer(CKB_INDEXER_URL);
  const xudt = {
    codeHash: XUDT.CODE_HASH,
    hashType: XUDT.HASH_TYPE,
    args: utils.computeScriptHash(helpers.parseAddress(tom.address)),
  };

  const omnilock = {
    codeHash: OMNILOCK.CODE_HASH,
    hashType: OMNILOCK.HASH_TYPE,
    args: "0x00" + hd.key.publicKeyToBlake160(tom.publicKey).slice(2) + "08" + computeScriptHash(TYPE_ID).slice(2),
  };

  console.log('public key hash', hd.key.publicKeyToBlake160(tom.publicKey).slice(2))
  
  const data = bytes.hexify(bytes.concat(
    Uint8.pack(0),
    Uint128.pack(0),
    Uint128.pack(88888888),
    bytes.bytify(utils.computeScriptHash(xudt))
  ));
  
  const cell = helpers.cellHelper.create({
    lock: omnilock,
    type: TYPE_ID,
    data
  });

  let txSkeleton = helpers.TransactionSkeleton({ cellProvider: indexer });

  txSkeleton = helpers.addCellDep(txSkeleton, {
    depType: XUDT.DEP_TYPE,
    outPoint: {
      txHash: XUDT.TX_HASH,
      index: XUDT.INDEX
    }
  });

  txSkeleton = helpers.addCellDep(txSkeleton, {
    depType: OMNILOCK.DEP_TYPE,
    outPoint: {
      txHash: OMNILOCK.TX_HASH,
      index: OMNILOCK.INDEX
    }
  });

  txSkeleton = await commons.common.injectCapacity(txSkeleton, [tom.address], cell.cellOutput.capacity);
  const args = generateTypeIdArgs({
    previousOutput: txSkeleton.get('inputs').get(0)!.outPoint!,
    since: txSkeleton.get('inputSinces').get(0, '0x0'),
  }, txSkeleton.get('outputs').size);
  cell.cellOutput.type!.args = args;
  cell.cellOutput.lock.args = "0x00" + hd.key.publicKeyToBlake160(tom.publicKey).slice(2) + "08" + computeScriptHash(cell.cellOutput.type!).slice(2);
  txSkeleton = txSkeleton.update('outputs', (outputs) => outputs.push(cell));
  txSkeleton = await commons.common.payFeeByFeeRate(txSkeleton, [tom.address], BigInt(1000));
  txSkeleton = commons.common.prepareSigningEntries(txSkeleton);
  const signatures = txSkeleton
    .get('signingEntries')
    .map(({ message }) => hd.key.signRecoverable(message, tom.secretKey))
    .toArray();
  const tx = helpers.sealTransaction(txSkeleton, signatures);
  tx.hash = await rpc.sendTransaction(tx);
  console.log('tx', tx);
}

// Transaction 0x16f5525edb1042dddd4b2ad49da2f81209b640b93fc380b78e93286916af962e

main();