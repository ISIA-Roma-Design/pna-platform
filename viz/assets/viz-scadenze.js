console.log("Script starting...");

window.onerror = function (msg, url, lineNo, columnNo, error) {
    console.error("Global error:", msg, url, lineNo, columnNo, error);
    document.body.insertAdjacentHTML('afterbegin', `<div style="background:red;color:white;padding:10px">Global Error: ${msg}</div>`);
    return false;
};

if (typeof d3 === 'undefined') {
    console.error("D3 is not loaded!");
    document.body.insertAdjacentHTML('afterbegin', '<div style="background:red;color:white;padding:10px">CRITICAL: D3.js library failed to load.</div>');
} else {
    console.log("D3 loaded:", d3.version);
}

// Custom Swiss Palette
const swissColors = {
    "Interpretazione Musicale": "#77C424", // Dark Blue
    "Arti dello Spettacolo": "#C0281B", // Muted Red
    "Design": "#3378F6", // Teal
    "Arti Visive": "#0001F6" // Green
};
const getColor = (cat) => swissColors[cat] || "#999";

async function initTimelines() {
    try {
        // 1. Fetch Data
        // Determine path based on location
        const pathname = window.location.pathname;
        const subdirectories = ["/viz/", "/prototipo/", "/docs/", "/data/"];
        const isSubdirectory = subdirectories.some(subdir => pathname.includes(subdir));
        const basePrefix = isSubdirectory ? "../" : "./";

        const jsonPath = basePrefix + 'data/pna-scadenze.json';
        console.log("Fetching", jsonPath, "...");
        const response = await fetch(jsonPath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const text = await response.text();
        const data = JSON.parse(text);
        console.log("Data parsed:", data.length, "items");

        // 2. Process Data (Global)
        const parseDate = d3.timeParse("%Y-%m-%d");
        data.forEach(d => {
            if (d.date) {
                d.start = parseDate(d.date);
                d.end = d.start;
                d.type = 'point';
            } else if (d.start_date && d.end_date) {
                d.start = parseDate(d.start_date);
                d.end = parseDate(d.end_date);
                d.type = 'range';
            }
        });

        const validData = data.filter(d => d.start && !isNaN(d.start));

        if (validData.length === 0) {
            document.body.insertAdjacentHTML('beforeend', "<p>Nessun dato valido trovato.</p>");
            return;
        }

        // 3. Render Legend (Global)
        renderLegend(validData);

        // 4. Split and Render Timelines
        const data18 = validData.filter(d => d.edition === "XVIII");
        const data19 = validData.filter(d => d.edition === "XIX");

        // Calculate global min/max month across all data to ensure same interval
        const allDates = validData.flatMap(d => [d.start, d.type === 'range' ? d.end : d.start]);
        const globalMinMonth = d3.min(allDates, d => d.getMonth());
        const globalMaxMonth = d3.max(allDates, d => d.getMonth());

        // Add some padding (e.g. start 1 month earlier, end 1 month later)
        const startMonth = globalMinMonth;
        const endMonth = globalMaxMonth;

        console.log(`Global Time Range: Month ${startMonth} to ${endMonth}`);

        // Render 2025 first (XIX), then 2024 (XVIII)
        renderTimeline(data19, "#timeline-xix", 2025, startMonth, endMonth);
        renderTimeline(data18, "#timeline-xviii", 2024, startMonth, endMonth);

        // Initialize Table Data (Store globally for sorting)
        window.tableDataXIX = data19;
        window.tableDataXVIII = data18;

        renderTable(data19, "xix");
        renderTable(data18, "xviii");

    } catch (error) {
        console.error("Error initializing timelines:", error);
        document.body.insertAdjacentHTML('beforeend', `<p style="color:red">Errore: ${error.message}</p>`);
    }
}

function switchEdition(edition) {
    // Update Buttons
    document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active'); // Assumes click event

    // Toggle Containers
    if (edition === 'XIX') {
        document.getElementById('edition-xix').style.display = 'block';
        document.getElementById('edition-xviii').style.display = 'none';
    } else {
        document.getElementById('edition-xix').style.display = 'none';
        document.getElementById('edition-xviii').style.display = 'block';
    }
}

// Global Sort State
const sortState = {
    xix: { key: 'date', asc: true },
    xviii: { key: 'date', asc: true }
};

function sortTable(edition, key) {
    const data = edition === 'xix' ? window.tableDataXIX : window.tableDataXVIII;
    const sortStateItem = sortState[edition];

    // Toggle sort order if clicking same key
    if (sortStateItem.key === key) {
        sortStateItem.asc = !sortStateItem.asc;
    } else {
        sortStateItem.key = key;
        sortStateItem.asc = true; // Default to asc for new key
    }

    // Sort Data
    data.sort((a, b) => {
        let valA = a[key];
        let valB = b[key];

        // Handle dates
        if (key === 'date') {
            valA = a.start;
            valB = b.start;
        }

        if (valA < valB) return sortStateItem.asc ? -1 : 1;
        if (valA > valB) return sortStateItem.asc ? 1 : -1;
        return 0;
    });

    // Re-render
    renderTable(data, edition);
    updateSortIcons(edition, key, sortStateItem.asc);
}

function updateSortIcons(edition, activeKey, isAsc) {
    const headers = document.querySelectorAll(`#table-${edition} th`);
    headers.forEach(th => {
        // Reset text to just the label + arrow placeholder
        const text = th.innerText.split(' ')[0];
        th.innerHTML = `${text} &#8597;`;

        // Highlight active
        if (th.getAttribute('onclick').includes(`'${activeKey}'`)) {
            th.innerHTML = `${text} ${isAsc ? '&#8593;' : '&#8595;'}`;
        }
    });
}

function renderTable(data, edition) {
    const tbody = document.querySelector(`#table-${edition} tbody`);
    tbody.innerHTML = "";

    data.forEach(d => {
        const tr = document.createElement("tr");

        const dateStr = d.type === 'range'
            ? `${d.start.toLocaleDateString()} - ${d.end.toLocaleDateString()}`
            : d.start.toLocaleDateString();

        tr.innerHTML = `
            <td>${dateStr}</td>
            <td><span style="color:${getColor(d.category)}; font-weight:bold;">${d.category}</span></td>
            <td>${d.section}</td>
            <td>${d.institution}</td>
            <td>${d.event_type}</td>
            <td><small>${d.details}</small></td>
        `;
        tbody.appendChild(tr);
    });
}

function renderLegend(allData) {
    const legend = d3.select("#legend");
    legend.html("");
    const legendCategories = Array.from(new Set(allData.map(d => d.category))).sort();

    legendCategories.forEach(cat => {
        const item = legend.append("div").attr("class", "legend-item");
        item.append("div")
            .attr("class", "legend-color")
            .style("background-color", getColor(cat));
        item.append("span").text(cat);
    });
}


function renderTimeline(dataset, containerSelector, year, startMonth, endMonth) {
    const container = d3.select(containerSelector);
    if (container.empty()) {
        console.error("Container not found:", containerSelector);
        return;
    }
    container.html(""); // Clear

    if (dataset.length === 0) {
        container.html("<p style='padding:10px; color:#666'>Nessun evento per questa edizione.</p>");
        return;
    }

    // Group by Section
    const sections = Array.from(new Set(dataset.map(d => d.section))).sort((a, b) => {
        const catA = dataset.find(d => d.section === a).category;
        const catB = dataset.find(d => d.section === b).category;
        if (catA !== catB) return catA.localeCompare(catB);
        return a.localeCompare(b);
    });

    // Dimensions
    const margin = { top: 40, right: 30, bottom: 40, left: 250 };
    const width = 1200 - margin.left - margin.right;
    const rowHeight = 40;
    const height = (sections.length * rowHeight) + margin.top + margin.bottom;

    // SVG
    const svg = container.append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Scales - Fixed Interval for unified comparison
    // Use the passed year and the global start/end months
    const minDate = new Date(year, startMonth, 1);
    const maxDate = new Date(year, endMonth + 1, 0); // End of the max month

    // Extra padding for visuals
    const paddedMin = d3.timeMonth.offset(minDate, -0.5);
    const paddedMax = d3.timeMonth.offset(maxDate, 0.5);

    const x = d3.scaleTime()
        .domain([paddedMin, paddedMax])
        .range([0, width]);

    const y = d3.scaleBand()
        .domain(sections)
        .range([0, sections.length * rowHeight])
        .padding(0.2);

    // X Axis (Months Only)
    const formatMonth = d3.timeFormat("%B"); // Full month name

    const xAxisMonths = d3.axisTop(x)
        .ticks(d3.timeMonth.every(1))
        .tickFormat(d => {
            const m = formatMonth(d);
            return m.charAt(0).toUpperCase() + m.slice(1);
        })
        .tickSize(-height + margin.top + margin.bottom) // Full height grid lines for months
        .tickPadding(10);

    // Render Months Axis
    const gXMonths = svg.append("g")
        .attr("class", "x-axis-months")
        .call(xAxisMonths);

    // Style grid lines
    gXMonths.selectAll(".tick line")
        .attr("stroke", "#e0e0e0")
        .attr("stroke-dasharray", "0");

    gXMonths.select(".domain").remove();

    // Style Month Labels
    gXMonths.selectAll(".tick text")
        .attr("fill", "#333")
        .attr("font-weight", "bold")
        .attr("font-size", "12px")
        .attr("x", 15) // Shift slightly right to center in the month gap (approx)
        .attr("text-anchor", "start"); // Align start to put label within the month span range


    // Row Backgrounds
    const sectionToCategory = {};
    dataset.forEach(d => { sectionToCategory[d.section] = d.category; });

    svg.selectAll(".row-bg")
        .data(sections)
        .enter()
        .append("rect")
        .attr("class", "row-bg")
        .attr("x", 0)
        .attr("y", d => y(d))
        .attr("width", width)
        .attr("height", y.bandwidth())
        .attr("fill", d => getColor(sectionToCategory[d]))
        .attr("opacity", 0.05);

    // Y Axis Labels
    svg.append("g")
        .selectAll("text")
        .data(sections)
        .enter()
        .append("text")
        .attr("x", -20)
        .attr("y", d => y(d) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "end")
        .text(d => d)
        .style("font-weight", "600")
        .style("font-size", "13px")
        .style("fill", d => getColor(sectionToCategory[d]));

    // Tooltip Logic
    const tooltip = d3.select("#tooltip");
    const showTooltip = (event, d) => {
        const dateStr = d.type === 'range'
            ? `${d.start.toLocaleDateString()} - ${d.end.toLocaleDateString()}`
            : d.start.toLocaleDateString();

        tooltip.style("opacity", 1)
            .html(`
                 <h3>${d.section}</h3>
                 <strong>${d.institution}</strong><br>
                 <span style="color:#666; font-size:12px">${dateStr}</span><br>
                 <em>${d.event_type}</em><br>
                 <p style="margin-top:5px; border-top:1px solid #eee; padding-top:5px">${d.details}</p>
             `)
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 10) + "px");
    };
    const hideTooltip = () => tooltip.style("opacity", 0);

    // Draw Data - Ranges
    svg.selectAll(".range-bar")
        .data(dataset.filter(d => d.type === 'range'))
        .enter()
        .append("rect")
        .attr("class", "event-rect")
        .attr("x", d => x(d.start))
        .attr("y", d => y(d.section) + y.bandwidth() * 0.25)
        .attr("width", d => Math.max(x(d.end) - x(d.start), 6))
        .attr("height", y.bandwidth() * 0.5)
        .attr("rx", 3)
        .attr("fill", d => getColor(d.category))
        .attr("opacity", 0.8)
        .on("mouseover", showTooltip)
        .on("mousemove", showTooltip)
        .on("mouseleave", hideTooltip);

    // Draw Data - Points
    svg.selectAll(".point-circle")
        .data(dataset.filter(d => d.type === 'point'))
        .enter()
        .append("circle")
        .attr("class", "event-circle")
        .attr("cx", d => x(d.start))
        .attr("cy", d => y(d.section) + y.bandwidth() / 2)
        .attr("r", 6)
        .attr("fill", "#fff")
        .attr("stroke", d => getColor(d.category))
        .attr("stroke-width", 3)
        .on("mouseover", function (event, d) {
            d3.select(this).attr("r", 9);
            showTooltip(event, d);
        })
        .on("mousemove", showTooltip)
        .on("mouseleave", function () {
            d3.select(this).attr("r", 6);
            hideTooltip();
        });
}

initTimelines();
