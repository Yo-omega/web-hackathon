

let listings = [
    {
        id: 1,
        title: "MacBook Pro 2019",
        category: "tech",
        price: 8000,
        description: "Excellent condition, 16GB RAM, 512GB SSD",
        imageUrl: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500",
        discord: "oayyoub"
    },
    {
        id: 2,
        title: "Algorithm Design Manual",
        category: "books",
        price: 200,
        description: "Like new condition, no highlights",
        imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500",
        discord: "adiri"
    }
];

const listingsContainer = document.getElementById('listings');
const addListingBtn = document.getElementById('addListingBtn');
const modal = document.getElementById('addListingModal');
const listingForm = document.getElementById('listingForm');


addListingBtn.addEventListener('click', () => modal.style.display = 'block');
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeModal();
    }
});

listingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addListing();
});


function closeModal() {
    modal.style.display = 'none';
    listingForm.reset();
}

function addListing() {
    const newListing = {
        id: listings.length + 1,
        title: document.getElementById('title').value,
        category: document.getElementById('listingCategory').value,
        price: parseFloat(document.getElementById('price').value),
        description: document.getElementById('description').value,
        imageUrl: document.getElementById('imageUrl').value || 'https://via.placeholder.com/300',
        discord: document.getElementById('discord').value
    };

    listings.unshift(newListing);
    closeModal();
    displayListings(listings);
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

    displayListings(filtered);
}

function displayListings(listingsToShow) {
    listingsContainer.innerHTML = listingsToShow.map(listing => `
        <div class="listing-card">
            <img src="${listing.imageUrl}" alt="${listing.title}" class="listing-image">
            <div class="listing-details">
                <h3 class="listing-title">${listing.title}</h3>
                <p class="listing-price">${listing.price} MAD</p>
                <p class="listing-description">${listing.description}</p>
                <button onclick="contactSeller('${listing.discord}')" class="primary-btn">
                    See Seller's Profile
                </button>
            </div>
        </div>
    `).join('');
}

function contactSeller(discord) {
    window.open(`https://profile.intra.42.fr/users/${discord}`);
}


displayListings(listings);
