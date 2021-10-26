import { Octokit } from '@octokit/rest';
import * as sodium from 'tweetsodium';
import { getRepositoryPublicKey } from "./get-repository-public-key";

export const encryptSecret = async (
    repoName: string,
    valueToEncrypt: string,
    OWNER: string,
    octokit: Octokit,
): Promise<{ encrypted: string, keyId: string }> => {
    const envKey = await getRepositoryPublicKey(repoName, OWNER, octokit);

    // Convert the message and key to Uint8Array's (Buffer implements that interface)
    const messageBytes = Buffer.from(valueToEncrypt);
    const keyBytes = Buffer.from(envKey.key, 'base64');

    // Encrypt using LibSodium.
    const encryptedBytes = sodium.seal(messageBytes, keyBytes);

    // Base64 the encrypted secret
    const encrypted = Buffer.from(encryptedBytes).toString('base64');
    return { encrypted: encrypted, keyId: envKey.keyId };
};