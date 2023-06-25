#!/bin/bash

PKG="$npm_package_name"
VERSION="$npm_package_version"

echo "INFO: Checking if $PKG is already published at version $VERSION"

if yarn npm info "$PKG" --fields versions | grep -q "'$VERSION'"; then
    echo "FAIL: $PKG is already published at $VERSION! Please bump this package."

    yarn npm info "$PKG" --fields version | while read -r line; do
        if grep -q "version" <<<"$line"; then
            echo "FAIL: The latest published $line."
        fi
    done

    exit 1
else
    echo "PASS: $PKG is not published at $VERSION"
    exit 0
fi
