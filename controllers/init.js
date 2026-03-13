import fs from 'fs/promises';


import path from 'path';


export async function initrepo() {
    const repoPath = path.resolve(process.cwd(), '.mygit');
    const commitespath=path.join(repoPath,'commits');

    try {
        await fs.mkdir(repoPath, { recursive: true });
        await fs.mkdir(commitespath, { recursive: true });
        await fs.writeFile(path.join(repoPath, 'index.json'), JSON.stringify({}), 'utf-8');
        console.log('Repository initialized successfully.');
    } catch (error) {
        console.error('Error initializing repository:', error);
    }
}

export default initrepo;
