#!/usr/bin/env sh

set -e

if [ "$npm_execpath" = "" ]; then
    echo "Run me with 'npm run gentoc' instead"
    exit 1
fi

for md in $(git grep -l "<\\!-- toc -->"); do
    echo "$md"
    npx markdown-toc -i "$md";
done
