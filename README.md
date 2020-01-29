# Stockdown
React native iOS app used to scan product barcodes to quickly create a list of out-of-stock product with the relevant information needed to find the product.

## Build for simulator
`cd stockdown`, then install node packages with `yarn install`
It is recommended to use react-native command line for building for both android and ios. Begin by installing it globally with `yarn global add react-native-cli`. In order to run on iOS simulator, you will need a mac with the xCode installed along with the command line tools. Test the app by executing `react-native run-ios`. To simulate android install Android Studio and execute `react-native run-android`.

## Enable barcode recognition with Google Firebase
This app uses Google Firebase and its barcode recognition machine learning
model to scan barcodes. You will need to follow the instructions [here]
(https://firebase.google.com/docs/ios/setup) to create your own firebase
project. It will also give you instructions to generate a
GoogleService-Info.plist that will be placed in `stockdown/ios/app/StockDown/`. 

## Install app on iOS 
After following the steps at [React Native, Running On Device](https://facebook.github.io/react-native/docs/running-on-device), you can test the app on a physical iPhone by running 

`react-native run-ios --device "device-name"`. 

NOTE: if the device name has special characters such as ', it will fail to recognize. You can workaround by changing your device name on the phone.

When you want to demo the app without running metro bundler, you can add the option `--configuration Release` to bundle the js files onto the device.

## How to use
At the top of the screen, tap on "New List 0" to rename the list based on what
you will be adding to it. Currently, you can keep up to ten different lists of
barcodes and navigate between them using the arrow keys near the title.

Use the camera viewfinder to scan a barcode. When it is recognized, the barcode
will be highlighted with a red box. Tap on the red box to add it to your list.
The app will highlight multiple barcodes at a time if present in the
viewfinder. 

Currently, the app will place the upc that was scanned in the sku location,
this is because I am primarily testing the app with home depot barcodes that
contain a sku instead of the upc. 

Once barcodes have been added to the list, you can edit them by tapping on
their line. 

The "Clear List" button will get rid of the barcodes in the current
list, but the information that you associated with the sku by editing will be
saved for the next time you scan the barcode. 

"Share this List" will create a copy of the underlying database that can be sent to another phone. If you tap
on the file in iOS, it will open the app and replace the current database with
the imported one. Sharing features have not been implemented in android at this
time. 

"Refresh" is for when barcodes haven't yet appeared in lists. It
shouldn't be needed often and will likely be removed in the future. 

## Development
This app is under active development and is subject to change at any time.
Currently, I am working on getting a first version of the app uploaded onto the
app store. 
