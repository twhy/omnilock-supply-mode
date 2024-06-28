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
  mnemonic: "topple poem win speak mixed pipe ivory usage cruel hybrid soul siren",
  address: "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqweyp8e4gr7qtwupaylt744kjuer3gvqlsx5a55s",
  secretKey: "0x191219118192838aaf1434e0cba23512a622cd9b10655e9069113e2970cf67d9",
  publicKey: "0x0221f39fe7fe3bcbcde6c859ffadf9755757fca315f8d354cdee043099d5060a81",
}

export const bob: Account = {
  mnemonic: "tired account learn mosquito tuna egg vanish scout pen security spend village",
  address: "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqvnmx4h95f4evawg34vsevtdcq6jqag49ctetfx6",
  secretKey: "0x53d62058e920ab738052c019c4f1b681d4e588d998a64ce22af7f2194b68d903",
  publicKey: "0x0202eb88f12dfa76d4beff749827904d039fce4a070f4c5a6880744d208d178347",
}

export const may: Account = {
  mnemonic: "cricket color build protect youth essence estate announce faculty dice ability gift",
  address: "ckt1qzda0cr08m85hc8jlnfp3zer7xulejywt49kt2rr0vthywaa50xwsqfe2j06myrnwzq7tn0zw7m9szg6enpnwaqn7pu2d",
  secretKey: "0x7982c786f6c29775a256a527b1b35b497ac8be7f99c4b8ad3345beff1ae8dcd9",
  publicKey: "0x03c8500405754eca3711b24fb185c0bc16470fc8f2dc7ff5dc1fe16b541f85202f",
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