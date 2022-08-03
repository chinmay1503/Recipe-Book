import React from "react";
import ReactDOM from "react-dom";
import Main from "./Main";
import "./css/styles.css";
import "./css/homeStyles.css";
import "./css/browseStyles.css";
import "./css/searchStyles.css";
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { faTwitter, faFontAwesome } from '@fortawesome/free-brands-svg-icons'

library.add(fas, faTwitter, faFontAwesome)
 
ReactDOM.render(
  <Main/>, 
  document.getElementById("root")
);