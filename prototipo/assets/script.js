// HIERARCHY DATA & INSTITUTIONS (Same as before, abbreviated here for clarity but fully preserved in logic)
// To save space in this response, I'm assuming the big data constants are still there or I should include them.
// I will include the full file content to be safe and ensure everything works 100%.

// Data storage
let HIERARCHY_DATA = [];
const INSTITUTION_DATA = {}; // Will be populated dynamically

const PREDEFINED_TAGS = [
    "Sostenibilità", "Innovazione", "Ricerca", "Performance", "Installazione", "Scultura", "Pittura", "Fotografia",
    "Video Art", "Sound Design", "Elettronica", "Acustica", "Armonia", "Contrappunto", "Jazz", "Improvvisazione",
    "Coreografia", "Danza", "Movimento", "Corpo", "Spazio", "Luce", "Suono", "Materia", "Riciclo", "Eco-design",
    "Social Design", "Interaction Design", "Product Design", "Graphic Design", "Typography", "Branding",
    "User Experience", "User Interface", "Web Design", "App Design", "Game Design", "3D Modeling", "Animation",
    "Motion Graphics", "Virtual Reality", "Augmented Reality", "Mixed Reality", "Artificial Intelligence",
    "Machine Learning", "Data Visualization", "Generative Art", "Bio Art", "Nano Art", "Kinetic Art", "Land Art",
    "Public Art", "Street Art", "Graffiti", "Urban Design", "Architecture", "Interior Design", "Fashion Design",
    "Textile Design", "Costume Design", "Scenography", "Stage Design", "Lighting Design", "Costume", "Trucco",
    "Maschera", "Burattini", "Marionette", "Teatro di Figura", "Teatro Danza", "Teatro Musicale", "Opera",
    "Operetta", "Musical", "Cabaret", "Circo", "Giocoleria", "Acrobatica", "Mimo", "Pantomima", "Clownerie",
    "Commedia dell'Arte", "Tragedia", "Commedia", "Dramma", "Melodramma", "Poesia", "Letteratura",
    "Scrittura Creativa", "Storytelling", "Narrazione", "Regia", "Montaggio", "Sceneggiatura", "Fotografia di Scena",
    "Documentario", "Cortometraggio", "Lungometraggio", "Videoclip", "Spot Pubblicitario", "Podcast", "Radio",
    "Televisione", "Cinema", "Streaming", "Social Media", "Marketing", "Management", "Economia della Cultura",
    "Diritto d'Autore", "Copyright", "Creative Commons", "Open Source"
];



async function loadHierarchyData() {
    try {
        // Fetch from ../../data/pna-sezioni.json (adjusting path for where script.js runs. 
        // If script.js is in /prototipo/assets/, and html is in /prototipo/, fetch is relative to HTML usually.
        // ../data/pna-sezioni.json
        const response = await fetch('../data/pna-sezioni.json');
        if (!response.ok) throw new Error("Failed to load hierarchy data");
        const rawData = await response.json();

        // Save raw data or transform it?
        // Let's keep it simply available or build a helper.
        HIERARCHY_DATA = rawData;
        console.log("Hierarchy Data Loaded:", HIERARCHY_DATA.length, "items");

        // Trigger any dependent UI updates if needed
        document.dispatchEvent(new Event('hierarchy-loaded'));
    } catch (e) {
        console.error("Error loading hierarchy:", e);
    }
}

async function loadInstitutionData() {
    try {
        const response = await fetch('../data/pna-istituzioni-afam.json');
        if (!response.ok) throw new Error("Failed to load institution data");
        const rawData = await response.json();

        // Transform data
        // Clear object keys if needed
        for (const key in INSTITUTION_DATA) delete INSTITUTION_DATA[key];

        rawData.forEach(item => {
            const typeLabel = item.tipologia_istituto;
            // Use label directly as key
            const key = typeLabel;

            if (key) {
                if (!INSTITUTION_DATA[key]) {
                    INSTITUTION_DATA[key] = {
                        label: typeLabel,
                        istituti: []
                    };
                }
                if (!INSTITUTION_DATA[key].istituti.includes(item.istituto)) {
                    INSTITUTION_DATA[key].istituti.push(item.istituto);
                }
            }
        });

        // Sort institutions alphabetically
        for (const key in INSTITUTION_DATA) {
            INSTITUTION_DATA[key].istituti.sort((a, b) => a.localeCompare(b));
        }

        console.log("Institution Data Loaded:", Object.keys(INSTITUTION_DATA).length, "typologies");
        return true;
    } catch (e) {
        console.error("Error loading institutions:", e);
        return false;
    }
}

