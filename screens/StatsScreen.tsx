import React, {Component} from 'react';
import { StyleSheet } from 'react-native';
import { View, Text} from '../components/Themed';
import Markdown from 'react-native-markdown-display';
import {AppConfig} from  "../config";
import {getColor} from "../components/Themed";
const axios = require('axios');
var nutritionKeys = require('../nutritionApiKey');
var nutritionID = nutritionKeys.apiID;
var nutritionKey = nutritionKeys.apiKey;

interface IProps {
}

interface IState {
  calories: Number,
  cholesterol: Number,
  dietaryFiber: Number, 
  protein: Number,
  saturatedFat: Number,
  sugars: Number,
  totalCarbs: Number,
  totalFat: Number
  servingQty: Number,
  servingUnit: String
}


export default class StatsScreen extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      calories: 0,
      cholesterol: 0,
      dietaryFiber: 0, 
      protein: 0,
      saturatedFat: 0,
      sugars: 0,
      totalCarbs: 0,
      totalFat: 0,
      servingQty: 0,
      servingUnit: ""
    }
  }

  componentDidMount() {
    this.getInformation()
  }

  getInformation = () => {
    let data = "chicken noodle soup";
    const headers = {
        'content-type': 'application/json',
        'x-app-id': nutritionID.toString(),
        'x-app-key': nutritionKey.toString(),
        'accept': 'application/json'
    }
    axios.post('https://trackapi.nutritionix.com/v2/natural/nutrients', {query: data}, {headers: headers})
    .then((response: any) => {
        const foods = response.data.foods[0]
        const calories = foods.nf_calories;
        const cholesterol = foods.nf_cholesterol;
        const dietaryFiber = foods.nf_dietary_fiber;
        const protein = foods.nf_protein;
        const saturatedFat = foods.nf_saturated_fat;
        const sugars = foods.nf_sugars;
        const totalCarbs = foods.nf_total_carbohyrdate;
        const totalFat = foods.nf_total_fat;
        const servingQty = foods.serving_qty;
        const servingUnit = foods.serving_unit;
        this.setState({ calories, cholesterol, dietaryFiber, protein, saturatedFat, sugars, totalCarbs, totalFat, servingQty, servingUnit })
    }).catch(function(error: any) {
        console.error(error);
    })
  }

  math() { // Used to calculate the new nutritional information when serving size changes

  }

  render() {
    const {calories,cholesterol,dietaryFiber,protein,saturatedFat,sugars,totalCarbs,totalFat ,servingQty,servingUnit} = this.state
    return (
      <View style={styles.container}>
        <View style={{}}>
          <Text h2 >Nutritional Information</Text>
        </View>
        <View>
              <Text style={{alignSelf: 'center'}}>Click the food that best matches your picture</Text>
              <Text> Calories: </Text> 
              <Text> {calories}, {protein}</Text>
        </View>
    </View>

    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10
  }
});


