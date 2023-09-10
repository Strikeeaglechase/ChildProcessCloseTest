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
const child = execFile(pathToUse);
child.stdout.on("data", (data) => log(`Child stdout: ${data.toString().trim()}`));
child.stderr.on("data", (data) => log(`Child stderr: ${data.toString().trim()}`));
child.on("error", (error) => log(`Child error: ${error}`));
child.on("close", (code) => log(`Child process exited with code ${code}. Why did this happen?`));
child.on("exit", (code) => log(`Child process exited with code ${code}.`));
