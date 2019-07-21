# Stockdown
React native iOS app used to scan product barcodes to quickly create a list of out-of-stock product with the relevant information needed to find the product.

## Build for simulator
`cd stockdown`, then install node packages with `yarn install`
It is recommended to use react-native command line for building for both android and ios. Begin by installing it globally with `yarn global add react-native-cli`. In order to run on iOS simulator, you will need a mac with the xCode installed along with the command line tools. Test the app by executing `react-native run-ios`. To simulate android install Android Studio and execute `react-native run-android`.

## Install app on iOS 
After following the steps at [React Native, Running On Device](https://facebook.github.io/react-native/docs/running-on-device), you can test the app on a physical iPhone by running 

`react-native run-ios --device "device-name"`. 

NOTE: if the device name has special characters such as ', it will fail to recognize. You can workaround by changing your device name on the phone.

When you want to demo the app without running metro bundler, you can add the option `--configuration Release` to bundle the js files onto the device.
