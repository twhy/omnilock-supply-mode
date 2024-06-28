# Omnilock with Supply Mode

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

## Create Token Info Unique Cell
```
ts-node src/unique_cell.ts
```

## Create Omnilock Cell with Supply Mode
```
ts-node src/omnilock.ts
```