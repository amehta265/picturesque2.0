import * as tf from '@tensorflow/tfjs';
import * as FileSystem from 'expo-file-system'
import { fetch ,asyncStorageIO,bundleResourceIO,decodeJpeg} from '@tensorflow/tfjs-react-native'
import {Image} from 'react-native';
import * as ImageManipulator from 'expo-image-manipulator';
import {AppConfig} from "../config"
import { ThemeConsumer } from 'react-native-elements';
import * as mobilenet from '@tensorflow-models/mobilenet'
import { MainBundlePath } from 'react-native-fs';

export interface ModelPrediction {
  className:string;
}

export interface IModelPredictionTiming {
  totalTime:number;
  imageLoadingTime:number;
  imagePreprocessing:number;
  imagePrediction:number;
  imageDecodePrediction:number;
}
// predictions?:ModelPrediction [] | null
export interface IModelPredictionResponse {
  predictions?: String[] | null
  timing?:IModelPredictionTiming | null
  error?:string | null
}

const imageToTensor = (rawImageData:Uint8Array)=> {
  return decodeJpeg(rawImageData);
}


const fetchImage = async (image:ImageManipulator.ImageResult) => {
  let imgB64:string;
  if(image.base64){
    imgB64=image.base64
  }else{ 
    const imageAssetPath = Image.resolveAssetSource(image)
    console.log(imageAssetPath.uri);
  
    imgB64 = await FileSystem.readAsStringAsync(imageAssetPath.uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
  }
 
  const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
  const rawImageData = new Uint8Array(imgBuffer)  

  return rawImageData;
}
const preprocessImage = (img:tf.Tensor3D,imageSize:number) =>{
      // https://github.com/keras-team/keras-applications/blob/master/keras_applications/imagenet_utils.py#L43

      let imageTensor = img.resizeBilinear([imageSize, imageSize]).toFloat();

      const offset = tf.scalar(224);
      const normalized = imageTensor.sub(offset).div(offset);
      const preProcessedImage:tf.Tensor3D = imageTensor.reshape([-1, imageSize, imageSize, 3]);
      return preProcessedImage;
      
}

const decodePredictions = (prediction: { className: any; }) => {
  const predictionResponse:Object[] = []
  predictionResponse.push(
    prediction.className
  )
  return predictionResponse;
}


export class ModelService {

    //private model:tf.GraphModel;
    private model: mobilenet.MobileNet
    private model_classes: String[];
    private imageSize:number;
    private static instance: ModelService;

    constructor(imageSize:number,model:mobilenet.MobileNet, model_classes: String[]){
        this.imageSize=imageSize;
        this.model = model;
        this.model_classes=model_classes;
    }


    static async create(imageSize:number) {
      if (!ModelService.instance){
        await tf.ready();
        const modelJSON = require('../assets/model_tfjs/model.json');
        const modelWeights = require('../assets/model_tfjs/group1-shard1of1.bin');
        const model_classes = require("../assets/model_tfjs/classes.json")

        //const model = await tf.loadGraphModel(bundleResourceIO(modelJSON, modelWeights));
        const model = await mobilenet.load()
        //model.predict(tf.zeros([1, imageSize, imageSize, 3]));
        model.classify(tf.zeros([imageSize, imageSize, 3]));
        
        ModelService.instance = new ModelService(imageSize,model,model_classes);
      }

      return ModelService.instance;

    }

    async classifyImage(image:ImageManipulator.ImageResult):Promise<IModelPredictionResponse>{ 
      const predictionResponse = {timing:null,predictions:null,error:null} as IModelPredictionResponse;
      try {
          console.log(`Classifying Image: Start `)
          
          let imgBuffer:Uint8Array = await fetchImage(image); 
          const timeStart = new Date().getTime()
          console.log(`Backend: ${tf.getBackend()} `)
          console.log(`Fetching Image: Start `)
        
          const imageTensor:tf.Tensor3D = imageToTensor(imgBuffer);
          
          
          console.log(`Fetching Image: Done `)
          const timeLoadDone = new Date().getTime()
    
          console.log("Preprocessing image: Start")
          
          const preProcessedImage = preprocessImage(imageTensor,this.imageSize); // Look at this line of code incase it improves accuracy.
    
          console.log("Preprocessing image: Done")
          const timePrepocessDone = new Date().getTime()
    
          console.log("Prediction: Start")
          //const predictionsTensor:tf.Tensor = this.model.predict(preProcessedImage) as tf.Tensor;
          const predictionsTensor:any = await this.model.classify(preProcessedImage);
          console.log("Prediction: Done")
          const timePredictionDone = new Date().getTime()
    
          console.log("Post Processing: Start")
    
          // post processing
          //predictionResponse.predictions  = decodePredictions(predictionsTensor:tf.Tensor,this.model_classes,AppConfig.topK);
          //predictionResponse.predictions = predictionsTensor.map((p: { className: any; }) => decodePredictions(p))
          predictionResponse.predictions = predictionsTensor[0];
          
          
          //tf.dispose(imageTensor);
          //tf.dispose(preProcessedImage);
          //tf.dispose(predictions);

          console.log("Post Processing: Done")

          const timeEnd = new Date().getTime()
          
          const timing:IModelPredictionTiming = {
            totalTime: timeEnd-timeStart,
            imageLoadingTime : timeLoadDone-timeStart,
            imagePreprocessing : timePrepocessDone-timeLoadDone,
            imagePrediction : timePredictionDone-timePrepocessDone ,
            imageDecodePrediction : timeEnd-timePredictionDone
          } as IModelPredictionTiming;
            predictionResponse.timing = timing;
          
          
          console.log(`Classifying Image: End `);

          console.log(`Response:  ${JSON.stringify(predictionResponse ,null, 2 ) } `);
          return predictionResponse as IModelPredictionResponse
          
      } catch (error) {
          console.log('Exception Error: ', error)
          return {error}
      }
    }
}

