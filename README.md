# Omnilock Supply Mode / XUDT with Max Supply

This project demos how to mint XUDT that has max supply in [Nervos Network](https://www.nervos.org/).

It uses the supply mode of [Omnilock](https://github.com/nervosnetwork/rfcs/blob/master/rfcs/0042-omnilock/0042-omnilock.md). 

## Install
Use either `npm` or `pnpm` is OK.
```sh
$ pnpm i
$ pnpm i -g ts-node
$ cd src
```

## Run
### 1. Generating New Test Accounts
```sh
$ ts-node generate.ts
```
This will generate three accounts (tom, bob, may) and write them to `accounts.ts`.

### 2. Claim Testnet CKB
Copy `tom's` address in `accounts.ts` and claim some Testnet CKB.

Faucet: https://faucet.nervos.org/ 

### 3. Create a Supply Mode Omnilock Cell
You can specify an optional max supply which defaults to 10,000.
```sh
$ ts-node omnilock.ts            // default max supply: 10,000
$ ts-node omnilock.ts 666666     // specify max supply: 666666
```
After running `omnilock.ts`, some related data will be written to `omnilock_data.ts`.

### 4. Mint XUDT with Max Supply
You can specify an optional mint amount which defaults to 1,000.
```sh
$ ts-node omnilock_mint.ts      // default mint amount: 1,000
$ ts-node omnilock_mint.ts 5000 // specify mint amount: 5,000
```
To keep things simple, all minted XUDT goes to `may's` address.

And `CURRENT_SUPPLY` in `omnilock_data.ts` will be updated after each successful minting.

### 5. View Cells / Transactions in Explorer
Every successful transaction will be logged in terminal.

Copy the transaction hash and view it Testnet Explorer: https://pudge.explorer.nervos.org/ .

## A Full Example
```
$ ts-node generate.ts              // generate test accounts
// Go to the faucet page and claim some testnet CKB for tom
$ ts-node omnilock.ts              // use default max supply 10,000
$ ts-node omnilock_mint.ts 2000    // mint 2000 XUDT for may
$ ts-node omnilock_mint.ts 6000    // mint another 6000 XUDT for may
$ ts-node omnilock_mint.ts 3000    // Error 90: ERROR_EXCEED_SUPPLY
```

## RFC
https://github.com/XuJiandong/rfcs/blob/xudt/rfcs/0042-omnilock/0042-omnilock.md#supply-mode

```
CellDeps:
    <vec> Omnilock Script Cell
    <vec> sUDT Script Cell
Inputs:
    <vec> Cell
        Data: <version> <current supply, 2,000>  <max supply: 10,000> <sUDT script hash, H1>
        Type: <Type ID script with hash H2>
        Lock:
            code_hash: Omnilock
            args: <flag: 0x0> <pubkey hash 1> <Omnilock flags: 8> <type script hash, H2>
    <... one of the input cell must have owner lock script as lock, to mint>

Outputs:
    <vec> Cell
        Data: <version> <current supply, 3,000>  <max supply: 10,000> <sUDT script hash, H1>
        Type: <Type ID script with hash H2>
        Lock:
            code_hash: Omnilock
            args: <flag: 0x0> <pubkey hash 1> <Omnilock flags: 8> <type script hash, H2>
    <vec> Minted sUDT Cell
        Data: <amount, 1,000>
        Type: <type script hash, H1>
    <...>
Witnesses:
    WitnessArgs structure:
      Lock:
        signature: <valid secp256k1 signature for pubkey hash 1>
        omni_identity: <EMPTY>
        preimage: <EMPTY>
      <...>
```

## Reference 
* [Omnilock Script Error Codes](https://github.com/nervosnetwork/ckb-script-error-codes/blob/main/by-type-hash/9b819793a64463aed77c615d6cb226eea5487ccfc0783043a587254cda2b6f26.md)
* [Error Code 90: ERROR_EXCEED_SUPPLY](https://github.com/nervosnetwork/ckb-script-error-codes/blob/main/by-type-hash/9b819793a64463aed77c615d6cb226eea5487ccfc0783043a587254cda2b6f26.md#90)