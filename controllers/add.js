import fs from 'fs/promises';
import path from 'path';

async function collectFilesRecursive(rootDir) {
    const dirents = await fs.readdir(rootDir, { withFileTypes: true });
    const filePaths = [];
    const skippedDirectories = new Set(['.mygit', '.git', 'node_modules']);

    for (const entry of dirents) {
        if (entry.isDirectory() && skippedDirectories.has(entry.name)) {
            continue;
        }

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

export async function add(filePath) {
    const cwd = process.cwd();
    const repoPath = path.resolve(cwd, '.mygit');
    const stagingPath = path.join(repoPath, 'staging');
    try{
        await fs.mkdir(stagingPath, { recursive: true });

        if (!filePath) {
            const allFiles = await collectFilesRecursive(cwd);

            for (const sourcePath of allFiles) {
                const relativePath = path.relative(cwd, sourcePath);
                const targetPath = path.join(stagingPath, relativePath);
                await fs.mkdir(path.dirname(targetPath), { recursive: true });
                await fs.copyFile(sourcePath, targetPath);
            }

            console.log(`Added ${allFiles.length} file(s) to staging area.`);
            return;
        }

        const resolvedPath = path.resolve(cwd, filePath);
        const stats = await fs.stat(resolvedPath);

        if (stats.isDirectory()) {
            const filesInDir = await collectFilesRecursive(resolvedPath);

            for (const sourcePath of filesInDir) {
                const relativePath = path.relative(cwd, sourcePath);
                const targetPath = path.join(stagingPath, relativePath);
                await fs.mkdir(path.dirname(targetPath), { recursive: true });
                await fs.copyFile(sourcePath, targetPath);
            }

            console.log(`Directory ${filePath} added to staging area.`);
            return;
        }

        const relativePath = path.relative(cwd, resolvedPath);
        const targetPath = path.join(stagingPath, relativePath);
        await fs.mkdir(path.dirname(targetPath), { recursive: true });
        await fs.copyFile(resolvedPath, targetPath);
        console.log(`File ${relativePath} added to staging area.`);
    }catch(err){
        console.error("Error adding file:", err);
    }

}

export default add;