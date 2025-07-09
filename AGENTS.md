# Agent Guidelines for Servo Discord Bot

## Commands
- **Start**: `npm start` or `node index.js`
- **Test**: No test framework configured (shows error message)
- **Deploy Commands**: `node deploy-commands.js` (requires config.json with clientId and token)

## Code Style
- **Language**: Node.js/JavaScript (ES6+)
- **Imports**: Use `require()` for CommonJS modules
- **Formatting**: Tabs for indentation, semicolons required
- **Naming**: camelCase for variables/functions, PascalCase for classes
- **Constants**: UPPER_SNAKE_CASE for module-level constants
- **Error Handling**: Use try/catch blocks, log errors with console.error()
- **Async**: Use async/await pattern, not promises or callbacks

## Architecture
- **Commands**: Located in `commands/` folder structure, each command exports `{data, execute}`
- **Libraries**: Core bot logic in `lib/`, response handling in `lib/response-types.js`
- **Dependencies**: discord.js, axios, urijs for URL handling
- **Environment**: Uses DISCORD_TOKEN and optional UPTIME_HEARTBEAT_URL env vars

## Discord.js Patterns
- Use SlashCommandBuilder for command definitions
- Commands must have `data` (SlashCommandBuilder) and `execute` (async function) exports
- Use EmbedBuilder for rich message responses
- Handle interaction replies with proper error handling for replied/deferred states