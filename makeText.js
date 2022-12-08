/** Command-line tool to generate Markov text. */
import { readFile } from "fs";
import MarkovMachine from "./markov.js";
import get from "axios";
import { exit, argv } from "process";
import { stripHtml } from "string-strip-html";

/** Make Markov machine from text and generate text from it. */

function generateText(text) {
  let mm = new MarkovMachine.MarkovMachine(text);
  console.log(mm.makeText());
}


/** read file and generate text from it. */

function makeText(path) {
  readFile(path, "utf8", function cb(err, data) {
    if (err) {
      console.error(`Cannot read file: ${path}: ${err}`);
      exit(1);
    } else {
      generateText(data);
    }
  });

}

/** read URL and make text from it. */
async function makeURLText(url) {
  let res, text;
  try {
    res = await get(url);
    text = stripHtml(res.data).result

  } catch (err) {
    console.error(`Cannot read URL: ${url}: ${err}`);
    exit(1);
  }
  generateText(text)
}

/** interpret cmdline to decide what to do. */

let [method, path] = argv.slice(2);

if (method === "file") {
  makeText(path);
}

else if (method === "url") {
  makeURLText(path);
}

else {
  console.error(`Unknown method: ${method}`);
  exit(1);
}