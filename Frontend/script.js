//Connecting to socket
const socket = io('http://localhost:3000/');

let page = 1;
let sorted = [];
let unsorted = [];
const main = document.getElementsByClassName('main');

const checkbox = document.querySelector('input[name=checkbox]');

//Checking if sorting turned on and passing data in which order it will be loaded
checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
        LoadContent(sorted);
    }
    else {
        LoadContent(unsorted);
    }
})

//Checking when to fetch new content
document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver(handleIntersect);
    observer.observe(document.querySelector(".load"));
});

//Sending request to server with page number, which will be fetched
function handleIntersect(entries) {
    if (entries[0].isIntersecting) {
        socket.emit('fetch', page);
        page++;
    }
}

function Sort(prop) {
    return function (a, b) {
        {
            return a[prop].localeCompare(b[prop]);
        }
    }
}

//Checking and loading new data to arrays
socket.on('picture', json => {
    json.map(pic => {
        unsorted.push(pic);
        sorted.push(pic);
    })
    sorted.sort(Sort('title'));
    if (checkbox.checked) {
        LoadContent(sorted);
    }
    else {
        LoadContent(unsorted);
    }
})

//Loading content to HTML
function LoadContent(data) {
    main[0].innerHTML = '';
    data.map(pic => {
        const container = document.createElement('div');
        const img = document.createElement('img');
        const title = document.createElement('h3');
        img.src = pic.photo;
        container.classList.add('container');
        container.id = pic.title;
        img.classList.add('picture');
        title.classList.add('title');
        container.append(img);
        title.innerText = pic.title;
        container.append(title);
        main[0].append(container);
    })
}