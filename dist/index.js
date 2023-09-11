import { execFile } from "child_process";
import fs from "fs";
const pathToChildOpts = ["../ChildProcessTest/bin/Debug/net6.0/ChildProcessTest.exe", "./ChildProcessTest/bin/Debug/net6.0/ChildProcessTest.exe"];
let pathToUse = "";
for (const pathToChild of pathToChildOpts) {
    if (fs.existsSync(pathToChild)) {
        pathToUse = pathToChild;
        break;
    }
}
if (!pathToUse) {
    console.log(`No child process found, please build first`);
    process.exit(1);
}
const outLog = fs.createWriteStream("./parent.log", { flags: "a" });
const log = (message) => {
    console.log(message);
    outLog.write(`${message}\n`);
};
log(`Starting`);
setInterval(() => {
    log(`Parent is still alive at ${new Date().toISOString()}`);
}, 1000 * 10);
const child = execFile(pathToUse, { maxBuffer: Infinity });
let c = 0;
child.stdout.on("data", (data) => {
    if (c++ % 100 != 0)
        return;
    const lines = data.toString().split("\n").map(l => l.trim()).filter(l => l.length > 0);
    lines.forEach(l => {
        const t = parseInt(l.split(" ")[0]);
        if (!isNaN(t)) {
            const delta = Date.now() - t;
            console.log(`Current delta is ${delta}ms. Chunk had ${data.length} bytes and ${data.split("\n").length} lines`);
        }
    });
});
child.stderr.on("data", (data) => log(`Child stderr: ${data.toString().trim()}`));
child.on("error", (error) => log(`Child error: ${error}`));
child.on("close", (code, sig) => {
    log(`Child process closed with code ${code} (${sig})`);
});
child.on("exit", (code, sig) => log(`Child process exited with code ${code} (${sig})`));
