import * as fs from 'fs';
import * as path from 'path';
import * as camelcase from 'camelcase';
import * as replace from 'replace-in-file';

export const renameBootstrap = async (newRepoPath: string, newRepoName: string) => {
    const newReponamePascalCase = camelcase(newRepoName, { pascalCase: true });
  
    const stackFileName = path.resolve(newRepoPath, 'lib', 'mt-aws-cdk-bootstrap-stack.ts');
    const appFileName = path.resolve(newRepoPath, 'bin', 'mt-aws-cdk-bootstrap.ts');
    const environmentFiles = path.resolve(newRepoPath, 'bin', 'stack-config.ts');
    const stackInterface = path.resolve(newRepoPath, 'bin', 'stack-environment-types.ts');
    const cdkTestFileName = path.resolve(newRepoPath, 'tests', 'cdk', 'mt-aws-cdk-bootstrap-stack.test.ts');
    const packageFileName = path.resolve(newRepoPath, 'package.json');
    const cdkFileName = path.resolve(newRepoPath, 'cdk.json');
  
    await replace.replaceInFile({
      files: [stackFileName, environmentFiles, stackInterface],
      from: /IMtAwsCdkBootstrapStackProps/g,
      to: `I${newReponamePascalCase}StackProps`,
    });
    await replace.replaceInFile({
      files: [stackFileName, appFileName, cdkTestFileName],
      from: /MtAwsCdkBootstrapStack/g,
      to: `${newReponamePascalCase}Stack`,
    });
    await replace.replaceInFile({
      files: [appFileName, cdkTestFileName, packageFileName, cdkFileName],
      from: /mt-aws-cdk-bootstrap/g,
      to: newRepoName,
    });
  
    fs.renameSync(stackFileName, path.resolve(newRepoPath, 'lib', `${newRepoName}-stack.ts`));
    fs.renameSync(appFileName, path.resolve(newRepoPath, 'bin', `${newRepoName}.ts`));
    fs.renameSync(cdkTestFileName, path.resolve(newRepoPath, 'tests', 'cdk', `${newRepoName}-stack.test.ts`));
  };