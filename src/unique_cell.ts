import { hd, utils, config, helpers, commons, RPC, Indexer, HashType, DepType, Input } from '@ckb-lumos/lumos';
import { bytes, blockchain, Uint8, Uint64 } from '@ckb-lumos/lumos/codec';
import { CKT_RPC_URL, CKT_INDEXER_URL } from './constants';
import { tom } from './accounts';

export const UNIQUE_CELL = {
  TESTNET: {
    CELL_DEP: {
      outPoint: {
        txHash: "0xff91b063c78ed06f10a1ed436122bd7d671f9a72ef5f5fa28d05252c17cf4cef",
        index: "0x0",
      },
      depType: "code" as DepType,
    },
    TYPE_SCRIPT: {
      codeHash: "0x8e341bcfec6393dcd41e635733ff2dca00a6af546949f70c57a706c0f344df8b",
      hashType: "type" as HashType,
    },
  },
  MAINNET: {
    CELL_DEP: {
      outPoint: {
        txHash: "0x67524c01c0cb5492e499c7c7e406f2f9d823e162d6b0cf432eacde0c9808c2ad",
        index: "0x0",
      },
      depType: "code" as DepType,
    },
    TYPE_SCRIPT: {
      codeHash: "0x2c8c11c985da60b0a330c61a85507416d6382c130ba67f0c47ab071e00aec628",
      hashType: "data1" as HashType,
    },
  }
}

function generateUniqueCellArgs(input: Input, index: number) {
  const hasher = new utils.CKBHasher();
  hasher.update(blockchain.CellInput.pack(input));
  hasher.update(Uint64.pack(index));
  return hasher.digestHex().slice(0, 42);
}

async function main() {
  config.initializeConfig(config.TESTNET);
  
  const rpc = new RPC(CKT_RPC_URL);
  const indexer = new Indexer(CKT_INDEXER_URL);

  const lock = helpers.parseAddress(tom.address);
  const type = {
    ...UNIQUE_CELL.TESTNET.TYPE_SCRIPT,
    args: bytes.hexify(new Uint8Array(20)),   // 20 bytes placeholder
  };

  const coin = {
    decimal: 6,
    name: "BEE COIN",
    symbol: "BEC",
  };

  const data = bytes.hexify(bytes.concat(
    Uint8.pack(coin.decimal),
    Uint8.pack(coin.name.length),
    new TextEncoder().encode(coin.name),
    Uint8.pack(coin.symbol.length),
    new TextEncoder().encode(coin.symbol),
  ));

  const cell = helpers.cellHelper.create({ lock, type, data });

  let txSkeleton = helpers.TransactionSkeleton({ cellProvider: indexer });

  txSkeleton = helpers.addCellDep(txSkeleton, UNIQUE_CELL.TESTNET.CELL_DEP);
  txSkeleton = await commons.common.injectCapacity(txSkeleton, [tom.address], cell.cellOutput.capacity);

  const input: Input = {
    previousOutput: txSkeleton.get('inputs').get(0)!.outPoint!,
    since: txSkeleton.get('inputSinces').get(0, '0x0'),
  };
  // set actual args
  cell.cellOutput.type!.args = generateUniqueCellArgs(input, txSkeleton.get('outputs').size);

  txSkeleton = txSkeleton.update('outputs', (outputs) => outputs.push(cell));
  txSkeleton = await commons.common.payFeeByFeeRate(txSkeleton, [tom.address], BigInt(1000));
  txSkeleton = commons.common.prepareSigningEntries(txSkeleton);

  const signatures = txSkeleton
    .get('signingEntries')
    .map(({ message }) => hd.key.signRecoverable(message, tom.secretKey))
    .toArray();

  const tx = helpers.sealTransaction(txSkeleton, signatures);
  tx.hash = await rpc.sendTransaction(tx);
  console.log(`A unique cell has been created with tx hash ${tx.hash}`);
}

main();