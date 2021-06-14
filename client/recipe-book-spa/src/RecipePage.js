import React, { Component } from 'react';
import {NavLink} from "react-router-dom";
import { Animated, Easing } from 'react-native';
import RecipeApi from "./services/RecipeApi";
import "./css/recipeStyles.css";
import SpringScrollbars from "./services/SpringScrollBar";

class Recipe extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      spinAnim: new Animated.Value(0)
    };
  }

  componentDidMount() {
    Animated.loop(Animated.timing(
      this.state.spinAnim,
    {
      toValue: 100,
      duration: 300000,
      easing: Easing.linear,
      useNativeDriver: true
    }
  )).start();
    var id = this.props.match.params.recipeId;
    var api = "/api/getRecipeById/" + id;
    RecipeApi.get(api).then(
      (result) => {
        this.setState({
          isLoaded: true,
          items: result.data,
        });
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error,
        });
      }
    );
  }

  deleteRecipe = (event) => {
    var recipeId = this.props.match.params.recipeId
    var api = "/api/deleteRecipe/" + recipeId;
    RecipeApi.delete(api).then(
      (result) => {
        this.props.history.push(`/browse`)
      },
      (error) => {
        this.setState({
          isLoaded: true,
          error,
        });
      }
    );
  }

  render() {
    var ingredients = [];
    var measurements = [];
    const spin = this.state.spinAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });
    const carrotStyle  = {
      transform: [{rotate: spin}],
      position: "absolute",
      top: "5vw",
      left: "5vw",
      right: "5vw",
      bottom: "5vw",
      height: "10vw",
      width: "10vw"

    }
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div class = "text-center errorMessage">Error: {error.message}</div>;
    } else if (!isLoaded) {
      return (
        <div>
        <div className = "loadingContainer">
            <img className = "plate" src = "../images/loadingIcon.png" alt = "background"/>
            <Animated.Image style={carrotStyle} source = "../images/ingredientIcon3.png" alt = "carrot"/>
        </div>
        <h1 className = "text-center loadingText">Awaiting Yumminess</h1>

      </div>)
    } else {
      if (items && items.data && items.data.recipes) 
      {
        if (Array.isArray(items.data.recipes))
        {
          var recipe = items.data.recipes[0];
          const category = "Category: " + recipe.Category;
          const region = "Region: " + recipe.Region;
          if (recipe.Tags !== null)
          {
            var newTags = recipe.Tags.replaceAll(",", ", ")
          }
          const tags = "Tags: " + newTags;
          const type = "Type: " + recipe.Type;
          var ingredientNum = recipe.ingredient1;
          var measureNum = recipe.measure1;
          var i = 1;
          while (ingredientNum !== null && ingredientNum !== "" && i <= 20)
          {
            ingredients.push(ingredientNum);
            measurements.push(measureNum)
            i = i + 1
            ingredientNum = eval("recipe.ingredient" + i)
            measureNum = eval("recipe.measure" + i)
          }
          var makeIngredients = [];
          for (var j = 0; j < ingredients.length; j++) {
              var item1 = ingredients[j];
              var item2 = measurements[j];
              makeIngredients.push(<div className = "mainIngredientText"><img className = "ingredientBullet" src = "../images/ingredientIcon.png" alt = "bulletpoint"/><div className = "measurementText">{item2}</div><div className = "ingredientText">{item1}  </div></div>);
          }
          return (
              <div className = "contentContainer">
                <SpringScrollbars>
                <div className = "spatulaContainer">
                    <img className = "spatula" alt="SpatulaImg" src = "/images/spatulaImage.png"/>
                </div>
            
                <div className = "recipeContainer">
                  <h1 className = "text-center">{recipe.mealName}</h1>
                  <div className = "divider"></div>
                  <div className = "photoHolder">
                    <img className = "recipeImage" alt="recipeImage" src = {`${recipe.mealThumbnail}`}/>
                  </div>
                  <div className = "stepsContainer">
                    <h2 className = "recipeText">Ingredients</h2>
                    <div className = "ingredientContainerShow">
                      {makeIngredients}
                    </div>
                    <h2 className = "recipeText">Instructions</h2>
                    <p className = "instructionsText">{recipe.Instructions}</p>
                  </div>
                  <div className = "widgetContainer">
                    <img className = "widgetImage" alt = "category" src = "../images/categoryIcon.png"/>
                    <span>
                      <h2 className = "widgetText">{category}</h2>
                    </span>
                  </div>
                  <div className = "widgetContainer">
                    <img className = "widgetImage" alt = "type" src = "../images/typeIcon.png"/>
                    <span>
                      <h2 className = "widgetText">{type}</h2>
                    </span>
                  </div>
                  <div className = "widgetContainer">
                    <img className = "widgetImage" alt = "region" src = "../images/regionIcon.png"/>
                    <span>
                      <h2 className = "widgetText">{region}</h2>
                    </span>
                  </div>
                  <div className = "widgetContainer">
                    <img className = "widgetImage" alt = "region" src = "../images/tagIcon.png"/>
                    <span>
                      <h2 className = "widgetText">{tags}</h2>
                    </span>
                  </div>
                  <div className = "widgetContainer">
                    <NavLink to={`/edit/${recipe.idMeal}`} className = "text-center editRecipe">Edit Recipe</NavLink>
                  </div>
                  <div className = "widgetContainer">
                    <div className = "text-center deleteRecipe" onClick={this.deleteRecipe}>Delete Recipe</div>
                  </div>
                </div>
                </SpringScrollbars>
              </div>
            
          );
        }
      }
     
    }
  }
}

export default Recipe;
