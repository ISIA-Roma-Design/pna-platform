
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("dendrogram-container");
    const tooltip = document.getElementById("tooltip");

    // Configuration
    const width = 1200;
    const duration = 500; // Transition duration
    const dx = 42; // Vertical spacing per node
    const dy = 420; // Increased spacing to accommodate horizontal segments

    let tree;
    let zoom;
    let gMain;
    function getNodeColor(d) {
        if (d.depth === 0) return "#000"; // Root
        if (d.depth === 1 || d.depth === 2) return "#333"; // Premio & Sezione
        return "#666"; // Sottosezione & Categorie
    }

    // Fetch Data
    fetch("../src/data/pna-sezioni.json")
        .then(response => response.json())
        .then(data => {
            const hierarchyData = buildHierarchy(data);
            initChart(hierarchyData, container);
        })
        .catch(error => console.error("Error loading data:", error));

    /**
     * Transforms flat JSON into a hierarchy:
     * Root -> Premio -> Sezione -> Sottosezione -> Categoria
     */
    function buildHierarchy(data) {
        const root = { name: "PNA", children: [] };

        data.forEach(item => {
            // Level 1: Premio
            let premioNode = root.children.find(d => d.name === item.premio);
            if (!premioNode) {
                premioNode = { name: item.premio, children: [] };
                root.children.push(premioNode);
            }

            // Level 2: Sezione
            let sezioneNode = premioNode.children.find(d => d.name === item.sezione);
            if (!sezioneNode) {
                sezioneNode = { name: item.sezione, children: [] };
                premioNode.children.push(sezioneNode);
            }

            // Level 3: Sottosezione
            let sottosezioneNode = sezioneNode.children.find(d => d.name === item.sottosezione);
            if (!sottosezioneNode) {
                sottosezioneNode = { name: item.sottosezione, children: [] };
                sezioneNode.children.push(sottosezioneNode);
            }

            // Level 4: Categoria (Leaf)
            if (item.categoria && item.categoria.trim() !== "") {
                sottosezioneNode.children.push({ name: item.categoria, value: 1, type: "category" });
            }
        });

        // Clean up empty children arrays if any
        function clean(node) {
            if (node.children) {
                if (node.children.length === 0) {
                    delete node.children;
                } else {
                    node.children.forEach(clean);
                }
            }
        }
        clean(root);
        return root;
    }

    function initChart(data, container) {
        root = d3.hierarchy(data);
        root.x0 = dx / 2;
        root.y0 = 0;

        // Initialize Tree Layout
        tree = d3.tree().nodeSize([dx, dy]);

        // Clear container
        container.innerHTML = "";

        // Setup SVG
        svg = d3.select(container)
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%")
            .style("font-family", "Helvetica Neue, sans-serif")
            .style("user-select", "none")
            .attr("cursor", "grab");

        // Initialize Zoom
        zoom = d3.zoom()
            .scaleExtent([0.1, 3])
            .on("zoom", (event) => {
                gMain.attr("transform", event.transform);
            });

        svg.call(zoom).on("wheel.zoom", null);

        gMain = svg.append("g");

        const g = gMain.append("g")
            .attr("transform", `translate(${dy / 3},${dx})`);

        gLink = g.append("g")
            .attr("fill", "none")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.4)
            .attr("stroke-width", 1.5);

        gNode = g.append("g")
            .attr("cursor", "pointer")
            .attr("pointer-events", "all");

        // Expand up to the 2nd degree (Depth 2 = Sezioni visible, Sottosezioni collapsed)
        root.descendants().forEach(d => {
            if (d.depth === 2 && d.children) {
                collapse(d);
            }
        });

        update(root);
        // Initial fit
        setTimeout(() => fitToView(), 300);
    }

    function update(source) {
        // Compute the new tree layout
        const nodes = root.descendants();
        const links = root.links();

        tree(root);

        let left = root;
        let right = root;
        root.eachBefore(node => {
            if (node.x < left.x) left = node;
            if (node.x > right.x) right = node;
        });

        const height = right.x - left.x + dx * 4;

        // svg height is 100%, no need to animate it here
        // No viewBox manipulation to avoid conflicts with d3.zoom
        const transition = d3.active(svg.node()) || d3.select(svg.node()).transition().duration(duration);

        // --- NODES ---
        const node = gNode.selectAll("g")
            .data(nodes, d => d.id || (d.id = Math.random())); // Assign unique ID if missing

        // Enter
        const nodeEnter = node.enter().append("g")
            .attr("transform", d => `translate(${source.y0},${source.x0})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0)
            .on("click", (event, d) => {
                // Toggle children
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else {
                    d.children = d._children;
                    d._children = null;
                }
                update(d);
            });

        // 1. Touch Target (Invisible Circle 44px)
        nodeEnter.append("circle")
            .attr("r", 22)
            .attr("fill", "transparent")
            .attr("stroke", "none");

        // 2. Visible Node Circle
        nodeEnter.append("circle")
            .attr("class", "visible-node")
            .attr("r", 5)
            .attr("fill", d => d._children ? getNodeColor(d) : "#fff")
            .attr("stroke", d => getNodeColor(d))
            .attr("stroke-width", 2);

        // 3. Text
        nodeEnter.append("text")
            .attr("dy", "0.31em")
            .attr("x", 12)
            .attr("text-anchor", "start")
            .text(d => d.data.name)
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3)
            .attr("stroke", "white")
            .attr("paint-order", "stroke");

        nodeEnter.append("text")
            .attr("dy", "0.31em")
            .attr("x", 12)
            .attr("text-anchor", "start")
            .text(d => d.data.name)
            .attr("fill", "#000");

        // Tooltip interaction
        nodeEnter.on("mouseover", (event, d) => {
            tooltip.style.opacity = 1;
            tooltip.innerHTML = `<strong>${d.data.name}</strong><br>${d.ancestors().map(a => a.data.name).reverse().join(" > ")}`;
            tooltip.style.left = (event.pageX + 10) + "px";
            tooltip.style.top = (event.pageY - 28) + "px";
        }).on("mouseout", () => {
            tooltip.style.opacity = 0;
        });

        // Update
        const nodeUpdate = node.merge(nodeEnter).transition(transition)
            .attr("transform", d => `translate(${d.y},${d.x})`)
            .attr("fill-opacity", 1)
            .attr("stroke-opacity", 1);

        // Update circle fill and stroke based on collapse state and section
        nodeUpdate.select(".visible-node")
            .attr("fill", d => d._children ? getNodeColor(d) : "#fff")
            .attr("stroke", d => getNodeColor(d));

        // Exit
        const nodeExit = node.exit().transition(transition).remove()
            .attr("transform", d => `translate(${source.y},${source.x})`)
            .attr("fill-opacity", 0)
            .attr("stroke-opacity", 0);

        // --- LINKS ---
        const link = gLink.selectAll("path")
            .data(links, d => d.target.id);

        // Enter
        const linkEnter = link.enter().append("path")
            .attr("d", d => {
                const o = { x: source.x0, y: source.y0 };
                return diagonal({ source: o, target: o });
            });

        // Update
        link.merge(linkEnter).transition(transition)
            .attr("d", diagonal)
            .attr("stroke", d => getNodeColor(d.target))
            .attr("stroke-opacity", d => d.target._children ? 0.8 : 0.4);

        // Exit
        link.exit().transition(transition).remove()
            .attr("d", d => {
                const o = { x: source.x, y: source.y };
                return diagonal({ source: o, target: o });
            });

        // Stash the old positions for transition.
        root.eachBefore(d => {
            d.x0 = d.x;
            d.y0 = d.y;
        });

        // Trigger auto-fit after transaction
        transition.end().then(() => {
            fitToView();
        }).catch(() => {
            fitToView();
        });
    }

    function fitToView() {
        if (!gMain || !svg || !container) return;

        // Get the bounding box of the contents inside gMain
        const bounds = gMain.node().getBBox();
        if (bounds.width === 0 || bounds.height === 0) return;

        // Physical dimensions of the container
        const viewportWidth = container.clientWidth;
        const viewportHeight = container.clientHeight;

        // Add some breathing room
        const padding = 80;
        const w = bounds.width + padding * 2;
        const h = bounds.height + padding * 2;

        // Scale to fit
        const scale = Math.min(viewportWidth / w, viewportHeight / h, 1);
        zoom.scaleExtent([scale, 3]);

        // Calculate the center of the tree
        const midX = bounds.x + bounds.width / 2;
        const midY = bounds.y + bounds.height / 2;

        // Center the tree center at viewport center
        const transform = d3.zoomIdentity
            .translate(viewportWidth / 2, viewportHeight / 2)
            .scale(scale)
            .translate(-midX, -midY);

        svg.transition()
            .duration(750)
            .call(zoom.transform, transform);
    }

    // Curved line generator with horizontal segment for labels
    function diagonal({ source, target }) {
        const labelOffset = 250; // Length of the horizontal segment to clear labels
        const startY = source.y;
        const startX = source.x;
        const endY = target.y;
        const endX = target.x;

        // If child is to the right, add horizontal line then curve
        // Using a Bezier curve starting from (startY + labelOffset, startX)
        const bendY = startY + labelOffset;

        return `M${startY},${startX}
                L${bendY},${startX}
                C${(bendY + endY) / 2},${startX}
                 ${(bendY + endY) / 2},${endX}
                 ${endY},${endX}`;
    }

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }

    // --- Global Zoom Controls ---
    window.zoomIn = function () {
        svg.transition().duration(300).call(zoom.scaleBy, 1.3);
    };

    window.zoomOut = function () {
        svg.transition().duration(300).call(zoom.scaleBy, 0.7);
    };

    window.resetZoom = function () {
        svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    };

    window.recenter = function () {
        fitToView();
    };

    window.toggleFullscreen = function () {
        const elem = document.querySelector(".fullscreen-container") || document.documentElement;
        if (!document.fullscreenElement) {
            // Apply a solid background before maximizing, as some browsers default to black/transparent
            elem.style.backgroundColor = "#fff"; 
            elem.style.overflow = "auto"; // allow scrolling if needed
            elem.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
        } else {
            document.exitFullscreen();
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
        }
    });
});

/**
 * Global function to export the dendrogram SVG
 */
function exportDendrogramToSVG() {
    const container = document.getElementById("dendrogram-container");
    const svgElement = container.querySelector("svg");

    if (!svgElement) {
        alert("Errore: SVG non trovato.");
        return;
    }

    // Prepare a clone to avoid modified original
    const clonedSvg = svgElement.cloneNode(true);

    // Embed styles directly into SVG for portability
    const styleString = `
        .node circle { fill: #fff; stroke: #000; stroke-width: 1.5px; }
        .visible-node { fill: #fff; stroke: #000; stroke-width: 1.5px; }
        .node text { font-family: 'Ministry', 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 12px; font-weight: 500; }
        .link { fill: none; stroke: #ccc; stroke-width: 1px; }
        path { fill: none; stroke: #999; stroke-opacity: 0.6; stroke-width: 1.5px; }
    `;

    const styleElement = document.createElementNS("http://www.w3.org/2000/svg", "style");
    styleElement.textContent = styleString;
    clonedSvg.insertBefore(styleElement, clonedSvg.firstChild);

    // Serialize
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(clonedSvg);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    // Download
    const link = document.createElement("a");
    link.href = url;
    link.download = "pna-struttura-dendrogramma.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}
