import express from 'express';
import { MusicBrainzApi } from 'musicbrainz-api';

const app = express();

const mbAPI = new MusicBrainzApi({
    appName: "node_test",
    appVersion: "1.0.0",
    appContactInfo: "davinovo.valadao@gmail.com"
})



//procurar artista por ID
const artistID = async (artistID)=> {
        try {
            const artist = await mbAPI.lookup('artist', artistID)
            console.log(artist)
            return artist
        }catch(error){
            console.error("Erro encontrado: " + error)
            throw error
        }
    };

const getImageRelease = async(idReleaseGroup)=> {
    const response = `https://coverartarchive.org/release/${idReleaseGroup}/front`
    return response
}

//release inclui todos tipos de lançamento
const releaseSearchID = async (releaseID) => {
    try {
        const release = await mbAPI.lookup('release', releaseID)
        const imageURL = await getImageRelease(releaseID)
        release.imageURL = imageURL
        const recordings = await mbAPI.browse('recording', {release: releaseID})
        release.recordings = recordings
        return release
    } catch(error){
        console.error("Erro encontrado: " + error)
        throw error
    }
}

//recording inclui lançamentos apenas músicas
const recordingSearchID = async (recordingID) => {
    try {
        const recording = await mbAPI.lookup('recording', recordingID)
        return recording
    } catch(error){
        console.error("Erro encontrado: " + error)
        throw error
    }
}
//procura o artista pelo nome
const artistSearch = async(nameArtist)=> {
    try {
        const result = await mbAPI.search('artist', {query: nameArtist, limit: 10})
        return result
    }catch(error){
        console.error("Erro encontrado: " + error)
        throw error
    }
}
//função de procura ao recording
const recordingSearch = async(nameMusic)=> {
    try {
        const result = await mbAPI.search('recording', {query: nameMusic, limit: 10})
        var artistasRepetidos = new Set();
        const listaFiltrada = result.recordings.filter(recording => {
            const artistName = recording['artist-credit'][0].name;
            if(artistasRepetidos.has(artistName)){
                return false
            }else {
                artistasRepetidos.add(artistName)
                return true
            }
        })
        return listaFiltrada
    }catch(error){
        console.error("Erro encontrado: " + error)
        throw error
    }
}
//funcao de procura de releaseGroup
const releaseSearchAlbumEp = async(nameAlbum)=> {
    try {
        const result = await mbAPI.search('release', {query: nameAlbum})
        return result
    }catch(error){
        console.error("Erro encontrado: " + error)
        throw error
    }
}


//chama o artista pelo seu ID
app.route("/artistId/:id")
    .get(async (req, res)=> {
        const id = req.params.id
        try {
            const resultArtista = await artistID(id)
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
app.route("/idMusic/:id")
    .get(async (req, res)=> {
        const idRelease = req.params.id
        try{
            const resultSearch = await recordingSearchID(idRelease)
            res.status(200).json(resultSearch)
        }catch(error){
            res.status(500).json({error: "Ocorreu um erro ao buscar seu artista"})
        }
});
 
app.route("/idAlbum/:id")
    .get(async (req, res)=> {
        const idRelease = req.params.id
        try{
            const resultSearch = await releaseSearchID(idRelease)
            res.status(200).json(resultSearch)
        }catch(error){
            res.status(500).json({error: "Ocorreu um erro ao buscar seu artista"})
        }
    }); 

app.route("/home/searchMusic/:music")
    .get(async (req, res)=> {
        const  music  = req.params.music
        try{
            const resultSearch = await recordingSearch(music)
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
            const resultSearch = await releaseSearchAlbumEp(album)
            res.status(200).json(resultSearch)
        }catch(error){
            res.status(500).json({error: "Ocorreu um erro ao buscar seu artista"})
        }
    })    

export default app;
