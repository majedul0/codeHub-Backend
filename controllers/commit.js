import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

async function collectFilesRecursive(rootDir) {
    const dirents = await fs.readdir(rootDir, { withFileTypes: true });
    const filePaths = [];

    for (const entry of dirents) {
        const fullPath = path.join(rootDir, entry.name);
        if (entry.isDirectory()) {
            const nestedFiles = await collectFilesRecursive(fullPath);
            filePaths.push(...nestedFiles);
        } else if (entry.isFile()) {
            filePaths.push(fullPath);
        }
    }

    
    return filePaths;
}

export async function commit(argvOrMessage) {
    const cwd = process.cwd();
    const message = typeof argvOrMessage === 'string' ? argvOrMessage : argvOrMessage?.message;
    const repoPath = path.resolve(cwd, '.mygit');
    const stagingPath = path.join(repoPath, 'staging');
    const commitsPath = path.join(repoPath, 'commits');

    try {
        await fs.mkdir(commitsPath, { recursive: true });
        await fs.mkdir(stagingPath, { recursive: true });

        const commitId = uuidv4();
        const commitPath = path.join(commitsPath, commitId);

        await fs.mkdir(commitPath, { recursive: true });

        const files = await collectFilesRecursive(stagingPath);
        if (files.length === 0) {
            console.log('Nothing to commit. Staging area is empty.');
            return;
        }

        for (const sourcePath of files) {
            const relativePath = path.relative(stagingPath, sourcePath);
            const targetPath = path.join(commitPath, relativePath);
            await fs.mkdir(path.dirname(targetPath), { recursive: true });
            await fs.copyFile(sourcePath, targetPath);
        }

        await fs.rm(stagingPath, { recursive: true, force: true });
        await fs.mkdir(stagingPath, { recursive: true });

        console.log(`Changes committed with id: ${commitId}`);
        console.log(`Commit message: ${message}`);
    } catch (err) {
        console.error("Error committing changes:", err);
    }
}

export default commit;