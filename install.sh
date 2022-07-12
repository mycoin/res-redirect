#!/bin/bash

if [[ -d node_modules ]]; then
    echo ">>> delete node_modules ..."
    mv node_modules $(mktemp -d)
fi

echo ">>> git fetch origin..."
git fetch origin
echo ">>> tnpm install..."
tnpm ii
echo ">>> tnpm run dev..."
tnpm run dev
