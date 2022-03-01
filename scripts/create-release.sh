#!/usr/bin/env bash

set -e
set -u
set -o pipefail

if [[ -z $VERSION_NAME ]]; then
  echo "version name not specified, aborting release"
  exit 1
fi

if [[ -z $VERSION_NUMBER ]]; then
  echo "version number not specified, aborting release"
  exit 1
fi

echo -e "creating release\nversion name: $VERSION_NAME\nversion number: $VERSION_NUMBER"

# update package.json
tmp="package.json_temp"
jq --arg versionName "$VERSION_NAME" '.version = $versionName' package.json > "$tmp"
mv "$tmp" package.json


# update android/app/build.gradle
sed -i -e 's/versionCode [0-9]\+/versionCode '"$VERSION_NUMBER"'/' android/app/build.gradle
sed -i -e 's/versionName ".*"/versionName "'"$VERSION_NAME"'"/' android/app/build.gradle


# update bitrise.yml
sed -i -e 's/VERSION_NAME: .*/VERSION_NAME: '"$VERSION_NAME"'/' bitrise.yml
sed -i -e 's/VERSION_NUMBER: [0-9]\+/VERSION_NUMBER: '"$VERSION_NUMBER"'/' bitrise.yml

# update ios/MetaMask.xcodeproj/project.pbxproj
sed -i -e 's/MARKETING_VERSION = .*/MARKETING_VERSION = '"$VERSION_NAME;"'/' ios/MetaMask.xcodeproj/project.pbxproj
sed -i -e 's/CURRENT_PROJECT_VERSION = [0-9]\+/CURRENT_PROJECT_VERSION = '"$VERSION_NUMBER"'/' ios/MetaMask.xcodeproj/project.pbxproj

# update changelog
yarn update-changelog
