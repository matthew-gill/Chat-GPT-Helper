import { expect } from "chai";
import {
  isAddCommand,
  isHelpCommand,
  isOpenCommand,
  isVersionCommand,
  outputHelpToConsole,
} from "../../src/utils/cli";
import { Prompt } from "../../src/utils/prompts";

describe("cli.ts", () => {
  describe("isAddCommand", () => {
    const addCommands = ["add", "new"];

    addCommands.forEach((command) => {
      it(`should return true for '${command}' command`, () => {
        expect(isAddCommand(command)).to.be.true;
      });
    });

    it("should return false for other commands", () => {
      expect(isAddCommand("foo")).to.be.false;
    });
  });

  describe("isHelpCommand", () => {
    const helpCommands = ["help", "--help", "-h"];

    helpCommands.forEach((command) => {
      it(`should return true for '${command}' command`, () => {
        expect(isHelpCommand(command)).to.be.true;
      });
    });

    it("should return false for other commands", () => {
      expect(isHelpCommand("foo")).to.be.false;
    });
  });

  describe("isOpenCommand", () => {
    const openCommands = ["open", "launch"];

    openCommands.forEach((command) => {
      it(`should return true for '${command}' command`, () => {
        expect(isOpenCommand(command)).to.be.true;
      });
    });

    it("should return false for other commands", () => {
      expect(isOpenCommand("foo")).to.be.false;
    });
  });

  describe("isVersionCommand", () => {
    const versionCommands = ["version", "--v", "-v"];

    versionCommands.forEach((command) => {
      it(`should return true for '${command}' command`, () => {
        expect(isVersionCommand(command)).to.be.true;
      });
    });

    it("should return false for other commands", () => {
      expect(isVersionCommand("foo")).to.be.false;
    });
  });

  describe("outputHelpToConsole", () => {
    it("should output help message to console", () => {
      const binaryName = "my-cli";
      const prompts: Prompt[] = [
        { name: "foo", aliases: ["f"], prompt: "Fooooo" },
        { name: "bar", aliases: ["b"], prompt: "Baaaaar" },
      ];
      const expectedOutput = `Usage:
  ${binaryName} [prompt|command]\n
Prompts:
  f          foo
  b          bar

Commands:
  open        Launch a browser to chat with Chat GPT
  add         Add a new prompt (Coming soon)
  help        Show this help message
  version     Show the version number
`;

      let actualOutput = "";
      const logSpy = (msg: string) => (actualOutput += msg + "\n");
      const consoleLog = console.log;

      console.log = logSpy;
      outputHelpToConsole(binaryName, prompts);
      console.log = consoleLog;

      expect(actualOutput).to.equal(expectedOutput);
    });
  });
});
