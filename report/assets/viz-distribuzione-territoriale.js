
// Static coordinates for Italian cities present in the dataset
const cityCoordinates = {
    "Adria": [45.0500, 12.0500],
    "Alessandria": [44.9133, 8.6147],
    "Ancona": [43.6000, 13.5167],
    "Aosta": [45.7372, 7.3206],
    "Avellino": [40.9167, 14.7833],
    "Bari": [41.1253, 16.8667],
    "Benevento": [41.1333, 14.7833],
    "Bergamo": [45.6950, 9.6700],
    "Bologna": [44.4949, 11.3426],
    "Bolzano": [46.5000, 11.3500],
    "Brescia": [45.5333, 10.2167],
    "Cagliari": [39.2167, 9.1167],
    "Caltanissetta": [37.4917, 14.0628],
    "Campobasso": [41.5575, 14.6597],
    "Carpi": [44.7833, 10.8833],
    "Carrara": [44.0833, 10.1000],
    "Castelfranco Veneto": [45.6667, 11.9333],
    "Catania": [37.5000, 15.0903],
    "Catanzaro": [38.9000, 16.6000],
    "Cesena": [44.1333, 12.2333],
    "Como": [45.8167, 9.0833],
    "Cosenza": [39.3000, 16.2500],
    "Cremona": [45.1333, 10.0333],
    "Cuneo": [44.3833, 7.5500],
    "Faenza": [44.2833, 11.8833],
    "Fermo": [43.1667, 13.7167],
    "Ferrara": [44.8333, 11.6167],
    "Fiesole": [43.8000, 11.2833],
    "Firenze": [43.7696, 11.2558],
    "Foggia": [41.4667, 15.5500],
    "Frosinone": [41.6333, 13.3500],
    "Gallarate": [45.6667, 8.7833],
    "Genova": [44.4072, 8.9340],
    "L'Aquila": [42.3540, 13.3970],
    "La Spezia": [44.1000, 9.8167],
    "Latina": [41.4667, 12.9000],
    "Lecce": [40.3500, 18.1667],
    "Livorno": [43.5500, 10.3167],
    "Lucca": [43.8333, 10.5000],
    "Macerata": [43.3000, 13.4500],
    "Mantova": [45.1500, 10.7833],
    "Matera": [40.6667, 16.6000],
    "Messina": [38.1933, 15.5525],
    "Milano": [45.4642, 9.1900],
    "Modena": [44.6500, 10.9167],
    "Monopoli": [40.9500, 17.3000],
    "Napoli": [40.8522, 14.2681],
    "Nocera Terinese": [39.0333, 16.1500],
    "Novara": [45.4500, 8.6167],
    "Padova": [45.4167, 11.8667],
    "Palermo": [38.1157, 13.3615],
    "Parma": [44.8000, 10.3333],
    "Pavia": [45.1833, 9.1667],
    "Perugia": [43.1167, 12.3833],
    "Pesaro": [43.9167, 12.9167],
    "Pescara": [42.4618, 14.2139],
    "Piacenza": [45.0500, 9.7000],
    "Pontedera": [43.6667, 10.6333],
    "Potenza": [40.6333, 15.8000],
    "Ravenna": [44.4167, 12.2000],
    "Reggio Calabria": [38.1144, 15.6500],
    "Reggio Emilia": [44.7000, 10.6333],
    "Ribera": [37.5000, 13.2667],
    "Rimini": [44.0500, 12.5667],
    "Roma": [41.9028, 12.4964],
    "Rovigo": [45.0667, 11.7833],
    "Saint Louis": [41.9028, 12.4964], // Assume Roma
    "Salerno": [40.6833, 14.7667],
    "Sanremo": [43.8167, 7.7833],
    "Sant'Agata Li Battiati": [37.5667, 15.0833],
    "Sassari": [40.7250, 8.5600],
    "Siena": [43.3183, 11.3314],
    "Siracusa": [37.0667, 15.2833],
    "Taranto": [40.4000, 17.2167],
    "Teramo": [42.6583, 13.7044],
    "Terni": [42.5667, 12.6500],
    "Torino": [45.0703, 7.6869],
    "Trapani": [38.0167, 12.5167],
    "Trento": [46.0667, 11.1167],
    "Trieste": [45.6333, 13.8000],
    "Udine": [46.0667, 13.2333],
    "Urbino": [43.7167, 12.6333],
    "Venezia": [45.4333, 12.3167],
    "Verona": [45.4333, 10.9833],
    "Vibo Valentia": [38.6667, 16.1000],
    "Vicenza": [45.5500, 11.5500],
    "Viterbo": [42.4167, 12.1000]
};

