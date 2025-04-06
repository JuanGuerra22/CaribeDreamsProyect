const selectCity = document.getElementById('ciudad');
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
        if(selectCity.value === "monteria"){
            contMonteria.classList.add('visible');
            titleMonteria.classList.remove('hidden');
            contMonteria.scrollIntoView({ behavior: 'smooth' });
        } else if(selectCity.value === "cartagena"){
            contCartagena.classList.add('visible')
            titleCartagena.classList.remove('hidden')
            contCartagena.scrollIntoView({ behavior: 'smooth' });
        } else if(selectCity.value === "san-andres"){
            contSanAndres.classList.add('visible')
            titleSanAndres.classList.remove('hidden')
            contSanAndres.scrollIntoView({ behavior: 'smooth' });
        }else if(selectCity.value === "sincelejo"){
            contSincelejo.classList.add('visible')
            titleSincelejo.classList.remove('hidden')
            contSincelejo.scrollIntoView({ behavior: 'smooth' });
        }
    })
}

mostrarCiudad();