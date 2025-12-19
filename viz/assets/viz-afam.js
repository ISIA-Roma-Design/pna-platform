
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

// SVG Map Calibration REMOVED because we are using Leaflet
// const SVG_WIDTH = 610.30981;
// const SVG_HEIGHT = 792.58575;


// Global variables
let allData = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('../data/pna-istituzioni-afam.json');
        allData = await response.json();

        // Init Map
        initLeafletMap(allData);

        // Pre-init chart (optional, or init on tab switch)

    } catch (error) {
        console.error("Error loading data:", error);
    }
});

function switchView(viewName) {
    const buttons = document.querySelectorAll('.view-btn');
    if (viewName === 'map') {
        buttons[0].classList.add('active');
        buttons[1].classList.remove('active');
    } else {
        buttons[0].classList.remove('active');
        buttons[1].classList.add('active');
    }

    document.getElementById('view-map').style.display = viewName === 'map' ? 'block' : 'none';
    document.getElementById('view-groups').style.display = viewName === 'groups' ? 'block' : 'none';

    if (viewName === 'map' && window.map) {
        // Invalidate size to ensure tiles load correctly if div was hidden
        setTimeout(() => {
            window.map.invalidateSize();
        }, 100);
    }

    if (viewName === 'groups') {
        const chartContainer = document.getElementById('bubble-chart');
        if (chartContainer.innerHTML === '') {
            initBubbleChart(allData);
        }
    }
}

function initLeafletMap(data) {
    // 1. Initialize Map
    // Center roughly on Italy
    const map = L.map('map-container', {
        minZoom: 1
    }).setView([41.9028, 12.4964], 6);
    window.map = map; // Save to global for invalidateSize

    // 2. Add Light Theme Tile Layer (CartoDB Positron No Labels)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    // 3. Add Markers
    data.forEach(item => {
        let lat, lon;

        // Use specific coordinates if available
        if (item.lat && item.lng) {
            lat = item.lat;
            lon = item.lng;
        } else {
            // Fallback to City Coordinates
            let city = item.citta;
            if (city && city.includes('/')) city = city.split('/')[0].trim();

            const coords = cityCoordinates[city];
            if (coords) {
                lat = coords[0];
                lon = coords[1];
            }
        }

        if (lat && lon) {
            const color = getColorByStatus(item.status);

            // Circle Marker
            L.circleMarker([lat, lon], {
                radius: 6,
                fillColor: color,
                color: "#fff",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            })
                .addTo(map)
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
        }
    });
}


function initBubbleChart(data) {
    const width = 1200;
    const height = 900;

    // Group by Status (Public/Private) THEN Type
    const groups = d3.group(data, d => d.status, d => d.tipologia_istituto);

    // Transform to hierarchy
    const rootData = {
        name: "AFAM",
        children: Array.from(groups, ([statusKey, typeMap]) => ({
            name: statusKey,
            children: Array.from(typeMap, ([typeKey, items]) => ({
                name: typeKey,
                children: items.map(v => ({ name: v.istituto, group: typeKey, status: statusKey, ...v }))
            }))
        }))
    };

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const pack = d3.pack()
        .size([width, height])
        .padding(3);

    const root = d3.hierarchy(rootData)
        .sum(d => 1)
        .sort((a, b) => b.value - a.value);

    pack(root);

    const svg = d3.select("#bubble-chart").append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("width", "100%")
        .attr("height", "100%")
        .style("font", "10px sans-serif")
        .attr("text-anchor", "middle");

    const node = svg.selectAll("g")
        .data(root.descendants())
        .join("g")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    // Circles
    node.append("circle")
        .attr("r", d => d.r)
        .attr("fill", d => {
            if (d.depth === 0) return "#fff"; // Root
            if (d.depth === 1) return "#f5f5f5"; // Status Group
            if (d.depth === 2) return "#e0e0e0"; // Type Group
            return getColorByStatus(d.data.status); // Leaf
        })
        .attr("stroke", d => d.children ? "#ccc" : "none")
        .attr("stroke-width", d => d.depth === 1 ? 2 : 1)
        .attr("class", d => d.children ? "parent-node" : "node leaf");

    // Tooltip logic for leaf nodes
    node.filter(d => !d.children)
        .on("mouseenter", (event, d) => showTooltip(event, d.data))
        .on("mouseleave", hideTooltip);

    // Labels for groups (Status)
    node.filter(d => d.depth === 1)
        .append("text")
        .attr("class", "group-label status-label")
        .attr("dy", d => -d.r + 15)
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text(d => d.data.name);

    // Labels for subgroups (Type) - only if large enough
    node.filter(d => d.depth === 2 && d.r > 30)
        .append("text")
        .attr("class", "group-label")
        .attr("dy", d => -d.r + 10)
        .style("font-size", "10px")
        .style("fill", "#666")
        .text(d => d.data.name.substring(0, 20) + (d.data.name.length > 20 ? "..." : ""));
}

function getColorByStatus(status) {
    if (!status) return "#999";
    if (status.includes("Statale") || status.includes("Pubblico")) return "#0f62fe"; // Carbon Blue 60
    return "#8a3ffc"; // Carbon Purple 60
}

function showTooltip(event, data) {
    const tooltip = d3.select("#tooltip");
    tooltip.style("opacity", 1)
        .html(`<h3>${data.istituto || data.name}</h3>
               <p>${data.citta}</p>
               <p><i>${data.status}</i></p>`)
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 10) + "px"); // Careful with SVG coords vs Page coords
}

function hideTooltip() {
    d3.select("#tooltip").style("opacity", 0);
}
