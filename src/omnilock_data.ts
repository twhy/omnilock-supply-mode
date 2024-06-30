// This file is generated by omnilock.ts
import { Script } from '@ckb-lumos/lumos';
export const TYPE_ID_SCRIPT = {
  "codeHash": "0x00000000000000000000000000000000000000000000000000545950455f4944",
  "hashType": "type",
  "args": "0x9cb55adc848dc02e9344eb3ed050cab502c115b021f7a2b31e82f20f9df53a8b"
} as Script;

export const MAX_SUPPLY = 20000;

export const CURRENT_SUPPLY = 18000;

export const XUDT_SCRIPT = {
  "codeHash": "0x25c29dc317811a6f6f3985a7a9ebc4838bd388d19d0feeecf0bcd60f6c0975bb",
  "hashType": "type",
  "args": "0x8be8af2e8e0f6efe6d2f03652c0a454fb83935374dabc32503d70a5f5b9c04de"
} as Script;

export const XUDT_SCRIPT_HASH = "0xce29a79a4a751b75a45dc90b852a3ab77835e9f02fee8debcb951cd65e650831";

export const OMNILOCK_SCRIPT = {
  "codeHash": "0xf329effd1c475a2978453c8600e1eaf0bc2087ee093c3ee64cc96ec6847752cb",
  "hashType": "type",
  "args": "0x00b716d7127cb841288f7a1a42e0a4b96831242e3b080811e807dbd469935ab07c7c17f24d5587172360b2ef907cffe368da5cb161d4"
} as Script;

export const OMNILOCK_SCRIPT_HASH = "0x49ae48dbe08943e8ce30ba18e0e57271ea494d31578dbdf99ac2ad26066d78ad";

export const OMNILOCK_TRANSACTION = {
  "version": "0x0",
  "cellDeps": [
    {
      "outPoint": {
        "txHash": "0xbf6fb538763efec2a70a6a3dcb7242787087e1030c4e7d86585bc63a9d337f5f",
        "index": "0x0"
      },
      "depType": "code"
    },
    {
      "outPoint": {
        "txHash": "0xec18bf0d857c981c3d1f4e17999b9b90c484b303378e94de1a57b0872f5d4602",
        "index": "0x0"
      },
      "depType": "code"
    },
    {
      "outPoint": {
        "txHash": "0xf8de3bb47d055cdf460d93a2a6e1b05f7432f9777c8c474abf4eec1d4aee5d37",
        "index": "0x0"
      },
      "depType": "depGroup"
    }
  ],
  "headerDeps": [],
  "inputs": [
    {
      "since": "0x0",
      "previousOutput": {
        "txHash": "0x1183b5c2b00be751d0e35083c333073692237a52bbdee4192f5c959a129f8a47",
        "index": "0x0"
      }
    }
  ],
  "outputs": [
    {
      "capacity": "0xde5a6f885c",
      "lock": {
        "codeHash": "0x9bd7e06f3ecf4be0f2fcd2188b23f1b9fcc88e5d4b65a8637b17723bbda3cce8",
        "hashType": "type",
        "args": "0xb716d7127cb841288f7a1a42e0a4b96831242e3b"
      }
    },
    {
      "capacity": "0x53d1ac100",
      "lock": {
        "codeHash": "0xf329effd1c475a2978453c8600e1eaf0bc2087ee093c3ee64cc96ec6847752cb",
        "hashType": "type",
        "args": "0x00b716d7127cb841288f7a1a42e0a4b96831242e3b080811e807dbd469935ab07c7c17f24d5587172360b2ef907cffe368da5cb161d4"
      },
      "type": {
        "codeHash": "0x00000000000000000000000000000000000000000000000000545950455f4944",
        "hashType": "type",
        "args": "0x9cb55adc848dc02e9344eb3ed050cab502c115b021f7a2b31e82f20f9df53a8b"
      }
    }
  ],
  "outputsData": [
    "0x",
    "0x0000000000000000000000000000000000204e0000000000000000000000000000ce29a79a4a751b75a45dc90b852a3ab77835e9f02fee8debcb951cd65e650831"
  ],
  "witnesses": [
    "0x55000000100000005500000055000000410000006e03a72aa8984656a57ebf9e9aa47e823f8abd00183df49b78a997bffd09a22e6cb30c58bcadcbcdb4b961c3b03fcc9d25770755f75b9b9f2d2af2618089e31200"
  ],
  "hash": "0xf049b272871df4cdcd1e060e690c47a0492b25f0557983ea558433e1945ce3b8"
};
