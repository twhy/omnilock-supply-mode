import { HashType, DepType } from '@ckb-lumos/lumos';

export type Account = {
  mnemonic: string;
  address: string;
  secretKey: string;
  publicKey: string;
}

export const CKB_RPC_URL = "https://testnet.ckb.dev/rpc";
export const CKB_INDEXER_URL = "https://testnet.ckb.dev/indexer";
export const SHANNON_PER_CKB = BigInt(10n ** 8n);

export const tom: Account = {
  mnemonic: "salad recycle flush atom laptop access fat cloth pig horror morning country",
  address: "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsq0gjcsdgvpup77pjugxgkp9zy7qc8e787sjz8vw8",
  secretKey: "0xece99388a468381173adc5983f5c645793216c68e644b35667fbc0821f55fa7f",
  publicKey: "0x02ee01e29509d141f0d846a8c602f9ec635022890f695a6e56864c68c279f2fe22",
}

export const bob: Account ={
  mnemonic: "smart april pitch asthma course miss slot sick air cannon achieve tuna",
  address: "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsq2aj9wc8l80uqlvkclqqn32pg2rlnk9nwqdu660e",
  secretKey: "0x14eac92a94d3e99b12dde6fe48c60e2e55f57532d112c19d2722fd55b7c236be",
  publicKey: "0x031c82dcb4d58bea437302e2605056327b8454e824dd78637379dc5909c84413b1",
}

export const may: Account ={
  mnemonic: "square shallow tiger belt ivory quality multiply harvest clock valley ripple right",
  address: "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqwz36snytvylvama04tfn286jcsjz55yzghrn6dr",
  secretKey: "0x0a49b7d459a60b1cff2cbb405f243d087254d6af53c0f5a8df9fbdd51c3198d6",
  publicKey: "0x036f9054777fe6b7cbe1db49ec102c9c23ccfc62c60d4a45133c336c8b46f5c9e7",
}

export const sam: Account = {
  mnemonic: "tonight stadium hour come element super require vicious craft farm gift index",
  address: "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsq0y7qr9c7p073cu8ahrkqsgp0e29qpp2sq3264k0",
  secretKey: "0x5989e24340a12f6d91d6d5abedd1097cc551721b92ce144c5c3714e296468435",
  publicKey: "0x03ddb274bf972b9ca54fae4f51eb7251fea0d3db20c12f623ef4dcb602ed7c47f7",
};

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