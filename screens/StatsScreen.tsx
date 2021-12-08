import React, {Component} from 'react';
import { StyleSheet } from 'react-native';
import { View, Text} from '../components/Themed';
import Markdown from 'react-native-markdown-display';
import {AppConfig} from  "../config";
import {getColor} from "../components/Themed";
import { PieChart } from 'react-native-svg-charts';
//import { ModelService, IModelPredictionResponse,IModelPredictionTiming,ModelPrediction } from '../components/ModelService';
import CameraScreen from'./CameraScreen';
import {Toast, Button, Container, Icon, Content, CardItem, Card, List, ListItem, Header} from 'native-base';
const axios = require('axios');
var nutritionKeys = require('../nutritionApiKey');
var nutritionID = nutritionKeys.apiID;
var nutritionKey = nutritionKeys.apiKey;

interface IProps {
  answer?: String;
}

interface IState {
  calories: number,
  cholesterol: number,
  dietaryFiber: number, 
  protein: number,
  saturatedFat: number,
  sugars: number,
  totalCarbs: number,
  totalFat: number
  servingQty: number,
  servingUnit: String,
  name: String,
  predictions: String | null
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
      servingUnit: "",
      name: "",
      predictions: null
    }
  }

  componentDidMount() {
    this.getInformation(this.props.answer);
  };

  componentDidUpdate(prevProps: any, prevState: any) {
    if (prevProps.answer !== this.props.answer) {
      this.getInformation(this.props.answer);
    }
  }

  getInformation = (data?: String) => {
    console.log("GetInfo in stats screen");
    console.log(data);
    if (!data) {
      return;
    }
    this.setState({name: data});
    const headers = {
        'content-type': 'application/json',
        'x-app-id': nutritionID.toString(),
        'x-app-key': nutritionKey.toString(),
        'accept': 'application/json'
    }
    axios.post('https://trackapi.nutritionix.com/v2/natural/nutrients', {query: data}, {headers: headers})
    .then((response: any) => {
        const foods = response.data.foods[0]
        const cal = foods.nf_calories;
        const chol = foods.nf_cholesterol;
        const dietFiber = foods.nf_dietary_fiber;
        const prot = foods.nf_protein;
        const saturatedF = foods.nf_saturated_fat;
        const sugars = foods.nf_sugars;
        const TCarbs = foods.nf_total_carbohydrate;
        const TFat = foods.nf_total_fat;
        const servQty = foods.serving_qty;
        const servUnit = foods.serving_unit;
        this.setState({ calories: cal, cholesterol: chol , dietaryFiber: dietFiber, protein: prot, 
          saturatedFat: saturatedF, sugars: sugars, totalCarbs: TCarbs, totalFat: TFat, servingQty: servQty, servingUnit:servUnit })
    }).catch(function(error: any) {
        console.error(error);
    })
  }

  math() { // Used to calculate the new nutritional information when serving size changes

  }

  render() {
    const {calories,cholesterol,dietaryFiber,protein,saturatedFat,sugars,totalCarbs,totalFat,servingQty,servingUnit,name} = this.state
    return (
      <Container>
        <Content>
          <View>
        <Card
          style={{alignItems: 'center', padding: 10}}
        >
        <CardItem
        header
        style={{alignSelf: 'center'}}
        >
            <Text
              style={{fontWeight: 'bold', fontSize: 20, color:"black"}}> {name.toUpperCase()}</Text>
            </CardItem>
            <CardItem
            style={{alignSelf: 'center'}}>
              <Text
                style={{fontWeight: 'bold', fontSize: 15, color:"black"}}>{calories} calories </Text>
            </CardItem>
            <CardItem
            style={{alignSelf: 'center'}}>
            <Text style={{fontWeight: 'bold', fontSize: 15, color:"black"}}>  Serving: {servingQty} {servingUnit} </Text>
            </CardItem>
            <CardItem
              style={{alignSelf: 'center'}}>
            </CardItem>
            <CardItem>
          <PieChart
          style={{ height: 250, width: 250 }}
          outerRadius={'70%'}
          innerRadius={10}
          data={[
            {
              key: 1,
              value: protein,
              svg: { fill: '#bc5090' },
              arc: { cornerRadius: 5 }
            },
            {
              key: 2,
              value: totalCarbs,
              svg: { fill: '#ff6361' },
              arc: { cornerRadius: 5 }
            },
            {
              key: 3,
              value: totalFat,
              svg: { fill: '#ffa600' },
              arc: { cornerRadius: 5 }
            }
          ]}
          />
            </CardItem>
            <CardItem
              style={{flex: 1}}>
              <Button
                style={{backgroundColor: '#bc5090'}}>
                <Text style={{color: 'black', fontWeight: 'bold'}}>Protein {protein.toFixed(2)}g</Text>
              </Button>
              <Button
                style={{backgroundColor: '#ff6361'}}>
                <Text style={{color: 'black', fontWeight: 'bold'}}>Carbs {totalCarbs.toFixed(2)}g</Text>
              </Button>
              <Button
                style={{backgroundColor: '#ffa600'}}>
                <Text style={{color: 'black', fontWeight: 'bold'}}>Fat {totalFat.toFixed(2)}g</Text>
              </Button>
            </CardItem>
        </Card>
        </View>
        <Card>
            <List>
            <ListItem itemDivider>
              <Text style={{color: 'black', fontWeight: 'bold'}}>
                {servingQty} {servingUnit} {name.toUpperCase()}
              </Text>
            </ListItem>
            <ListItem>
              <Text style={{color: 'black', fontWeight: 'bold'}}>Calories: {calories}kcal</Text>
            </ListItem>
            <ListItem>
              <Text style={{color: 'black', fontWeight: 'bold'}}>Total Fat: {totalFat}g</Text>
            </ListItem>
            <ListItem>
              <Text style={{color: 'black', fontWeight: 'bold'}}>Carbs: {totalCarbs}g</Text>
            </ListItem>
            <ListItem>
              <Text style={{color: 'black', fontWeight: 'bold'}}>Sugar: {sugars}g</Text>
            </ListItem>
            <ListItem>
              <Text style={{color: 'black', fontWeight: 'bold'}}>Cholesterol: {cholesterol}g</Text>
            </ListItem>
            <ListItem>
              <Text style={{color: 'black', fontWeight: 'bold'}}>Protein: {protein}g</Text>
            </ListItem>
            <ListItem>
              <Text style={{color: 'black', fontWeight: 'bold'}}>Dietary Fiber: {dietaryFiber}g</Text>
            </ListItem>
            <ListItem>
              <Text style={{color: 'black', fontWeight: 'bold'}}>Saturated Fat: {saturatedFat}g</Text>
            </ListItem>
          </List>
        </Card>
        </Content>
      </Container>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10
  }
});
