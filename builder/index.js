const { execSync } = require('child_process')
const fs = require('fs')
const path = require("path")

function wrapCatch(command) {
    try {
        let stdout = execSync(command)
        return stdout.toString()
    } catch (error) {
        // console.error(error)
        console.log("FAILED:", command)
        process.exit(error.code)
    }
}

function deleteFolderRecursive(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function (file) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

const outputDir = path.join(__dirname, "..", "output")
const serverBuildDir = path.join(__dirname, "..", "server", "build")
const webClientBuildDir = path.join(__dirname, "..", "web-client", "build")
const uploadDir = path.join(outputDir, "uploads")
const rootDir = path.join(__dirname, "..")

// START BUILDER
console.log("------ Start builder ------")

const nodeVersion = wrapCatch("node --version")
console.log("Node Version:", nodeVersion)

// Delete all files from "output"
try {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    } else {
        console.log(`Deleting contents of "${outputDir}"`)
        const files = fs.readdirSync(outputDir);
        for (const file of files) {
            const isDirectory = fs.lstatSync(path.join(outputDir, file)).isDirectory()
            if (isDirectory) {
                deleteFolderRecursive(path.join(outputDir, file));
            } else {
                fs.unlinkSync(path.join(outputDir, file));
            }
        }
        console.log(`Deleted contents of "${outputDir}"`)
    }
} catch (err) {
    console.error(err);
}

console.log(`Building "web-client"`)
wrapCatch(`cd ${path.join(__dirname, "..", "web-client")} & npm run build`)
console.log(`Built "web-client"`)

console.log(`Building "server"`)
wrapCatch(`cd ${path.join(__dirname, "..", "server")} & npm run build`)
console.log(`Built "server"`)

console.log(`Create ".env"`)
fs.writeFileSync(path.join(outputDir, ".env"), `SERVER_ENVIRONMENT=production
WEB_CLIENT_BUILD_DIR=web-client-build
SERVER_BUILD_DIR=server-build`);

console.log(`Create "package.json"`)
const webClientDependencies =
    JSON.parse(fs.readFileSync(path.join(rootDir, "web-client", "package.json")).toString())["dependencies"];
const serverDependencies =
    JSON.parse(fs.readFileSync(path.join(rootDir, "server", "package.json")).toString())["dependencies"];

fs.writeFileSync(path.join(outputDir, "package.json"), `{
  "name": "home-server",
  "version": "1.0.0",
  "description": "Home Server",
  "main": "server-build/index.js",
  "dependencies": ${JSON.stringify({ ...webClientDependencies, ...serverDependencies }, null, 4)}
}`);

console.log(`Running "npm install"`)
wrapCatch(`cd ${outputDir} & npm install`)
console.log(`Comleted "npm install"`)

console.log(`Create "shows-paths.json"`)
fs.writeFileSync(path.join(outputDir, "shows-paths.json"), `{}`);

console.log(`Create "uploads"`)
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

console.log(`Copy "web-client-build"`)
fs.cpSync(webClientBuildDir, path.join(outputDir, "web-client-build"), { recursive: true }, (err) => {
    if (err) {
        console.log("Error:", err);
    }
    else {
        console.log(`Copied web-client "build" directory`)
    }
});

console.log(`Copy "server-build"`)
fs.cpSync(serverBuildDir, path.join(outputDir, "server-build"), { recursive: true }, (err) => {
    if (err) {
        console.log("Error:", err);
    }
    else {
        console.log(`Copied server "build" directory`)
    }
});