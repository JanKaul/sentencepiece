import { expect } from '@esm-bundle/chai';
import { sentencepieceProcessor, cleanText } from "@weblab-notebook/sentencepiece";

let text = "I am still waiting on my card?";
let cleaned = cleanText(text);

let preprocessor = await sentencepieceProcessor("https://github.com/google/sentencepiece/blob/8420f2179007c398c8b70f63cb12d8aec827397c/python/test/test_model.model");

let ids = await preprocessor.encodeIds(cleaned);

it('encode ids', () => {
    expect(ids).to.eql(new Int32Array([13, 1, 589, 174, 1672, 27, 51, 2056, 60]));
});

let pieces = await preprocessor.decodeIds(ids);

it('decode ids', () => {
    expect(pieces).to.eql("this is some test text.");
});