function initInstitutionSelects(formId) {
    const form = document.getElementById(formId);
    if (form) {
        const tipologiaSelect = form.querySelector('#tipologia_istituzione');
        const istituzioneSelect = form.querySelector('#istituzione');

        if (tipologiaSelect && istituzioneSelect) {
            // Re-create default option to be safe
            tipologiaSelect.innerHTML = '<cds-select-item value="" disabled selected>Seleziona Tipologia...</cds-select-item>';

            const sortedKeys = Object.keys(INSTITUTION_DATA).sort();

            for (const key of sortedKeys) {
                const value = INSTITUTION_DATA[key];
                const item = document.createElement('cds-select-item');
                item.value = key;
                item.textContent = value.label;
                tipologiaSelect.appendChild(item);
            }

            // Handle Chain
            tipologiaSelect.addEventListener('cds-select-selected', (e) => {
                const selectedKey = e.target.value;
                const data = INSTITUTION_DATA[selectedKey];

                // Clear Istituzione select
                istituzioneSelect.innerHTML = '<cds-select-item value="" disabled selected>Seleziona Istituzione...</cds-select-item>';

                if (data && data.istituti) {
                    istituzioneSelect.disabled = false;
                    data.istituti.forEach(nome => {
                        const item = document.createElement('cds-select-item');
                        item.value = nome;
                        item.textContent = nome;
                        istituzioneSelect.appendChild(item);
                    });
                } else {
                    istituzioneSelect.disabled = true;
                }
            });
        }
    }
}

function initTaxonomySelects(formId) {
    const form = document.getElementById(formId);
    if (form) {
        const premioSelect = form.querySelector('#id_premio');
        const sezioneSelect = form.querySelector('#id_sezione');
        const sottosezioneSelect = form.querySelector('#id_sottosezione');
        const categoriaSelect = form.querySelector('#id_categoria');

        if (premioSelect && HIERARCHY_DATA.length > 0) {
            // 1. Populate Premio (Unique values)
            const premi = [...new Set(HIERARCHY_DATA.map(item => item.premio))].sort();

            // Clear and add default
            premioSelect.innerHTML = '<cds-select-item value="" disabled selected>Seleziona premio...</cds-select-item>';

            premi.forEach(premio => {
                const item = document.createElement('cds-select-item');
                item.value = premio;
                item.textContent = premio;
                premioSelect.appendChild(item);
            });
            // Force empty selection logic for Carbon
            const placeholder = premioSelect.querySelector('cds-select-item[value=""]');
            if (placeholder) placeholder.removeAttribute('disabled');
            premioSelect.value = "";
            // Re-disable after short delay to allow component to update
            setTimeout(() => {
                if (placeholder) placeholder.setAttribute('disabled', '');
            }, 50);

            // 2. Handle Premio Change -> Populate Sezione
            premioSelect.addEventListener('cds-select-selected', (e) => {
                const selectedPremio = e.target.value;

                // Clear downstream
                sezioneSelect.innerHTML = '<cds-select-item value="" disabled selected>Seleziona Sezione...</cds-select-item>';
                sezioneSelect.disabled = true;
                sottosezioneSelect.innerHTML = '<cds-select-item value="" disabled selected>Prima seleziona Sezione...</cds-select-item>';
                sottosezioneSelect.disabled = true;
                if (categoriaSelect) {
                    categoriaSelect.innerHTML = '<cds-select-item value="" disabled selected>Prima seleziona Sottosezione...</cds-select-item>';
                    categoriaSelect.disabled = true;
                }

                if (selectedPremio) {
                    // Filter data for this premio
                    const sections = [...new Set(HIERARCHY_DATA
                        .filter(item => item.premio === selectedPremio)
                        .map(item => item.sezione))].sort();

                    if (sections.length > 0) {
                        sezioneSelect.disabled = false;
                        sections.forEach(sezione => {
                            const item = document.createElement('cds-select-item');
                            item.value = sezione;
                            item.textContent = sezione;
                            sezioneSelect.appendChild(item);
                        });
                    }
                }
            });

            // 3. Handle Sezione Change -> Populate Sottosezione
            sezioneSelect.addEventListener('cds-select-selected', (e) => {
                const selectedSezione = e.target.value;
                const selectedPremio = premioSelect.value;

                // Clear downstream
                sottosezioneSelect.innerHTML = '<cds-select-item value="" disabled selected>Seleziona Sottosezione...</cds-select-item>';
                sottosezioneSelect.disabled = true;
                if (categoriaSelect) {
                    categoriaSelect.innerHTML = '<cds-select-item value="" disabled selected>Prima seleziona Sottosezione...</cds-select-item>';
                    categoriaSelect.disabled = true;
                }

                if (selectedSezione && selectedPremio) {
                    const subsections = [...new Set(HIERARCHY_DATA
                        .filter(item => item.premio === selectedPremio && item.sezione === selectedSezione)
                        .map(item => item.sottosezione))].sort();

                    if (subsections.length > 0) {
                        sottosezioneSelect.disabled = false;
                        subsections.forEach(sub => {
                            const item = document.createElement('cds-select-item');
                            item.value = sub;
                            item.textContent = sub;
                            sottosezioneSelect.appendChild(item);
                        });
                    }
                }
            });

            // 4. Handle Sottosezione Change -> Populate Categoria (if any)
            sottosezioneSelect.addEventListener('cds-select-selected', (e) => {
                const selectedSub = e.target.value;
                const selectedSezione = sezioneSelect.value;
                const selectedPremio = premioSelect.value;

                if (categoriaSelect) {
                    categoriaSelect.innerHTML = '<cds-select-item value="" disabled selected>Seleziona Categoria (Opzionale)...</cds-select-item>';
                    categoriaSelect.disabled = true; // Enable only if items found

                    if (selectedSub && selectedSezione && selectedPremio) {
                        const categories = [...new Set(HIERARCHY_DATA
                            .filter(item => item.premio === selectedPremio &&
                                item.sezione === selectedSezione &&
                                item.sottosezione === selectedSub &&
                                item.categoria) // Only non-empty categories
                            .map(item => item.categoria))].sort();

                        if (categories.length > 0) {
                            categoriaSelect.disabled = false;
                            categories.forEach(cat => {
                                const item = document.createElement('cds-select-item');
                                item.value = cat;
                                item.textContent = cat;
                                categoriaSelect.appendChild(item);
                            });
                        } else {
                            // No categories, maybe disable or leave as optional?
                            // Keep disabled but change text?
                            categoriaSelect.innerHTML = '<cds-select-item value="" disabled selected>Nessuna Categoria disponibile</cds-select-item>';
                        }
                    }
                }
            });
        }
    }
}

