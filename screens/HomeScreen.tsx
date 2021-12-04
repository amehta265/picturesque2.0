import React, {useEffect} from "react"
import {SafeAreaView, ScrollView, Image, Text, Alert, View, ImageBackground, FlatList, TouchableOpacity} from "react-native"
import {StyleSheet} from "react-native";
import { white } from "react-native-paper/lib/typescript/styles/colors";
import { NavigationContainer } from '@react-navigation/native';
//import style from "./style";

const Dashboard = ({navigation}: {navigation: any}) => {
  const [recentFoods, setRecentFoods] = React.useState<string[]>([])

  useEffect(() => {
    setRecentFoods(['apple', 'cheese'])
  }, [])

  return (
    <SafeAreaView style={style.container}>
      <ImageBackground source={require('../assets/images/background.png')} resizeMode="cover" style={{flex:1, marginTop: 50}}>
        <View style={{alignItems: 'center', marginTop: 60}}>
          <Image style={{width: 400, height: 300}} source={require('../assets/images/logo2.png')}/>
        </View>
        <View style={{alignItems: 'center', marginTop: 50}}>  
          <TouchableOpacity style={style.cameraButton} onPress={() => navigation.navigate('Camera')}>
            <Image style={{width: 200, height: 150}} source={require('../assets/images/takePicText.png')}/>
          </TouchableOpacity>
        </View>
      </ImageBackground>
        {/* <Text style={style.titleText}> ADD RECENT FOODS</Text>
        <View style={{alignItems: 'center', paddingVertical: 5}}>
          <View style={{width:'80%'}}>
            <ImageBackground resizeMode="cover" style={{justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 3, borderColor: 'black', width: '100%', height: 100, borderRadius: 10}} source={require('../assets/images/apple.jpg')}>
              <Image source={require('../assets/images/logo.png')}/>
            </ImageBackground>
          </View>
        </View>
        <View style={{alignItems: 'center', paddingVertical: 5}}>
          <View style={{width:'80%'}}>
            <ImageBackground resizeMode="cover" style={{justifyContent: 'center', alignItems: 'center', overflow: 'hidden', borderWidth: 3, borderColor: 'black', width: '100%', height: 100, borderRadius: 10}} source={require('../assets/images/cheese.jpg')}>
              <Image source={require('../assets/images/addCheeseButton.png')}/>
            </ImageBackground>
          </View>
        </View>

        <Text style={style.titleText}> DISCOVER</Text>
        <Text style={style.baseText}>    What's new today</Text>
        <View style={{alignItems: 'center', paddingVertical: 5}}>
          <Image style={{borderWidth: 3, borderColor: 'black', width: '80%', height: 100, borderRadius: 10}} source={require('../assets/images/recipes.jpg')} /> 
        </View>
        <View style={{alignItems: 'center', paddingVertical: 5}}>
          <Image style={{borderWidth: 3, borderColor: 'black', width: '80%', height: 100, borderRadius: 10}} source={require('../assets/images/noodle.jpg')} /> 
        </View>
        <View style={{alignItems: 'center', paddingVertical: 5}}>
          <Image style={{borderWidth: 3, borderColor: 'black', width: '80%', height: 100, borderRadius: 10}} source={require('../assets/images/pasta.jpg')} /> 
        </View> */}
    </SafeAreaView>
  )
}

const style = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
  },
  baseText: {
    color: 'black', 
    fontSize: 30,
    padding: 10,
    fontFamily: 'Comfortaa'
  },
  titleText: {
    fontSize: 36,
    fontWeight: "bold"
  },
  button: {
    position: 'absolute', 
  },
  cameraButton: {
    width: 300,
    height: 200,
    borderRadius: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

export default Dashboard
