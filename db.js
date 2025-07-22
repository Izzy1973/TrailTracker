// db.js
import { openDB } from 'https://unpkg.com/idb?module';

const DB_NAME = 'trail-tracker';
const DB_VERSION = 1;

export const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('hikes')) {
      const hikeStore = db.createObjectStore('hikes', { keyPath: 'id', autoIncrement: true });
      hikeStore.createIndex('byDate', 'date');
    }
    if (!db.objectStoreNames.contains('trails')) {
      const trailStore = db.createObjectStore('trails', { keyPath: 'id', autoIncrement: true });
      trailStore.createIndex('byName', 'trailName');
    }
  }
});

export async function saveHike(hike) {
  const db = await dbPromise;
  return db.add('hikes', hike);
}

export async function getHikes() {
  const db = await dbPromise;
  return db.getAll('hikes');
}

export async function saveTrail(trail) {
  const db = await dbPromise;
  return db.add('trails', trail);
}

export async function getTrails() {
  const db = await dbPromise;
  return db.getAll('trails');
}