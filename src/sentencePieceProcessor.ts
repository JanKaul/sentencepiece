import Module from "./sentencepiece"

let sentencepiece = await Module();

export class SentencePieceProcessor {
    processor: any;
    constructor(spp) {
        this.processor = spp;
    }
    encodeIds(text: string) {

        let string_view = new sentencepiece.StringView(text);

        let absl_string_view = string_view.getView();

        let ids = this.processor.EncodeAsIds(absl_string_view);

        let arr = sentencepiece.vecToView(ids).slice();

        ids.delete();
        absl_string_view.delete();
        string_view.delete();

        return arr;
    }
    decodeIds(ids: Int32Array) {

        let vecIds = sentencepiece.vecFromJSArray(ids);

        let str = this.processor.DecodeIds(vecIds).slice();

        vecIds.delete();

        return str;
    }

    async loadVocabulary(url: string) {

        let text = await fetch(url).then(response => response.text());

        sentencepiece.FS.writeFile("sentencepiece.vocab", text);

        let string_view = new sentencepiece.StringView("sentencepiece.vocab");

        let absl_string_view = string_view.getView();

        let status = this.processor.LoadVocabulary(absl_string_view, -1000);

        status.delete();
        absl_string_view.delete();
        string_view.delete();
    }
}

export async function sentencePieceProcessor(url: string) {

    let spp = new sentencepiece.SentencePieceProcessor();

    let buffer = await fetch(url).then(response => response.arrayBuffer());

    sentencepiece.FS.writeFile("sentencepiece.model", new Uint8Array(buffer));

    let string_view = new sentencepiece.StringView("sentencepiece.model");

    let absl_string_view = string_view.getView();

    let load_status = spp.Load(absl_string_view);

    load_status.delete();
    absl_string_view.delete();
    string_view.delete();

    return new SentencePieceProcessor(spp);
}

export function cleanText(text: string) {
    const stringBuilder = [];
    let originalCharIndex = 0, newCharIndex = 0;
    for (const ch of text) {
        // Skip the characters that cannot be used.
        if (isInvalid(ch)) {
            originalCharIndex += ch.length;
            continue;
        }
        if (isWhitespace(ch)) {
            if (stringBuilder.length > 0 &&
                stringBuilder[stringBuilder.length - 1] !== ' ') {
                stringBuilder.push(' ');
                originalCharIndex += ch.length;
            } else {
                originalCharIndex += ch.length;
                continue;
            }
        } else {
            stringBuilder.push(ch);
            originalCharIndex += ch.length;
        }
        newCharIndex++;
    }
    return stringBuilder.join('').toLowerCase();
}

function isWhitespace(ch) {
    return /\s/.test(ch);
}

function isInvalid(ch) {
    return (ch.charCodeAt(0) === 0 || ch.charCodeAt(0) === 0xfffd);
}