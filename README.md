# Javascript wrapper for the sentencepiece library

## Build

Sentencepiece is compiled to webassembly using emscripten.

To rebuild this project

```bash

yarn

git clone https://github.com/google/sentencepiece.git

yarn build

```

## Use

To use this tool

```js

const { SentencePieceProcessor, cleanText } = require("../dist");
const ROOT = require('app-root-path')

async function main() {

    let text = "I am still waiting on my card?";
    let cleaned = cleanText(text);

    let spp = new SentencePieceProcessor(); // new an spp object
    await spp.load(`${ROOT}/test/smart.model`); // load model

    let ids = spp.encodeIds(cleaned);
    console.log(ids) 
    /*
    Int32Array(9) [
        90, 4184, 5522,
        1547, 1148,  693,
        4839, 6187,    0
    ]
    */
    let str = spp.decodeIds(ids)
    console.log(str)
    // i am still waiting on my card ⁇
}
main()

```

## Note

devilyouwei updated this repo to make this module support the js `require` keyword and added the using example