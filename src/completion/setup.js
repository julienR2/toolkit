const fs = require("fs");
const os = require("os");

const completion = require("./init");
const runCommand = require("../utils/runCommand");

completion().setupShellInitFile();

const bashProfile = `${os.homedir()}/.bash_profile`;
const bashRc = `${os.homedir()}/.bashrc`;
