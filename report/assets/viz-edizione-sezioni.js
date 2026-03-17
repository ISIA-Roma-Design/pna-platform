// versione 06 - Rainbow Ribbon (Unified 4-Section Flow)

document.addEventListener('DOMContentLoaded', function () {

    const ACTOR_MAP = {
        "[MIN]": "Ministero (MUR)",
        "[ISTO]": "Istituzione Organizzatrice",
        "[STU]": "Studente",
        "[REF]": "Referente Istituto",
        "[IST]": "Istituzione Partecipante",
        "[GIU]": "Giuria"
    };

    const JOURNEY_CONFIG = {
        "interpretazione_musicale": {
            label: VIZ_CONFIG.SECTION_LABELS.interpretazione_musicale,
            color: VIZ_CONFIG.COLORS.interpretazione_musicale
        },
        "arti_spettacolo": {
            label: VIZ_CONFIG.SECTION_LABELS.arti_spettacolo,
            color: VIZ_CONFIG.COLORS.arti_spettacolo
        },
        "design": {
            label: VIZ_CONFIG.SECTION_LABELS.design,
            color: VIZ_CONFIG.COLORS.design
        },
        "arti_visive": {
            label: VIZ_CONFIG.SECTION_LABELS.arti_visive,
            color: VIZ_CONFIG.COLORS.arti_visive
        }
    };

    let allJourneys = {};
    let journeyVisibility = {};

    // Forcibly hide popover on startup to prevent empty tooltip flash
    const initPopover = document.getElementById('dettagli-popover');
    if (initPopover) initPopover.style.display = 'none';

    // 1. Data Loading
    fetch('../src/data/pna-processo-asis.json')
        .then(response => response.json())
        .then(data => {
            allJourneys = data.journeys;
            Object.keys(allJourneys).forEach(k => journeyVisibility[k] = true);
            initButtons();
            renderChart();
        })
        .catch(err => {
            console.error(err);
            document.getElementById('chart-area').innerHTML = `<p style="color:red">Errore caricamento dati: ${err.message}</p>`;
        });

    // 2. Button Initialization
    function initButtons() {
        const btnContainer = document.getElementById('button-controls');
        if (!btnContainer) return;

        btnContainer.innerHTML = '';

        // Add "Tutti" button
        const allBtn = document.createElement('button');
        allBtn.className = 'btn btn-outline-dark btn-sm rounded-0 fw-bold';
        allBtn.textContent = "Reset";

        allBtn.addEventListener('click', () => {
            Object.keys(journeyVisibility).forEach(k => {
                journeyVisibility[k] = true;
                updateButtonState(k, true);
            });
            renderChart();
        });
        //btnContainer.appendChild(allBtn);

        Object.keys(allJourneys).forEach(key => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-dark btn-sm rounded-0 fw-bold';
            btn.setAttribute('id', `btn-${key}`);
            btn.textContent = (JOURNEY_CONFIG[key]?.label || key);
            btn.style.backgroundColor = JOURNEY_CONFIG[key].color;
            btn.style.borderColor = JOURNEY_CONFIG[key].color;
            btn.style.color = '#fff';


            btn.addEventListener('click', () => {
                const newState = !journeyVisibility[key];
                journeyVisibility[key] = newState;
                updateButtonState(key, newState);
                renderChart();
            });
            btnContainer.appendChild(btn);
        });
    }

    function updateButtonState(key, isVisible) {
        const btn = document.getElementById(`btn-${key}`);
        if (!btn) return;
        if (isVisible) {
            btn.className = 'btn btn-dark btn-sm rounded-0 fw-bold';
            btn.style.opacity = '1';
        } else {
            btn.className = 'btn btn-outline-dark btn-sm rounded-0 fw-bold';
            btn.style.opacity = '0.5';
        }
    }


    let svg, gMain, zoom;

    // 3. Render Chart
    function renderChart() {
        const container = document.getElementById('chart-area');
        container.innerHTML = '';

        const keys = Object.keys(allJourneys).filter(k => journeyVisibility[k]);
        if (keys.length === 0) {
            container.innerHTML = '<p style="padding:40px; text-align:center; color:#666;">Seleziona almeno un percorso per visualizzare il diagramma.</p>';
            return;
        }

        const allStepsFlat = [];
        keys.forEach(key => {
            allJourneys[key].forEach((s, i) => {
                allStepsFlat.push({
                    journeyKey: key,
                    ...s,
                    actorName: ACTOR_MAP[s.actor] || s.actor,
                    idInJourney: i
                });
            });
        });

        const attores = [...new Set(allStepsFlat.map(d => d.actorName))];
        const preferredOrder = ["Ministero (MUR)", "Istituzione Organizzatrice", "Giuria", "Istituzione Partecipante", "Referente Istituto", "Studente / Candidato"];
        attores.sort((a, b) => {
            const idxA = preferredOrder.indexOf(a);
            const idxB = preferredOrder.indexOf(b);
            if (idxA === -1 && idxB === -1) return a.localeCompare(b);
            if (idxA === -1) return 1;
            if (idxB === -1) return -1;
            return idxA - idxB;
        });

        const maxSteps = Math.max(...Object.keys(allJourneys).map(k => allJourneys[k].length));
        const width = container.clientWidth || 1000;
        const laneHeight = 110;
        const margin = { top: 80, right: 100, bottom: 40, left: 220 };
        const height = (attores.length * laneHeight) + margin.top + margin.bottom;

        const yScale = d3.scaleBand().domain(attores).range([0, attores.length * laneHeight]);
        const xScale = d3.scaleLinear().domain([0, maxSteps - 1]).range([0, width - margin.left - margin.right]);

        svg = d3.select("#chart-area").append("svg")
            .attr("width", "100%").attr("height", "100%")
            .style("cursor", "grab");

        // Inner container for zooming
        gMain = svg.append("g");

        // Set up zoom behavior
        zoom = d3.zoom()
            .scaleExtent([0.2, 4])
            .on("zoom", (event) => {
                gMain.attr("transform", event.transform);
            });

        svg.call(zoom).on("wheel.zoom", null);

        const g = gMain.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

        // Initial default zoom level based on container width
        const scale = Math.min((container.clientWidth - 20) / width, 1);
        zoom.scaleExtent([scale, 4]); // Prevent zooming out beyond initial fit
        svg.call(zoom.transform, d3.zoomIdentity.scale(scale));

        // Lanes
        g.selectAll(".lane-bg").data(attores).enter().append("rect")
            .attr("x", -margin.left).attr("y", d => yScale(d)).attr("width", width).attr("height", laneHeight)
            .attr("fill", (d, i) => i % 2 === 0 ? "#fdfdfd" : "#fff");

        g.selectAll(".lane-line").data(attores).enter().append("line")
            .attr("class", "lane-line")
            .attr("x1", -margin.left).attr("x2", width - margin.left - margin.right)
            .attr("y1", d => yScale(d) + laneHeight).attr("y2", d => yScale(d) + laneHeight)
            .attr("stroke", "#e0e0e0").attr("stroke-width", 1);

        g.selectAll(".lane-label").data(attores).enter().append("text").attr("class", "lane-label")
            .attr("x", -20).attr("y", d => yScale(d) + laneHeight / 2).text(d => d);

        // Sankey Transformation
        const nodes = [];
        const links = [];
        const nodeMap = new Map(); // key: stepId_actor

        // 1. Generate Unified Nodes
        keys.forEach(key => {
            const journeySteps = allJourneys[key];
            journeySteps.forEach((s, i) => {
                const nodeId = `${s.step_id}_${s.actor}`;
                if (!nodeMap.has(nodeId)) {
                    nodeMap.set(nodeId, nodes.length);
                    nodes.push({
                        id: nodeId, step_id: s.step_id, actor: s.actor,
                        actorName: ACTOR_MAP[s.actor] || s.actor, idInJourney: i,
                        stepsData: {} // journeyKey -> step data
                    });
                }
                nodes[nodeMap.get(nodeId)].stepsData[key] = s;
            });
        });

        // 2. Generate Rainbow Links
        keys.forEach(key => {
            const journeySteps = allJourneys[key];
            for (let i = 0; i < journeySteps.length - 1; i++) {
                const s1 = journeySteps[i];
                const s2 = journeySteps[i + 1];
                const n1Id = `${s1.step_id}_${s1.actor}`;
                const n2Id = `${s2.step_id}_${s2.actor}`;

                links.push({
                    source: nodeMap.get(n1Id),
                    target: nodeMap.get(n2Id),
                    value: 0.25,
                    journeyKey: key
                });
            }
        });

        const sankey = d3.sankey()
            .nodeWidth(10).nodePadding(0) // No padding between links within nodes
            .extent([[0, 0], [width - margin.left - margin.right, height]]);

        const graph = sankey({
            nodes: nodes.map(d => Object.assign({}, d)),
            links: links.map(d => Object.assign({}, d))
        });

        // Manual positioning to align with lanes and steps
        graph.nodes.forEach(node => {
            node.x0 = xScale(node.idInJourney);
            node.x1 = node.x0 + 10;
        });

        const stepActorGroups = d3.groups(graph.nodes, d => d.idInJourney, d => d.actorName);
        const flowScale = 18; // 100% = 18px

        stepActorGroups.forEach(([stepIdx, actorGroups]) => {
            actorGroups.forEach(([actorName, nodesInLane]) => {
                const totalValue = d3.sum(nodesInLane, n => n.value);
                const totalHeight = totalValue * flowScale;
                const laneYCenter = yScale(actorName) + laneHeight / 2;
                let currentY = laneYCenter - totalHeight / 2;

                // Should only be one merged node per lane/step now
                nodesInLane.forEach(node => {
                    node.y0 = currentY;
                    node.y1 = currentY + node.value * flowScale;
                    currentY = node.y1;
                });
            });
        });

        // Force link widths to match our flowScale
        graph.links.forEach(l => {
            l.width = l.value * flowScale;
        });

        sankey.update(graph);

        // Draw Links (Rainbow Stripes) - Custom "Spezzata" path
        const journeyOrder = Object.keys(JOURNEY_CONFIG);
        graph.links.sort((a, b) => journeyOrder.indexOf(a.journeyKey) - journeyOrder.indexOf(b.journeyKey));

        const linkPath = d => {
            const x0 = d.source.x1;
            const x1 = d.target.x0;
            const y0 = d.y0;
            const y1 = d.y1;
            const xm = (x0 + x1) / 2;
            return `M${x0},${y0}L${xm},${y0}L${xm},${y1}L${x1},${y1}`;
        };

        g.append("g").selectAll(".journey-link")
            .data(graph.links)
            .enter().append("path")
            .attr("class", d => `journey-link journey-path-${d.journeyKey}`)
            .attr("d", linkPath)
            .attr("stroke", d => JOURNEY_CONFIG[d.journeyKey].color)
            .attr("stroke-width", d => d.width)
            .attr("fill", "none")
            .attr("opacity", 0.9)
            .style("stroke-linecap", "butt");

        // Draw Nodes (Unified Circles)
        const nodeG = g.append("g").selectAll(".node-group")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class", d => "node-group")
            .attr("transform", d => `translate(${(d.x0 + d.x1) / 2}, ${(d.y0 + d.y1) / 2})`);

        nodeG.append("circle")
            .attr("r", 12).attr("class", "node-circle")
            .attr("fill", "#fff").attr("stroke", "#525252")
            .attr("stroke-width", 3)
            .style("cursor", "pointer")
            .on("mouseenter", function (e, d) { showPopover(d, this); });

        nodeG.append("text").attr("class", "node-label").attr("dy", 1).style("font-size", "10px").text(d => d.step_id);

        // Phase Rendering (using first available journey as reference)
        const firstActiveKey = keys[0];
        const referenceJourney = allJourneys[firstActiveKey];
        const phaseBounds = [];
        let currentPhase = null, startIdx = 0;
        referenceJourney.forEach((step, i) => {
            if (step.phase !== currentPhase) {
                if (currentPhase !== null) phaseBounds.push({ name: currentPhase, start: startIdx, end: i - 1 });
                currentPhase = step.phase; startIdx = i;
            }
        });
        phaseBounds.push({ name: currentPhase, start: startIdx, end: referenceJourney.length - 1 });

        phaseBounds.forEach(pb => {
            const xOffset = xScale(pb.start);
            const xEnd = xScale(pb.end);
            g.append("line").attr("class", "phase-divider").attr("x1", xOffset).attr("x2", xOffset).attr("y1", -20).attr("y2", height - margin.top - margin.bottom);
            g.append("text").attr("class", "phase-label").attr("x", (xOffset + xEnd) / 2).attr("y", -30).attr("text-anchor", "middle").text(pb.name);
        });
    }

    const popover = document.getElementById('dettagli-popover');
    const popoverTitle = document.getElementById('popover-title');
    const popoverDesc = document.getElementById('popover-desc');

    function showPopover(node, element) {
        d3.selectAll('.node-circle').classed('active', false);
        d3.select(element).classed('active', true);

        const stepNum = String(node.step_id).padStart(2, '0');

        // Find if all steps are common or if there's diversity
        const steps = Object.values(node.stepsData);
        const isAllCommon = steps.every(s => s.type === "common");

        if (isAllCommon) {
            popoverTitle.style.color = "#525252";
            popoverTitle.textContent = `step ${stepNum} - comune`;
        } else {
            // Pick first non-common label or generic if multiple
            const specificStep = steps.find(s => s.type === "specific") || steps[0];
            const journeyKey = Object.keys(node.stepsData).find(k => node.stepsData[k] === specificStep);
            popoverTitle.style.color = JOURNEY_CONFIG[journeyKey].color;
            popoverTitle.textContent = `step ${stepNum} - ${JOURNEY_CONFIG[journeyKey].label.toLowerCase()}`;
        }

        const firstStep = steps[0];
        popoverDesc.innerHTML = `<div class="fw-bold mb-1">${firstStep.phase.toUpperCase()} — ${ACTOR_MAP[firstStep.actor] || firstStep.actor}</div><div>${firstStep.action}</div>`;

        popover.style.display = 'block';
        const rect = element.getBoundingClientRect();
        popover.style.top = `${rect.top + window.scrollY - popover.offsetHeight - 10}px`;
        popover.style.left = `${rect.left + window.scrollX - (popover.offsetWidth / 2) + 12}px`;
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.node-circle') && !e.target.closest('#dettagli-popover')) {
            popover.style.display = 'none';
            d3.selectAll('.node-circle').classed('active', false);
        }
    });

    // --- Global Controls ---
    window.zoomIn = function () {
        if (!svg) return;
        svg.transition().duration(300).call(zoom.scaleBy, 1.3);
    };

    window.zoomOut = function () {
        if (!svg) return;
        svg.transition().duration(300).call(zoom.scaleBy, 0.7);
    };

    window.resetZoom = function () {
        if (!svg) return;
        svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity.scale(1));
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
                }).catch((err) => {
                    console.error(`Error attempting to enable fullscreen: ${err.message}`);
                });
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

    window.exportVisualization = function () {
        const container = document.getElementById("chart-area");
        const svgElement = container.querySelector("svg");

        if (!svgElement) {
            alert("Errore: SVG non trovato.");
            return;
        }

        const clonedSvg = svgElement.cloneNode(true);

        const styleString = `
            text { font-family: 'Ministry', 'Helvetica Neue', Helvetica, Arial, sans-serif; fill: #000; }
            .lane-label { font-weight: 700; font-size: 14px; text-anchor: end; }
            .phase-label { font-weight: 800; font-size: 12px; fill: #666; text-transform: uppercase; }
            .phase-divider { stroke: #999; stroke-dasharray: 4; stroke-width: 1px; }
            .node-label { font-size: 10px; font-weight: bold; text-anchor: middle; }
            .node-circle { fill: #fff; stroke: #525252; stroke-width: 3px; }
            .lane-line { stroke: #e0e0e0; stroke-width: 1px; }
        `;

        const styleElement = document.createElementNS("http://www.w3.org/2000/svg", "style");
        styleElement.textContent = styleString;
        clonedSvg.insertBefore(styleElement, clonedSvg.firstChild);

        // Reset transform on clone so export shows full graph
        const gClonemain = clonedSvg.querySelector("g");
        if (gClonemain) {
            clonedSvg.setAttribute("viewBox", svgElement.getAttribute("viewBox") || ("0 0 " + svgElement.getAttribute("width") + " " + svgElement.getAttribute("height")));
        }

        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(clonedSvg);
        const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "pna-edizione-sezioni.svg";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

});
