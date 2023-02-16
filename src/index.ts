#!/usr/bin/env node

import { readFileSync } from "fs";
import fs from "fs";
import YAML from "yaml";
import path from "path";

import * as yaml from 'js-yaml';

interface Prompt {
  aliases: string[];
  name: string;
  author: string;
  version: number;
  model: string;
  prompt: string;
}

const getPromptFilenames = (): string[] =>
  getAllFiles(__dirname + "/../prompts").filter((file) =>
    file.endsWith(".chatgpt.yml")
  );

const getAllFiles = (
  dirPath: string,
  arrayOfFiles: string[] | undefined = []
) => {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, "/", file));
    }
  });

  return arrayOfFiles;
};

const getAllDefinedPrompts = (): Prompt[] =>
  getPromptFilenames()
    .map((file) => readPromptFile(file))
    .filter((prompt): prompt is Prompt => prompt !== undefined);

const readPromptFile = (filename: string): Prompt | undefined => {
  try {
    const fileContent = readFileSync(`${filename}`, "utf-8");
    const prompt = YAML.parse(fileContent) as Prompt;

    if (filename.includes("private")) {
      prompt.name = "🤫 " + prompt.name;
    }

    return prompt;
  } catch (err) {
    console.error(`Failed to read prompt file "${filename}": ${err}`);
    return undefined;
  }
};

const getPrompt = (alias: string): Prompt | undefined => {
  const filenames = getPromptFilenames();
  for (const filename of filenames) {
    const prompt = readPromptFile(filename);
    if (prompt && prompt.aliases.includes(alias)) {
      return prompt;
    }
  }
  console.error(`No prompt found with alias "${alias}".`);
};

const copyPromptToClipboard = (prompt: Prompt) => {
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

const toolName = "chatgpt";

const args = process.argv.slice(2);
const command = args[0];

const prompts = getAllDefinedPrompts();

const aliases = prompts.map((prompt) => prompt.aliases).flat();

if (command === "help" || command === "--help" || command === "-h") {
  outputHelpToConsole();
} else if (command === "add" || command === "new") {
  console.log("Coming soon!");
} else if (
  command === "version" ||
  command === "--version" ||
  command === "-v"
) {
  console.log(`  ${toolName} version 1.0.0`);
} else if (aliases.includes(command)) {
  const prompt = getPrompt(command);
  if (prompt) {


    var options = {
      noColor: false
    };

    var prettyjson = require('prettyjson');

    // create a new object from prompt which excludes the version and author

    
    console.log(prettyjson.render({
      name: prompt.name,
      aliases: prompt.aliases,
      author: prompt.author,
    }, options));


    console.log(prompt.prompt)


    copyPromptToClipboard(prompt);

    if (process.env.CHATGPT_TOOL_OPEN_BROWSER) {
      const open = require("open");
      open("https://chat.openai.com/chat");
    }
  }
} else if(command === "open" || command === "launch") {
  const open = require("open");
  open("https://chat.openai.com/chat");
} else {
  console.error(`Unknown command \n`);
  outputHelpToConsole();
}

function outputHelpToConsole() {
  console.log(`Usage:
  ${toolName} <command>

Prompts:
${prompts.map((prompt) => `  ${prompt.aliases[0]} (${prompt.name})`).join("\n")}

Commands:
  open        Launch a browser to chat with Chat GPT
  add         Add a new prompt (Coming soon)
  help        Show this help message
  version     Show the version number`);
}
