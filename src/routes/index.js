const { Router } = require('express');
const { pokemon, idPokemon, pokemonByName, getTypes, createPokemon } = require('./controllers');
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');


const router = Router();

router.get('/pokemons', async(req, res) => {
    const name = req.query.name
    try {
        const pokemon = await pokemonByName(name)
        res.send(pokemon)
    } catch (error) {
        res.status(404).send(error)
    }
})

router.get("/pokemons", async (req, res) =>{
    try {
        const allPokemons = await pokemon()
        res.send(allPokemons)
    } catch (error) {
        res.status(404).send("Error al cargar")
    }
})

router.get('/pokemons/:id',async(req,res)=>{
    try {
        const {id} =req.params
        const pokemon=await idPokemon(id)
    res.send(pokemon)
    } catch (error) {
        res.status(404).send(error)
    }
})

router.get('/types',async(req, res)=>{
    try {
        const types= await getTypes()
        res.send(types)
    } catch (error) {
        res.status(404).res.send(error)
    }
})

router.post('/pokemons', async(req, res)=>{
    try {
        const {id, name, image, hp, attack, defense, speed, height, weight, types}= req.body
        const createPoke = await createPokemon(id, name, image, hp, attack, defense, speed, height, weight, types)
        res.send(createPoke)
    } catch (error) {
        res.status(404).res.send(error)
    }
})

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);


module.exports = router;