// Global variables
let allData = [];
let markerClusterGroup;
let currentRadius = 30;

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('../src/data/pna-istituzioni-afam.json');
        allData = await response.json();

        updateTotalCount(allData.length);
        initLeafletMap(allData);

    } catch (error) {
        console.error("Error loading data:", error);
    }
});

function updateTotalCount(count) {
    document.querySelectorAll('.total-institutions-count').forEach(el => {
        el.textContent = count;
    });
}

function applyFilters() {
    const filteredData = getFilteredData();
    updateTotalCount(filteredData.length);
    initLeafletMap(filteredData);
}

function getFilteredData() {
    const selectedStatuses = Array.from(document.querySelectorAll('.status-filter:checked')).map(cb => cb.value);
    const soloPrincipale = document.getElementById('checkPrincipale')?.checked;
    
    return allData.filter(d => {
        const matchesStatus = selectedStatuses.includes(d.status);
        const matchesSede = soloPrincipale ? d.sede === "Principale" : true;
        return matchesStatus && matchesSede;
    });
}

function initLeafletMap(data) {
    if (!window.map) {
        const map = L.map('map-container', {
            minZoom: 6,
            zoomControl: false
        }).setView([41.9028, 12.4964], 6);
        window.map = map;

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);
    }

    const map = window.map;

    if (markerClusterGroup) {
        map.removeLayer(markerClusterGroup);
    }

    markerClusterGroup = L.markerClusterGroup({
        maxClusterRadius: currentRadius,
        showCoverageOnHover: false,
        zoomToBoundsOnClick: true,
        spiderfyOnMaxZoom: true,
        singleMarkerMode: true,
        iconCreateFunction: function (cluster) {
            const childCount = cluster.getChildCount();

            if (childCount === 1) {
                const markers = cluster.getAllChildMarkers();
                const color = (markers.length > 0 && markers[0].options.fillColor) || "#999";
                return new L.DivIcon({
                    html: `<div style="background-color: ${color}; border: 2px solid white; border-radius: 50%; width: 14px; height: 14px; box-shadow: 0 0 0 2px rgba(0,0,0,0.1);"></div>`,
                    className: 'marker-cluster-single',
                    iconSize: new L.Point(14, 14)
                });
            }

            let c = ' marker-cluster-';
            if (childCount < 10) {
                c += 'small';
            } else if (childCount < 100) {
                c += 'medium';
            } else {
                c += 'large';
            }

            return new L.DivIcon({
                html: `<div><span>${childCount}</span></div>`,
                className: 'marker-cluster' + c,
                iconSize: new L.Point(40, 40)
            });
        }
    });

    data.forEach(item => {
        let lat, lon;

        if (item.lat && item.lng) {
            lat = item.lat;
            lon = item.lng;
        } else {
            let city = item.citta;
            if (city && city.includes('/')) city = city.split('/')[0].trim();

            const coords = cityCoordinates[city];
            if (coords) {
                lat = coords[0];
                lon = coords[1];
            }
        }

        if (lat && lon) {
            const color = getColorBySection(item.tipologia_istituto);

            const marker = L.circleMarker([lat, lon], {
                radius: 6,
                fillColor: color,
                color: "#fff",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            })
                .bindTooltip(`
                <div style="font-family: inherit;">
                    <strong>${item.istituto || item.name}</strong><br>
                    ${item.address ? `${item.address}<br>` : ''}
                    ${item.citta}<br>
                    <span style="font-size:0.9em; opacity:0.8">${item.status}</span>
                </div>
            `, {
                    direction: 'top',
                    className: 'custom-leaflet-tooltip'
                });

            markerClusterGroup.addLayer(marker);
        }
    });

    map.addLayer(markerClusterGroup);
}

