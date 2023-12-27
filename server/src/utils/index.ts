import { existsSync, readdirSync } from "fs";
import { readFile } from "fs/promises";
import path from "path";
import { ShowDirectory, ShowParentDirectory } from "../types";
import { networkInterfaces } from "os";

export async function loadShowsPathsJson(): Promise<ShowParentDirectory | null> {
  console.log("loadShowsPathsJson");

  const removeLastPath = (_path: string) => {
    const pathArr: Array<string> = _path.split(path.sep);
    pathArr.pop();
    return pathArr.join(path.sep);
  };
  let currentPath = __dirname;
  let totalPathSegment = currentPath.split(path.sep).length;
  let showPath = path.join(currentPath, "shows-paths.json");

  // Traverse up the directory till a "shows-paths.json" file is found.
  for (let i = 0; i < totalPathSegment; i++) {
    if (!existsSync(showPath)) {
      showPath = path.join(currentPath, "shows-paths.json");
      currentPath = removeLastPath(currentPath);
    } else {
      const content = await readFile(showPath, { encoding: "utf-8" });
      return JSON.parse(content);
    }
  }
  return null;
}

export async function loadShowsParentDirectories(
  showsJson: ShowParentDirectory
): Promise<Array<ShowDirectory>> {
  const pathArr = [];
  const directoryNames = Object.keys(showsJson);
  for (let i = 0; i < directoryNames.length; i++) {
    const parent = directoryNames[i];
    const parentPath = showsJson[parent];
    try {
      const filesInDir = readdirSync(parentPath);
      for (let j = 0; j < filesInDir.length; j++) {
        const _file = filesInDir[j];
        pathArr.push({
          relativePath: _file,
          parent: parent,
        });
      }
    } catch (error) {
      // TODO: try and return some error.
    }
  }
  return pathArr;
}

export async function loadShowsInParentDirectory(
  showPath: string,
  parent: string
) {
  const showsJson = await loadShowsPathsJson();
  const fileArr = [];
  console.log(path.join(showsJson![parent], showPath));
  const files = readdirSync(path.join(showsJson![parent], showPath));
  for (let i = 0; i < files.length; i++) {
    console.log(files[i]);
    if (
      files[i].includes(".jpg") ||
      files[i].includes(".srt") ||
      files[i].includes(".txt") ||
      files[i].includes(".jpeg")
    ) {
    } else {
      fileArr.push({
        relativePath: path.join(showPath, files[i]),
        parent: parent,
      });
    }
  }
  return fileArr;
}

export function findHostAddress() {
  const nets = networkInterfaces();
  const results = Object.create(null);
  for (const name of Object.keys(nets)) {
    const netName = nets[name];
    if (netName !== undefined) {
      for (const net of netName) {
        const familyV4Value = typeof net.family === "string" ? "IPv4" : 4;
        if (net.family === familyV4Value && !net.internal) {
          if (!results[name]) {
            results[name] = [];
          }
          results[name].push(net.address);
        }
      }
    }
  }
  const keys = Object.keys(results);
  return results[keys[0]];
}
