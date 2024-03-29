import * as React from 'react';
import * as Permissions from 'expo-permissions'
import * as tf from '@tensorflow/tfjs';
import * as ImageManipulator from 'expo-image-manipulator';
import {
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import {AppConfig} from "../config";
import {Text ,View,getColor,ActivityIndicator,ScrollView} from '../components/Themed';
import {Icon, ListItem} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker';
import { ModelService, IModelPredictionResponse,IModelPredictionTiming,ModelPrediction } from '../components/ModelService';

type State = {
  image: ImageManipulator.ImageResult | {}; 
  loading:boolean;
  isTfReady: boolean;
  isModelReady: boolean;
  error:string|null;
  timing:IModelPredictionTiming|null|undefined;
  predictions: String[] | null;
};


export default class CameraScreen extends React.Component<{answer?: String, setAnswer: (answer?: String) => void},State> {
  static navigationOptions = {
    header: null,
  };

  static answerShared: String[] | null;
  state:State = {
      image: {},
      loading: false,
      isTfReady: false,
      isModelReady: false,
      predictions: null,
      error:null,
      timing:null,
  };


  modelService!:ModelService;

  async componentDidMount() {
    this.setState({ loading: true });
    this.modelService = await ModelService.create(AppConfig.imageSize);
    this.setState({ isTfReady: true,isModelReady: true,loading: false  });
  };

  render() {

    const modelLoadingStatus = this.state.isModelReady ? "Yes" : "No";
    // contentContainerStyle={styles.contentContainer}
    return (
      <ScrollView style={styles.container}>
          <View style={styles.container} >

              <View style={styles.titleContainer}>
                  <Text h1>{AppConfig.title}</Text>
                    <Text style={{fontSize: 23, paddingLeft: 10, paddingRight: 10, paddingTop: 20, paddingBottom: 20}}>Take a picture of your food using the camera, or load a picture from your camera roll:</Text>
              </View>
              <View>
                <Text style={{paddingLeft: 10}}>Model Status: {modelLoadingStatus}</Text>
              </View>

              <View style={styles.actionsContainer}>
                  <View style={styles.callToActionContainer}>
                      <Icon name='camera-alt' raised onPress={this._pickImageFromCamera}/>
                      <Icon name='image' raised onPress={this._pickImageFromLibrary}/>
                  </View>
              </View>

              <View style={styles.imageContainer}>
                  <Image source={this.state.image} style={{height: 200, width: 200}}/>
              </View>


              <View style={styles.predictionsContainer}>
                  {this.renderPredictions()}
              </View>
          </View>
      </ScrollView>
    );
  }


  renderPredictions() {
      if (this.state.loading) {
          return <ActivityIndicator/>
      }
      let predictions= this.state.predictions || [];
      
      if (Object.keys(predictions).length > 1) {
          return (
              <View style={styles.predictionsContentContainer}>
                  <Text h3>Prediction </Text>
                  <View>
                    { Object.values(predictions).map((className, Prob) => {
                      return (
                        <Text> {className} </Text>
                      )
                    })
                    }
                  </View>

                  <Text h3>Timing (ms)</Text>
                  <View>
                    <Text>total time: {this.state.timing?.totalTime}</Text>
                    <Text>loading time: {this.state.timing?.imageLoadingTime}</Text>
                    <Text>preprocessing time: {this.state.timing?.imagePreprocessing}</Text>
                    <Text>prediction time: {this.state.timing?.imagePrediction}</Text>
                    <Text>decode time: {this.state.timing?.imageDecodePrediction}</Text>
                    <View style={{alignItems: 'center', paddingTop: 10}}>
                      <TouchableOpacity style={{width: 300, height: 50, borderRadius: 10, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: 'black'}}>Nutrients and calorie info</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

              </View>
          )
      } else {
          return null
      }
  }


  _verifyPermissions = async () => {
      console.log("Verifying Permissions");
      const { status, expires, permissions } = await Permissions.getAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);

      if (status !== 'granted') {
          const { status, permissions }  = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL)
        
          if (status === 'granted') {
              console.log("Permissions granted");
              return true
          } else {
              alert('Hey! You have not enabled selected permissions');
              return false
          }

      }else{
          return true;
      }
  };

  _pickImageFromLibrary = async () => {
      const status = await this._verifyPermissions();

      try {
        let response = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3]
        })

        if (!response.cancelled) {
          //const source = { uri: response.uri }

          //this.setState({ image: source })
          this._classifyImage(response.uri)
        }
      } catch (error) {
        console.log(error)
      }

  };

  _pickImageFromCamera = async () => {
      const status = await this._verifyPermissions();

      try {

        let response = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3]
        });

        if (!response.cancelled) {
          //const source = { uri: response.uri }
          
          this._classifyImage(response.uri)
        }
    }  catch (error) {
      console.log(error)
    }

  };

  _classifyImage = async (imageUri:string) => {
    try {
      const res:ImageManipulator.ImageResult = await ImageManipulator.manipulateAsync(imageUri,
        [{ resize: { width:AppConfig.imageSize, height:AppConfig.imageSize }}],
        { compress: 1, format: ImageManipulator.SaveFormat.JPEG,base64:true }
        );
      
      this.setState({ image: res})
      console.log('numTensors (before prediction): ' + tf.memory().numTensors);
      this.setState({ predictions: null ,error:null , loading:true })
      
      const predictionResponse = await this.modelService.classifyImage(res);
      //PredictionState.setState({pred: predictionResponse.predictions});
      
      if (predictionResponse.error){
        this.setState({ error: predictionResponse.error , loading:false})
      }else{
        let predictions: any
        predictions = predictionResponse.predictions  || null;
        this.setState({ predictions: predictions, timing:predictionResponse.timing,  loading:false})
        console.log("classifyImage stuff");
        console.log(predictions.className.split(',')[0]);
        this.props.setAnswer(predictions.className.split(',')[0]);
        console.log("below is the props in the classify image method")
        console.log(this.props.setAnswer);
      }
      
      //tf.dispose(predictions);
      console.log('numTensors (after prediction): ' + tf.memory().numTensors);

    } catch (error) {
      console.log('Exception Error: ', error)
    }
  }
}


const styles = StyleSheet.create({
  container: {
      paddingTop: 5,
      flex: 1,
  },

  contentContainer: {
      alignItems: 'center',
      justifyContent: 'center',
  },
  titleContainer: {
      alignItems: 'center',
      marginTop: 10,
      //flex: 2,
      justifyContent: 'center',
  },
  actionsContainer: {
      alignItems: 'center',
      marginTop: 5,
      marginBottom: 5,
      //flex: 1,
  },
  imageContainer: {
      alignItems: 'center',
  },
  callToActionContainer: {
      flexDirection: "row"
  },

  feedBackActionsContainer: {
      flexDirection: "row"
  },

  predictionsContainer: {
      padding: 10,
      justifyContent: 'center',
      color: 'black'
  },

  predictionsContentContainer: {
      padding: 10,
      color: "black"
  },
  predictionRow: {
      flexDirection: "row",
  },
  predictionRowCategory: {
      justifyContent: "space-between",
  },
  predictionRowLabel: {
      justifyContent: "space-between",
  }
});

