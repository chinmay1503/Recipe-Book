import React, { Component } from "react";
import { Animated, Easing } from 'react-native';
import {
  NavLink,
  HashRouter
} from "react-router-dom";
import RecipeApi from "./services/RecipeApi";
import "./css/searchStyles.css";
import DropdownButton from "./DropdownButton.js";
import SpringScrollbars from "./services/SpringScrollBar";
 
class SearchRecipe extends Component {
  constructor(props) {
    super(props);
    this.changeSearchCategory = this.changeSearchCategory.bind(this);
    this.changeSearchRegion = this.changeSearchRegion.bind(this);
    this.changeSearchType = this.changeSearchType.bind(this);
    this.cancelFilter = this.cancelFilter.bind(this);
    this.handleCancelFilter = this.handleCancelFilter.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
    this.startFilter = this.startFilter.bind(this);
    this.toggleSearchCategory = this.toggleSearchCategory.bind(this);
    this.toggleSearchRegion = this.toggleSearchRegion.bind(this);
    this.toggleSearchType = this.toggleSearchType.bind(this);
    this.state = {
      mealName: "",
      Instructions: "",
      mealThumbnail: "",
      Tags: "",
      Youtube: "",
      mainCategory: "Choose a Category",
      mainRegion: "Choose a Region",
      mainType: "Choose a Type",
      error: null,
      isLoaded: false,
      items: [],
      recipes: [],
      term: "",
      dropdownDiv: "dropdownDiv",
      stopFilter: "stopFilter",
      filterDiv: "filterDiv",   
      finishedFilter: "finishedFilter",
      clearFilter: "clearFilter",
      spinAnim: new Animated.Value(0),
      categoryOpen: false,
      regionOpen: false,
      typeOpen: false
    };
  }

  handleCancelFilter(event)
  {
    this.setState({
      dropdownDiv: "dropdownDiv",
      stopFilter: "stopFilter",
      filterDiv: "filterDiv",   
      finishedFilter: "finishedFilter",
      clearFilter: "clearFilter"
    });
    event.preventDefault();
  }

  cancelFilter(event)
  {
    this.setState({
      dropdownDiv: "dropdownDiv",
      stopFilter: "stopFilter",
      filterDiv: "filterDiv",   
      finishedFilter: "finishedFilter",
      clearFilter: "clearFilter",
      mainCategory: "Choose a Category",
      mainRegion: "Choose a Region",
      mainType: "Choose a Type",
      items: this.state.recipes
    });
    event.preventDefault();
  }

  toggleSearchCategory(newValue) {
    this.setState({ categoryOpen: newValue });
  }

  toggleSearchRegion(newValue) {
    this.setState({ regionOpen: newValue });
  }

  toggleSearchType(newValue) {
    this.setState({ typeOpen : newValue });
  }

  handleFilter(event)
  {
    this.setState({
      dropdownDiv: "dropdownDiv",
      stopFilter: "stopFilter",
      filterDiv: "filterDiv",   
      finishedFilter: "finishedFilter",
      clearFilter: "clearFilter"
    });
    const category = this.state.mainCategory
    const region = this.state.mainRegion
    const type = this.state.mainType
  
    let recipeArray = this.state.recipes.data.recipes
    var filteredArray = recipeArray
    if (category !== "Choose a Category")
    {
      filteredArray = filteredArray.filter(function(item) {
        return item.Category === category
      })
    }
    if (region !== "Choose a Region")
    {
      filteredArray = filteredArray.filter(function(item) {
        return item.Region === region
      })
    }
    if (type !== "Choose a Type")
    {
      filteredArray = filteredArray.filter(function(item) {
        return item.Type === type
      })
    }
    let filteredItems = {
      data: {
        recipes: filteredArray
      }
    }
    this.setState({items: filteredItems});
    event.preventDefault();
    
  }

  startFilter(event) 
  {
    this.setState({
      dropdownDiv: "dropdownDivActive",
      stopFilter: "stopFilterActive",
      filterDiv: "filterDivActive",   
      finishedFilter: "finishedFilterActive",
      clearFilter: "clearFilterActive"
    });
    event.preventDefault();
  }

  changeSearchCategory(newValue) {
    this.setState({ mainCategory: newValue });
  }

  changeSearchType(newValue) {
    this.setState({ mainType: newValue });
  }

