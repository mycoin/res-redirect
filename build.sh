#!/bin/bash
APP_NAME='res-redirect'

if [[ -d $APP_NAME ]]; then
    rm -rf $APP_NAME
fi

npm run build
mkdir -p $APP_NAME
cp -r manifest.json *.html support README.md dist $APP_NAME

zip -vr $APP_NAME.zip $APP_NAME/
