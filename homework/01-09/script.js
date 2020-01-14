function changeColor(color) {
    document.querySelector("h1").style.color = color;
}

document.querySelector("#clickToChangeColor").onclick = function() {
    changeColor("#6095d0");
}
