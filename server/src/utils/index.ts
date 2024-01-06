import { readFile, readdir, stat } from "fs/promises";
import path from "path";
import { ShowDirectory, ShowParentDirectory } from "../types";
import { networkInterfaces } from "os";

export async function loadShowsPathsJson(): Promise<ShowParentDirectory | null> {
  try {
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
      const fileExists = async (path: string) =>
        !!(await stat(path).catch((e) => false));
      if (!(await fileExists(showPath))) {
        showPath = path.join(currentPath, "shows-paths.json");
        currentPath = removeLastPath(currentPath);
      } else {
        const content = await readFile(showPath, { encoding: "utf-8" });
        return JSON.parse(content);
      }
    }
  } catch (error) {
    console.log(error);
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
      const filesInDir = await readdir(parentPath);
      for (let j = 0; j < filesInDir.length; j++) {
        const _file = filesInDir[j];
        pathArr.push({
          relativePath: _file,
          parent: parent,
        });
      }
    } catch (error: any) {
      // TODO: try and return some error.
      if (error.code === "ENOENT") {
        console.log(error.message);
      } else {
        console.log(error);
      }
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
  try {
    const files = await readdir(path.join(showsJson![parent], showPath));
    for (let i = 0; i < files.length; i++) {
      if (
        files[i].includes(".txt") ||
        files[i].includes(".log") ||
        files[i].includes(".jpg") ||
        files[i].includes(".png") ||
        files[i].includes(".jpeg") ||
        files[i].includes(".vtt") ||
        files[i].includes(".srt")
      ) {
      } else {
        fileArr.push({
          relativePath: path.join(showPath, files[i]),
          parent: parent,
        });
      }
    }
  } catch (error) {
    console.log(error);
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

export async function loadShowPosterPath(
  showRootDirPath: string
): Promise<string | null> {
  try {
    const files = await readdir(showRootDirPath);
    for (let file of files) {
      if (file.includes("poster.")) {
        return path.join(showRootDirPath, file);
      }
    }
  } catch (error) {
    console.log(error);
  }
  return null;
}

export function logToTerminal(tag: string, ...msg: Array<any>) {
  const currentDate = new Date();
  console.log(
    `\x1b[32m[ \x1b[0m${tag}\x1b[32m ]\x1b[0m`,
    `\x1b[32m[ \x1b[0m${currentDate.toLocaleString()}\x1b[32m ]\x1b[0m`,
    ...msg
  );
}

/**
 * Traverse up a directoru till the file is found.
 * @param fileName Name of the file to find.
 * @returns
 */
export async function traverseThenRead(
  fileName: string
): Promise<string | null> {
  try {
    const removeLastPath = (_path: string) => {
      const pathArr: Array<string> = _path.split(path.sep);
      pathArr.pop();
      return pathArr.join(path.sep);
    };
    let currentPath = __dirname;
    let totalPathSegment = currentPath.split(path.sep).length;
    let showPath = path.join(currentPath, fileName);
    for (let i = 0; i < totalPathSegment; i++) {
      const fileExists = async (path: string) =>
        !!(await stat(path).catch((e) => false));
      if (!(await fileExists(showPath))) {
        showPath = path.join(currentPath, fileName);
        currentPath = removeLastPath(currentPath);
      } else {
        const content = await readFile(showPath, { encoding: "utf-8" });
        return content;
      }
    }
  } catch (error) {
    console.log(error);
  }
  return null;
}

export async function readPathInParentDir(
  parentDir: string,
  relativePath: string
): Promise<string[]> {
  return new Promise(async (resolve, reject) => {
    setTimeout(() => {
      return reject("timeout");
    }, 5_000);
    try {
      const fileContent = await traverseThenRead("shows-paths.json");
      if (fileContent === null) {
        return reject(`Could find "shows-paths.json`);
      }
      const showsPathsJson = JSON.parse(fileContent);
      const parentPath = showsPathsJson[parentDir];
      if (typeof parentPath !== "string") {
        return reject(
          `Path for "${parentDir}" does not exist in "shows-paths.json`
        );
      }
      const fullPath = path.join(parentPath, relativePath);
      const files: string[] = await readdir(fullPath);
      return resolve(files);
    } catch (error) {
      return reject(error);
    }
  });
}
