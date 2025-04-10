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

// const servicesCont = document.querySelectorAll('.services-cont')

// const selectService = document.getElementById('servicios');
// const titleCordHotel = document.getElementById('title-cord-hotel');
// const servicesCordoba = document.getElementById('serv-cordoba');
// const titleCordobaHotel = document.getElementById('title-cord-hotel');

// const btnSearch = document.getElementById('btn-search-bar');

// function mostrarServicio(){
//         titleCordobaHotel.classList.add('hidden');
//         servicesCordoba.classList.remove('visible');
//         if(selectService.value === 'accommodation'){
//             servicesCordoba.classList.add('visible');
//             titleCordobaHotel.classList.remove('hidden');
//             titleCordobaHotel.scrollIntoView({ behavior: 'smooth' });
//         }  
    
// }

// btnSearch.addEventListener('click', mostrarServicio)



const titleCordHotel = document.getElementById('title-cord-hotel');
const selectDepart = document.getElementById('departamento');
const selectService = document.getElementById('servicios');
const contServicios = document.querySelectorAll('.services-cont');
const btnSearch = document.getElementById('btn-search-bar');



function mostrarContenido(){
    const departamentos = selectDepart.value;
    const servicios = selectService.value;
    const idMostrar = `${departamentos}-${servicios}`;
    const contMostrar = document.getElementById(idMostrar);
    console.log(contMostrar)
     if(contMostrar){
        contMostrar.classList.add('visible')
        titleCordHotel.classList.remove('hidden')
        titleCordHotel.scrollIntoView({ behavior: 'smooth' });
    }
   
}
btnSearch.addEventListener('click', mostrarContenido)


