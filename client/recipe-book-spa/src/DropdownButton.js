import React, { Component } from "react";
import "./css/addStyles.css"; 

class DropdownButton extends Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
        this.handleDropdown = this.handleDropdown.bind(this);
        this.onClick = this.onClick.bind(this);
        this.state = {
            categories: this.props.categories,
            dropdown: this.props.dropdown,
            dropdownContainer: this.props.dropdownContainer,
            imageId: this.props.imageId
        }
      }

      handleClick(event) {
        const id = event.target.id;
        var name = document.getElementById(id).innerHTML
        this.props.changeData(name)

      }

      onClick(event) {
        this.handleDropdown(event);
        this.handleClick(event);
        event.preventDefault()
     }

      handleDropdown(event) {
        if (this.props.isOpen === false)
        {
           this.props.toggleThisClass(true)
        }
        else
        {
            this.props.toggleThisClass(false)
        }
        
        this.props.toggleClass1(false)
        this.props.toggleClass2(false)
        event.preventDefault();
    }

    
  render() {
    let madeArr = Object.entries(this.props.categories)
    let category = madeArr.map(p=>
        <button id = {this.props.className + p[0]} name= {this.props.class + p[0]} className = "text-center dropdownButtons" onClick = {this.onClick} >{p[1]}</button>
    );
    if (this.props.isOpen === false)
    {
        return (
            <div id = {this.props.dropdownContainer} className = "dropdownContainer-closed">
                <button id = {this.props.mainButton} className = "text-center mainButton" onClick = {this.handleDropdown}>{this.props.mainText}
                    <img id = {this.props.imageId} className = "downArrow" src = "../images/dropdownIcon.png" alt = "dropdown"/>
                    <img className = "uploadImage" alt = "category" src = {this.props.image}/>
                </button>
                <div id = {this.props.dropdown} className = "dropdown-closed">
                    {category}
                </div>
            </div>
        );
    }
    else
    {
        return (
            <div id = {this.props.dropdownContainer} className = "dropdownContainer-open">
                <button id = {this.props.mainButton} className = "text-center mainButton" onClick = {this.handleDropdown}>{this.props.mainText}
                    <img id = {this.props.imageId} className = "downArrow downArrowRotate" src = "../images/dropdownIcon.png" alt = "dropdown"/>
                    <img className = "uploadImage" alt = "category" src = {this.props.image}/>
                </button>
                <div id = {this.props.dropdown} className = "dropdown-open">
                    {category}
                </div>
            </div>
        );
    }
  }
}
 
export default DropdownButton;