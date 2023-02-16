import { expect } from "chai";
import sinon from "sinon";
import { copyPromptToClipboard } from "./clipboard";
import { Prompt } from "./prompts";

describe("clipboard.ts", () => {
  describe("copyPromptToClipboard", () => {
    it("should copy the prompt to the clipboard", async () => {
      const prompt: Prompt = {
        name: "Test prompt",
        aliases: ["test"],
        prompt: "This is a test prompt",
      };
      const spawnMock = sinon.mock();

      const originalSpawn = require("child_process").spawn;

      require("child_process").spawn = spawnMock;

      await copyPromptToClipboard(prompt);

      spawnMock.verify();
      expect(spawnMock.calledOnce).to.be.true;

      require("child_process").spawn = originalSpawn;
    });

    it("should print an error message if copying the prompt fails", async () => {
      const prompt: Prompt = {
        name: "Test prompt",
        aliases: ["test"],
        prompt: "This is a test prompt",
      };
      const spawnMock = sinon.mock();
      const error = new Error("Failed to copy to clipboard");

      spawnMock.withArgs("pbcopy").throws(error);

      const originalSpawn = require("child_process").spawn;

      const consoleErrorSpy = sinon.spy(console, "error");

      require("child_process").spawn = spawnMock;

      await copyPromptToClipboard(prompt);

      spawnMock.verify();

      sinon.assert.calledWith(
        consoleErrorSpy,
        `Failed to copy prompt 'Test prompt' to clipboard: ${error}`
      );

      require("child_process").spawn = originalSpawn;
      consoleErrorSpy.restore();
    });
  });
});
