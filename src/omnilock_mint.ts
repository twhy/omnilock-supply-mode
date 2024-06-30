import fs from 'fs';
import { hd, config, helpers, commons, RPC, Indexer } from '@ckb-lumos/lumos';
import { bytes, blockchain, Uint8, Uint128 } from '@ckb-lumos/lumos/codec';
import { XUDT_SCRIPT, XUDT_SCRIPT_HASH, TYPE_ID_SCRIPT, OMNILOCK_SCRIPT, MAX_SUPPLY, CURRENT_SUPPLY } from './omnilock_data';
import { CKT_RPC_URL, CKT_INDEXER_URL } from './constants';
import { tom, may } from './accounts';

config.initializeConfig(config.TESTNET);

const MINT_AMOUNT = +process.argv[2] || 1000;

const { XUDT, OMNILOCK } = config.TESTNET.SCRIPTS;

async function main() {
  const rpc = new RPC(CKT_RPC_URL);
  const indexer = new Indexer(CKT_INDEXER_URL);

  const omniresp = await indexer.getCells({
    script: OMNILOCK_SCRIPT,
    scriptType: "lock",
    scriptSearchMode: 'exact'
  });

  const omnidata = bytes.hexify(bytes.concat(
    Uint8.pack(0),
    Uint128.pack(CURRENT_SUPPLY + MINT_AMOUNT),
    Uint128.pack(MAX_SUPPLY),
    XUDT_SCRIPT_HASH
  ));

  const omnicell = helpers.cellHelper.create({
    type: TYPE_ID_SCRIPT,
    lock: OMNILOCK_SCRIPT,
    data: omnidata
  });

  const mintcell = helpers.cellHelper.create({
    lock: helpers.parseAddress(may.address),
    type: XUDT_SCRIPT,
    data: Uint128.pack(MINT_AMOUNT)
  });

  let txSkeleton = helpers.TransactionSkeleton({
    cellProvider: indexer
  });

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
  
  txSkeleton = txSkeleton.update('inputs', (inputs) => inputs.push(omniresp.objects[0]));
  txSkeleton = await commons.common.injectCapacity(txSkeleton, [tom.address], mintcell.cellOutput.capacity);
  txSkeleton = txSkeleton.update('outputs', (outputs) => outputs.push(omnicell, mintcell));
  txSkeleton = await commons.common.payFeeByFeeRate(txSkeleton, [tom.address], BigInt(1200));
  const length = commons.omnilock.OmnilockWitnessLock.pack({ signature: bytes.hexify(new Uint8Array(65)) }).length   // 85
  const placeholder = bytes.hexify(blockchain.WitnessArgs.pack({
    lock: bytes.hexify(new Uint8Array(length))
  }));
  txSkeleton = txSkeleton.update("witnesses", (witnesses) => witnesses.set(0, placeholder));
  txSkeleton = commons.common.prepareSigningEntries(txSkeleton);
  const signatures = txSkeleton.get('signingEntries')
    .map(({ message }) => hd.key.signRecoverable(message, tom.secretKey))
    .toArray();
  const tx = helpers.createTransactionFromSkeleton(txSkeleton);
  tx.witnesses = [
    bytes.hexify(blockchain.WitnessArgs.pack({ lock: commons.omnilock.OmnilockWitnessLock.pack({
      signature: signatures[1]
    })})),
    bytes.hexify(blockchain.WitnessArgs.pack({ lock: signatures[0] })),
  ];
  tx.hash = await rpc.sendTransaction(tx);
  updateCurrentSupply(CURRENT_SUPPLY + MINT_AMOUNT);
  console.log('tx', tx);
  console.log(`Minted ${MINT_AMOUNT} XUDT to May: ${may.address} with tx hash ${tx.hash}`);
  console.log(`Current supply: ${CURRENT_SUPPLY + MINT_AMOUNT}, Max supply: ${MAX_SUPPLY}`);
}

const OMNILOCK_DATA_FILE = './omnilock_data.ts';
function updateCurrentSupply(supply: number) {
  const content = fs.readFileSync(OMNILOCK_DATA_FILE, 'utf8');
  fs.writeFileSync(
    OMNILOCK_DATA_FILE,
    content.replace(/export const CURRENT_SUPPLY = (\d+);/, `export const CURRENT_SUPPLY = ${supply};`)
  );
}

main();
// https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0042-omnilock/0042-omnilock.md#unlock-with-supply-mode
// Unlock with supply mode
// CellDeps:
//     <vec> Omnilock Script Cell
//     <vec> sUDT Script Cell
// Inputs:
//     <vec> Cell
//         Data: <version> <current supply, 2,000>  <max supply: 10,000> <sUDT script hash, H1>
//         Type: <Type ID script with hash H2>
//         Lock:
//             code_hash: Omnilock
//             args: <flag: 0x0> <pubkey hash 1> <Omnilock flags: 8> <type script hash, H2>
//     <... one of the input cell must have owner lock script as lock, to mint>

// Outputs:
//     <vec> Cell
//         Data: <version> <current supply, 3,000>  <max supply: 10,000> <sUDT script hash, H1>
//         Type: <Type ID script with hash H2>
//         Lock:
//             code_hash: Omnilock
//             args: <flag: 0x0> <pubkey hash 1> <Omnilock flags: 8> <type script hash, H2>
//     <vec> Minted sUDT Cell
//         Data: <amount, 1,000>
//         Type: <type script hash, H1>
//     <...>
// Witnesses:
//     WitnessArgs structure:
//       Lock:
//         signature: <valid secp256k1 signature for pubkey hash 1>
//         omni_identity: <EMPTY>
//         preimage: <EMPTY>
//       <...>