// DYNAMIC RELATIONS LOGIC
function initDynamicRelations(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    // State
    const relationState = {
        studenti: [],
        docenti: [],
        performers: []
    };

    // Helper: Render Tables
    const renderTable = (type) => { // type: 'studenti' | 'docenti' | 'performers'
        const tbody = document.getElementById(`table_${type}_body`);
        const list = relationState[type];

        if (!tbody) return;
        tbody.innerHTML = '';

        const emptyMsg = document.getElementById(`msg_empty_${type}`);

        if (list.length === 0) {
            if (emptyMsg) emptyMsg.style.display = 'block';
            return;
        }

        if (emptyMsg) emptyMsg.style.display = 'none';

        list.forEach((person, index) => {
            const row = document.createElement('cds-table-row');

            if (type === 'performers') {
                row.innerHTML = `
                    <cds-table-cell>${person.nome}</cds-table-cell>
                    <cds-table-cell>${person.cognome}</cds-table-cell>
                    <cds-table-cell>
                        <cds-button kind="danger--ghost" size="sm" class="btn-remove-${type}" data-index="${index}">Rimuovi</cds-button>
                    </cds-table-cell>
                `;
            } else {
                row.innerHTML = `
                    <cds-table-cell>${person.nome}</cds-table-cell>
                    <cds-table-cell>${person.cognome}</cds-table-cell>
                    <cds-table-cell>${person.email}</cds-table-cell>
                    <cds-table-cell>
                        <cds-button kind="danger--ghost" size="sm" class="btn-remove-${type}" data-index="${index}">Rimuovi</cds-button>
                    </cds-table-cell>
                `;
            }
            tbody.appendChild(row);
        });

        // Re-attach remove listeners
        tbody.querySelectorAll(`.btn-remove-${type}`).forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.target.getAttribute('data-index'));
                relationState[type].splice(idx, 1);
                renderTable(type);
            });
        });
    };

    // Helper: Handle Search
    const setupSearch = (type) => {
        const searchInput = document.getElementById(`search_${type}`);
        const resultsContainer = document.getElementById(`search_results_${type}`);

        if (!searchInput || !resultsContainer) return;

        let debounceTimer;
        searchInput.addEventListener('cds-search-input', (e) => {
            const query = e.detail?.value || e.target.value;

            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(async () => {
                if (query.length < 2) {
                    resultsContainer.style.display = 'none';
                    return;
                }

                try {
                    // const res = await fetch(`../engine/api.php?action=search_users&q=${encodeURIComponent(query)}&type=${type}`);
                    const res = await MockAPI.searchUsers(query, type); // Use MockAPI

                    if (res.ok) {
                        const users = res.users; // Array of users

                        if (users.length > 0) {
                            resultsContainer.innerHTML = '';
                            users.forEach(user => {
                                const item = document.createElement('div');
                                item.style.padding = '0.5rem';
                                item.style.cursor = 'pointer';
                                item.style.borderBottom = '1px solid #eee';
                                item.innerHTML = `<strong>${user.nome} ${user.cognome}</strong> ${user.email ? '(' + user.email + ')' : ''}`;

                                item.onmouseover = () => item.style.backgroundColor = '#f4f4f4';
                                item.onmouseout = () => item.style.backgroundColor = 'white';

                                item.addEventListener('click', () => {
                                    // Add to state
                                    const exists = relationState[type].some(u => {
                                        if (user.email && u.email) return u.email === user.email;
                                        return u.nome === user.nome && u.cognome === user.cognome;
                                    });

                                    if (!exists) {
                                        relationState[type].push(user);
                                        renderTable(type);
                                    } else {
                                        alert("Utente già aggiunto.");
                                    }

                                    resultsContainer.style.display = 'none';
                                    searchInput.value = '';
                                });
                                resultsContainer.appendChild(item);
                            });
                            resultsContainer.style.display = 'block';
                        } else {
                            resultsContainer.innerHTML = '<div style="padding:0.5rem; color:#888;">Nessun risultato</div>';
                            resultsContainer.style.display = 'block';
                        }
                    }
                } catch (err) {
                    console.error("Search error", err);
                }
            }, 300);
        });
    };

    // Helper: Handle Modal Add
    const setupModal = (domSuffix, stateKey) => {
        const modal = document.getElementById(`modal_${domSuffix}`);
        const openBtn = document.getElementById(`btn_open_modal_${domSuffix}`);
        const saveBtn = document.getElementById(`btn_save_${domSuffix}`);

        if (!modal || !openBtn || !saveBtn) return;

        openBtn.addEventListener('click', () => {
            modal.open = true;
        });

        saveBtn.addEventListener('click', () => {
            const nome = document.getElementById(`new_${domSuffix}_nome`).value;
            const cognome = document.getElementById(`new_${domSuffix}_cognome`).value;
            const email = document.getElementById(`new_${domSuffix}_email`).value;

            if (nome && cognome && email) {
                if (!relationState[stateKey].some(u => u.email === email)) {
                    relationState[stateKey].push({ nome, cognome, email, is_new: true });
                    renderTable(stateKey);
                    modal.open = false;
                    // Clear inputs
                    document.getElementById(`new_${domSuffix}_nome`).value = '';
                    document.getElementById(`new_${domSuffix}_cognome`).value = '';
                    document.getElementById(`new_${domSuffix}_email`).value = '';
                } else {
                    alert("Utente già in lista.");
                }
            } else {
                alert("Compila tutti i campi.");
            }
        });
    };

    // Init
    setupSearch('studenti');
    setupSearch('docenti');

    // Pass (domSuffix, stateKey) to handle HTML singular vs State plural mismatch
    setupModal('studente', 'studenti');
    setupModal('docente', 'docenti');

    // Expose state for form submission (attach to form object or returning it?)
    // A clean way is to attach a method to the form or storing it in a global/module scope map.
    // For this prototype, let's attach to the form element property.
    form.relationState = relationState;
}

