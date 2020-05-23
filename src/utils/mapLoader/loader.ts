import CellTypes from "./cellTypes";

export const load: (path: string) => string = (path) => {
    var xhttp = new XMLHttpRequest();
    xhttp.responseType = "document"
    xhttp.onreadystatechange = () => {
        console.log(xhttp.response);
    };
    xhttp.open("GET", "", true);
    xhttp.send();
    return xhttp.response;
};