import { Octokit } from '@octokit/rest';
import { GithubRepo } from "../types/types";
import { encryptSecret } from "./encrypt-secret";

export const addGithubSecret = async (
    repo: GithubRepo,
    secret: string,
    secretName: string,
    octokit: Octokit,
    OWNER: string,
) => {
    const { encrypted, keyId } = await encryptSecret(repo.name, secret, OWNER, octokit);
    await octokit.request('PUT /repos/{owner}/{repo}/actions/secrets/{secret_name}', {
        owner: OWNER,
        repo: repo.name,
        secret_name: secretName,
        encrypted_value: encrypted,
        key_id: keyId,
    });
};

export const createGithubSecret = async (
    repo: GithubRepo,
    octokit: Octokit,
    OWNER: string,
    AWS_ACCESS_KEY_ID: string,
    AWS_SECRET_ACCESS_KEY: string,
) => {
    await addGithubSecret(repo, AWS_ACCESS_KEY_ID, 'AWS_ACCESS_KEY_ID', octokit, OWNER);
    await addGithubSecret(repo, AWS_SECRET_ACCESS_KEY, 'AWS_SECRET_ACCESS_KEY', octokit, OWNER);
};