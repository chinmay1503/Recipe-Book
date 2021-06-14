import React, { Component } from "react";
import { Animated, Easing } from 'react-native';
import {
  NavLink,
  HashRouter
} from "react-router-dom";
import SpringScrollbars from "./services/SpringScrollBar";
import RecipeApi from "./services/RecipeApi";

class Browse extends Component {
  constructor(props) {
    super(props);
    this.changeView = this.changeView.bind(this)
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      spinAnim: new Animated.Value(0),
      filterMessage: "Sort Z-A",
      gallery: 1,
      viewMessage: "Gallery View",
      imageSource: "./images/sortIcon.jpg"
    };
  }

  componentDidMount() {
    Animated.loop(
      Animated.timing(this.state.spinAnim, {
        toValue: 100,
        duration: 300000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
    RecipeApi.get("/api/listAllRecipeNames/1").then(
      (result) => {
        this.setState({
          isLoaded: true,
          items: result.data,
        });
      },
      (error) => {
        console.log(error)
        this.setState({
          isLoaded: true,
          error: error,
        });
      }
    );
  }

  changeView(event) {
    if (this.state.gallery === 1)
    {
      this.setState({
        gallery: 0,
        viewMessage: "List View"
      });
      event.preventDefault();
    }
    else
    {
      this.setState({
        gallery: 1,
        viewMessage: "Gallery View"
      });
      event.preventDefault();
    }
  }

  reverseList = (event) => {
    var recipeList = this.state.items.data.recipes;
    if (this.state.filterMessage === "Sort A-Z")
    {
      this.setState({
        imageSource: "./images/sortIcon.jpg",
        filterMessage: "Sort Z-A"
      });
    }
    else
    {
      this.setState({
        imageSource: "./images/sortIconUp.png",
        filterMessage: "Sort A-Z"
      });
    }
    recipeList.reverse();
    this.setState({
      items: {
        data: {
          recipes: recipeList,
        },
      },
    });
    event.preventDefault();
  };

  render() {
    const spin = this.state.spinAnim.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"],
    });
    const carrotStyle = {
      transform: [{ rotate: spin }],
      position: "absolute",
      top: "5vw",
      left: "5vw",
      right: "5vw",
      bottom: "5vw",
      height: "10vw",
      width: "10vw",
    };
    const { error, isLoaded, items } = this.state;
    if (error) {
      return <div class="text-center errorMessage">Error: {error.message}</div>;
    } else if (!isLoaded) {
      return (
        <div>
          <div className="loadingContainer">
            <img
              className="plate"
              src="../images/loadingIcon.png"
              alt="background"
            />
            <Animated.Image
              style={carrotStyle}
              source="../images/ingredientIcon3.png"
              alt="carrot"
            />
          </div>
          <h1 className="text-center loadingText">Awaiting Yumminess</h1>
        </div>
      );
    } else {
      const group = items.data.recipes.reduce((r, e) => {
        const key1 = e.mealName[0];
        if (key1 !== undefined) {
          var key = key1.toUpperCase();
          if (!r[key]) r[key] = [];
          r[key].push(e);
        }
        return r;
      }, {});
      if (this.state.gallery === 0)
      {
        return(
          <HashRouter>
            <div className="contentContainer">
            <SpringScrollbars>
              <div className="spatulaContainer">
                <img
                  className="spatula"
                  alt="SpatulaImg"
                  src="/images/spatulaImage.png"
                />
              </div>
              <div className="browseWidgetContainer">
                  <button className="text-center flipList" onClick={this.reverseList}>
                    <img className = "sortImage" src = {this.state.imageSource} alt = "sort"/>
                    {this.state.filterMessage}
                  </button>
                  <button className="text-center galleryView" onClick={this.changeView}>
                    <img className = "listImage" src = "./images/listIcon.png" alt = "list"/>
                    {this.state.viewMessage}
                  </button>
              </div>
              <div className="recipe-List">
                <div>
                  <h1> Browse All Recipes </h1>
                  <div className = "mainSearchContainer">

                    {Object.entries(this.state.items.data.recipes).map((item) => {
                      return (
                        <NavLink to={`/recipe/${item[1].idMeal}`} className = "shadow recipeBox">
                          <div className = "recipeImageHolder">
                            <img className = "recipeSearchImage" alt = "recipe" src = {item[1].mealThumbnail}/>
                          </div>
                          <div className = "recipeSearchText">{item[1].mealName}</div>
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              </div>
              </SpringScrollbars>
            </div>
          </HashRouter>
        );
      }
      else
      {
        return (
          <HashRouter>
            <div className="contentContainer">
            <SpringScrollbars>
              <div className="spatulaContainer">
                <img
                  className="spatula"
                  alt="SpatulaImg"
                  src="/images/spatulaImage.png"
                />
              </div>
              <div className="browseWidgetContainer">
                  <button className="text-center flipList" onClick={this.reverseList}>
                    <img className = "sortImage" src = {this.state.imageSource} alt = "sort"/> 
                    {this.state.filterMessage}
                  </button>
                  <button className="text-center galleryView" onClick={this.changeView}>
                    <img className = "galleryImage" src = "./images/galleryIcon.png" alt = "gallery"/>
                    {this.state.viewMessage}
                  </button>
              </div>
              <div className="recipe-List">
                <div>
                  <h1> Browse All Recipes </h1>
                  <div className = "recipeSection">
                    {Object.entries(group).map(([key, value], i) => {
                      return (
                        <div className="recipe-Block" key={i}>
                          <div className="recipe-key">
                            <strong>{key}</strong>
                          </div>
                          {value.map((item, j) => (
                            <div className="recipe-Name" key={j}>
                              <NavLink
                                to={`/recipe/${item.idMeal}`}
                                className="links"
                              >
                                {item.mealName}
                              </NavLink>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              </SpringScrollbars>
            </div>
          </HashRouter>
        );
      }
    }
  }
}

export default Browse;
