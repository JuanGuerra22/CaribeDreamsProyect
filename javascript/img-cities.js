const selectCity = document.getElementById('departamento');
const contMonteria = document.getElementById('cont-monteria');
const contCartagena = document.getElementById('cont-cartagena');
const contSincelejo = document.getElementById('cont-sincelejo');
const contSanAndres = document.getElementById('cont-san-andres');
const titleMonteria = document.getElementById('title-monteria');
const titleCartagena = document.getElementById('title-cartagena');
const titleSanAndres = document.getElementById('title-san-andres');
const titleSincelejo = document.getElementById('title-sincelejo');


function mostrarCiudad(){
    selectCity.addEventListener('change', ()=>{
        contMonteria.classList.remove('visible');
        contCartagena.classList.remove('visible');
        contSincelejo.classList.remove('visible');
        contSanAndres.classList.remove('visible');
        titleMonteria.classList.add('hidden');
        titleCartagena.classList.add('hidden');
        titleSincelejo.classList.add('hidden');
        titleSanAndres.classList.add('hidden');
        if(selectCity.value === "cordoba"){
            contMonteria.classList.add('visible');
            titleMonteria.classList.remove('hidden');
            contMonteria.scrollIntoView({ behavior: 'smooth' });
        } else if(selectCity.value === "bolivar"){
            contCartagena.classList.add('visible')
            titleCartagena.classList.remove('hidden')
            contCartagena.scrollIntoView({ behavior: 'smooth' });
        } else if(selectCity.value === "san-andres"){
            contSanAndres.classList.add('visible')
            titleSanAndres.classList.remove('hidden')
            contSanAndres.scrollIntoView({ behavior: 'smooth' });
        }else if(selectCity.value === "sucre"){
            contSincelejo.classList.add('visible')
            titleSincelejo.classList.remove('hidden')
            contSincelejo.scrollIntoView({ behavior: 'smooth' });
        }
    })
}

// mostrarCiudad();




const constServicios = document.getElementById('cont-services');
const selectDepart = document.getElementById('departamento');
const selectService = document.getElementById('servicios');
const contCordoba = document.querySelectorAll('.services-department');
const btnSearch = document.getElementById('btn-search-bar');
const enConstruccion = document.getElementById('cont-en-construccion');



function mostrarContenido(){
    const departamentos = selectDepart.value;
    const servicios = selectService.value;
    const idMostrar = `${departamentos}-${servicios}`;
    const contMostrar = document.getElementById(idMostrar);
    enConstruccion.innerHTML = '';
     // Oculta todos los contenedores de servicio
     contCordoba.forEach(contenedor => {
        contenedor.classList.remove('visible');
    });
     if(contMostrar){
        contMostrar.classList.add('visible');
        contMostrar.scrollIntoView({ behavior: 'smooth' });
    } else if(departamentos || servicios){
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


