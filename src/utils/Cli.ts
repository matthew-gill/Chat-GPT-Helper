import { Prompt } from "./Prompts";

export const outputHelpToConsole = (BINARY_NAME: string, prompts: Prompt[]) => {
  console.log(`Usage:\n
  ${BINARY_NAME} <command>
  
  Prompts:
${prompts
  .map((prompt) => `    ${prompt.aliases[0]} (${prompt.name})`)
  .join("\n")}
  
  Commands:
    open        Launch a browser to chat with Chat GPT
    add         Add a new prompt (Coming soon)
    help        Show this help message
    version     Show the version number`);
};

export const isOpenCommand = (command: string) =>
  command === "open" || command === "launch";
export const isAddCommand = (command: string) =>
  command === "add" || command === "new";
export const ishelpCommand = (command: string) =>
  command === "help" || command === "--help" || command === "-h";
export const isVersionCommand = (command: string) =>
  command === "version" || command === "--v" || command === "-v";
