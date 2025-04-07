

// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAAUzyCe6Wnh17Sfw-chrpzR5iG1RrYiII",
    authDomain: "caribedreams-6662a.firebaseapp.com",
    projectId: "caribedreams-6662a",
    storageBucket: "caribedreams-6662a.firebasestorage.app",
    messagingSenderId: "180975396780",
    appId: "1:180975396780:web:277e0c8536e53279e27c09"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const accounts = [];

document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector("#registerForm");
    if (!form) {
        console.error("No se encontró el formulario.");
        return;
    }

    form.addEventListener("submit", async function (e) {
        e.preventDefault();
        console.log("Previniendo el envío del formulario");

        const userData = CaptureDataForm();
        console.log("Datos capturados", userData);

        try {
            // Guardar los datos en Firestore
            const docRef = await addDoc(collection(db, "accounts"), userData);
            console.log("Documento escrito con ID: ", docRef.id);

            accounts.push(userData);
            form.reset();

            console.log("Formulario enviado con éxito y datos almacenados en Firebase");
        } catch (error) {
            console.error("Error al agregar el documento: ", error);
        }
    });
});

function CaptureDataForm() {
    const name = document.querySelector("[name='name']").value.trim();
    const email = document.querySelector("[name='email']").value.trim();
    const phone = document.querySelector("[name='phoneNumber']").value.trim();
    const password = document.querySelector("[name='password']").value.trim();

    return { name, email, phone, password };
}

console.log("El script se está ejecutando");
console.log(accounts);