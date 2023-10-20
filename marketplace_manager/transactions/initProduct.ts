import { Connection, PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { InitProductInstructionAccounts, InitProductInstructionArgs, createInitProductInstruction } from "../../utils";
import { TOKEN_2022_PROGRAM_ID, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { normalizePrice } from "../../utils/normalizePrice";
import { BRICK_PROGRAM_ID_PK } from "../../constants";
import { deriveBrickPda } from "../../utils/derivePda";
import { parse } from 'uuid'

type InitProductAccounts = {
    signer: PublicKey
    marketplace: PublicKey
    paymentMint: PublicKey
}

 type InitProductParams = {
    id: string
    productPrice: number
}

export async function createInitProductTransaction(
    connection: Connection, 
    accounts: InitProductAccounts, 
    params: InitProductParams
): Promise<VersionedTransaction> {
    const id = parse(params.id);
    const accessMint = deriveBrickPda("access_mint", [accounts.marketplace]);
    const accessVault = getAssociatedTokenAddressSync(accessMint, accounts.signer, false, TOKEN_2022_PROGRAM_ID);
    const accessVaultExists = await connection.getAccountInfo(accessVault);
    const product = deriveBrickPda("product", [id]);
    const [productMint, productMintBump] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("product_mint", "utf-8"), 
            product.toBuffer()
        ],
        BRICK_PROGRAM_ID_PK
    );
    const ixAccounts: InitProductInstructionAccounts = {
        ...accounts,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_2022_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        product,
        productMint,
        accessMint,
        accessVault: accessVaultExists ? accessVault : null,
    };
    const args: InitProductInstructionArgs = {
        params: {
            id: [...id],
            productPrice: normalizePrice(params.productPrice, accounts.paymentMint.toString()),
            productMintBump,
        }
    };
    const ix = createInitProductInstruction(ixAccounts, args);
    let blockhash = (await connection.getLatestBlockhash('finalized')).blockhash;
    const messageV0 = new TransactionMessage({
        payerKey: accounts.signer,
        recentBlockhash: blockhash,
        instructions: [ix],
    }).compileToV0Message();
    
    return new VersionedTransaction(messageV0);
}