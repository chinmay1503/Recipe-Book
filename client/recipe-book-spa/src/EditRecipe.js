import React, { Component } from "react";
import "./css/addStyles.css";
import DropdownButton from "./DropdownButton.js";
import RecipeApi from "./services/RecipeApi";
import {Animated, Easing } from 'react-native';
import SpringScrollbars from "./services/SpringScrollBar";
import { ToastContainer, toast } from 'material-react-toastify';
import 'material-react-toastify/dist/ReactToastify.css';

class EditRecipe extends Component {
  constructor(props) {
    super(props);
    this.newIngredient = this.newIngredient.bind(this);
    this.submitData = this.submitData.bind(this);
    this.changeCategory = this.changeCategory.bind(this);
    this.changeRegion = this.changeRegion.bind(this);
    this.changeType = this.changeType.bind(this);
    this.toggleCategory = this.toggleCategory.bind(this);
    this.toggleRegion = this.toggleRegion.bind(this);
    this.toggleType = this.toggleType.bind(this);
    this.state = {
      mealName: "",
      Instructions: "",
      mealThumbnail: "",
      Tags: "",
      Youtube: "",
      mainCategory: "Choose a Category",
      mainRegion: "Choose a Region",
      mainType: "Choose a Type",
      id: "",
      spinAnim: new Animated.Value(0),
      categoryOpen: false,
      regionOpen: false,
      typeOpen: false,
      ingredientBlocks: [4],
      initialNumIngredients: 0,
      ingredients: {},
      measures: {},
      numIngredients: 4,
      finalBlocks: [],
      newIngredientButton: "newIngredient",
    };
  }


  ingredientsChangeHandler = (event) => {
    let nam = event.target.id;
    let val = event.target.value;
    var ingredientObj = this.state.ingredients
    ingredientObj[nam] = val
    this.setState({ingredients: ingredientObj})
  }

  measuresChangeHandler = (event) => {
    let nam = event.target.id;
    let val = event.target.value;
    var measuresObj = this.state.measures
    measuresObj[nam] = val
    this.setState({measures: measuresObj})
  }

  changeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  };

  changeCategory(newValue) {
    this.setState({ mainCategory: newValue });
  }

  changeType(newValue) {
    this.setState({ mainType: newValue });
  }

  changeRegion(newValue) {
    this.setState({ mainRegion: newValue });
  }

  toggleCategory(newValue) {
    this.setState({ categoryOpen: newValue });
  }

  toggleRegion(newValue) {
    this.setState({ regionOpen: newValue });
  }

  toggleType(newValue) {
    this.setState({ typeOpen : newValue });
  }

  newIngredient(event)
  {
    if (this.state.numIngredients <= 20)
    {
      const slides = this.state.ingredientBlocks.map((item) => {
        return (
          <div id = {`ingredientContainer${item}`} className = "ingredientContainer">
              <input id = {`ingredient${item}`} value = {this.state.ingredients[`ingredient"${item}`]} onChange={this.ingredientsChangeHandler} className = "text-center ingredientInput" placeholder = {`Ingredient ${item}`}></input>
              <span><input id = {`measure${item}`} value = {this.state.measures[`measure"${item}`]} onChange={this.measuresChangeHandler} className = "text-center measureInput" placeholder = "Measure/Units"></input></span>
          </div>
        );
      });
        
      const newNum = this.state.numIngredients + 1
      var newBlocks = this.state.finalBlocks
      newBlocks = newBlocks.concat(slides)
      this.setState({
      numIngredients: newNum,
      ingredientBlocks: [newNum],
      finalBlocks: newBlocks});
      if (this.state.numIngredients === 20)
      {
        this.setState({newIngredientButton: "newIngredientGone"})
      }
    } 
    event.preventDefault();
  }

  getIngredientsOrMeasure(recipeData, parentArray, fieldName) {
    for (var i = 1; i <= 20; i++) {
      const fullFieldName = fieldName + i;
      if (parentArray[fullFieldName] != null) 
      {
        // if ingredient value present add to recipe Object
        recipeData[fullFieldName] = parentArray[fullFieldName]
      } else 
      {
        // if no ingredient value present set as blank
        recipeData[fullFieldName] = "";
      }
    }
  }

  validateFields() {
    var isValid = true;
    var errMsg;
    var mealName = this.state.mealName ? this.state.mealName : "";
    var ingredient1 = this.state.ingredients["ingredient1"];
    var measure1 = this.state.measures["measure1"];
    var mealThumbnail = this.state.mealThumbnail ? this.state.mealThumbnail : "";
    var Instructions = this.state.Instructions ? this.state.Instructions : "";

    if (mealName === "") {
      isValid = false;
      errMsg = "Meal Name is mandatory"
    }

    if (isValid && ingredient1 === undefined) {
      isValid = false;
      errMsg = "Recipe should have at least one ingredient"
    }

    if (isValid && measure1 === undefined) {
      isValid = false;
      errMsg = "Ingredient should have some measure"
    }

    if (isValid && Instructions === "") {
      isValid = false;
      errMsg = "Recipe instructions are mandatory"
    }

    if (isValid && mealThumbnail === "") {
      isValid = false;
      errMsg = "Thumbnail URL is mandatory"
    }

    if (!isValid) {
      toast.dark(errMsg, {
        position:"top-right",
        autoClose: 3000,
        closeOnClick: true
      });
    }
    return isValid;
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
        let recipe = result.data.data.recipes[0]
        let finalTag = ""
        let newCategory = this.state.mainCategory
        let newRegion = this.state.mainRegion
        let newType = this.state.mainType
        if (recipe.Tags !== null)
        {
            finalTag = recipe.Tags.replaceAll(",",", ")
        }
        if (recipe.Category !== null)
        {
            newCategory = recipe.Category
        }
        if (recipe.Region !== null)
        {
            newRegion = recipe.Region
        }
        if (recipe.Type !== null)
        {
            newType = recipe.Type
        }

        var makeIngredients = [];
        var item1 =  eval("recipe.ingredient" + 1)
        var i = 1;
        while (item1 !== null && item1 !== "" && i <= 20) {
              const item2 =  eval("recipe.measure" + i)
              const ingredientId = ("ingredient" + i)
              const measureId = ("measure" + i)
              const divId = ("ingredientContainer" + i)
              makeIngredients.push(<div id = {divId} className = "ingredientContainer">
              <input id = {ingredientId} onChange={this.ingredientsChangeHandler} className = "text-center ingredientInput" defaultValue = {item1}></input>
              <span><input id = {measureId} onChange={this.measuresChangeHandler} className = "text-center measureInput" defaultValue = {item2}></input></span>
              </div>);
              var currIngredients = this.state.ingredients
              currIngredients[`ingredient${i}`] = item1
              var currMeasures = this.state.measures
              currMeasures[`measure${i}`] = item2

              this.setState ({
                ingredients: currIngredients,
                measures: currMeasures
              });
              i = i + 1;
              item1 =  eval("recipe.ingredient" + i)
        }
        const numInitial = i;
        this.setState({
            isLoaded: true,
            items: result.data,
            mealName: recipe.mealName,
            Instructions: recipe.Instructions,
            mealThumbnail: recipe.mealThumbnail,
            Tags: finalTag,
            Youtube: recipe.Youtube,
            mainCategory: newCategory,
            mainRegion: newRegion,
            mainType: newType,
            id: recipe.idMeal,
            numIngredients: numInitial,
            ingredientBlocks: [numInitial],
            finalBlocks: makeIngredients,
            initialNumIngredients: numInitial+1
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
  submitData = (event) => {
    event.preventDefault();
    if (this.validateFields())
    {
      var recipeData = {};
      recipeData.mealName = this.state.mealName ? this.state.mealName : "";
      this.getIngredientsOrMeasure(recipeData, this.state.ingredients, "ingredient");
      this.getIngredientsOrMeasure(recipeData, this.state.measures, "measure");
      recipeData.mealThumbnail = this.state.mealThumbnail ? this.state.mealThumbnail : "";
      recipeData.Instructions = this.state.Instructions ? this.state.Instructions : "";
      recipeData.Tags = this.state.Tags ? this.state.Tags : "";
      if (this.state.mainRegion === "Choose a Region")
      {
          recipeData.Region = ""
      }
      else
      {
          recipeData.Region = this.state.mainRegion
      }
      if (this.state.mainCategory === "Choose a Category")
      {
          recipeData.Category = ""
      }
      else
      {
          recipeData.Category = this.state.mainCategory
      }
      if (this.state.mainType === "Choose a Type")
      {
          recipeData.Type = ""
      }
      else
      {
          recipeData.Type = this.state.mainType
      }

      RecipeApi.put(`/api/updateRecipe/${this.state.id}`, recipeData).then((response) => {
          this.props.history.push(`/recipe/${this.state.id}`)
      });
    }
  };

  render() {

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
  
        </div>);
      } else {
          
        return (
        <div className = "contentContainer">
          <ToastContainer />
          <SpringScrollbars>
            <div className = "spatulaContainer">
                <img className = "spatula" alt="SpatulaImg" src = "/images/spatulaImage.png"/>
            </div>
            <div className = "mainAddRecipeContainer">
            <h1 className = "text-center">Edit Recipe.</h1>
            <form method="POST" onSubmit={this.submitData}>
                <input name = "mealName" onChange={this.changeHandler} className = "text-center mainInput" type="text" defaultValue={this.state.mealName}></input>
                {this.state.finalBlocks}
                <div id = "moreIngredients" className = "moreIngredients"></div>
                <button type="button" id = "newIngredientButton" className = {this.state.newIngredientButton} onClick={this.newIngredient}>+ Add Ingredient</button>
                <textarea name = "Instructions" onChange={this.changeHandler} className = "directionsInput" type = "text" defaultValue = {this.state.Instructions}></textarea>
                <div className = "mainInput">
                    <input name = "mealThumbnail" defaultValue={this.state.mealThumbnail} onChange={this.changeHandler} className = "text-center mainInput youtubeInput"></input>
                    <img className = "uploadImage" alt = "upload" src = "../images/photoIcon.png"/>
                </div>
                  <DropdownButton isOpen = {this.state.categoryOpen} mainText = {this.state.mainCategory} toggleThisClass = {this.toggleCategory.bind(this)} toggleClass1 = {this.toggleRegion.bind(this)} toggleClass2 = {this.toggleType.bind(this)} changeData={this.changeCategory.bind(this)} id = "Category" className = {"category"} dropdown = {"categoryDropdown"} dropdownContainer = {"categoryDropdownContainer"} mainButton={"categoryMain"} categories = {["Appetizers", "Beverages", "Soups","Salads", "Vegetables","Main Dishes","Breads", "Rolls","Desserts", "Sides", "Miscellaneous"]} imageId = "categoryImage" image = {"../images/categoryIcon.png"}/>
                  <DropdownButton isOpen = {this.state.regionOpen} mainText = {this.state.mainRegion} toggleThisClass = {this.toggleRegion.bind(this)} toggleClass1 = {this.toggleCategory.bind(this)} toggleClass2 = {this.toggleType.bind(this)} changeData={this.changeRegion.bind(this)} id = "Region" className = {"region"} dropdown = {"regionDropdown"} dropdownContainer = {"regionDropdownContainer"} mainButton={"regionMain"} categories = {["Turkish","Italian","Chinese","Jamaican","Dutch","American","Tunisian","Spanish","Japanese","Canadian","Indian","Vietnamese","Portuguese","Moroccan","Unknown","Irish","French","Mexican","Thai","Malaysian","Kenyan","British","Egyptian","Greek","Polish","Russian"]} imageId = "regionImage" image = {"../images/regionIcon.png"}/>
                  <DropdownButton isOpen = {this.state.typeOpen} mainText = {this.state.mainType} toggleThisClass = {this.toggleType.bind(this)} toggleClass1 = {this.toggleRegion.bind(this)} toggleClass2 = {this.toggleCategory.bind(this)} changeData={this.changeType.bind(this)} id = "Type" className = {"type"} dropdown = {"typeDropdown"} dropdownContainer = {"typeDropdownContainer"} mainButton={"typeMain"} categories = {["Vegetarian", "Non-Vegetarian"]} imageId = "typeImage" image = {"../images/typeIcon.png"}/>
                <div className = "mainInput">
                    <input name = "Tags" defaultValue={this.state.Tags} onChange={this.changeHandler} className = "mainInput tagsInput"></input>
                    <img className = "uploadImage" alt = "tags" src = "../images/tagIcon.png"/>
                </div>
                <div className = "mainInput">
                    <input name = "Youtube" defaultValue={this.state.Youtube} onChange={this.changeHandler} type = "url" className = "text-center mainInput youtubeInput"></input>
                    <img className = "uploadImage" alt = "video" src = "../images/videoIcon.png"/>
                </div>            
                <button id = "submitButton" className = "text-center submitButton" type="submit">Update Recipe</button>
            </form>
            </div>
            </SpringScrollbars>
        </div>
        );
      }
  }
}
 
export default EditRecipe;