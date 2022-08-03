import React, { Component } from "react";
import {
    NavLink,
    HashRouter,
    
} from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ToastContainer, toast } from 'material-react-toastify';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
} else {
    toast.dark("Sorry the browser doesn't support Speech Recognition!", {
        position:"top-right",
        autoClose: 3000,
        closeOnClick: true
    });
}

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
          navClass: "navLink"
        };
        
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
        if (SpeechRecognition) {
            const micBtn = event.currentTarget;
            const micIcon = micBtn.querySelector("svg");

            if (!micIcon.classList.contains("fa-beat-fade")) {
                // Start Speech Recoginition
                recognition.start();
            } else {
                // Stop Speech Recoginition
                recognition.stop();
            }


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
                const searchBox = document.getElementById("searchBox");
                searchBox.value = transcript;
              }.bind(this));
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
                </div>
            </HashRouter>
        )
    }
}

export default Home;
