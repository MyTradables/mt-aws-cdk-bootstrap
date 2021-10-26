import * as fs from 'fs';
import { Octokit } from '@octokit/rest';
import { GithubRepo } from '../types/types';

export const validateParameters = async (
    newRepoName: string,
    newRepoPath: string,
    octokit: Octokit,
    OWNER: string,
    AWS_ACCESS_KEY_ID: string,
    AWS_SECRET_ACCESS_KEY: string
) => {
    if (!AWS_ACCESS_KEY_ID) {
        throw new Error('AWS AWS_ACCESS_KEY_ID for must be specified!');
    }

    if (!AWS_SECRET_ACCESS_KEY) {
        throw new Error('AWS AWS_SECRET_ACCESS_KEY for must be specified!');
    }

    if (fs.existsSync(newRepoPath)) {
        if (fs.readdirSync(newRepoPath).length !== 0) {
            throw new Error('New repo directory must be empty.');
        }
    } else {
        fs.mkdirSync(newRepoPath);
    }

    const newGithubRepo: GithubRepo = (await octokit.rest.repos.get({
        owner: OWNER,
        repo: newRepoName,
    })).data;
    return newGithubRepo;
};