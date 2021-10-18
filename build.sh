mkdir build
cd build
emcmake cmake ../sentencepiece
emmake make sentencepiece-static
emcc --bind -o ../src/sentencepiece.js -Wl,--whole-archive src/libsentencepiece.a -Wl,--no-whole-archive ../bindings/sentencepiece.cpp -s EXPORT_ES6=1 -s MODULARIZE=1 -s SINGLE_FILE=1 -O3 -s ASYNCIFY=1
cd ..
