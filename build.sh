#!/bin/bash
npm install
ionic cordova build android || true
ionic cordova plugin add cordova-plugin-photo-library --force
export BUILD_NUMBER=$(cat /ionicapp/build_number)
echo "Generatting version $BUILD_NUMBER"
ionic cordova build android --release -- -- --versionCode=${BUILD_NUMBER}
cp /ionicapp/platforms/android/app/build/outputs/apk/release/app-release-unsigned.apk /ionicapp/barbacopoly-unsigned.apk
/opt/android-sdk/build-tools/25.0.3/zipalign -v -p 4 /ionicapp/barbacopoly-unsigned.apk /ionicapp/barbacopoly-unsigned-aligned.apk
/opt/android-sdk/build-tools/25.0.3/apksigner sign --ks /ionicapp/barbacopoly.jks --ks-pass pass:barbacopoly --ks-key-alias barbacopoly --out /ionicapp/barbacopoly.apk /ionicapp/barbacopoly-unsigned-aligned.apk