import { traduccionesEN } from './traducciones-en.js'
import { traduccionesES } from './traducciones-es.js'


let idiomaActual = 'en';
const elementosTraducibles = document.querySelectorAll('[data-i18n]');
const btnEnglish = document.getElementById('btn-english');
const btnSpanish = document.getElementById('btn-spanish');

function traducirAtributo(elemento, atributo, traducciones) {
  const claveCompleta = elemento.getAttribute('data-i18n');
  if (claveCompleta && claveCompleta.startsWith(`[${atributo}]`)) {
    const claveTraduccion = claveCompleta.substring(claveCompleta.indexOf(']') + 1);
    if (traducciones[claveTraduccion]) {
      elemento.setAttribute(atributo, traducciones[claveTraduccion]);
    }
  }
}

function cambiarIdioma(lang) {
  idiomaActual = lang;
  const traducciones = idiomaActual === 'en' ? traduccionesEN : traduccionesES;

  elementosTraducibles.forEach(elemento => {
    const claveCompleta = elemento.getAttribute('data-i18n');

    if (claveCompleta && !claveCompleta.startsWith('[')) {
      // Traducir textContent si no es un atributo
      if (traducciones[claveCompleta]) {
        elemento.textContent = traducciones[claveCompleta];
      }
    }

    // Traducir atributos específicos
    traducirAtributo(elemento, 'placeholder', traducciones);
    // Puedes agregar más llamadas a traducirAtributo para otros atributos (title, alt, etc.)
  });

  localStorage.setItem('idiomaSeleccionado', idiomaActual);
}

// Función para cargar el idioma guardado o el predeterminado al cargar la página
function cargarIdiomaInicial() {
    const idiomaGuardado = localStorage.getItem('idiomaSeleccionado');
    if (idiomaGuardado) {
      cambiarIdioma(idiomaGuardado);
    } else {
      cambiarIdioma(idiomaActual); // Cargar el idioma predeterminado
    }
  }
  // Llamar a la función para cargar el idioma inicial al cargar la página
cargarIdiomaInicial();

btnEnglish.addEventListener('click', () =>{cambiarIdioma('en')});
btnSpanish.addEventListener('click', () =>{cambiarIdioma('es')});