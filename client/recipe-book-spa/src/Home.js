import React, { Component } from "react";
import {
    NavLink,
    HashRouter,
    
} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'material-react-toastify';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

class Home extends Component {
    constructor(props) {
        super(props);
        this.setTerm = this.setTerm.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onMicrophoneClick = this.onMicrophoneClick.bind(this);
        this.state = {
          searchTerm: "",
          placeholder: "Search for a Recipe...",
          navClass: "navLink",
          recognition: null,
          dialogFlowAgent: null
        };
        
      }

    componentDidMount() {
        const dfMessenger = document.querySelector('df-messenger');
        if (dfMessenger) {
            this.setState({dialogFlowAgent: dfMessenger});
        }

        dfMessenger.addEventListener('df-response-received', function (event) {
            console.log(event);
            let intentName = event.detail.response.queryResult.intent.displayName;
            if (intentName === "GetNutritionalFactsIntent") {
                const payload = [
                    {
                      "type": "info",
                      "title": event.detail.response.queryResult.fulfillmentMessages[0].card.title,
                      "subtitle": event.detail.response.queryResult.fulfillmentMessages[0].card.subtitle
                    }];
                  dfMessenger.renderCustomCard(payload);
            } else if (intentName === "GetRecipeByIngredientIntent") {
                let ingredientName = event.detail.response.queryResult.parameters.food
                ingredientName = ingredientName.charAt(0).toUpperCase() + ingredientName.slice(1).toLowerCase()
                dfMessenger.renderCustomText('Here are some ' + ingredientName + ' recipe Suggestions:');
                handlePayloadRecipeSuggestionData(event)
            } else if (intentName === "GetRecipeByCuisineIntent") {
                let cuisineParam = event.detail.response.queryResult.parameters.Cuisine
                cuisineParam = cuisineParam.charAt(0).toUpperCase() + cuisineParam.slice(1).toLowerCase()
                dfMessenger.renderCustomText('Here are some ' + cuisineParam + ' recipe Suggestions:');
                handlePayloadRecipeSuggestionData(event)
            }
        });

        function handlePayloadRecipeSuggestionData(event) {
            const meals = event.detail.response.queryResult.fulfillmentMessages[0].payload.meals;
            let mealSize = meals.length > 10 ? 10 : meals.length;

            const payload = [];
            for (let i = 0; i < mealSize; i++) {
                let currMeal = meals[i];
                let mealName = currMeal.strMeal.replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
                let mealImg = currMeal.strMealThumb;
                payload.push({
                    "type": "list",
                    "title": mealName,
                    "image": {
                        "src": {
                          "rawUrl": mealImg
                        }
                    }
                  });
                
                  payload.push({
                    "type": "divider"
                  });
            }
            dfMessenger.renderCustomCard(payload);
        }

        dfMessenger.addEventListener('df-list-element-clicked', function (event) {
            const recipeSuggestion = event.detail.element.title_;
                this.setState({ searchTerm: recipeSuggestion });
                this.setState({navClass: "navLinkActive"});
                const searchBox = document.getElementById("searchBox");
                searchBox.value = recipeSuggestion;
        }.bind(this));

        const micBtn = document.getElementsByClassName("micButton")[0];
        const micIcon = micBtn.querySelector("svg");
        if (SpeechRecognition) {

            let recognition = new SpeechRecognition();
            this.setState({recognition : recognition});

            recognition.onstart = function() {
                console.log("Speech Recognition active");
                micIcon.classList.add("fa-beat-fade");
            }

            recognition.onend = function() {
                console.log("Speech Recognition stopped");
                micIcon.classList.remove("fa-beat-fade");
            }

            recognition.onerror = function() {
                console.log("Something went wrong while listening! Speech Recognition stopped");
            }

            recognition.addEventListener('result', function(event) {
                const transcript = event.results[0][0].transcript;
                this.setState({ searchTerm: transcript });
                this.setState({navClass: "navLinkActive"});
                const searchBox = document.getElementById("searchBox");
                searchBox.value = transcript;
              }.bind(this));
        } else {
            micBtn.remove();
            toast.dark("Sorry the browser doesn't support Speech Recognition!", {
                position: "top-right",
                autoClose: 3000,
                closeOnClick: true,
            });
        }
    }

    setTerm(event) {
        if (event.target.value !== "")
        {
            this.setState({navClass: "navLinkActive"});
        }
        else
        {
            this.setState({navClass: "navLink"});
        }
        this.setState({ searchTerm: event.target.value });
        event.preventDefault();
    }

    onKeyDown(event) 
    {
        if (event.key === 'Enter') 
        {
            
            if (this.state.searchTerm !== "")
            {
                document.getElementById("submit").click();
            }
            else
            {
                this.setState({placeholder: "Please enter a valid Recipe"});
            }
            
            event.stopPropagation();
            event.preventDefault();
        }
    }

    onClick(event) 
    {
        if (this.state.searchTerm === "")
        {
            this.setState({placeholder: "Please enter a valid Recipe"});
        }
    }
    
    onMicrophoneClick(event) 
    {
        if (this.state.recognition) {
            const micBtn = event.currentTarget;
            const micIcon = micBtn.querySelector("svg");

            if (!micIcon.classList.contains("fa-beat-fade")) {
                // Start Speech Recoginition
                this.state.recognition.start();
            } else {
                // Stop Speech Recoginition
                this.state.recognition.stop();
            }
        }
    }
    
    render(){
        return(
            <HashRouter>
                <div className = "contentContainer">
                <ToastContainer />
                    <div className = "spatulaContainer">
                        <img className = "spatula" alt="SpatulaImg" src = "/images/spatulaImage.png"/>
                    </div>
                    <div className="mainContainer">
                        <h1>Find a New Recipe </h1>
                        <div className = "containSearch">
                            <div className = "searchContainer">
                                <input id="searchBox" onKeyDown={this.onKeyDown} className = "searchBox shadow" type="text" onChange={this.setTerm} placeholder= {this.state.placeholder}/>
                                <button className = "micButton" type="button" onClick = {this.onMicrophoneClick}><FontAwesomeIcon icon="fas fa-microphone" /></button>
                                <button  className = "searchButton" onClick = {this.onClick}>
                                    <NavLink id = "submit" className = {this.state.navClass} to={`/search/${this.state.searchTerm}`}><img className = "searchIcon" alt="SearchIcon" src = "/images/searchIcon.png"/></NavLink> 
                                </button>                
                            </div>
                        </div>
                        <h1>OR</h1>
                        <div className = "uploadContainer">
                            <NavLink to="/add" className = "uploadRecipe"> Upload Your Own Recipe.</NavLink>
                        </div>
                    </div>
                        <df-messenger
                        chat-icon="https:\\recipe-book-online.herokuapp.com\images\logo.png"
                        intent="WELCOME"
                        chat-title="Recipe-Bot"
                        agent-id="d626b179-fb08-4a7b-8697-cc28513e5a3a"
                        language-code="en"
                        ></df-messenger>
                </div>
            </HashRouter>
        )
    }
}

export default Home;
