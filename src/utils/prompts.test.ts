import { expect } from "chai";
import { getAllDefinedPrompts, getPrompt, getPromptFilenames, readPromptFile } from "./prompts";

describe("prompts.ts", () => {
  describe("getPromptFilenames", () => {
    it("should return an array of all prompt file names", () => {
      const promptDirectory = "src/mocks/prompts";
      const expectedFilenames = ["src/mocks/prompts/foo.chatgpt.yml", "src/mocks/prompts/bar.chatgpt.yml"];
      const actualFilenames = getPromptFilenames(promptDirectory);
      expect(actualFilenames).to.have.members(expectedFilenames);
    });
  });

  describe("getAllDefinedPrompts", () => {
    it("should return an array of all defined prompts", () => {
      const actualPrompts = getAllDefinedPrompts();
      expect(actualPrompts).to.have.lengthOf.greaterThanOrEqual(2);
    });
  });

  describe("readPromptFile", () => {
    it("should return a prompt object from a valid YAML file", () => {
      const filename = "src/mocks/prompts/foo.chatgpt.yml";
      const expectedPrompt = {
        aliases: ["f", "foo"],
        name: "Foo",
        prompt: "This is a test prompt.",
      };
      const actualPrompt = readPromptFile(filename);
      expect(actualPrompt).to.deep.equal(expectedPrompt);
    });

    it("should return undefined for an invalid YAML file", () => {
      const filename = "src/mocks/prompts/invalid.chatgpt.yml";
      const actualPrompt = readPromptFile(filename);
      expect(actualPrompt).to.be.undefined;
    });
  });

  describe("getPrompt", () => {
    it("should return the prompt object for a given alias", () => {
      const alias = "card";
      const actualPrompt = getPrompt(alias);
      expect(actualPrompt).to.not.be.undefined;
    });

    it("should return undefined if no prompt is found for the given alias", () => {
      const alias = "baz";
      const actualPrompt = getPrompt(alias);
      expect(actualPrompt).to.be.undefined;
    });
  });
});
