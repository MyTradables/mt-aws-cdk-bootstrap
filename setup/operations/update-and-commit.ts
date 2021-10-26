import { execSync } from 'child_process';
import simpleGit, { SimpleGit } from 'simple-git';

export const setupNewRepoFiles = async (newRepoPath: string, newRepoName: string, OWNER:string, GITHUB_TOKEN: string) => {
    const newRepoGit: SimpleGit = simpleGit(newRepoPath);
    const newRepoRemote = `https://${GITHUB_TOKEN}@github.com/${OWNER}/${newRepoName}.git`;

    await newRepoGit.init();
    await newRepoGit.addRemote('origin', newRepoRemote);

    const remoteResponse = await newRepoGit.listRemote([newRepoRemote]);
    if (remoteResponse !== '') {
        throw new Error('Remote repository is not empty!');
    }

    // remove setup dependencies and install needed dependencies
    execSync(`cd ${newRepoPath} && npm install && npm up`);

    await newRepoGit.addConfig('user.name', 'mt-actions');
    await newRepoGit.addConfig('user.email', 'mytradables@gmail.com');
    await newRepoGit.add('./*');
    await newRepoGit.commit('Initial commit');
    await newRepoGit.branch(['-M', 'main']);
    await newRepoGit.push('origin', 'main');
};