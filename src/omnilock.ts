import { hd, utils, config, helpers, RPC, Indexer, commons, HashType } from '@ckb-lumos/lumos';
import { bytes, Uint8, Uint128 } from '@ckb-lumos/lumos/codec';
import { tom, UNIQUE_CELL, CKB_RPC_URL, CKB_INDEXER_URL } from './constant';
import { computeScriptHash } from '@ckb-lumos/lumos/utils';

config.initializeConfig(config.TESTNET);

const { XUDT, OMNILOCK } = config.TESTNET.SCRIPTS;

const TOKEN_INFO_TYPE_SCRIPT = {
  codeHash: "0x8e341bcfec6393dcd41e635733ff2dca00a6af546949f70c57a706c0f344df8b",
  hashType: "type" as HashType,
  args: "0xcd8fd1cc554fa153905a5c6d14d0a42dc1fbc797"
};

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
    args: "0x00" + hd.key.publicKeyToBlake160(tom.publicKey).slice(2) + "08" + computeScriptHash(TOKEN_INFO_TYPE_SCRIPT).slice(2),
  };
  
  const data = bytes.hexify(bytes.concat(
    Uint8.pack(0),
    Uint128.pack(0),
    Uint128.pack(88888888),
    bytes.bytify(utils.computeScriptHash(xudt))
  ));
  
  const cell = helpers.cellHelper.create({
    lock: omnilock,
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

  txSkeleton = helpers.addCellDep(txSkeleton, UNIQUE_CELL.TESTNET.CELL_DEP);

  txSkeleton = await commons.common.injectCapacity(txSkeleton, [tom.address], cell.cellOutput.capacity);
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

main();