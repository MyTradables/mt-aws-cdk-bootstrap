/* eslint-disable max-lines, max-len, complexity*/
import 'dotenv/config';
import * as fs from 'fs';
import simpleGit, { SimpleGit } from 'simple-git';
import { setupCmdArguments } from './operations/setup-cmd-arguments';
import { validateParameters } from './operations/validate-parameters';
import { createGithubSecret } from './operations/create-add-github-secret';
import { renameBootstrap } from './operations/rename-bootstrap';
import { removeSetupDependencies, removeSetupDirectory, removeSetupFiles } from './operations/remove-setup';
import { setupNewRepoFiles } from './operations/update-and-commit';
import { setBranchAutoDeletion } from './operations/set-branch-auto-deletion';
import { Octokit } from '@octokit/rest';
import { GithubRepo } from './types/types';


const OWNER = 'MyTradables';
const GITHUB_TOKEN = process.env.MT_GITHUB_TOKEN as string;
const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID as string;
const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY as string;

// initialized in main()
let octokit: Octokit;

const main = async () => {
  const argv = await setupCmdArguments();
  const newRepoName = argv.name;
  const newRepoPath = './' + newRepoName;

  octokit = new Octokit({
    auth: GITHUB_TOKEN,
  });

  // create repository in github.
  await octokit.repos.createInOrg({
    org: OWNER,
    name: newRepoName,
    private: true,
  });
  console.log('(1/8) Repository Created...');

  const newGithubRepo: GithubRepo = await validateParameters(
    newRepoName,
    newRepoPath,
    octokit,
    OWNER,
    AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY,
  );
  console.log('(2/8) Validation Done...');

  // setup aws account(s) as github secrets.
  await Promise.all([
    createGithubSecret(
      newGithubRepo,
      octokit,
      OWNER,
      AWS_ACCESS_KEY_ID,
      AWS_SECRET_ACCESS_KEY,
    ),
  ]);
  console.log('(3/8) Creating Github Secrets...');

  // checkout boilerplate repo and remove git information.
  const boilerplateGit: SimpleGit = simpleGit();
  await boilerplateGit.clone(`https://${GITHUB_TOKEN}@github.com/${OWNER}/mt-aws-cdk-bootstrap.git`, newRepoPath);
  fs.rmdirSync(`${newRepoPath}/.git`, { recursive: true });
  console.log('(4/8) Cloned mt-aws-cdk-bootstrap...');

  // repace boilerplate names with new repo names.
  await renameBootstrap(
    newRepoPath,
    newGithubRepo.name,
  );
  console.log('(5/8) Done Renaming New Stack...');

  // cleanup setup before committing.
  await removeSetupFiles(newRepoPath);
  await removeSetupDirectory(newRepoPath);
  await removeSetupDependencies(newRepoPath);
  console.log('(6/8) Cleaned up setup files...');

  // initialize new repo and push the initial commit.
  await setupNewRepoFiles(
    newRepoPath,
    newGithubRepo.name,
    OWNER,
    GITHUB_TOKEN,
  );
  console.log('(7/8) Pushed Changes to Github...');

  await setBranchAutoDeletion(
    newGithubRepo.name,
    OWNER,
    octokit,
  );
  console.log('(8/8) Finished...');
};

main().catch((error: any) => {
  console.error(error);
  process.exit(1);
});