// --- DYNAMIC FIELDS LOGIC ---
const initDynamicFields = (formId) => {
    const form = document.getElementById(formId);
    if (!form) return;

    const premioSelect = form.querySelector('#id_premio');
    const sezioneSelect = form.querySelector('#id_sezione');
    const sottosezioneSelect = form.querySelector('#id_sottosezione');

    const updateFields = () => {
        // Hide all first
        form.querySelectorAll('.dynamic-section').forEach(el => el.hidden = true);

        const premio = premioSelect.value || "";
        const sezione = sezioneSelect.value || "";
        const sottosezione = sottosezioneSelect.value || "";
        const categoria = form.querySelector('#id_categoria') ? form.querySelector('#id_categoria').value : ""; // Categoria might be optional

        if (!premio) return;

        // --- MAPPING LOGIC ---

        // DESIGN
        if (sezione === 'Design') {
            showGroup('design_progetto');
            return;
        }

        // ARTI VISIVE
        if (sezione.startsWith('Arti visive')) {
            showGroup('artivisive_opera');
            return;
        }

        // TEATRO
        if (sottosezione === 'Recitazione') {
            showGroup('teatro_recitazione');
            return;
        }
        if (sottosezione === 'Regia') {
            showGroup('teatro_regia');
            return;
        }
        if (sottosezione === 'Drammaturgia') {
            showGroup('teatro_drammaturgia');
            return;
        }

        // DANZA
        if (sottosezione === 'Danza classica') {
            showGroup('danza_classica');
            return;
        }
        if (sottosezione === 'Danza contemporanea') {
            showGroup('danza_contemporanea');
            return;
        }
        if (sottosezione === 'Coreografia') {
            showGroup('danza_coreografia');
            return;
        }

        // MUSICA
        if (sottosezione === 'Composizione') {
            showGroup('musica_composizione');
            return;
        }
        if (sottosezione === 'Fisarmonica') {
            showGroup('musica_fisarmonica');
            return;
        }
        // Musica Antica / Canto Lirico (Schema check: use musica_antica for 'Musica per strumenti antichi' group)
        if (sottosezione.startsWith('Musica per strumenti antichi')) {
            showGroup('musica_antica');
            // Note: Canto lirico exists as a separate subsection in JSON but doesn't have a specific table in the range 250-478 of Schema.
            // Assuming it might use musica_antica or generic? 
            // For now, only explicit schema matches.
            return;
        }
        if (sottosezione === 'Organo') {
            showGroup('musica_organo');
            return;
        }
        if (sottosezione === 'Jazz') {
            showGroup('musica_jazz');
            return;
        }
        if (sottosezione.includes('Musica da Camera') || sottosezione === 'Musica vocale da camera') {
            showGroup('musica_da_camera');
            return;
        }
        if (sottosezione === 'Pianoforte') {
            showGroup('musica_pianoforte');
            return;
        }
        if (sottosezione === 'Strumenti a percussione') {
            showGroup('musica_percussioni');
            return;
        }
        if (sottosezione.startsWith('Musica elettronica')) {
            showGroup('musica_elettronica');
            return;
        }
        if (sottosezione.startsWith('Musiche pop e rock')) {
            showGroup('musica_pop_rock');
            return;
        }
        if (sottosezione.includes('Direzione')) {
            showGroup('musica_direzione_orchestra');
            return;
        }

        // MUSICA - Strumenti a fiato
        if (sottosezione === 'Strumenti a fiato') {
            if (categoria.startsWith('Legni')) {
                showGroup('musica_legni');
            } else if (categoria.startsWith('Ottoni')) {
                showGroup('musica_ottoni');
            }
            return;
        }

        // MUSICA - Strumenti ad arco / Mandolino / Chitarra / Arpa
        if (sottosezione === 'Strumenti ad arco') {
            if (categoria.includes('Violino') || categoria.includes('Viola')) {
                showGroup('musica_violino_viola');
            } else if (categoria.includes('Violoncello') || categoria.includes('contrabbasso')) {
                showGroup('musica_velocello_contrabbasso');
            }
            return;
        }

        // Pending: Arpa, Chitarra, Mandolino, Canto Lirico don't have explicit tables in the provided Schema block.
        // They probably share generic logic or I missed a table. 
        // Implementation restricted to explicit tables in requested Lines 250-478.
    };

    const showGroup = (id) => {
        const el = form.querySelector(`[data-field-group="${id}"]`);
        if (el) el.hidden = false;
    };

    // Listen to changes
    // Carbon components emit 'cds-select-selected'
    if (premioSelect) premioSelect.addEventListener('cds-select-selected', updateFields);
    if (sezioneSelect) sezioneSelect.addEventListener('cds-select-selected', updateFields);
    if (sottosezioneSelect) sottosezioneSelect.addEventListener('cds-select-selected', updateFields);
    const catSelect = form.querySelector('#id_categoria');
    if (catSelect) catSelect.addEventListener('cds-select-selected', updateFields);
};

