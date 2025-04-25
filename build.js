// run the node cli scripts
const promisify = require('util').promisify;
const exec = require('child_process').exec;

const execPromise = promisify(exec);


const frontnedScirpts = 'npx react-scripts build';
const makeBundledData = 'npx tsx ./backend/dao/save_bundled_data.ts && mv ./backend/dao/bundled_data.json ./build/bundled_data.json';
const copyAndRenameFiles = 'cp -r ./build/* ~/works/sudoku_release_version/';


// run the react-scripts build command
async function runFrontendBuild() {
    try {
        await execPromise(frontnedScirpts)
    } catch (error) {
        console.error('Error:', error);
    }
}

// run the makeBundledData command
async function runMakeBundledData() {
    try {
        const { stdout, stderr } = await execPromise(makeBundledData);
        console.log('stdout:', stdout);
        console.error('stderr:', stderr);
    } catch (error) {
        console.error('Error:', error);
    }
}
// run the copyAndRenameFiles command
async function runCopyAndRenameFiles() {
    try {
        await execPromise(copyAndRenameFiles);
    } catch (error) {
        console.error('Error:', error);
    }
}

// run one by one
async function runAll() {
    await runFrontendBuild();
    await runMakeBundledData();
    await runCopyAndRenameFiles();
}
runAll();