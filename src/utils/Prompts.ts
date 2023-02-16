import { readFileSync, readdirSync, statSync } from "fs";
import YAML from "yaml";
import path from "path";

export interface Prompt {
  aliases: string[];
  name: string;
  author: string;
  version: number;
  model: string;
  prompt: string;
}

const promptDirectory = path.join(__dirname, "..", "..", "prompts");
const promptFileExtension = ".chatgpt.yml";

const getPromptFilenames = (): string[] =>
  getAllFiles(promptDirectory).filter((file) =>
    file.endsWith(promptFileExtension)
  );

const getAllFiles = (
  dirPath: string,
  arrayOfFiles: string[] | undefined = []
) => {
  const files = readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    if (statSync(dirPath + "/" + file).isDirectory()) {
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
    const fileContent = readFileSync(filename, "utf-8");
    const { name } = path.parse(filename);
    const prompt = YAML.parse(fileContent) as Prompt;

    if (filename.includes("/private/")) {
      prompt.name = `🤫 ${prompt.name}`;
    }

    return prompt;
  } catch (error) {
    console.error(`Failed to read prompt file "${filename}": ${error}`);
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

export { getAllDefinedPrompts, getPrompt };
