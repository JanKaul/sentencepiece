import { expect } from '@esm-bundle/chai';
import { sentencePieceProcessor, cleanText } from "@weblab-notebook/sentencepiece";

let text = "I am still waiting on my card?";
let cleaned = cleanText(text);

let preprocessor = await sentencePieceProcessor("test/30k-clean.model");

it('encode ids', () => {
    [...Array(2000)].forEach(_ => {
        preprocessor.encodeIds(cleaned).then(ids => { expect(ids).to.eql(new Int32Array([31, 589, 174, 1672, 27, 51, 2056, 60])); Promise.resolve(true) });
    })
});

let ids = await preprocessor.encodeIds(cleaned);

it('decode ids', () => {
    [...Array(2000)].forEach(_ => {
        preprocessor.decodeIds(ids).then(pieces => { expect(pieces).to.eql("i am still waiting on my card?"); Promise.resolve(true) })
    })
});
