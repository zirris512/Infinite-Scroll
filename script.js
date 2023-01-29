const imageContainer = document.querySelector("#image-container");
const loader = document.querySelector("#loader");

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let photosArr = [];

// Unsplash API
const count = 30;
const apiKey = "";
const apiUrl = `https://api.unsplash.com/photos/random?count=${count}&client_id=${apiKey}`;

// Check if images were loaded
function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
    }
}
// Helper function to set attributes
function setAttributes(el, attrs) {
    for (const key in attrs) {
        el[key] = attrs[key];
    }
}
// Display images on page
function displayImages() {
    totalImages = photosArr.length;
    imagesLoaded = 0;

    photosArr.forEach((photo) => {
        const item = document.createElement("a");
        setAttributes(item, {
            href: photo.links.html,
            target: "_blank",
        });

        const image = document.createElement("img");
        setAttributes(image, {
            src: photo.urls.regular,
            alt: photo.alt_description,
            title: photo.alt_description,
        });

        image.addEventListener("load", imageLoaded);

        item.append(image);
        imageContainer.append(item);
    });
}

// Get photos from Unsplash
async function getPhotos() {
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            const error = new Error(`Could not fetch images: ${response.status}`);
            error.errors = response.errors;
            throw error;
        }
        photosArr = await response.json();
        displayImages();
    } catch (err) {
        if (err instanceof Error) {
            console.error(
                err.message,
                err.errors.map((errorMsg) => `${errorMsg}, `)
            );
        }
    }
}

// Check if scrolling near the bottom, Load more photos
window.addEventListener("scroll", (e) => {
    if (innerHeight + scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        getPhotos();
    }
});

getPhotos();
