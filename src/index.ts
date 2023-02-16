#!/usr/bin/env node

import * as open from "open";
import prettyjson from "prettyjson";
import { config } from "dotenv";
import { CliCommand, isAddCommand, isHelpCommand, isOpenCommand, isVersionCommand, outputHelpToConsole } from "./utils/cli";
import { copyPromptToClipboard } from "./utils/clipboard";
import { Prompt, getAllDefinedPrompts, getPrompt } from "./utils/prompts";

config({ path: ".env.dist" });

const VERSION = "1.0.0";
process.env.BINARY_NAME = process.env.BINARY_NAME || "chatgpt";
process.env.CHAT_BOT_SITE = process.env.CHAT_BOT_SITE || "https://chat.openai.com/chat";
process.env.CHATGPT_TOOL_OPEN_BROWSER = process.env.CHATGPT_TOOL_OPEN_BROWSER || "false";

const command: CliCommand = process.argv[2] as CliCommand;

const prompts: Prompt[] = getAllDefinedPrompts();
const aliases: string[] = prompts.flatMap((prompt) => prompt.aliases);

async function main() {
  try {
    if (isHelpCommand(command)) {
      outputHelpToConsole(process.env.BINARY_NAME || "", prompts);
    } else if (isAddCommand(command)) {
      console.log("Coming soon!");
    } else if (isVersionCommand(command)) {
      console.log(`  ${process.env.BINARY_NAME} version ${VERSION}`);
    } else if (aliases.includes(command)) {
      const prompt: Prompt | undefined = getPrompt(command);

      if (!prompt) {
        throw new Error(`Could not find prompt with name or alias "${command}"`);
      }

      console.log(
        prettyjson.render({
          name: prompt.name,
          aliases: prompt.aliases,
          author: prompt.author,
        })
      );

      console.log(prompt.prompt);

      await copyPromptToClipboard(prompt);

      if (process.env.CHATGPT_TOOL_OPEN_BROWSER === "true") {
        await open.default(process.env.CHAT_BOT_SITE || "");
      }
    } else if (isOpenCommand(command)) {
      await open.default(process.env.CHAT_BOT_SITE || "");
    } else {
      throw new Error(`Unknown command: "${command}"`);
    }
  } catch (error) {
    console.error(error);
    outputHelpToConsole(process.env.BINARY_NAME || "", prompts);
  }
}

main();
