import { Prompt } from "./Prompts";

export const copyPromptToClipboard = (prompt: Prompt) => {
    try {
      var proc = require("child_process").spawn("pbcopy");
      proc.stdin.write(prompt.prompt);
      proc.stdin.end();
      console.log(`Copied prompt "${prompt.name}" to clipboard.`);
  
      console.log(`Press enter to open browser or any other key to exit`);
  
      // Ask the user to press enter or any other key
      process.stdin.setRawMode(true);
      process.stdin.resume();
  
      process.stdin.on("data", (data) => {
        if (data.toString() === "\r") {
          const open = require("open");
          open("https://chat.openai.com/chat");
        }
        process.exit();
      });
    } catch (err) {
      console.error(
        `Failed to copy prompt "${prompt.name}" to clipboard: ${err}`
      );
    }
  };