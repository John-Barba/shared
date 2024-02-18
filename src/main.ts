import * as fs from "fs";

import Load from "./load.ts";
import algoNextClosest from "./algoNextClosest.ts";
import { MAX_DRIVER_COST } from "./constants.ts";

export function readFile(path: string): Array<Load> | null {
  const loadObjects: Array<Load> = [];

  // read entire file contents
  let fileData;
  try {
    fileData = fs.readFileSync(path, { encoding: "utf-8" });
  } catch (ex: any) {
    console.error(`Unable to load data from file (${path}): ${ex.message}`);
    return null;
  }

  // handle contents line by line
  const lines = fileData.split("\n");
  let lineNumber = 0;
  for (const line of lines) {
    // skip the first line of the file; contains metadata
    if (!lineNumber) {
      lineNumber++;
      continue;
    }
    // skip blank/empty lines
    if (line.length == 0) {
      continue;
    }
    const load = Load.createFromString(line);
    if (!load) {
      console.error("Error while reading file '${path}', line #${lineNumber}");
      return null;
    }
    if (load.id != lineNumber) {
      console.warn(
        `Warn while reading file '${path}', line #${lineNumber} loadNumber mis-match, have ${load.id}, expected ${lineNumber}`
      );
    }
    loadObjects.push(load);
    lineNumber++;
  }

  return loadObjects;
}

// checks for obvious data issues
// returns true if valid data, false otherwise
export function loadsSanityCheck(loads: Array<Load>): boolean {
  let returnVal = true;

  for (const load of loads) {
    const roundTripCost =
      load.costToStart + load.costToExecute + load.costFromEnd;
    if (roundTripCost > MAX_DRIVER_COST) {
      console.error(
        `Failed sanity check for id: ${load.id}, round trip cost (${roundTripCost}) exceeds MAX_DRIVER_COST (${MAX_DRIVER_COST})`
      );
      returnVal = false;
    }
  }

  return returnVal;
}

export function processDirectory(directory: string): void {
  let files;
  try {
    files = fs.readdirSync(directory);
  } catch (ex: any) {
    console.error(
      `Error getting directory (${directory}) contents: ${ex.message}`
    );
    return;
  }

  files.forEach((file) => {
    const idx = file.lastIndexOf(".");
    if (idx <= 0) {
      return;
    }
    const filename = file.substring(0, idx);
    console.log(`File: ${filename}`);
  });
}

function formatAndOutputResults(results: Array<Array<number>>): void {
  for (const driver of results) {
    console.log(`[${driver.join(",")}]`);
  }
}

async function main(): Promise<void> {
  const loads = readFile(process.argv[2]);
  if (!loads) {
    return;
  }
  if (!loadsSanityCheck(loads)) {
    return;
  }
  const results = algoNextClosest(loads);

  formatAndOutputResults(results);
}

await main();
