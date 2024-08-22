import express, { response } from 'express';
import { MusicBrainzApi } from 'musicbrainz-api';
import { release } from 'os';
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
//procura o artista pelo nome
const artistSearch = async(nameArtist)=> {
    try {
        const result = await mbAPI.search('artist', {query: nameArtist, limit: 1})
        return result
    }catch(error){
        console.error("Erro encontrado: " + error)
        throw error
    }
}
//função de procura á música
const musicSearch = async(nameMusic)=> {
    try {
        const result = await mbAPI.search('release', {query: nameMusic, limit: 10})
        function filteredReleases(releases){
            const seen = new Map();
            for(const release of releases){
                const chave = `${release['artist-credit']}-${release['release-group']}`
                if(!seen.has(chave)){
                    seen.set(chave, release)
                    filteredReleases.push(release)
                }
            )
        }
        return filteredReleases
        
    }catch(error){
        console.error("Erro encontrado: " + error)
        throw error
    }
}
//funcao de procura de album
const albumSearch = async(nameAlbum)=> {
    try {
        const result = await mbAPI.search('release-group', {query: nameAlbum, limit: 1})
        return result
    }catch(error){
        console.error("Erro encontrado: " + error)
        throw error
    }
}

//chama o artista pelo seu ID
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
//chama o artista pelo nome 
app.route("/home/searchArtist/:artist")
    .get(async (req, res)=> {
        const artist = req.params.artist
        try{
            const resultSearch = await artistSearch(artist)
            res.status(200).json(resultSearch)
        }catch(error){
            res.status(500).json({error: "Ocorreu um erro ao buscar seu artista"})
        }
    });
//chama a música pelo nome
app.route("/home/searchMusic/:music")
    .get(async (req, res)=> {
        const music = req.params.music
        try{
            const resultSearch = await musicSearch(music)
            res.status(200).json(resultSearch)
        }catch(error){
            res.status(500).json({error: "Ocorreu um erro ao buscar seu artista"})
        }
    })

//procura de albuns    
app.route("/home/searchAlbum/:album")
    .get(async (req, res)=> {
        const album = req.params.album
        try{
            const resultSearch = await albumSearch(album)
            res.status(200).json(resultSearch)
        }catch(error){
            res.status(500).json({error: "Ocorreu um erro ao buscar seu artista"})
        }
    })    

export default app;
