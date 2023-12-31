/**
 * This code was GENERATED using the solita package.
 * Please DO NOT EDIT THIS FILE, instead rerun solita to update it or write a wrapper to add functionality.
 *
 * See: https://github.com/metaplex-foundation/solita
 */

import * as splToken from '@solana/spl-token'
import * as beet from '@metaplex-foundation/beet'
import * as web3 from '@solana/web3.js'

/**
 * @category Instructions
 * @category RegisterBuy
 * @category generated
 */
export type RegisterBuyInstructionArgs = {
  amount: number
}
/**
 * @category Instructions
 * @category RegisterBuy
 * @category generated
 */
export const registerBuyStruct = new beet.BeetArgsStruct<
  RegisterBuyInstructionArgs & {
    instructionDiscriminator: number[] /* size: 8 */
  }
>(
  [
    ['instructionDiscriminator', beet.uniformFixedSizeArray(beet.u8, 8)],
    ['amount', beet.u32],
  ],
  'RegisterBuyInstructionArgs',
)
/**
 * Accounts required by the _registerBuy_ instruction
 *
 * @property [_writable_, **signer**] signer
 * @property [_writable_] seller (optional)
 * @property [_writable_] marketplaceAuth (optional)
 * @property [_writable_] marketplace
 * @property [_writable_] product
 * @property [] paymentMint
 * @property [_writable_] buyerTransferVault (optional)
 * @property [_writable_] sellerTransferVault (optional)
 * @property [_writable_] marketplaceTransferVault (optional)
 * @property [_writable_] bountyVault (optional)
 * @property [_writable_] sellerReward (optional)
 * @property [_writable_] sellerRewardVault (optional)
 * @property [_writable_] buyerReward (optional)
 * @property [_writable_] buyerRewardVault (optional)
 * @category Instructions
 * @category RegisterBuy
 * @category generated
 */
export type RegisterBuyInstructionAccounts = {
  signer: web3.PublicKey
  seller?: web3.PublicKey
  marketplaceAuth?: web3.PublicKey
  marketplace: web3.PublicKey
  product: web3.PublicKey
  paymentMint: web3.PublicKey
  buyerTransferVault?: web3.PublicKey
  sellerTransferVault?: web3.PublicKey
  marketplaceTransferVault?: web3.PublicKey
  bountyVault?: web3.PublicKey
  sellerReward?: web3.PublicKey
  sellerRewardVault?: web3.PublicKey
  buyerReward?: web3.PublicKey
  buyerRewardVault?: web3.PublicKey
  systemProgram?: web3.PublicKey
  tokenProgram?: web3.PublicKey
  rent?: web3.PublicKey
  anchorRemainingAccounts?: web3.AccountMeta[]
}

export const registerBuyInstructionDiscriminator = [
  49, 64, 206, 28, 74, 111, 166, 179,
]

/**
 * Creates a _RegisterBuy_ instruction.
 *
 * Optional accounts that are not provided will be omitted from the accounts
 * array passed with the instruction.
 * An optional account that is set cannot follow an optional account that is unset.
 * Otherwise an Error is raised.
 *
 * @param accounts that will be accessed while the instruction is processed
 * @param args to provide as instruction data to the program
 *
 * @category Instructions
 * @category RegisterBuy
 * @category generated
 */