  changeSearchRegion(newValue) {
    this.setState({ mainRegion: newValue });
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
    var keyword = this.props.match.params.recipeName;
    const searchString = "/api/searchRecipeByName/" + keyword
    RecipeApi.get(searchString).then(
      (result) => {
        const data = result.data;
        this.setState({
          isLoaded: true,
          items: data,
          term: keyword,
          recipes: data
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
    var { error, isLoaded, items } = this.state;
    if (error) {
      return <div className = "text-center errorMessage">Error: {error.message}</div>;
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
      let madeArr = Object.entries(items.data.recipes)
      var recipeIcons = <div className = "noRecipeContainer"><img className = "noRecipeIcon" src = "./images/logo.png" alt = "icon"/><div className = "text-center noRecipe">No Recipe Found.</div></div>
      
      if (this.state.items.data.recipes.length !== 0)
      {
        recipeIcons = madeArr.map((item) => (
          <NavLink to={`/recipe/${item[1].idMeal}`} className = "shadow recipeBox">
            <div className = "recipeImageHolder">
              <img className = "recipeSearchImage" alt = "recipe" src = {item[1].mealThumbnail}/>
            </div>
            <div className = "recipeSearchText">{item[1].mealName}</div>
          </NavLink>
        ));
      }

      return (
      <HashRouter>
        <div className = "contentContainer">
          <div className = {this.state.filterDiv}>
            <button onClick = {this.handleCancelFilter} className = {this.state.stopFilter}>
              <div className = "xLine1"></div>
              <div className = "xLine2"></div>
            </button>
            <div className = {this.state.dropdownDiv}>
              <DropdownButton isOpen = {this.state.categoryOpen} mainText = {this.state.mainCategory} toggleThisClass = {this.toggleSearchCategory.bind(this)} toggleClass1 = {this.toggleSearchRegion.bind(this)} toggleClass2 = {this.toggleSearchType.bind(this)} changeData={this.changeSearchCategory.bind(this)} id = "Category" className = {"category"} dropdown = {"categoryDropdown"} dropdownContainer = {"categoryDropdownContainer"} mainButton={"categoryMain"} categories = {["Choose a Category", "Appetizers", "Beverages", "Soups","Salads", "Vegetables","Main Dishes","Breads", "Rolls","Desserts", "Sides", "Miscellaneous"]} imageId = "categoryImage" image = {"../images/categoryIcon.png"}/>
            </div>
            <div className = {this.state.dropdownDiv}>
              <DropdownButton isOpen = {this.state.regionOpen} mainText = {this.state.mainRegion} toggleThisClass = {this.toggleSearchRegion.bind(this)} toggleClass1 = {this.toggleSearchCategory.bind(this)} toggleClass2 = {this.toggleSearchType.bind(this)} changeData={this.changeSearchRegion.bind(this)} id = "Region" className = {"region"} dropdown = {"regionDropdown"} dropdownContainer = {"regionDropdownContainer"} mainButton={"regionMain"} categories = {["Choose a Region", "Turkish","Italian","Chinese","Jamaican","Dutch","American","Tunisian","Spanish","Japanese","Canadian","Indian","Vietnamese","Portuguese","Moroccan","Unknown","Irish","French","Mexican","Thai","Malaysian","Kenyan","British","Egyptian","Greek","Polish","Russian"]} imageId = "regionImage" image = {"../images/regionIcon.png"}/>            
            </div>
            <div className = {this.state.dropdownDiv}>
              <DropdownButton isOpen = {this.state.typeOpen} mainText = {this.state.mainType} toggleThisClass = {this.toggleSearchType.bind(this)} toggleClass1 = {this.toggleSearchRegion.bind(this)} toggleClass2 = {this.toggleSearchCategory.bind(this)} changeData={this.changeSearchType.bind(this)} id = "Type" className = {"type"} dropdown = {"typeDropdown"} dropdownContainer = {"typeDropdownContainer"} mainButton={"typeMain"} categories = {["Choose a Type", "Vegetarian", "Non-Vegetarian"]} imageId = "typeImage" image = {"../images/typeIcon.png"}/>
            </div>
            <div className = {this.state.dropdownDiv}>
              <button className = {this.state.finishedFilter} onClick = {this.handleFilter}><img className = "filterIcon2" alt = "filter" src = "../images/filterIconWhite.png"/>Apply Filter</button>
            </div>
            <div className = {this.state.dropdownDiv}>
              <button className = {this.state.clearFilter} onClick = {this.cancelFilter}>Clear Filters</button>
            </div>
          </div>
          <SpringScrollbars>
          
          <div className = "spatulaContainer">
              <img className = "spatula" alt="SpatulaImg" src = "/images/spatulaImage.png"/>
          </div>
          <div className = "searchHeader">
            <h1 className = "searchHeaderText">Search Results for "{this.state.term}"</h1>
            <div className = "filters">
              <button className = "filterButton" onClick = {this.startFilter}>
                <img className = "filterIcon" alt = "filter" src = "../images/filterIcon.png"/>
                Filter
              </button>
            </div>
            <div className = "mainSearchContainer">
              {recipeIcons}
            </div>
          </div>
          </SpringScrollbars>
        </div>
        </HashRouter>

      );
    }
  }
}

export default SearchRecipe;
