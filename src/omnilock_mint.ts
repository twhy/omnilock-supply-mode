import { hd, utils, config, helpers, commons, RPC, Indexer, HashType } from '@ckb-lumos/lumos';
import { bytes, blockchain, Uint8, Uint128 } from '@ckb-lumos/lumos/codec';
import { tom, may } from './constant';

config.initializeConfig(config.TESTNET);

const { XUDT, OMNILOCK } = config.TESTNET.SCRIPTS;

const TYPE_ID = {
  codeHash: "0x00000000000000000000000000000000000000000000000000545950455f4944",
  hashType: "type" as HashType,
  args: "0x33caa7cdc81d67448dcc2d511c18b1c3b564699e521e045f7fe3baef0290e5e4"
}

async function main() {
  const rpc = new RPC("https://testnet.ckb.dev/rpc");
  const indexer = new Indexer("https://testnet.ckb.dev/indexer");

  const xudt = {
    codeHash: XUDT.CODE_HASH,
    hashType: XUDT.HASH_TYPE,
    args: utils.computeScriptHash(helpers.parseAddress(tom.address)),
  };

  const omnilock = {
    codeHash: OMNILOCK.CODE_HASH,
    hashType: OMNILOCK.HASH_TYPE,
    args: "0x00" + hd.key.publicKeyToBlake160(tom.publicKey).slice(2) + "08" + utils.computeScriptHash(TYPE_ID).slice(2),
    // 0x00e89620d4303c0fbc19710645825113c0c1f3e3fa08030dd7f40b1fc03581776f17a7a15e65bfbcddc2320274a89e2acec0c56e2882
  };

  const omniresp = await indexer.getCells({
    script: omnilock,
    scriptType: "lock",
    scriptSearchMode: 'exact'
  });

  const omnidata = bytes.hexify(bytes.concat(
    Uint8.pack(0),
    Uint128.pack(10000),
    Uint128.pack(88888888),   // total supply
    utils.computeScriptHash(xudt)
  ));

  const omnicell = helpers.cellHelper.create({
    type: TYPE_ID,
    lock: omnilock,
    data: omnidata
  });

  const mintcell = helpers.cellHelper.create({
    lock: helpers.parseAddress(may.address),
    type: xudt,
    data: Uint128.pack(10000)
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
  const placeholder = bytes.hexify(blockchain.WitnessArgs.pack({
    lock: commons.omnilock.OmnilockWitnessLock.pack({ signature: bytes.hexify(new Uint8Array(65)) })
  }));
  txSkeleton = txSkeleton.update("witnesses", (witnesses) => witnesses.set(0, placeholder));
  txSkeleton = commons.common.prepareSigningEntries(txSkeleton);
  // console.log('txSkeleton', JSON.stringify(txSkeleton.toJS(), null, 2));
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
  console.log('tx', tx);
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