import { readFileSync, writeFileSync } from 'fs';
const FILE_PATH = './listings.json';
import express from 'express';
const app = express()
const PORT = 3000;

console.log("Hello World!");

app.get('/hello', (req, res) => {
	res.send('Hello Worlferfrd!')
})
  
  app.listen(PORT, () => {
	console.log(`Example app listening on port ${PORT}`)
  })

// Read database
const readDB = () => {
    const data = readFileSync(FILE_PATH, 'utf8');
    return JSON.parse(data);
};

// Write database
const writeDB = (data) => {
    writeFileSync(FILE_PATH, JSON.stringify(data, null, 2), 'utf8');
};

// Create a new listing
const addListing = (listing) => {
    const db = readDB();
    listing.id = db.length ? db[db.length - 1].id + 1 : 1; // Auto-increment ID
    db.push(listing);
    writeDB(db);
};

// Read all listings
const getAllListings = () => readDB();

// Read a single listing by ID
const getListingById = (id) => {
    const db = readDB();
    return db.find(listing => listing.id === id) || null;
};

// Update a listing
const updateListing = (id, newData) => {
    const db = readDB();
    const index = db.findIndex(listing => listing.id === id);
    if (index !== -1) {
        db[index] = { ...db[index], ...newData };
        writeDB(db);
        return true;
    }
    return false;
};

// Delete a listing
const deleteListing = (id) => {
    let db = readDB();
    const newDb = db.filter(listing => listing.id !== id);
    if (newDb.length !== db.length) {
        writeDB(newDb);
        return true;
    }
    return false;
};

// Example Usage in development environment
console.log("All Listings:", getAllListings());
// addListing({ title: "Gaming Chair", category: "furniture", price: 500, description: "Comfortable gaming chair", imageUrl: "https://images.unsplash.com/photo-1597670351082-4c255af69ab6?w=500", intra: "john_doe" });
console.log("After Adding:", getAllListings());
console.log("Get Listing with ID 1:", getListingById(1));
updateListing(1, { price: 7500 });
console.log("After Update:", getAllListings());
deleteListing(2);
console.log("After Deletion:", getAllListings());

export default { addListing, getAllListings, getListingById, updateListing, deleteListing };

