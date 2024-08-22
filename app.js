import express, { response } from 'express';
import { MusicBrainzApi } from 'musicbrainz-api';
const app = express();

const mbAPI = new MusicBrainzApi({
    appName: "node_test",
    appVersion: "1.0.0",
    appContactInfo: "davinovo.valadao@gmail.com"
})


//procurar artista por ID
const artist = async (artistID)=> {
        try {
            const artist = await mbAPI.lookup('artist', artistID)
            console.log(artist)
            return artist
        }catch(error){
            console.error("Erro encontrado: " + error)
            throw error
        }
    }

const artistSearch = async(nameArtist)=> {
    try {
        const result = await mbAPI.search('artist', {query: nameArtist, limit: 1})
        return result
    }catch(error){
        console.error("Erro encontrado: " + error)
        throw error
    }
}

app.route("/home/:id")
    .get(async (req, res)=> {
        const id = req.params.id
        try {
            const resultArtista = await artist(id)
            res.status(200).json(resultArtista)
        }catch(error){
            res.status(500).json({error: "Ocorreu um erro ao buscar seu artista"})
        }
    });

app.route("/home/search/:artist")
    .get(async (req, res)=> {
        const artist = req.params.artist
        try{
            const resultSearch = await artistSearch(artist)
            res.status(200).json(resultSearch)
        }catch(error){
            res.status(500).json({error: "Ocorreu um erro ao buscar seu artista"})
        }
    })

export default app;