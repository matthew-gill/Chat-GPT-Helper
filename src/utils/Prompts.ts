import { readFileSync } from "fs";
import fs from "fs";
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

export const getPromptFilenames = (): string[] =>
  getAllFiles(__dirname + "/../../prompts").filter((file) =>
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

export const getAllDefinedPrompts = (): Prompt[] =>
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

export const getPrompt = (alias: string): Prompt | undefined => {
  const filenames = getPromptFilenames();
  for (const filename of filenames) {
    const prompt = readPromptFile(filename);
    if (prompt && prompt.aliases.includes(alias)) {
      return prompt;
    }
  }
  console.error(`No prompt found with alias "${alias}".`);
};
