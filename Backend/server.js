const Flickr = require('flickr-sdk');
const express = require('express');
const app = express();
const cors = require('cors');
const http = require('http').createServer(app);
const io = require('socket.io')(http);
require('dotenv').config();

const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions), (req, res) => {
    res.sendStatus(200);
})

//Checking for new connections
io.on('connection', async socket => {
    console.log('user has connected');
    const load = await Load();
    //Sending pictures to front end when user connects
    io.emit('picture', load);
    //Checking for requests when to send new pictures
    socket.on('fetch', async (page) => {
        const load = await Load(page);
        io.emit('picture', load);
    })
    socket.on('disconnect', () => {
        console.log('user has disconnected');
    })
})

//Getting data from Flickr API
async function Load(pageNumber) {
    const flickr = new Flickr(process.env.KEY, process.env.SECRET);
    let json = [];
    const pic = flickr.photos.search({
        tags: 'nature, night, town, dog, cat',
        safe_search: '1',
        page: pageNumber,
        per_page: '10'
    }).then(r => {
        //Creating image URL and adding in array with picture titles
        r.body.photos.photo.map(pic => {
            json.push({ photo: `https://farm${pic.farm}.staticflickr.com/${pic.server}/${pic.id}_${pic.secret}.jpg`, title: pic.title });
        });
        return json;
    }).catch(function (err) {
        console.error(err);
    });
    return pic;
}

http.listen(3000)