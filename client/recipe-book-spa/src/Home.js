import React, { Component } from "react";
import {
    NavLink,
    HashRouter,
    
} from "react-router-dom";

class Home extends Component {
    constructor(props) {
        super(props);
        this.setTerm = this.setTerm.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onClick = this.onClick.bind(this);
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
    
    
    render(){
        return(
            <HashRouter>
                <div className = "contentContainer">
                    <div className = "spatulaContainer">
                        <img className = "spatula" alt="SpatulaImg" src = "/images/spatulaImage.png"/>
                    </div>
                    <div className="mainContainer">
                        <h1>Find a New Recipe</h1>
                        <div className = "containSearch">
                            <div className = "searchContainer">
                                <input onKeyDown={this.onKeyDown} className = "searchBox shadow" type="text" onChange={this.setTerm} placeholder= {this.state.placeholder}/>
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
