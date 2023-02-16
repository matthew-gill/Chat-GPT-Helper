#!/usr/bin/env node

import { copyPromptToClipboard } from "./utils/Clipboard";
import { getAllDefinedPrompts, getPrompt } from "./utils/Prompts";
import * as prettyjson from "prettyjson";
import * as open from "open";
import {
  isAddCommand,
  ishelpCommand,
  isOpenCommand,
  isVersionCommand,
  outputHelpToConsole,
} from "./utils/Cli";

import { config } from "dotenv";

config({ path: ".env.dist" });

const VERSION = "1.0.0";
process.env.BINARY_NAME = process.env.BINARY_NAME || "chatgpt";
process.env.CHAT_BOT_SITE =
  process.env.CHAT_BOT_SITE || "https://chat.openai.com/chat";

const args = process.argv.slice(2);
const command = args[0];

const prompts = getAllDefinedPrompts();

const aliases = prompts.map((prompt) => prompt.aliases).flat();

if (ishelpCommand(command)) {
  outputHelpToConsole(process.env.BINARY_NAME, prompts);
} else if (isAddCommand(command)) {
  console.log("Coming soon!");
} else if (isVersionCommand(command)) {
  console.log(`  ${process.env.BINARY_NAME} version ${VERSION}`);
} else if (aliases.includes(command)) {
  const prompt = getPrompt(command);
  if (prompt) {
    console.log(
      prettyjson.render(
        {
          name: prompt.name,
          aliases: prompt.aliases,
          author: prompt.author,
        }
      )
    );

    console.log(prompt.prompt);

    copyPromptToClipboard(prompt);

    if (process.env.CHATGPT_TOOL_OPEN_BROWSER) {
      open.default(process.env.CHAT_BOT_SITE);
    }
  }
} else if (isOpenCommand(command)) {
  open.default(process.env.CHAT_BOT_SITE);
} else {
  console.error(`Unknown command \n`);
  outputHelpToConsole(process.env.BINARY_NAME, prompts);
}
