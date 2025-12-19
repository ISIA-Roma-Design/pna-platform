document.addEventListener('DOMContentLoaded', function () {

    // 1. Data Processing
    // Determine path based on location
    const pathname = window.location.pathname;
    const subdirectories = ["/viz/", "/prototipo/", "/docs/", "/data/"];
    const isSubdirectory = subdirectories.some(subdir => pathname.includes(subdir));
    const basePrefix = isSubdirectory ? "../" : "./";

    fetch(basePrefix + 'data/pna-processo.json')
        .then(response => response.json())
        .then(rawData => {

            // Parse data
            const data = rawData.map((d, i) => {
                return {
                    id: i,
                    originalfasi: d.fasi + ". " + d.attore,
                    fasiNumber: d.fasi,
                    attore: d.attore,
                    dettagli: d.dettagli
                };
            });

            // Unique attores
            const attores = [...new Set(data.map(d => d.attore))];

            // 2. Setup Dimensions
            const container = document.getElementById('chart-area');
            const width = container.clientWidth;
            const laneHeight = 100; // More breathing room
            const margin = { top: 50, right: 100, bottom: 50, left: 200 }; // Left margin for attore labels
            const height = (attores.length * laneHeight) + margin.top + margin.bottom;

            // 3. Creates SVG
            const svg = d3.select("#chart-area")
                .append("svg")
                .attr("width", "100%")
                .attr("height", height)
                .attr("viewBox", `0 0 ${width} ${height}`);

            const g = svg.append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // 4. Scales
            const yScale = d3.scaleBand()
                .domain(attores)
                .range([0, attores.length * laneHeight]);

            const xScale = d3.scaleLinear()
                .domain([0, data.length - 1])
                .range([0, width - margin.left - margin.right]);

            // 5. Draw Lanes (Grid)
            g.selectAll(".lane-bg")
                .data(attores)
                .enter()
                .append("rect")
                .attr("x", -margin.left) // Full width background
                .attr("y", d => yScale(d))
                .attr("width", width)
                .attr("height", laneHeight)
                .attr("fill", (d, i) => i % 2 === 0 ? "#fdfdfd" : "#fff"); // Subtle zebra stripe

            g.selectAll(".lane-line")
                .data(attores)
                .enter()
                .append("line")
                .attr("class", "lane-line")
                .attr("x1", -margin.left + 20)
                .attr("x2", width - margin.left - margin.right)
                .attr("y1", d => yScale(d) + laneHeight)
                .attr("y2", d => yScale(d) + laneHeight);

            // attore Labels
            g.selectAll(".lane-label")
                .data(attores)
                .enter()
                .append("text")
                .attr("class", "lane-label")
                .attr("x", -20)
                .attr("y", d => yScale(d) + laneHeight / 2)
                .text(d => d);

            // 6. Draw Connections (Path)
            const lineGenerator = d3.line()
                .x(d => xScale(d.id))
                .y(d => yScale(d.attore) + laneHeight / 2)
                .curve(d3.curveMonotoneX);

            g.append("path")
                .datum(data)
                .attr("class", "connection-path")
                .attr("d", lineGenerator);

            // 7. Draw Nodes
            const nodesGroup = g.selectAll(".node-group")
                .data(data)
                .enter()
                .append("g")
                .attr("class", "node-group")
                .attr("transform", d => `translate(${xScale(d.id)}, ${yScale(d.attore) + laneHeight / 2})`);

            const circles = nodesGroup.append("circle")
                .attr("class", "node-circle")
                .attr("r", 9)
                .attr("fill", "#fff");

            nodesGroup.append("text")
                .attr("class", "node-label")
                .attr("dy", 1)
                .text(d => d.fasiNumber);

            // 8. Interactivity with Popover
            const popover = document.getElementById('dettagli-popover');
            const popoverTitle = document.getElementById('popover-title');
            const popoverDesc = document.getElementById('popover-desc');

            function showPopover(d, element) {
                d3.selectAll('.node-circle').classed('active', false);
                d3.select(element).classed('active', true);

                // 1. Update Content First (so we can measure)
                popoverTitle.textContent = `fasi ${d.fasiNumber} – ${d.attore.toUpperCase()}`;
                popoverDesc.textContent = d.dettagli;

                // 2. Show initially to measure dimensions (but maybe offscreen or just assume standard flow)
                popover.open = true;

                // 3. Get Coordinates & Dimensions
                const rect = element.getBoundingClientRect();
                const scrollTop = window.scrollY || document.documentElement.scrollTop;
                const scrollLeft = window.scrollX || document.documentElement.scrollLeft;

                // Get ACTUAL rendered dimensions of the popover
                const popRect = popover.getBoundingClientRect();
                const popoverWidth = popRect.width;
                const popoverHeight = popRect.height;

                const viewportWidth = window.innerWidth;
                const viewportHeight = window.innerHeight;

                // 4. Default Position (Right-Bottom of node)
                let top = rect.top + scrollTop;
                let left = rect.left + scrollLeft + 20;

                // 5. Boundary Check
                // If it goes off RIGHT edge, flip to Left
                // We place it 20px to the left of the node's left edge
                if (rect.left + popoverWidth + 20 > viewportWidth) {
                    left = rect.left + scrollLeft - popoverWidth - 20;
                }

                // If it goes off BOTTOM edge, flip to Top
                // We place it above the node
                if (rect.top + popoverHeight > viewportHeight + scrollTop) {
                    top = rect.top + scrollTop - popoverHeight;
                }

                // 6. Apply Final Position
                popover.style.top = `${top}px`;
                popover.style.left = `${left}px`;
            }

            function hidePopover() {
                popover.open = false;
                d3.selectAll('.node-circle').classed('active', false);
            }

            circles.on("click", function (event, d) {
                event.stopPropagation();
                showPopover(d, this);
            });

            circles.on("mouseenter", function (event, d) {
                showPopover(d, this);
            });

            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.node-circle') && !e.target.closest('cds-popover')) {
                    hidePopover();
                }
            });

        })
        .catch(err => {
            console.error(err);
            document.getElementById('chart-area').innerHTML = `<p style="color:red">Errore caricamento dati: ${err.message}</p>`;
        });
});
