import { Prompt } from "./prompts";

export type CliCommand = "add" | "help" | "open" | "version" | string;

export function isAddCommand(command: CliCommand): command is "add" | "new" {
  return ["add", "new"].includes(command);
}

export function isHelpCommand(command: CliCommand): command is "help" | "--help" | "-h" {
  return ["help", "--help", "-h"].includes(command);
}

export function isOpenCommand(command: CliCommand): command is "open" | "launch" {
  return ["open", "launch"].includes(command);
}

export function isVersionCommand(command: CliCommand): command is "version" | "--v" | "-v" {
  return ["version", "--v", "-v"].includes(command);
}

export const outputHelpToConsole = (binaryName: string, prompts: Prompt[]): void => {
  console.log(`Usage:
  ${binaryName} [prompt|command]\n`);

  console.log("Prompts:");

  prompts.forEach(({ name, aliases }) => {
    const commandString = [aliases[0].padEnd(10), name].join(" ");

    console.log(`  ${commandString}`);
  });

  console.log(`
Commands:
  open        Launch a browser to chat with Chat GPT
  add         Add a new prompt (Coming soon)
  help        Show this help message
  version     Show the version number`);
};
