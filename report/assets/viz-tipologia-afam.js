
// Global variables
let allData = [];

document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('data/pna-istituzioni-afam.json');
        allData = await response.json();

        applyFilters();

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
    const soloPrincipale = document.getElementById('checkPrincipale')?.checked;

    const filteredData = allData.filter(d => {
        return soloPrincipale ? d.sede === "Principale" : true;
    });

    updateTotalCount(filteredData.length);

    // Clear existing chart
    d3.select("#bubble-chart").html("");
    initBubbleChart(filteredData);
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

    const pack = d3.pack()
        .size([width, height])
        .padding(3);

    const root = d3.hierarchy(rootData)
        .sum(d => d.children ? 0 : 1)
        .sort((a, b) => b.value - a.value);

    pack(root);

    const svg = d3.select("#bubble-chart").append("svg")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("width", "100%")
        .attr("height", "100%")
        .attr("role", "application")
        .attr("aria-label", "Mappa a bolle delle tipologie di istituzioni AFAM")
        .style("font", "10px sans-serif")
        .attr("text-anchor", "middle")
        .style("cursor", "grab")
        .attr("tabindex", "0");

    const gMain = svg.append("g");

    const zoom = d3.zoom()
        .scaleExtent([1, 4])
        .on("zoom", (event) => {
            gMain.attr("transform", event.transform);
        });
    svg.call(zoom).on("wheel.zoom", null);
    document.getElementById("bubble-chart")._zoomInfo = { svg, zoom };

    const node = gMain.selectAll("g")
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
            return VIZ_CONFIG.getColorBySection(d.data.tipologia_istituto); // Leaf
        })
        .attr("stroke-width", d => d.depth === 1 ? 2 : 1)
        .attr("class", d => d.children ? "parent-node" : "node leaf")
        .attr("tabindex", d => d.children ? "-1" : "0")
        .attr("role", d => d.children ? null : "listitem")
        .attr("aria-label", d => {
            if (d.data.children) return null;
            return `${d.data.name}, ${d.data.group} (${d.data.status})`;
        });

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
        .text(d => `${d.data.name} (${d.value})`);

    // Labels for subgroups (Type) - only if large enough
    node.filter(d => d.depth === 2 && d.r > 30)
        .append("text")
        .attr("class", "group-label")
        .attr("dy", d => -d.r + 10)
        .style("font-size", "10px")
        .style("fill", "#666")
        .text(d => {
            const shortName = d.data.name.length > 20 ? d.data.name.substring(0, 20) + "..." : d.data.name;
            return `${shortName} (${d.value})`;
        });
}


function showTooltip(event, data) {
    const content = `
        <h6 class="fw-bold mb-1">${data.istituto || data.name}</h6>
        <div class="small mb-1">${data.citta}</div>
        <div class="small italic text-muted">${data.status}</div>
    `;
    const popover = bootstrap.Popover.getOrCreateInstance(event.currentTarget, {
        content: content,
        html: true,
        trigger: 'manual',
        placement: 'top',
        container: 'body',
        customClass: 'pna-popover'
    });
    popover.show();
}

function hideTooltip(event) {
    const popover = bootstrap.Popover.getInstance(event.currentTarget);
    if (popover) popover.hide();
}

window.zoomIn = function () {
    const info = document.getElementById("bubble-chart")?._zoomInfo;
    if (info) info.svg.transition().duration(300).call(info.zoom.scaleBy, 1.3);
};

window.zoomOut = function () {
    const info = document.getElementById("bubble-chart")?._zoomInfo;
    if (info) info.svg.transition().duration(300).call(info.zoom.scaleBy, 0.7);
};

window.resetZoom = function () {
    const info = document.getElementById("bubble-chart")?._zoomInfo;
    if (info) info.svg.transition().duration(750).call(info.zoom.transform, d3.zoomIdentity);
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
                    screen.orientation.lock('landscape').catch(err => console.log("Orientation lock not supported:", err));
                }
            }).catch(err => console.error(err));
        } else {
            // Fallback per iOS/iPhone
            elem.classList.add('ios-fullscreen-fallback');
            updateFullscreenButtons(true);
            setTimeout(() => { if (window.recenter) window.recenter(); else if (window.resetZoom) window.resetZoom(); }, 200);
        }
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else {
            // Fallback per iOS/iPhone
            elem.classList.remove('ios-fullscreen-fallback');
            updateFullscreenButtons(false);
            setTimeout(() => { if (window.recenter) window.recenter(); else if (window.resetZoom) window.resetZoom(); }, 200);
        }
    }
};

function updateFullscreenButtons(isFullscreen) {
    const buttons = document.querySelectorAll('button[onclick="toggleFullscreen()"]');
    buttons.forEach(btn => {
        const icon = btn.querySelector('i');
        const text = btn.querySelector('.btn-text');
        if (isFullscreen) {
            if (icon) icon.className = 'bi bi-fullscreen-exit';
            if (text) text.textContent = 'Esci';
        } else {
            if (icon) icon.className = 'bi bi-arrows-fullscreen';
            if (text) text.textContent = 'Fullscreen';
        }
    });
}

document.addEventListener('fullscreenchange', () => {
    const elem = document.querySelector(".fullscreen-container");
    const isFullscreen = !!document.fullscreenElement;

    updateFullscreenButtons(isFullscreen);
    
    if (!isFullscreen && elem) {
        elem.style.backgroundColor = "";
        elem.style.overflow = "";
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

window.exportVisualization = function () {
    const svgElement = document.querySelector("#bubble-chart svg");
    if (!svgElement) {
        alert("Errore: SVG non trovato.");
        return;
    }

    const clonedSvg = svgElement.cloneNode(true);
    const styleString = `
        text { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 10px; }
        .group-label.status-label { font-size: 14px; font-weight: bold; }
        .leaf text { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; }
    `;
    const styleElement = document.createElementNS("http://www.w3.org/2000/svg", "style");
    styleElement.textContent = styleString;
    clonedSvg.insertBefore(styleElement, clonedSvg.firstChild);

    // Reset view bounds just in case for export stability
    const info = document.getElementById("bubble-chart")?._zoomInfo;
    if (info) {
        clonedSvg.setAttribute("viewBox", `0 0 1200 900`);
    }

    const svgData = new XMLSerializer().serializeToString(clonedSvg);
    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "afam-bubble-chart.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};
