import CellTypes from "./cellTypes";

export const load: (path: string) => string = (path) => {
    var xhttp = new XMLHttpRequest();
    xhttp.responseType = "text"
    xhttp.onreadystatechange = () => {
        console.log(xhttp.response);
    };
    xhttp.open("GET", "http://localhost:8080/mapFile.csv", true);
    xhttp.setRequestHeader("Access-Control-Allow-Origin", "localhost:8080");
    xhttp.setRequestHeader("Access-Control-Request-Method", "GET");
    xhttp.setRequestHeader("Origin", "http://localhost:3000");
    xhttp.send();
    return xhttp.response;
};