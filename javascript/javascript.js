function OnClickButton(id, link){
    const button = document.getElementById(id);
    
    if (button){
    document.getElementById(id).addEventListener("click", function(){
        RedirectTo(link);
    })}

    else{
        throw new Error(`Button with id : ${id} not found`);
    }
}

function RedirectTo(link){    
    window.location.href = link;
}

function OnClickButtonClass(className, link){
    const buttons = document.querySelectorAll(`.${className}`);
    if (!buttons.length){
        throw new Error (`No class ${className} was found`);
    }
    else{
        buttons.forEach((button) => {
            button.addEventListener("click", function(){
            RedirectTo(link)
            });
        });
    }
    
}

function RedirectTo(link){
    console.log(`Redirecting to: ${link}`);
    window.location.href = link;
}




OnClickButtonClass("redirectToLogIn", "login.html")


console.log("writing");


let suma = 1;
let suma2 = 2;

let resultado = suma + suma2;
console.log(`El resultado de la suma es: ${resultado}`);