// --- TAG SYSTEM LOGIC ---
const initTagSystem = (formId) => {
    const form = document.getElementById(formId);
    if (!form) return;

    const tagInput = form.querySelector('#tag_input');
    const addBtn = form.querySelector('#btn_add_tag');
    const tagsContainer = form.querySelector('#tags_container');
    const hiddenInput = form.querySelector('#tags');
    const datalist = form.querySelector('#tag_suggestions');

    if (!tagInput || !addBtn || !tagsContainer || !hiddenInput || !datalist) return;

    let selectedTags = [];

    // Populate Datalist
    PREDEFINED_TAGS.sort().forEach(tag => {
        const option = document.createElement('option');
        option.value = tag;
        datalist.appendChild(option);
    });

    const renderTags = () => {
        tagsContainer.innerHTML = '';
        selectedTags.forEach((tag, index) => {
            // Using Carbon Tag
            const chip = document.createElement('cds-tag');
            chip.setAttribute('filter', '');
            chip.setAttribute('type', 'blue');
            chip.setAttribute('title', 'Rimuovi tag');
            chip.textContent = tag;

            // Remove listener
            chip.addEventListener('cds-tag-closed', (e) => {
                e.stopPropagation();
                removeTag(index);
            });

            tagsContainer.appendChild(chip);
        });
        hiddenInput.value = selectedTags.join(',');
    };

    const addTag = (tag) => {
        const cleanTag = tag.trim();
        if (cleanTag && !selectedTags.includes(cleanTag)) {
            selectedTags.push(cleanTag);
            renderTags();
        }
        tagInput.value = '';
    };

    const removeTag = (index) => {
        selectedTags.splice(index, 1);
        renderTags();
    };

    // Add Button Click
    addBtn.addEventListener('click', () => {
        addTag(tagInput.value);
    });

    // Enter Key in Input
    tagInput.addEventListener('keydown', (e) => { // keydown better for Enter prevention
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag(tagInput.value);
        }
    });
};

