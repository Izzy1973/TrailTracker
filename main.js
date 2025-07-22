// main.js
import { saveHike, getHikes, getTrails } from './db.js';

let watchId = null;
let currentRoute = [];

const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const status = document.getElementById('status');
const hikeForm = document.getElementById('hikeForm');
const hikeNameInput = document.getElementById('hikeName');
const trailSelect = document.getElementById('trailSelect');
const saveHikeBtn = document.getElementById('saveHike');
const hikeList = document.getElementById('hikeList');

startBtn.addEventListener('click', () => {
  currentRoute = [];
  status.textContent = 'Tracking...';
  startBtn.disabled = true;
  stopBtn.disabled = false;
  watchId = navigator.geolocation.watchPosition(position => {
    const { latitude, longitude } = position.coords;
    currentRoute.push({ lat: latitude, lng: longitude, timestamp: Date.now() });
  }, err => {
    console.error(err);
  }, { enableHighAccuracy: true });
});

stopBtn.addEventListener('click', async () => {
  navigator.geolocation.clearWatch(watchId);
  status.textContent = `Tracked ${currentRoute.length} points.`;
  startBtn.disabled = false;
  stopBtn.disabled = true;
  hikeForm.hidden = false;
  await loadTrails();
});

saveHikeBtn.addEventListener('click', async () => {
  const name = hikeNameInput.value || 'Unnamed Hike';
  const associatedTrailId = trailSelect.value || null;
  const hike = {
    name,
    route: currentRoute,
    date: new Date().toISOString(),
    associatedTrailId
  };
  await saveHike(hike);
  hikeForm.hidden = true;
  hikeNameInput.value = '';
  status.textContent = 'Hike saved!';
  await renderHikeList();
});

async function renderHikeList() {
  const hikes = await getHikes();
  hikeList.innerHTML = '<h2>Saved Hikes</h2>';
  hikes.forEach(hike => {
    const el = document.createElement('div');
    el.textContent = `${hike.name} (${new Date(hike.date).toLocaleString()}) - ${hike.route.length} pts`;
    hikeList.appendChild(el);
  });
}

async function loadTrails() {
  const trails = await getTrails();
  trailSelect.innerHTML = '<option value="">-- None --</option>';
  trails.forEach(trail => {
    const opt = document.createElement('option');
    opt.value = trail.id;
    opt.textContent = trail.trailName;
    trailSelect.appendChild(opt);
  });
}

renderHikeList();