// const selectCity = document.getElementById('departamento');
// const contMonteria = document.getElementById('cont-monteria');
// const contCartagena = document.getElementById('cont-cartagena');
// const contSincelejo = document.getElementById('cont-sincelejo');
// const contSanAndres = document.getElementById('cont-san-andres');
// const titleMonteria = document.getElementById('title-monteria');
// const titleCartagena = document.getElementById('title-cartagena');
// const titleSanAndres = document.getElementById('title-san-andres');
// const titleSincelejo = document.getElementById('title-sincelejo');


// function mostrarCiudad(){
//     selectCity.addEventListener('change', ()=>{
//         contMonteria.classList.remove('visible');
//         contCartagena.classList.remove('visible');
//         contSincelejo.classList.remove('visible');
//         contSanAndres.classList.remove('visible');
//         titleMonteria.classList.add('hidden');
//         titleCartagena.classList.add('hidden');
//         titleSincelejo.classList.add('hidden');
//         titleSanAndres.classList.add('hidden');
//         if(selectCity.value === "cordoba"){
//             contMonteria.classList.add('visible');
//             titleMonteria.classList.remove('hidden');
//             contMonteria.scrollIntoView({ behavior: 'smooth' });
//         } else if(selectCity.value === "bolivar"){
//             contCartagena.classList.add('visible')
//             titleCartagena.classList.remove('hidden')
//             contCartagena.scrollIntoView({ behavior: 'smooth' });
//         } else if(selectCity.value === "san-andres"){
//             contSanAndres.classList.add('visible')
//             titleSanAndres.classList.remove('hidden')
//             contSanAndres.scrollIntoView({ behavior: 'smooth' });
//         }else if(selectCity.value === "sucre"){
//             contSincelejo.classList.add('visible')
//             titleSincelejo.classList.remove('hidden')
//             contSincelejo.scrollIntoView({ behavior: 'smooth' });
//         }
//     })
// }

// mostrarCiudad();




const constServicios = document.getElementById('cont-services');
const selectDepart = document.getElementById('departamento');
const selectService = document.getElementById('servicios');
const contDepartment = document.querySelectorAll('.services-department');
const btnSearch = document.getElementById('btn-search-bar');
const enConstruccion = document.getElementById('cont-en-construccion');



function mostrarContenido(){
    const departamentos = selectDepart.value;
    const servicios = selectService.value;
    const idMostrar = `${departamentos}-${servicios}`;
    const contMostrar = document.getElementById(idMostrar);
    enConstruccion.innerHTML = '';
     // Oculta todos los contenedores de servicio
     contDepartment.forEach(contenedor => {
        contenedor.classList.remove('visible');
    });
     if(contMostrar){
        contMostrar.classList.add('visible');
        
        contMostrar.scrollIntoView({ behavior: 'smooth' });
    } else if(departamentos && servicios){
        const divContenido = document.createElement('div');
        divContenido.classList.add('div-contenido');
        divContenido.innerHTML = `
            <img src="assets/images/enConstruccion.svg" alt="" class="img-enconstruccion">
            <h3>Lo sentimos, estamos trabajando para mejorar tu experiencia en nuestro sitio</h3>
        `;
        enConstruccion.appendChild(divContenido);
        divContenido.scrollIntoView({ behavior: 'smooth'});
    }   
}
btnSearch.addEventListener('click', mostrarContenido)






// mostrar y ocultar los servicios y eventos en el search bar

const searchServices  = document.getElementById('search-bar-services');
const searchEvents  = document.getElementById('search-bar-events');
const searchPosts = document.getElementById('search-bar-posts');
const sectioCarousel = document.getElementById('section-carousel');

const servicesBtn = document.getElementById('services-btn');
const eventsBtn = document.getElementById('events-btn');
const postsBtn = document.getElementById('posts-btn');

eventsBtn.addEventListener('click', ()=>{
    if(searchEvents){
        searchServices.classList.remove('visible');
        searchPosts.classList.remove('visible');
        searchEvents.classList.add('visible');
        sectioCarousel.classList.add('visible');
        constServicios.classList.add('hidden');
        sectioCarousel.scrollIntoView({ behavior: 'smooth'});
        eventsBtn.style.backgroundColor = '#000000ce';
        servicesBtn.style.backgroundColor = '#00000093';
        postsBtn.style.backgroundColor = '#00000093';
    }
});

servicesBtn.addEventListener('click', ()=>{
    if(searchServices){
        searchEvents.classList.remove('visible');
        searchPosts.classList.remove('visible');
        searchServices.classList.add('visible');
        sectioCarousel.classList.remove('visible');
        constServicios.classList.remove('hidden');
        constServicios.scrollIntoView({ behavior: 'smooth'});
        servicesBtn.style.backgroundColor = '#000000ce';
        eventsBtn.style.backgroundColor = '#00000093';
        postsBtn.style.backgroundColor = '#00000093';
    }
});

postsBtn.addEventListener('click', ()=>{
    if(searchPosts){
        searchPosts.classList.add('visible');
        searchServices.classList.remove('visible');
        searchEvents.classList.remove('visible');
        sectioCarousel.classList.remove('visible');
        constServicios.classList.add('hidden');
        postsBtn.style.backgroundColor = '#000000ce';
        eventsBtn.style.backgroundColor = '#00000093';
        servicesBtn.style.backgroundColor = '#00000093';
    }
});



// funcionalidad del carrucel de imagenes

const slides = document.querySelectorAll('.carousel-slide');
const prevButton = document.querySelector('.prev-button');
const nextButton = document.querySelector('.next-button');
let currentIndex = 0;
const intervalTime = 3000; 
let intervalId;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove('active');
    if (i === index) {
      slide.classList.add('active');
    }
  });
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  showSlide(currentIndex);
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  showSlide(currentIndex);
}

function startCarousel() {
  intervalId = setInterval(nextSlide, intervalTime);
}

function stopCarousel() {
  clearInterval(intervalId);
}

nextButton.addEventListener('click', () => {
  stopCarousel(); // Detener el cambio automático al interactuar
  nextSlide();
  startCarousel(); // Reiniciar el cambio automático después de la interacción
});

prevButton.addEventListener('click', () => {
  stopCarousel(); // Detener el cambio automático al interactuar
  prevSlide();
  startCarousel(); // Reiniciar el cambio automático después de la interacción
});

// Mostrar la primera imagen al cargar la página
showSlide(currentIndex);

// Iniciar el carrusel automáticamente
startCarousel();