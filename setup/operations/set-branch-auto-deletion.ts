import { Octokit } from '@octokit/rest';

export const setBranchAutoDeletion = async (
  repoName: string,
  OWNER: string,
  octokit: Octokit,
) => {
  await octokit.request('PATCH /repos/{owner}/{repo}', {
    owner: OWNER,
    repo: repoName,
    delete_branch_on_merge: true,
  });
};