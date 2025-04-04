//Buttons redirection
function OnClickButtonClass(className, link) {
    const buttons = document.querySelectorAll(`.${className}`);

    if (document.querySelector("header")) {
        if (!buttons.length) {
            console.error(`No class ${className} was found`);
            return;
        }
        else {
            buttons.forEach((button) => {
                button.addEventListener("click", function () {
                    RedirectTo(link);
                });
            });
        }
    }

}

function RedirectTo(link) {
    console.log(`Redirecting to: ${link}`);
    window.location.href = link;
}

try {
    OnClickButtonClass("redirectToLogIn", "login.html");
    OnClickButtonClass("redirectToIndex", "index.html");
    OnClickButtonClass("redirectToAbout", "about.html");
} catch {
    console.error("Error setting up button that redirects", error);
}

//register 
const accounts = [];

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#registerForm");
    if (!form) {
        console.error("no se encontró el formulario.");
        return;
    }


    form.addEventListener("submit", function (e) {
        e.preventDefault();
        console.log("Previniendo el envio del formulario");

        const userData = CaptureDataForm();
        console.log("Datos capturados", userData);

        accounts.push(userData);

        form.reset();

    });
});

function CaptureDataForm() {
    const name = document.querySelector("[name = 'name']").value.trim();
    const email = document.querySelector("[name = 'email']").value.trim();
    const phone = document.querySelector("[name = 'phoneNumber']").value.trim();
    const password = document.querySelector("[name = 'password']").value.trim();

    return { name, email, phone, password };
}


console.log("El script se está ejecutando");

console.log(accounts);