function updateClusterRadius(radius) {
    currentRadius = parseInt(radius);
    document.getElementById('radius-value').innerText = radius + 'px';

    if (allData.length > 0) {
        initLeafletMap(getFilteredData());
    }
}

function getColorBySection(type) {
    return VIZ_CONFIG.getColorBySection(type);
}

// --- Global Controls ---
window.zoomIn = function () {
    if (window.map) window.map.zoomIn();
};

window.zoomOut = function () {
    if (window.map) window.map.zoomOut();
};

window.resetZoom = function () {
    if (window.map) window.map.setView([41.9028, 12.4964], 6);
};

window.recenter = function () {
    window.resetZoom();
};

window.toggleFullscreen = function () {
    const elem = document.querySelector(".fullscreen-container") || document.documentElement;
    const isFullscreen = !!document.fullscreenElement || elem.classList.contains('ios-fullscreen-fallback');

    if (!isFullscreen) {
        if (elem.requestFullscreen) {
            elem.style.backgroundColor = "#fff"; 
            elem.style.overflow = "auto";
            elem.requestFullscreen().then(() => {
                if (screen.orientation && screen.orientation.lock) {
                    screen.orientation.lock('landscape').catch(err => console.log("Orientation lock not supported or failed:", err));
                }
            }).catch(err => console.error(err));
        } else {
            // Fallback per iOS/iPhone
            elem.classList.add('ios-fullscreen-fallback');
            const btn = document.querySelector('button[onclick="toggleFullscreen()"]');
            if (btn) btn.innerHTML = '<i class="bi bi-fullscreen-exit"></i>';
            setTimeout(() => { if (window.recenter) window.recenter(); else if (window.resetZoom) window.resetZoom(); }, 200);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else {
            // Fallback per iOS/iPhone
            elem.classList.remove('ios-fullscreen-fallback');
            const btn = document.querySelector('button[onclick="toggleFullscreen()"]');
            if (btn) btn.innerHTML = '<i class="bi bi-arrows-fullscreen"></i>';
            setTimeout(() => { if (window.recenter) window.recenter(); else if (window.resetZoom) window.resetZoom(); }, 200);
        }
    }
};

document.addEventListener('fullscreenchange', () => {
    const elem = document.querySelector(".fullscreen-container");
    const btn = document.querySelector('button[onclick="toggleFullscreen()"]');
    if (document.fullscreenElement) {
        if (btn) btn.innerHTML = '<i class="bi bi-fullscreen-exit"></i>';
    } else {
        if (elem) {
            elem.style.backgroundColor = "";
            elem.style.overflow = "";
        }
        if (btn) btn.innerHTML = '<i class="bi bi-arrows-fullscreen"></i>';
        if (screen.orientation && screen.orientation.unlock) {
            screen.orientation.unlock();
        }
    }
    // Recenter after a small delay to allow for layout changes
    setTimeout(() => {
        if (window.recenter) window.recenter();
        else if (window.resetZoom) window.resetZoom();
    }, 200);
});

async function exportMapToSVG() {
    if (!allData || allData.length === 0) {
        alert("Nessun dato disponibile per l'esportazione.");
        return;
    }

    let italySVGContent = "";
    try {
        const response = await fetch('assets/italy.svg');
        italySVGContent = await response.text();
    } catch (e) {
        alert("Errore nel caricamento della mappa di base (italy.svg).");
        return;
    }

    const parser = new DOMParser();
    const italyDoc = parser.parseFromString(italySVGContent, "image/svg+xml");
    const italyPaths = italyDoc.querySelectorAll('path');
    const italySvgTag = italyDoc.querySelector('svg');
    const vWidth = parseFloat(italySvgTag.getAttribute('width')) || 610.30981;
    const vHeight = parseFloat(italySvgTag.getAttribute('height')) || 792.58575;

    const longWest = 6.624486;
    const longEast = 18.521301;
    const latNorth = 47.35;
    const latSouth = 35.75;

    function project(lat, lon) {
        const x = (lon - longWest) * (vWidth / (longEast - longWest));
        const y = (latNorth - lat) * (vHeight / (latNorth - latSouth));
        return { x, y };
    }

    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("width", vWidth);
    svg.setAttribute("height", vHeight);
    svg.setAttribute("viewBox", `0 0 ${vWidth} ${vHeight}`);
    svg.setAttribute("xmlns", svgNS);
    svg.style.backgroundColor = "#ffffff";

    const mapGroup = document.createElementNS(svgNS, "g");
    mapGroup.setAttribute("class", "italy-map");
    italyPaths.forEach(p => {
        const path = document.createElementNS(svgNS, "path");
        path.setAttribute("d", p.getAttribute('d'));
        path.setAttribute("fill", "#f0f0f0");
        path.setAttribute("stroke", "#dddddd");
        path.setAttribute("stroke-width", "0.5");
        mapGroup.appendChild(path);
    });
    svg.appendChild(mapGroup);

    const visibleElements = new Set();
    window.map.eachLayer(layer => {
        if (layer.getLatLng && (typeof layer.getChildCount === 'function' || (layer.options && layer.options.fillColor))) {
            visibleElements.add(layer);
        }
    });

    const markersGroup = document.createElementNS(svgNS, "g");
    svg.appendChild(markersGroup);

    visibleElements.forEach(el => {
        const latlng = (el.getLatLng && typeof el.getLatLng === 'function') ? el.getLatLng() : el._latlng;
        if (!latlng) return;

        const pos = project(latlng.lat, latlng.lng);
        const isCluster = typeof el.getChildCount === 'function';
        const count = isCluster ? el.getChildCount() : 1;

        if (count === 1) {
            let color = "#999";
            if (isCluster) {
                const markers = el.getAllChildMarkers();
                if (markers.length > 0 && markers[0].options && markers[0].options.fillColor) {
                    color = markers[0].options.fillColor;
                }
            } else if (el.options && el.options.fillColor) {
                color = el.options.fillColor;
            }

            const glow = document.createElementNS(svgNS, "circle");
            glow.setAttribute("cx", pos.x);
            glow.setAttribute("cy", pos.y);
            glow.setAttribute("r", 9);
            glow.setAttribute("fill", color);
            glow.setAttribute("fill-opacity", "0.2");
            markersGroup.appendChild(glow);

            const pin = document.createElementNS(svgNS, "circle");
            pin.setAttribute("cx", pos.x);
            pin.setAttribute("cy", pos.y);
            pin.setAttribute("r", 6);
            pin.setAttribute("fill", color);
            pin.setAttribute("stroke", "#ffffff");
            pin.setAttribute("stroke-width", "2");
            pin.setAttribute("fill-opacity", "1.0");
            markersGroup.appendChild(pin);

        } else {
            let color = "#333";

            const halo = document.createElementNS(svgNS, "circle");
            halo.setAttribute("cx", pos.x);
            halo.setAttribute("cy", pos.y);
            halo.setAttribute("r", 12);
            halo.setAttribute("fill", color);
            halo.setAttribute("fill-opacity", "0.2");
            markersGroup.appendChild(halo);

            const circle = document.createElementNS(svgNS, "circle");
            circle.setAttribute("cx", pos.x);
            circle.setAttribute("cy", pos.y);
            circle.setAttribute("r", 9);
            circle.setAttribute("fill", color);
            circle.setAttribute("fill-opacity", "0.95");
            circle.setAttribute("stroke", "#ffffff");
            circle.setAttribute("stroke-width", "2.0");
            markersGroup.appendChild(circle);

            const text = document.createElementNS(svgNS, "text");
            text.setAttribute("x", pos.x);
            text.setAttribute("y", pos.y + 3);
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("fill", "#ffffff");
            text.setAttribute("font-size", "9px");
            text.setAttribute("font-weight", "bold");
            text.setAttribute("font-family", "Arial, sans-serif");
            text.textContent = count;
            markersGroup.appendChild(text);
        }
    });

    const svgData = new XMLSerializer().serializeToString(svg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "mappa-afam-vettoriale.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
