// main.js

// Sample data structure for listings
let listings = []; 
async function getDataFromAPI() {
	try {
        // Fetch data from API
		const response = await fetch('http://127.0.0.1:3000'); 
        if (!response.ok) throw new Error("Failed to fetch data");
        
		// Store fetched data in the listings array
        listings = await response.json();
        console.log("Fetched Listings:", listings);

		//e the UI with new data
        displayListings(listings.reverse());
    } catch (error) {
		console.error("Error:", error);
    }
}
getDataFromAPI();

async function addListingToAPI(newListing) {
    console.log(`$newListing`, newListing);
    try {
        const response = await fetch('http://127.0.0.1:3000/add', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newListing)
        });

        if (!response.ok) throw new Error("❌ ERROR IN SERVER");

        const result = await response.json();
        console.log("✅", result);
        getDataFromAPI();
    } catch (error) {
        console.error("❌ ERROR", error);
    }
}

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

// DOM Elements
const listingsContainer = document.getElementById('listings');
const addListingBtn = document.getElementById('addListingBtn');
const modal = document.getElementById('addListingModal');
const listingForm = document.getElementById('listingForm');
const themeToggle = document.getElementById('themeToggle');

// Event Listeners
addListingBtn.addEventListener('click', () => modal.style.display = 'block');
themeToggle.addEventListener('click', toggleTheme);
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

listingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addListing();
});

// Functions
function closeModal() {
    modal.style.display = 'none';
    listingForm.reset();
}

function checkCategory(category) {
    const categoryImages = {
        books: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500',
        tech: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500',
        clothing: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
        accessories: 'https://images.unsplash.com/3/www.madebyvadim.com.jpg?q=80&w=2082&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        services: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
    };
    return categoryImages[category.toLowerCase()]
    || 'https://images.unsplash.com/photo-1663465374413-83cba00bff6f?q=80&w=2080&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
}

function validateImage(url, fallbackUrl) {
    return new Promise((resolve) => {
        const img = new Image();
        img.src = url;

        img.onload = () => resolve(url);
        img.onerror = () => resolve(fallbackUrl); 
    });
}

function addListing() {
    const userImageUrl = document.getElementById('imageUrl').value;
    const fallbackImage = checkCategory(document.getElementById('listingCategory').value);

    validateImage(userImageUrl, fallbackImage).then((validImageUrl) => {
        const newListing = {
            title: document.getElementById('title').value,
            category: document.getElementById('listingCategory').value,
            price: parseFloat(document.getElementById('price').value),
            description: document.getElementById('description').value,
            imageUrl: validImageUrl, 
            intra: document.getElementById('intra').value
        };

        addListingToAPI(newListing);
        closeModal();
        displayListings(listings.reverse());
    }).catch(error => console.error("error", error));
}


function filterListings() {
    const searchTerm = document.getElementById('search').value.toLowerCase();
    const category = document.getElementById('category').value;

    const filtered = listings.filter(listing => {
        const matchesSearch = listing.title.toLowerCase().includes(searchTerm) ||
                            listing.description.toLowerCase().includes(searchTerm);
        const matchesCategory = category === '' || listing.category === category;
        return matchesSearch && matchesCategory;
    });

   displayListings(filtered)
}

function displayListings(listingsToShow) {
    listingsContainer.innerHTML = listingsToShow.map(listing => `
        <div class="listing-card">
            <img src="${listing.imageUrl}" alt="${listing.title}" class="listing-image">
            <div class="listing-details">
                <h3 class="listing-title">${listing.title}</h3>
                <p class="listing-price">${listing.price} MAD</p>
                <p class="listing-description">${listing.description}</p>
                <button onclick="contactSeller('${listing.intra}')" class="primary-btn" style="margin-bottom: 20px;">
                    See Seller's Profile 
                </button>
            </div>
        </div>
    `).join('');
}

function contactSeller(intra) {
    window.open(`https://profile.intra.42.fr/users/${intra}`);
}

// Initialize theme and listings
initTheme();
displayListings(listings.reverse);
