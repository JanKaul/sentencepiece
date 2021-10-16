import { expect } from '@esm-bundle/chai';
import { tokenizer, cleanText } from "@weblab-notebook/albert_tokenization";

let text = "I am still waiting on my card?";
let cleaned = cleanText(text);

let processor = await tokenizer("https://github.com/google/sentencepiece/blob/8420f2179007c398c8b70f63cb12d8aec827397c/python/test/test_model.model");


let ids = await processor.encodeIds(cleaned);

it('encode ids', () => {
    expect(ids).to.eql(new Int32Array([13, 1, 589, 174, 1672, 27, 51, 2056, 60]));
});

let pieces = await processor.decodeIds(ids);

it('decode ids', () => {
    expect(pieces).to.eql("this is some test text.");
});
