import { Octokit } from '@octokit/rest';
import { GithubEnvPublicKey } from "../types/types";

export const getRepositoryPublicKey = async (
    repoName: string,
    OWNER: string,
    octokit: Octokit,
): Promise<GithubEnvPublicKey> => {
    const keyResponse = await octokit.request('GET /repos/{owner}/{repo}/actions/secrets/public-key', {
        owner: OWNER,
        repo: repoName,
    });
    const newEnvKey = { key: keyResponse.data.key, keyId: keyResponse.data.key_id };
    return newEnvKey;
};