// --- MOCK API (Client-Side Storage) ---
const MockAPI = {
    DB_KEY: 'db_prototipo',

    _getDB() {
        const stored = localStorage.getItem(this.DB_KEY);
        return stored ? JSON.parse(stored) : [];
    },

    _saveDB(data) {
        localStorage.setItem(this.DB_KEY, JSON.stringify(data));
    },

    async register(userData) {
        // Simulate network delay
        await new Promise(r => setTimeout(r, 600));

        const db = this._getDB();
        if (db.some(u => u.email === userData.email)) {
            return { ok: false, message: "Email già registrata" };
        }

        const newUser = { ...userData, registered_at: new Date().toISOString() };
        db.push(newUser);
        this._saveDB(db);
        return { ok: true, user: newUser };
    },

    async login(email, password) {
        await new Promise(r => setTimeout(r, 600));
        const db = this._getDB();
        const user = db.find(u => u.email === email && u.password === password);

        if (user) return { ok: true, user };
        return { ok: false, message: "Credenziali non valide" };
    },

    async searchUsers(query, type) {
        await new Promise(r => setTimeout(r, 300));
        const db = this._getDB();
        const q = query.toLowerCase();

        // Simple search
        const results = db.filter(u =>
            (u.nome && u.nome.toLowerCase().includes(q)) ||
            (u.cognome && u.cognome.toLowerCase().includes(q)) ||
            (u.email && u.email.toLowerCase().includes(q))
        ).map(u => ({
            nome: u.nome,
            cognome: u.cognome,
            email: u.email
        }));

        return { ok: true, users: results }; // consistent with API response structure
    },

    async updateProfile(email, data) {
        await new Promise(r => setTimeout(r, 600));
        const db = this._getDB();
        const index = db.findIndex(u => u.email === email);

        if (index === -1) return { ok: false, message: "Utente non trovato" };

        // Update fields
        const updatedUser = { ...db[index], ...data };
        db[index] = updatedUser;
        this._saveDB(db);

        return { ok: true, user: updatedUser };
    },

    async submitCandidacy(data) {
        await new Promise(r => setTimeout(r, 800));
        const candidacies = JSON.parse(localStorage.getItem('pna_candidacies') || '[]');
        const newCandidacy = {
            ...data,
            submitted_at: new Date().toISOString(),
            id: 'cand_' + Date.now()
        };
        candidacies.push(newCandidacy);
        localStorage.setItem('pna_candidacies', JSON.stringify(candidacies));
        return { ok: true, candidacy: newCandidacy };
    }
};

function initRegistrationForm() {
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        // Init selects
        initInstitutionSelects('registrationForm');

        const handleRegistration = async (e) => {
            if (e) e.preventDefault();

            // In Carbon WC, getting values is via .value property which syncs
            const userProfile = {};

            // Manual collection for Carbon inputs
            registrationForm.querySelectorAll('cds-text-input, cds-select').forEach(el => {
                if (el.name) userProfile[el.name] = el.value;
            });
            // Also collect standard inputs if any
            registrationForm.querySelectorAll('input:not([type="submit"])').forEach(el => {
                if (el.name) userProfile[el.name] = el.value;
            });

            if (userProfile.password !== userProfile.confirm_password) {
                alert('Le password non coincidono');
                return;
            }

            console.log("Registering:", userProfile);

            try {
                // Determine API path (relative or absolute)
                // REPLACED WITH MOCK API for GitHub Pages support
                // const response = await fetch('../engine/api.php?action=register', { ... });

                const response = await MockAPI.register(userProfile);

                if (response.ok) {
                    // Success: save session and redirect
                    localStorage.setItem('pna_user_profile', JSON.stringify(response.user));
                    localStorage.setItem('pna_user_name', `${response.user.nome} ${response.user.cognome}`);
                    alert('Registrazione completata con successo!');
                    window.location.href = 'studente-dashboard.html';
                } else {
                    alert('Errore durante la registrazione: ' + (response.message || 'Errore sconosciuto'));
                }
            } catch (error) {
                console.error('Registration Error:', error);
                alert('Errore di connessione o salvataggio dati.');
            }
        };

        // Attach to Form Submit
        registrationForm.addEventListener('submit', handleRegistration);

        // Attach to Button Click (Carbon WC specific reliability fix)
        const registerBtn = registrationForm.querySelector('cds-button');
        if (registerBtn) {
            registerBtn.addEventListener('click', handleRegistration);
        }
    }
}