export function createRegisterBuyInstruction(
  accounts: RegisterBuyInstructionAccounts,
  args: RegisterBuyInstructionArgs,
  programId = new web3.PublicKey('PROGRAM PUBKEY'),
) {
  const [data] = registerBuyStruct.serialize({
    instructionDiscriminator: registerBuyInstructionDiscriminator,
    ...args,
  })
  const keys: web3.AccountMeta[] = [
    {
      pubkey: accounts.signer,
      isWritable: true,
      isSigner: true,
    },
  ]

  if (accounts.seller != null) {
    keys.push({
      pubkey: accounts.seller,
      isWritable: true,
      isSigner: false,
    })
  }
  if (accounts.marketplaceAuth != null) {
    if (accounts.seller == null) {
      throw new Error(
        "When providing 'marketplaceAuth' then 'accounts.seller' need(s) to be provided as well.",
      )
    }
    keys.push({
      pubkey: accounts.marketplaceAuth,
      isWritable: true,
      isSigner: false,
    })
  }
  keys.push({
    pubkey: accounts.marketplace,
    isWritable: true,
    isSigner: false,
  })
  keys.push({
    pubkey: accounts.product,
    isWritable: true,
    isSigner: false,
  })
  keys.push({
    pubkey: accounts.paymentMint,
    isWritable: false,
    isSigner: false,
  })
  if (accounts.buyerTransferVault != null) {
    if (accounts.seller == null || accounts.marketplaceAuth == null) {
      throw new Error(
        "When providing 'buyerTransferVault' then 'accounts.seller', 'accounts.marketplaceAuth' need(s) to be provided as well.",
      )
    }
    keys.push({
      pubkey: accounts.buyerTransferVault,
      isWritable: true,
      isSigner: false,
    })
  }
  if (accounts.sellerTransferVault != null) {
    if (
      accounts.seller == null ||
      accounts.marketplaceAuth == null ||
      accounts.buyerTransferVault == null
    ) {
      throw new Error(
        "When providing 'sellerTransferVault' then 'accounts.seller', 'accounts.marketplaceAuth', 'accounts.buyerTransferVault' need(s) to be provided as well.",
      )
    }
    keys.push({
      pubkey: accounts.sellerTransferVault,
      isWritable: true,
      isSigner: false,
    })
  }
  if (accounts.marketplaceTransferVault != null) {
    if (
      accounts.seller == null ||
      accounts.marketplaceAuth == null ||
      accounts.buyerTransferVault == null ||
      accounts.sellerTransferVault == null
    ) {
      throw new Error(
        "When providing 'marketplaceTransferVault' then 'accounts.seller', 'accounts.marketplaceAuth', 'accounts.buyerTransferVault', 'accounts.sellerTransferVault' need(s) to be provided as well.",
      )
    }
    keys.push({
      pubkey: accounts.marketplaceTransferVault,
      isWritable: true,
      isSigner: false,
    })
  }
  if (accounts.bountyVault != null) {
    if (
      accounts.seller == null ||
      accounts.marketplaceAuth == null ||
      accounts.buyerTransferVault == null ||
      accounts.sellerTransferVault == null ||
      accounts.marketplaceTransferVault == null
    ) {
      throw new Error(
        "When providing 'bountyVault' then 'accounts.seller', 'accounts.marketplaceAuth', 'accounts.buyerTransferVault', 'accounts.sellerTransferVault', 'accounts.marketplaceTransferVault' need(s) to be provided as well.",
      )
    }
    keys.push({
      pubkey: accounts.bountyVault,
      isWritable: true,
      isSigner: false,
    })
  }
  if (accounts.sellerReward != null) {
    if (
      accounts.seller == null ||
      accounts.marketplaceAuth == null ||
      accounts.buyerTransferVault == null ||
      accounts.sellerTransferVault == null ||
      accounts.marketplaceTransferVault == null ||
      accounts.bountyVault == null
    ) {
      throw new Error(
        "When providing 'sellerReward' then 'accounts.seller', 'accounts.marketplaceAuth', 'accounts.buyerTransferVault', 'accounts.sellerTransferVault', 'accounts.marketplaceTransferVault', 'accounts.bountyVault' need(s) to be provided as well.",
      )
    }
    keys.push({
      pubkey: accounts.sellerReward,
      isWritable: true,
      isSigner: false,
    })
  }
  if (accounts.sellerRewardVault != null) {
    if (
      accounts.seller == null ||
      accounts.marketplaceAuth == null ||
      accounts.buyerTransferVault == null ||
      accounts.sellerTransferVault == null ||
      accounts.marketplaceTransferVault == null ||
      accounts.bountyVault == null ||
      accounts.sellerReward == null
    ) {
      throw new Error(
        "When providing 'sellerRewardVault' then 'accounts.seller', 'accounts.marketplaceAuth', 'accounts.buyerTransferVault', 'accounts.sellerTransferVault', 'accounts.marketplaceTransferVault', 'accounts.bountyVault', 'accounts.sellerReward' need(s) to be provided as well.",
      )
    }
    keys.push({
      pubkey: accounts.sellerRewardVault,
      isWritable: true,
      isSigner: false,
    })
  }
  if (accounts.buyerReward != null) {
    if (
      accounts.seller == null ||
      accounts.marketplaceAuth == null ||
      accounts.buyerTransferVault == null ||
      accounts.sellerTransferVault == null ||
      accounts.marketplaceTransferVault == null ||
      accounts.bountyVault == null ||
      accounts.sellerReward == null ||
      accounts.sellerRewardVault == null
    ) {
      throw new Error(
        "When providing 'buyerReward' then 'accounts.seller', 'accounts.marketplaceAuth', 'accounts.buyerTransferVault', 'accounts.sellerTransferVault', 'accounts.marketplaceTransferVault', 'accounts.bountyVault', 'accounts.sellerReward', 'accounts.sellerRewardVault' need(s) to be provided as well.",
      )
    }
    keys.push({
      pubkey: accounts.buyerReward,
      isWritable: true,
      isSigner: false,
    })
  }
  if (accounts.buyerRewardVault != null) {
    if (
      accounts.seller == null ||
      accounts.marketplaceAuth == null ||
      accounts.buyerTransferVault == null ||
      accounts.sellerTransferVault == null ||
      accounts.marketplaceTransferVault == null ||
      accounts.bountyVault == null ||
      accounts.sellerReward == null ||
      accounts.sellerRewardVault == null ||
      accounts.buyerReward == null
    ) {
      throw new Error(
        "When providing 'buyerRewardVault' then 'accounts.seller', 'accounts.marketplaceAuth', 'accounts.buyerTransferVault', 'accounts.sellerTransferVault', 'accounts.marketplaceTransferVault', 'accounts.bountyVault', 'accounts.sellerReward', 'accounts.sellerRewardVault', 'accounts.buyerReward' need(s) to be provided as well.",
      )
    }
    keys.push({
      pubkey: accounts.buyerRewardVault,
      isWritable: true,
      isSigner: false,
    })
  }
  keys.push({
    pubkey: accounts.systemProgram ?? web3.SystemProgram.programId,
    isWritable: false,
    isSigner: false,
  })
  keys.push({
    pubkey: accounts.tokenProgram ?? splToken.TOKEN_PROGRAM_ID,
    isWritable: false,
    isSigner: false,
  })
  keys.push({
    pubkey: accounts.rent ?? web3.SYSVAR_RENT_PUBKEY,
    isWritable: false,
    isSigner: false,
  })

  if (accounts.anchorRemainingAccounts != null) {
    for (const acc of accounts.anchorRemainingAccounts) {
      keys.push(acc)
    }
  }

  const ix = new web3.TransactionInstruction({
    programId,
    keys,
    data,
  })
  return ix
}
