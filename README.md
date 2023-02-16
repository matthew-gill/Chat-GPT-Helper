# ChatGPT CLI

This is an open-source CLI tool which allows you to quickly access pre-defined prompts for Chat GPT, copy them to your clipboard, and open the chat interface in your web browser.

For now only supported on OSX, and requires node and `pbcopy` to be installed.

## Usage

To use the CLI tool, you must have Node.js installed on your computer. Once you have installed Node.js, follow the steps below:

1. Clone this repository or download the code as a zip file.
2. Open a terminal or command prompt and navigate to the folder containing the downloaded code.
3. Run `yarn install-binary` to install the required dependencies.
4. Run the CLI tool with `chatgpt <command>`.

### Commands

The available commands are:

- `<command>`: If the command alias exists, copy it to your clip board and prompt you to open a browser.
- `open`: Opens the ChatGPT web interface in your default web browser.
- `help`: Shows the available commands and prompts.
- `version`: Shows the version of the ChatGPT CLI.

### Adding your own prompts

1. Create one file per custom prompt in `prompts/private`
2. Ensure it follows the same format as the files in `prompts/bundled` and use the `.chatgpt.yml` file extension and give it a unique value under the `aliases` key
3. Test it! `chatgpt <your-private-alias>`

### Package.json scripts

The following scripts are available in the package.json file:

- `start:dev`: Runs the code using the `ts-node` package.
- `launch`: Starts the CLI tool and opens the ChatGPT web interface in your default web browser.
- `build`: Compiles the TypeScript code to JavaScript.
- `install-binary`: Requires sudo. Builds the app and symlinks it to /usr/local/bin/chatgpt
- `run-built`: Runs the compiled JavaScript code.

## License

This code is open source under the MIT License. Feel free to use it and contribute to it.