function initProfileForm() {
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        // 1. Pre-fill form from localStorage
        const userProfileString = localStorage.getItem('pna_user_profile');
        if (userProfileString) {
            const user = JSON.parse(userProfileString);

            // Map standard fields
            Object.keys(user).forEach(key => {
                const input = profileForm.querySelector(`[name="${key}"]`);
                if (input) {
                    // Skip institution fields for generic map, handle explicitly below
                    if (key !== 'tipologia_istituzione' && key !== 'istituzione') {
                        input.value = user[key];
                    }
                }
            });

            // Handle Institution Selects synchronously now that data is loaded
            const tipologia = profileForm.querySelector('#tipologia_istituzione');
            const istituzione = profileForm.querySelector('#istituzione');

            if (tipologia && user.tipologia_istituzione) {
                // Set the value directly
                tipologia.value = user.tipologia_istituzione;

                // Let's manually trigger the population logic:
                const data = INSTITUTION_DATA[user.tipologia_istituzione];
                if (data && data.istituti) {
                    // Clear Istituzione select
                    istituzione.innerHTML = '<cds-select-item value="" disabled selected>Seleziona Istituzione...</cds-select-item>';

                    istituzione.disabled = false;
                    data.istituti.forEach(nome => {
                        const item = document.createElement('cds-select-item');
                        item.value = nome;
                        item.textContent = nome;
                        istituzione.appendChild(item);
                    });

                    // Now set the second value
                    if (user.istituzione) {
                        istituzione.value = user.istituzione;
                    }
                }
            }

        } else {
            alert("Nessun profilo trovato. Effettua il login.");
            window.location.href = 'login.html';
        }

        const handleProfileUpdate = async (e) => {
            if (e) e.preventDefault();

            // Collect data
            const data = {};
            profileForm.querySelectorAll('cds-text-input, cds-select, cds-date-picker-input, input').forEach(el => {
                if (el.name) data[el.name] = el.value;
            });

            // Handle Selects explicitly if querySelectorAll missed them or value issue
            const tipologia = profileForm.querySelector('#tipologia_istituzione');
            const istituzione = profileForm.querySelector('#istituzione');
            if (tipologia) data['tipologia_istituzione'] = tipologia.value;
            if (istituzione) data['istituzione'] = istituzione.value;

            // Password check (frontend)
            if (data.password && data.password !== data.confirm_password) {
                alert("Le password non coincidono.");
                return;
            }

            try {
                // const response = await fetch('/engine/api.php?action=update_profile', { ... });
                const response = await MockAPI.updateProfile(data.email, data);

                if (response.ok) {
                    alert("Profilo aggiornato con successo!");
                    // Update session
                    localStorage.setItem('pna_user_profile', JSON.stringify(response.user));
                    localStorage.setItem('pna_user_name', `${response.user.nome} ${response.user.cognome}`);
                    window.location.href = 'studente-dashboard.html';
                } else {
                    alert("Errore aggiornamento: " + (response.message || "Errore sconosciuto"));
                }
            } catch (error) {
                console.error("Update error:", error);
                alert("Errore di connessione al server.");
            }
        };

        profileForm.addEventListener('submit', handleProfileUpdate);
        const saveBtn = profileForm.querySelector('cds-button[type="submit"]');
        if (saveBtn) saveBtn.addEventListener('click', handleProfileUpdate);
    }
}

document.addEventListener('DOMContentLoaded', () => {

    // 1. Load Hierarchy Data (Async)
    loadHierarchyData().then(() => {
        initTaxonomySelects('candidaturaForm');
    });

    // 2. Load Institution Data (Async)
    loadInstitutionData().then(() => {
        // Init Registration Page
        initRegistrationForm();

        // Init Profile Page
        initInstitutionSelects('profileForm');
        initProfileForm();
    });

    // 3. Independent Initializations
    initDynamicRelations('candidaturaForm');
    initDynamicFields('candidaturaForm');
    initTagSystem('candidaturaForm');

    // 4. Candidatura Form Submission
    const candidaturaForm = document.getElementById('candidaturaForm');
    if (candidaturaForm) {
        candidaturaForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = {};
            candidaturaForm.querySelectorAll('cds-text-input, cds-textarea, cds-select').forEach(el => {
                if (el.name) data[el.name] = el.value;
            });

            if (candidaturaForm.relationState) {
                data.relazioni = {
                    studenti: candidaturaForm.relationState.studenti,
                    docenti: candidaturaForm.relationState.docenti,
                    performers: candidaturaForm.relationState.performers
                };
            }

            console.log("Candidacy Payload:", data);

            try {
                const response = await MockAPI.submitCandidacy(data);
                if (response.ok) {
                    alert("Candidatura inviata con successo!");
                    window.location.href = 'studente-dashboard.html';
                } else {
                    alert("Errore invio: " + (response.message || 'Errore sconosciuto'));
                }
            } catch (error) {
                console.error("Submission error:", error);
                alert("Errore di salvataggio candidatura.");
            }
        });
    }

    // 5. Login Form Handling
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const handleLogin = async (e) => {
            if (e) e.preventDefault();
            const emailInput = document.getElementById('login_email');
            const passwordInput = document.getElementById('login_password');

            if (!emailInput || !passwordInput) return;

            const email = emailInput.value;
            const password = passwordInput.value;

            if (!email || !password) {
                alert("Inserisci email e password");
                return;
            }

            try {
                const response = await MockAPI.login(email, password);
                if (response.ok) {
                    localStorage.setItem('pna_user_profile', JSON.stringify(response.user));
                    localStorage.setItem('pna_user_name', `${response.user.nome} ${response.user.cognome}`);
                    window.location.href = 'studente-dashboard.html';
                } else {
                    alert('Login fallito: ' + (response.message || "Credenziali non valide"));
                }
            } catch (error) {
                console.error("Login error:", error);
                alert('Errore di accesso.');
            }
        };

        loginForm.addEventListener('submit', handleLogin);
        const loginBtn = loginForm.querySelector('cds-button');
        if (loginBtn) loginBtn.addEventListener('click', handleLogin);
    }

    // 6. Dashboard Data Loading
    const userDataContainer = document.getElementById('userDataContainer');
    if (userDataContainer) {
        loadUserData();
        loadCandidacies(); // Load submitted candidacies
        initDataManagement(); // Init export/import
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                localStorage.removeItem('pna_user_profile');
                localStorage.removeItem('pna_user_name');
                window.location.href = 'login.html';
            });
        }
    }
});

