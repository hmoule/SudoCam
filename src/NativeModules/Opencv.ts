import {NativeModules} from 'react-native';
interface RNOpenCvLibraryInterface {
  solveSudoku: (base64: string) => void;
}

export default NativeModules.RNOpenCvLibrary as RNOpenCvLibraryInterface;
