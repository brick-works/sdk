import { Connection, PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { InitMarketplaceInstructionAccounts, createInitMarketplaceInstruction } from "../../utils";
import { TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { deriveBrickPda } from "../../utils/derivePda";
import { BRICK_PROGRAM_ID_PK } from "../../constants";
import { PaymentFeePayer } from "../../types";

type InitMarketplaceAccounts = {
    signer: PublicKey
    rewardMint: PublicKey
    discountMint: PublicKey
}

type InitMarketplaceParams = {
    fee: number
    feeReduction: number
    sellerReward: number
    buyerReward: number
    transferable: boolean
    permissionless: boolean
    rewardsEnabled: boolean
    feePayer: PaymentFeePayer
}

export async function createInitMarketplaceTransaction(
    connection: Connection, 
    accounts: InitMarketplaceAccounts, 
    params: InitMarketplaceParams
): Promise<VersionedTransaction> {
    const marketplace = deriveBrickPda("marketplace", [accounts.signer]);
    const bountyVault = deriveBrickPda("bounty_vault", [marketplace,accounts.rewardMint]);
    const [accessMint, accessMintBump] = PublicKey.findProgramAddressSync(
        [
          Buffer.from("access_mint", "utf-8"),
          marketplace.toBuffer(),
        ],
        BRICK_PROGRAM_ID_PK
    );

    const ixAccounts: InitMarketplaceInstructionAccounts = {
        ...accounts,
        systemProgram: SystemProgram.programId,
        tokenProgram2022: TOKEN_2022_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        marketplace,
        accessMint,
        bountyVault,
    };
    const ix = createInitMarketplaceInstruction(ixAccounts, { params: { ...params, accessMintBump } });
    let blockhash = (await connection.getLatestBlockhash('finalized')).blockhash;
    const messageV0 = new TransactionMessage({
        payerKey: accounts.signer,
        recentBlockhash: blockhash,
        instructions: [ix],
    }).compileToV0Message();

    return new VersionedTransaction(messageV0);
}