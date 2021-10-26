import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

export const removeSetupFiles = async (newRepoPath: string) => {
    const githubSetupAction = path.resolve(newRepoPath, '.github', 'workflows', 'create_stack.yaml');
    fs.rm(githubSetupAction, (err: any) => {
        if (err) {
            console.log(err)
        }
    });
};

export const removeSetupDirectory = async (newRepoPath: string) => {
    const setupDirectory = path.resolve(newRepoPath, 'setup');
    fs.rm(setupDirectory, { recursive: true, force: true }, (err: any) => {
        if (err) {
            console.log(err)
        }
    });
};

export const removeSetupDependencies = async (newRepoPath: string) => {
    const setupDependencies = '@mytradables/mt-bootstrap-setup';
    execSync(`cd ${newRepoPath} && npm uninstall ${setupDependencies}`);
}