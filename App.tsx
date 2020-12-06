import {RNCamera} from 'react-native-camera';
import ml from '@react-native-firebase/ml';
import React, {FunctionComponent} from 'react';
import {StyleSheet, View, Text, TouchableOpacity, Alert} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-picker';

const PendingView = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: 'lightgreen',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
    <Text>Waiting</Text>
  </View>
);

const App: FunctionComponent = () => {
  const chooseFromLibrary = () => {
    ImagePicker.launchImageLibrary(
      {mediaType: 'photo', storageOptions: {skipBackup: true}},
      async (response) => {
        debugger;
        if (response.data) {
          await RNFetchBlob.fetch(
            'POST',
            'http://10.0.2.2:5000/solve',
            {'Content-Type': 'multipart/form-data'},
            [{name: 'file', filename: 'file.jpg', data: response.data}],
          );
        }
      },
    );
  };
  const takePicture = async (camera) => {
    try {
      const options = {base64: true, fixOrientation: true};
      const data = await camera.takePictureAsync(options);

      await RNFetchBlob.fetch(
        'POST',
        'http://10.0.2.2:5000/solve',
        {'Content-Type': 'multipart/form-data'},
        [{name: 'file', filename: 'file.jpg', data: data.base64}],
      );
    } catch (e) {
      Alert.alert('Error', e.message);
    }

    // console.log(data.uri);
    // console.log(data.path);
    // const processed = await ml().cloudDocumentTextRecognizerProcessImage(
    //   data.uri,
    // );
    // processed.blocks.forEach((block) => {
    //   console.log('Found block with text: ', block.text);
    //   console.log('Confidence in block: ', block.confidence);
    //   console.log('Languages found in block: ', block.recognizedLanguages);
    // });
  };
  return (
    <View style={styles.container}>
      <RNCamera
        captureAudio={false}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.auto}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}>
        {({camera, status, recordAudioPermissionStatus}) => {
          if (status !== 'READY') {
            return <PendingView />;
          }
          return (
            <View
              style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
              <TouchableOpacity
                onPress={() => takePicture(camera)}
                style={styles.capture}>
                <Text style={{fontSize: 14}}> SNAP </Text>
              </TouchableOpacity>
            </View>
          );
        }}
      </RNCamera>
      <TouchableOpacity
        style={{height: 50, backgroundColor: 'red'}}
        onPress={chooseFromLibrary}>
        <Text>Choose from library</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default App;
