#!/usr/bin/env node

import { copyPromptToClipboard } from "./utils/Clipboard";
import { getAllDefinedPrompts, getPrompt } from "./utils/Prompts";
import * as prettyjson from "prettyjson";
import * as open from "open";
import { outputHelpToConsole } from "./utils/Cli";

import { config } from "dotenv"

config({ path: '.env.dist' });

const BINARY_NAME = process.env.BINARY_NAME || "chatgpt";
const CHAT_GPT_URL = process.env.CHAT_BOT_SITE || "https://chat.openai.com/chat";

const args = process.argv.slice(2);
const command = args[0];

const prompts = getAllDefinedPrompts();

const aliases = prompts.map((prompt) => prompt.aliases).flat();

if (command === "help" || command === "--help" || command === "-h") {
  outputHelpToConsole(BINARY_NAME, prompts);
} else if (command === "add" || command === "new") {
  console.log("Coming soon!");
} else if (
  command === "version" ||
  command === "--version" ||
  command === "-v"
) {
  console.log(`  ${BINARY_NAME} version 1.0.0`);
} else if (aliases.includes(command)) {
  const prompt = getPrompt(command);
  if (prompt) {
    var options = {
      noColor: false,
    };

    console.log(
      prettyjson.render(
        {
          name: prompt.name,
          aliases: prompt.aliases,
          author: prompt.author,
        },
        options
      )
    );

    console.log(prompt.prompt);

    copyPromptToClipboard(prompt);

    if (process.env.CHATGPT_TOOL_OPEN_BROWSER) {
      // const open = require("open");
      // open(CHAT_GPT_URL);
      open.default(CHAT_GPT_URL);
    }
  }
} else if (command === "open" || command === "launch") {
  // const open = require("open");
  // open(CHAT_GPT_URL);
  open.default(CHAT_GPT_URL);
} else {
  console.error(`Unknown command \n`);
  outputHelpToConsole(BINARY_NAME, prompts);
}
