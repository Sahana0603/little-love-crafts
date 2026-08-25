// ===============================
// WHATSAPP ORDER
// ===============================
function orderNow(productName) {
    let message = "Hi, I want to order " + productName + " from Craftifyy 💕";
    let url = "https://wa.me/917892510154?text=" + encodeURIComponent(message);
    window.open(url, "_blank");
}


// ===============================
// IMAGE DATA
// ===============================
const images = {
    clock: ["p2.jpeg","p7.jpeg","p10.jpeg"],
    decor: ["p11.jpeg","p12.jpeg","p16.jpeg"],
    flower: ["p13.jpeg","p14.jpeg"],
    frames: ["p3.jpeg","p4.jpeg","p8.jpeg"],
    hamper: ["p1.jpeg","p5.jpeg","p6.jpeg","p9.jpeg","p15.jpeg"]
};


// ===============================
// OPEN GALLERY
// ===============================
function openGallery(folder) {

    const gallery = document.getElementById("gallery");
    const container = document.getElementById("galleryImages");

    container.innerHTML = "";

    if (!images[folder]) return;

    images[folder].forEach(file => {

        let img = document.createElement("img");
        img.src = "images/" + folder + "/" + file;

        img.onerror = function() {
            this.src = "images/logo.jpeg";
        };

        img.onclick = function () {
            orderNow(folder);
        };

        container.appendChild(img);
    });

    gallery.style.display = "block";
}


// ===============================
// CLOSE GALLERY
// ===============================
function closeGallery() {
    document.getElementById("gallery").style.display = "none";
}


// ===============================
// CLICK OUTSIDE CLOSE
// ===============================
window.onclick = function(event) {
    let gallery = document.getElementById("gallery");
    if (event.target === gallery) {
        closeGallery();
    }
};


// ===============================
// ESC CLOSE
// ===============================
document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
        closeGallery();
    }
});

// ===============================
// ADD REVIEW FUNCTION
// ===============================
function addReview() {
    let name = document.getElementById("name").value;
    let message = document.getElementById("message").value;

    if (name === "" || message === "") {
        alert("Please fill all fields");
        return;
    }

    let review = { name, message };

    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];
    reviews.push(review);

    localStorage.setItem("reviews", JSON.stringify(reviews));

    displayReviews();

    document.getElementById("name").value = "";
    document.getElementById("message").value = "";
}


// ===============================
// DISPLAY REVIEWS
// ===============================
function displayReviews() {
    let reviewList = document.getElementById("reviewList");

    let reviews = JSON.parse(localStorage.getItem("reviews")) || [];

    reviewList.innerHTML = "";

    reviews.forEach(r => {
        let div = document.createElement("div");
        div.className = "review-card";

        div.innerHTML = `
            <p>"${r.message}"</p>
            <h4>- ${r.name}</h4>
        `;

        reviewList.appendChild(div);
    });
}

// LOAD ON PAGE OPEN
if (window.location.pathname.includes("reviews.html")) {
    displayReviews();
}