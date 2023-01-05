const { SentencePieceProcessor, cleanText } = require("../dist");
const ROOT = require('app-root-path')

async function main() {

    let text = "I am still waiting on my card?";
    let cleaned = cleanText(text);

    let spp = new SentencePieceProcessor();
    await spp.load(`${ROOT}/test/smart.model`)

    let ids = spp.encodeIds(cleaned);
    console.log(ids)
    let str = spp.decodeIds(ids)
    console.log(str)
}
main()