import { expect } from '@esm-bundle/chai';
import { sentencePieceProcessor, cleanText } from "@weblab-notebook/sentencepiece";

let text = "I am still waiting on my card?";
let cleaned = cleanText(text);

let preprocessor = await sentencePieceProcessor("https://raw.githubusercontent.com/google/sentencepiece/raw/master/python/test/test_model.model");

let ids = await preprocessor.encodeIds(cleaned);

it('encode ids', () => {
    expect(ids).to.eql(new Int32Array([13, 1, 589, 174, 1672, 27, 51, 2056, 60]));
});

let pieces = await preprocessor.decodeIds(ids);

it('decode ids', () => {
    expect(pieces).to.eql("this is some test text.");
});
