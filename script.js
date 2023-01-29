const imageContainer = document.querySelector("#image-container");
const loader = document.querySelector("#loader");

let photosArr = [];

// Unsplash API
const count = 30;
const apiKey = "";
const apiUrl = `https://api.unsplash.com/photos/random?count=${count}&client_id=${apiKey}`;

// Observer options
const observerOptions = {
    rootMargin: "-1000px 0px 0px 0px",
};

// Setup observer to retrieve more photos
const observer = new IntersectionObserver((entries, observer) => {
    if (entries[0].isIntersecting) {
        observer.unobserve(entries[0].target);
        getPhotos();
    }
}, observerOptions);

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

    photosArr.forEach((photo, idx) => {
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

        // Observe last image created
        if (idx === count - 1) {
            image.onload = () => observer.observe(image);
            loader.hidden = true;
        }

        item.append(image);
        imageContainer.append(item);
    });
}

// Get photos from Unsplash
async function getPhotos() {
    try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
            const apiErrors = await response.json();
            const errors = new Error(`Could not fetch images: status ${response.status}`);
            errors.errors = apiErrors.errors;
            throw errors;
        }
        photosArr = await response.json();
        displayImages();
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
            console.error(...err.errors);
        }
        const errorEl = document.createElement("h2");
        errorEl.textContent = "Unable to load images";
        imageContainer.append(errorEl);
        loader.hidden = true;
    }
}

getPhotos();
