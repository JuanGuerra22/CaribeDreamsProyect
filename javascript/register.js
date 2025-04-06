const accounts = [];

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#registerForm");
    if (!form) {
        console.error("no se encontró el formulario.");
        return;
    }


    form.addEventListener("submit", function (e) {
        e.preventDefault();
        console.log("Previniendo el envío del formulario");

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