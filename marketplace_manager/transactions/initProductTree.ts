import { InitProductTreeInstructionAccounts, InitProductTreeInstructionArgs, createInitProductTreeInstruction, getConcurrentMerkleTreeAccountSize } from "../../utils";
import { BRICK_PROGRAM_ID_PK, BUBBLEGUM_PROGRAM_ID_PK, COMPRESSION_PROGRAM_ID_PK, METADATA_PROGRAM_ID_PK, NOOP_PROGRAM_ID_PK } from "../../constants";
import { Connection, Keypair, PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram, TransactionMessage, VersionedTransaction } from "@solana/web3.js";
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, TOKEN_PROGRAM_ID, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { normalizePrice } from "../../utils/normalizePrice";
import { deriveBrickPda } from "../../utils/derivePda";
import { parse } from 'uuid'

type InitProductTreeAccounts = {
    signer: PublicKey
    marketplace: PublicKey
    paymentMint: PublicKey
}

type InitProductTreeParams = {
    id: string
    productPrice: number
    name: string
    metadataUrl: string
    feeBasisPoints: number
    height: number
    buffer: number
    canopy: number
}

export async function createInitProductTreeTransaction(
    connection: Connection, 
    accounts: InitProductTreeAccounts, 
    params: InitProductTreeParams
): Promise<VersionedTransaction> {
    const id = parse(params.id);
    const accessMint = deriveBrickPda("access_mint", [accounts.marketplace]);
    const accessVault = getAssociatedTokenAddressSync(accessMint, accounts.signer, false, TOKEN_2022_PROGRAM_ID);
    const accessVaultExists = await connection.getAccountInfo(accessVault);
    const product = deriveBrickPda("product", [id]);
    const productMint = deriveBrickPda("productMint", [product]);
    const [masterEdition] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("metadata", "utf-8"),
            METADATA_PROGRAM_ID_PK.toBuffer(),
            productMint.toBuffer(),
            Buffer.from("edition", "utf-8"),
        ],
        METADATA_PROGRAM_ID_PK
    );
    const [metadata] = PublicKey.findProgramAddressSync(
        [
            Buffer.from("metadata", "utf-8"),
            METADATA_PROGRAM_ID_PK.toBuffer(),
            productMint.toBuffer(),
        ],
        METADATA_PROGRAM_ID_PK
    );
    const merkleTree = Keypair.generate();
    const [treeAuthority] = PublicKey.findProgramAddressSync(
        [merkleTree.publicKey.toBuffer()], BUBBLEGUM_PROGRAM_ID_PK
    );

    const space = getConcurrentMerkleTreeAccountSize(params.height, params.buffer, params.canopy);
    const cost = await connection.getMinimumBalanceForRentExemption(space);
    const createTreeAccountIx = SystemProgram.createAccount({
        fromPubkey: accounts.signer,
        newAccountPubkey: merkleTree.publicKey,
        lamports: cost,
        space: space,
        programId: COMPRESSION_PROGRAM_ID_PK,
    });

    const ixAccounts: InitProductTreeInstructionAccounts = {
        ...accounts,
        tokenMetadataProgram:  METADATA_PROGRAM_ID_PK,
        logWrapper: NOOP_PROGRAM_ID_PK,
        systemProgram: SystemProgram.programId,
        bubblegumProgram: BUBBLEGUM_PROGRAM_ID_PK,
        compressionProgram: COMPRESSION_PROGRAM_ID_PK,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        rent: SYSVAR_RENT_PUBKEY,
        product: product,
        productMint: productMint,
        accessMint: accessMint,
        accessVault: accessVaultExists ? accessVault : null,
        productMintVault: getAssociatedTokenAddressSync(productMint, product, true),
        masterEdition: masterEdition,
        metadata: metadata,
        merkleTree: merkleTree.publicKey,
        treeAuthority: treeAuthority,
    };
    
    const args: InitProductTreeInstructionArgs = {
        params: {
            id: [...id],
            productPrice: normalizePrice(params.productPrice, accounts.paymentMint.toString()),
            maxDepth: params.height,
            maxBufferSize: params.buffer,
            name: params.name,
            metadataUrl: params.metadataUrl,
            feeBasisPoints: params.feeBasisPoints,
        }
    };
    const ix = createInitProductTreeInstruction(ixAccounts, args);

    let blockhash = (await connection.getLatestBlockhash('finalized')).blockhash;
    const messageV0 = new TransactionMessage({
        payerKey: accounts.signer,
        recentBlockhash: blockhash,
        instructions: [createTreeAccountIx, ix],
    }).compileToV0Message();

    const transaction = new VersionedTransaction(messageV0);
    transaction.sign([merkleTree]);

    return transaction;
}