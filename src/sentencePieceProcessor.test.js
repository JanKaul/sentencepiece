import { expect } from '@esm-bundle/chai';
import { sentencePieceProcessor, cleanText } from "@weblab-notebook/sentencepiece";

let text = "I am still waiting on my card?";
let cleaned = cleanText(text);

let preprocessor = await sentencePieceProcessor("test/30k-clean.model");

let ids = await preprocessor.encodeIds(cleaned);

it('encode ids', () => {
    expect(ids).to.eql(new Int32Array([31, 589, 174, 1672, 27, 51, 2056, 60]));
});

let pieces = await preprocessor.decodeIds(ids);

it('decode ids', () => {
    expect(pieces).to.eql("i am still waiting on my card?");
});
