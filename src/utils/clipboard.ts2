import { Prompt } from "./prompts";
import { spawn } from "child_process";
import * as open from "open";

export async function copyPromptToClipboard(prompt: Prompt): Promise<void> {
  const { prompt: promptText, name } = prompt;

  try {
    const proc = spawn("pbcopy");

    proc.stdin.write(promptText);
    proc.stdin.end();

    console.log(`✅ Copied prompt '${name}' to clipboard\n`);

    console.log(`🤖 Press enter to open the chat bot site or any other key to exit`);

    // Enable raw mode to read a single key press
    process.stdin.setRawMode(true);
    process.stdin.resume();

    // Listen for the 'data' event to read the key press
    process.stdin.on("data", (data) => {
      if (data.toString() === "\r") {
        open.default(process.env.CHAT_BOT_SITE ?? "");
      }
      process.exit();
    });
  } catch (error) {
    console.error(`Failed to copy prompt '${name}' to clipboard: ${error}`);
  }
}
