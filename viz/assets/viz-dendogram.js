
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("dendrogram-container");
    const tooltip = document.getElementById("tooltip");

    // Configuration
    const width = 1200;
    const duration = 500; // Transition duration
    const dx = 40; // Vertical spacing per node (dynamic base)
    const dy = width / 6; // Horizontal spacing

    let root;
    let svg;
    let gLink;
    let gNode;
    let tree;

    // Fetch Data
    fetch("../data/pna-sezioni.json")
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
            .attr("width", width)
            .style("font-family", "Helvetica Neue, sans-serif")
            .style("user-select", "none");

        const g = svg.append("g")
            .attr("transform", `translate(${dy / 3},${dx})`);

        gLink = g.append("g")
            .attr("fill", "none")
            .attr("stroke", "#999")
            .attr("stroke-opacity", 0.6)
            .attr("stroke-width", 1.5);

        gNode = g.append("g")
            .attr("cursor", "pointer")
            .attr("pointer-events", "all");

        // Collapse after level 2 initially for cleaner view (Optional)
        // root.children.forEach(collapse); 
        // Not collapsing by default based on established visual style, but ready if needed.

        update(root);
    }

    function update(source) {
        // Compute the new tree layout
        const nodes = root.descendants();
        const links = root.links();

        // Calculate dynamic height
        // tree nodeSize sets [height, width] per node in cluster terms?
        // documentation: nodeSize([dx, dy]) means dx is vertical spacing, dy is horizontal

        tree(root);

        let left = root;
        let right = root;
        root.eachBefore(node => {
            if (node.x < left.x) left = node;
            if (node.x > right.x) right = node;
        });

        const height = right.x - left.x + dx * 4;

        // Animate SVG height resize
        const transition = svg.transition()
            .duration(duration)
            .attr("height", height)
            .attr("viewBox", [-dy / 3, left.x - dx, width, height]);

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
            .attr("r", 4)
            .attr("fill", d => d._children ? "#000" : "#fff") // Black if collapsed children
            .attr("stroke", "#000")
            .attr("stroke-width", 1.5);

        // 3. Text
        nodeEnter.append("text")
            .attr("dy", "0.31em")
            .attr("x", d => d.children || d._children ? -10 : 10)
            .attr("text-anchor", d => d.children || d._children ? "end" : "start")
            .text(d => d.data.name)
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 3)
            .attr("stroke", "white")
            .attr("paint-order", "stroke");

        nodeEnter.append("text")
            .attr("dy", "0.31em")
            .attr("x", d => d.children || d._children ? -10 : 10)
            .attr("text-anchor", d => d.children || d._children ? "end" : "start")
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

        // Update circle fill based on collapse state
        nodeUpdate.select(".visible-node")
            .attr("fill", d => d._children ? "#000" : "#fff");

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
            .attr("d", diagonal);

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
    }

    // Curved line generator
    function diagonal({ source, target }) {
        return `M${source.y},${source.x}
                C${(source.y + target.y) / 2},${source.x}
                 ${(source.y + target.y) / 2},${target.x}
                 ${target.y},${target.x}`;
    }

    function collapse(d) {
        if (d.children) {
            d._children = d.children;
            d._children.forEach(collapse);
            d.children = null;
        }
    }
});
