import childProcess from "node:child_process";

const cmd = process.platform === "win32" ? "pnpm.cmd" : "pnpm";

childProcess.spawn(cmd, ["run", "start-bot-dev"], {
  stdio: [process.stdin, process.stdout, process.stderr],
});
