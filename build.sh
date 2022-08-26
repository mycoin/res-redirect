#!/bin/bash
if [[ -d target ]]; then
    rm -rf ./target
fi

npm run build
mkdir -p target
cp -r manifest.json *.html support dist target
