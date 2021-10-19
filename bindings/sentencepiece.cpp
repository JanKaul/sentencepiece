#include <emscripten/bind.h>
#include <emscripten.h>
#include "../sentencepiece/src/sentencepiece_processor.h"

class StringView {
  private: 
    std::string str;
    absl::string_view view;
  public:
    StringView(const std::string &input) {
      str = std::string(input);
      view = absl::string_view(str.data(),str.length());
    }
    absl::string_view get_view() {
      return this->view;
    }
};

template <typename T> emscripten::val vecToView(std::vector<T> vec) {
  return emscripten::val(emscripten::typed_memory_view(vec.size(),vec.data()));
}

template <typename T> std::vector<T> vecFromJSArray(const emscripten::val &v)
{
    std::vector<T> rv;

    const auto l = v["length"].as<unsigned>();
    rv.resize(l);

    emscripten::val memoryView{emscripten::typed_memory_view(l, rv.data())};
    memoryView.call<void>("set", v);

    return rv;
}

EMSCRIPTEN_BINDINGS(sentencepiece) {
  emscripten::register_vector<std::string>("VectorString");
  emscripten::register_vector<int>("VectorInt");

  emscripten::function("vecToView",emscripten::select_overload<emscripten::val(std::vector<int>)>(&vecToView));
  emscripten::function("vecFromJSArray",emscripten::select_overload<std::vector<int>(const emscripten::val &)>(&vecFromJSArray));

  emscripten::class_<sentencepiece::util::Status>("Status")
    .constructor()
    .function("ToString",&sentencepiece::util::Status::ToString)
    ;

  emscripten::class_<absl::string_view>("AbslStringView")
    .constructor<const std::string &>()
    ;

  emscripten::class_<StringView>("StringView")
    .constructor<const std::string &>()
    .function("getView",&StringView::get_view)
    ;

  emscripten::class_<sentencepiece::SentencePieceProcessor>("SentencePieceProcessor")
    .smart_ptr_constructor("SentencePieceProcessor", &std::make_shared<sentencepiece::SentencePieceProcessor>)
    .function("Load", emscripten::select_overload<sentencepiece::util::Status(absl::string_view)>(&sentencepiece::SentencePieceProcessor::Load))
    .function("status", &sentencepiece::SentencePieceProcessor::status)
    .function("SetEncodeExtraOptions", &sentencepiece::SentencePieceProcessor::SetEncodeExtraOptions)
    .function("SetDecodeExtraOptions", &sentencepiece::SentencePieceProcessor::SetDecodeExtraOptions)
    .function("SetVocabulary", &sentencepiece::SentencePieceProcessor::SetVocabulary)
    .function("ResetVocabulary", &sentencepiece::SentencePieceProcessor::ResetVocabulary)
    .function("LoadVocabulary", &sentencepiece::SentencePieceProcessor::LoadVocabulary)
    .function("EncodeAsPieces", &sentencepiece::SentencePieceProcessor::EncodeAsPieces)
    .function("EncodeAsIds", &sentencepiece::SentencePieceProcessor::EncodeAsIds)
    .function("PieceToId", &sentencepiece::SentencePieceProcessor::PieceToId)
    .function("DecodeIds", &sentencepiece::SentencePieceProcessor::DecodeIds)
    ;
}
