# Home Server

This is a home server for movie hosting that uses the Node.js `express` library. This is hosted on a Raspberry PI 4, but it should be possible to host it in any platform.

## Requirements

- Node.js >= 18
  - This currently does not create a binary, so it will need the node.js runtime

## How to use

1. Add paths in `shows-paths.json`, where the `key` is the alias and `value` is absolute path
   - This is used to tell the application what directories to read
1. Add paths in `ignored-files.json`, add new files in `files` property
   - This is used to tell the application what files/directories to ignore

## Start server and client

Start up the server and web client for development

1. Open a terminal
1. Run `cd server`
1. Run `npm run dev` to start the server and listen for changes
1. Open a separate terminal
1. Run `cd web-client`
1. Run `npm run dev` to start the web client

## Create a build output and run it

Create a build version for production

1. Run `npm run build`
   - This creates an `output` folder that contains a build version
1. Run `cd output`
   - This creates new files, so you would need to modify `shows-paths.json` and `ignored-files.json`
1. Run `node .`
