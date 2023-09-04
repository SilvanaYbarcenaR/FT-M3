const process = require('process');
const { Z_ASCII } = require('zlib');
const commands = require('./commands/index.js');

const bash = () => {
   process.stdout.write("prompt > ");
   process.stdin.on("data", (data) => {
      const args = String(data).trim().split(' ');
      const cmd = args.shift();
      if(commands[cmd]) {
         commands[cmd](print, args.join(' '));
      } else {
         print(`command not found: ${cmd}`);
      }
   })
}

const print = (output) => {
   process.stdout.write(output);
   process.stdout.write("\nprompt > ");
}

bash();
module.exports = {
   print,
   bash,
};
