const axios = require("axios")
const {Pokemon, Type} = require("../db")  


async function pokemon () {
    const pagina1=await axios.get('https://pokeapi.co/api/v2/pokemon')///peticion principal pagina 1
    const pagina2= await  axios.get( pagina1.data.next)//nos quedamos con la pagina 2 tambien
    const allpokemones= [].concat(pagina1.data.results,pagina2.data.results)///concatenamos la pagina 1 y 2 para quedarnos con nombre  y url de pokemones

    const Info=await Peticiones(allpokemones)//se la pasamos a la funcion que devuelve informacion de los pokemones
    const InfoPokemones=Info.map(i=>{
        return{
            id:i.id,
            name:i.forms[0].name,
            image:i.sprites.other.home.front_default,
            hp:i.stats[0].base_stat,
            attack:i.stats[1].base_stat,
            defense:i.stats[2].base_stat,
            speed:i.stats[5].base_stat,
            height:i.height,
            weight:i.weight,
            types:i.types.map(i=>i.type.name)
        }
    })
    const pokemonDB= await pokemonsDb()
    const Allpokemons = [].concat(pokemonDB, InfoPokemones)
    return Allpokemons
    }

const Peticiones= async(allpokemones)=>{//recibe un array de objetos con pokemones con name y url [{name:nombre,url:url},{name:nombre,url:url} etc...]
    const urls= allpokemones.map(i=>i.url)///nos quedamos con todas las urls
    const peticion =  urls.map( i=> axios.get(i))//por cada url hacemos una peticion y nos queda un array con promesas pendientes
    const Peticiongrande=await axios.all(peticion)//le pasamos todas las promesas a axios.all, y se resuelven con el await , dandonos la info que nesecitamos
    const peticionresuelta =Peticiongrande.map(i=>i.data)///Nos quedamos con la data que nos llega de la peticion , que son la info de los pokemones
     return peticionresuelta  ///retornamos la peticion  resuelta, con toda la info de pokemones listas para mapear
}
const idPokemon= async(id)=>{
    if(id.length > 3){
        const pokemonDb= await Pokemon.findByPk(id)
        return pokemonDb
    }else{
        const pokemon=await axios.get(`https://pokeapi.co/api/v2/pokemon/${id}`)
        const infoApi={
        id:pokemon.data.id,
        name:pokemon.data.forms[0].name,
        image:pokemon.data.sprites.other.home.front_default,
        hp:pokemon.data.stats[0].base_stat,
        attack:pokemon.data.stats[1].base_stat,
        defense:pokemon.data.stats[2].base_stat,
        speed:pokemon.data.stats[5].base_stat,
        height:pokemon.data.height,
        weight:pokemon.data.weight,
        types:pokemon.data.types.map(i=>i.type.name)
    }
    return infoApi
    }
}

const pokemonByName= async(name)=>{
    const pokemon = await axios.get(`https://pokeapi.co/api/v2/pokemon/${name}`)
    const infoApi={
        id:pokemon.data.id,
        name:pokemon.data.forms[0].name,
        image:pokemon.data.sprites.other.home.front_default,
        hp:pokemon.data.stats[0].base_stat,
        attack:pokemon.data.stats[1].base_stat,
        defense:pokemon.data.stats[2].base_stat,
        speed:pokemon.data.stats[5].base_stat,
        height:pokemon.data.height,
        weight:pokemon.data.weight,
        types:pokemon.data.types.map(i=>i.type.name)
    }
    return infoApi
}

const getTypes = async()=>{
    const existTypes= await Type.findAll()
    if(!existTypes.length){
    const types = await axios.get("https://pokeapi.co/api/v2/type")
    const typesName = types.data.results.map(i=>i.name)
    const typesDb = await TypesDb(typesName)
    return typesDb;}else{
        return existTypes;
    }
}
//--------------------------------------------------------------------
const pokemonsDb = async()=> {
    const pokemones= await Pokemon.findAll({include:Type})
    return pokemones
}

const TypesDb = async(types)=>{
    types.forEach(element => {
        Type.create({
            name:element
        })
    });
    const tipos = await Type.findAll({include: Pokemon})
    return tipos
}

const createPokemon = async(id, name, image, hp, attack, defense, speed, height, weight, types) =>{
    if(name && image && hp && attack && defense && types){
        const newPokemon = await Pokemon.create(
            {
                name, 
                image, 
                hp, 
                attack, 
                defense, 
                speed, 
                height, 
                weight, 
                types
            }
        )
        const typesdb = await Type.findAll({
            where:{name: types}
        })
        return newPokemon.addType(typesdb)
}
}

module.exports = {
    pokemon,
    idPokemon,
    pokemonByName,
    getTypes,
    createPokemon,
    pokemonsDb,
}