import axios from "axios";

// const url = 'http://localhost:5000';
const url = window.location.origin;

export default axios.create({
    baseURL: `${url}`
})