function initDataManagement() {
    const exportBtn = document.getElementById('exportBtn');
    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');

    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const data = {};
            // Collect all pna_ and db_prototipo keys
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith('pna_') || key === 'db_prototipo') {
                    try {
                        const val = localStorage.getItem(key);
                        data[key] = JSON.parse(val);
                    } catch (e) {
                        console.warn(`Export: Could not parse key "${key}", exporting as raw string.`, e);
                        data[key] = localStorage.getItem(key);
                    }
                }
            }

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
            a.href = url;
            a.download = `pna_database_export_${timestamp}.json`;
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    if (importBtn && importFile) {
        importBtn.addEventListener('click', () => importFile.click());

        importFile.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);

                    // Basic Validation
                    const keys = Object.keys(data);
                    if (keys.length === 0) {
                        throw new Error("Il file è vuoto.");
                    }

                    const hasRelevantKeys = keys.some(k => k.startsWith('pna_') || k === 'db_prototipo');
                    if (!hasRelevantKeys) {
                        throw new Error("Il file non sembra contenere dati del portale PNA validi.");
                    }

                    if (confirm("Attenzione: l'importazione sovrascriverà i dati correnti nel browser. Procedere?")) {
                        keys.forEach(key => {
                            const val = typeof data[key] === 'string' ? data[key] : JSON.stringify(data[key]);
                            localStorage.setItem(key, val);
                        });
                        alert("Database importato con successo! La pagina verrà ricaricata.");
                        window.location.reload();
                    }
                } catch (err) {
                    alert("Errore durante l'importazione: " + err.message);
                    console.error("Import error:", err);
                }
                // Reset input to allow re-importing same file if needed
                importFile.value = '';
            };
            reader.readAsText(file);
        });
    }
}

function loadCandidacies() {
    const tableBody = document.getElementById('candidaciesTableBody');
    const noMsg = document.getElementById('noCandidaciesMsg');
    const tableEl = document.querySelector('#candidaciesContainer cds-table');

    if (!tableBody) return;

    const userProfileString = localStorage.getItem('pna_user_profile');
    if (!userProfileString) return;
    const user = JSON.parse(userProfileString);

    const storedCandidacies = localStorage.getItem('pna_candidacies');
    const candidacies = storedCandidacies ? JSON.parse(storedCandidacies) : [];

    // Filter by current user email
    // Note: In our current MockAPI, some data might not have user email if it wasn't captured, 
    // but typically we should match by student email.
    // However, for this prototype, if the user is logged in, we show what's in local storage.
    // Realistically, for multi-user local storage simulation, we filter.
    const userCandidacies = candidacies.filter(c => c.email === user.email || (c.relazioni && c.relazioni.studenti.some(s => s.email === user.email)));

    if (userCandidacies.length === 0) {
        if (noMsg) noMsg.style.display = 'block';
        if (tableEl) tableEl.style.display = 'none';
        return;
    }

    if (noMsg) noMsg.style.display = 'none';
    if (tableEl) tableEl.style.display = 'block';

    tableBody.innerHTML = '';
    userCandidacies.forEach(c => {
        const dateStr = c.submitted_at ? new Date(c.submitted_at).toLocaleDateString('it-IT') : '-';
        const row = document.createElement('cds-table-row');
        row.innerHTML = `
            <cds-table-cell>${c.id_premio || 'N/D'}</cds-table-cell>
            <cds-table-cell>${c.titolo || 'Senza titolo'}</cds-table-cell>
            <cds-table-cell>${dateStr}</cds-table-cell>
            <cds-table-cell><cds-tag type="green">Inviata</cds-tag></cds-table-cell>
        `;
        tableBody.appendChild(row);
    });
}

function loadUserData() {
    const userProfileString = localStorage.getItem('pna_user_profile');
    const container = document.getElementById('userDataContainer');
    if (!container) return;

    if (userProfileString) {
        const user = JSON.parse(userProfileString);
        container.innerHTML = `
            <div class="data-label">Nome Completo</div>
            <div class="data-value">${user.nome} ${user.cognome}</div>
            
            <div class="data-label">Email</div>
            <div class="data-value">${user.email}</div>
            
            <div class="data-label">Istituzione</div>
            <div class="data-value">${user.istituzione || '-'}</div>
            
            <div class="data-label">Matricola</div>
            <div class="data-value">${user.matricola || '-'}</div>
        `;
    } else {
        // container.innerHTML = "<p>Nessun utente loggato. <a href='index.html'>Registrati</a></p>";
        // Per requirements: should redirect or show login
        // Let's redirect to login for "auth protection" feel
        window.location.href = 'login.html';
    }
}
