import Module from "./sentencepiece"

let sentencepieceProm = Module();

export class SentencePieceProcessor {
    processor: any;
    constructor(spp) {
        this.processor = spp;
    }
    async encodeIds(text: string) {

        let sentencepiece = await sentencepieceProm;

        let string_view = new sentencepiece.StringView(text);

        let ids = this.processor.EncodeAsIds(string_view.getView());

        let arr = sentencepiece.vecToView(ids).slice();

        ids.delete();
        string_view.delete();

        return arr;
    }
    async decodeIds(ids: Int32Array) {

        let sentencepiece = await sentencepieceProm;

        let vecIds = sentencepiece.vecFromJSArray(ids);

        let str = this.processor.DecodeIds(vecIds);

        vecIds.delete();

        return str;
    }

    async loadVocabulary(url: string) {
        let sentencepiece = await sentencepieceProm;

        let text = await fetch(url).then(response => response.text());

        sentencepiece.FS.writeFile("sentencepiece.vocab", text);

        let path = new sentencepiece.StringView("sentencepiece.vocab");

        this.processor.LoadVocabulary(path, -1000);
    }
}

export async function sentencePieceProcessor(url: string) {

    let sentencepiece = await sentencepieceProm;

    let spp = new sentencepiece.SentencePieceProcessor();

    let buffer = await fetch(url).then(response => response.arrayBuffer());

    sentencepiece.FS.writeFile("sentencepiece.model", new Uint8Array(buffer));

    let path = new sentencepiece.StringView("sentencepiece.model");

    let load_status = spp.Load(path.getView());

    load_status.delete();
    path.delete();

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