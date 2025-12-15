const HIERARCHY_DATA = {
    "arti_performative": {
        label: "Arti Performative",
        sezioni: {
            "arti_spettacolo": {
                label: "Arti dello Spettacolo",
                sottosezioni: {
                    "danza_classica": "Danza Classica",
                    "danza_contemporanea": "Danza Contemporanea",
                    "coreografia": "Coreografia",
                    "regia": "Regia",
                    "recitazione": "Recitazione",
                    "drammaturgia": "Drammaturgia"
                }
            },
            "interpretazione_musicale": {
                label: "Interpretazione Musicale",
                sottosezioni: {
                    "canto_lirico": "Canto Lirico",
                    "musica_vocale_camera": "Musica Vocale da Camera",
                    "chitarra": "Chitarra",
                    "composizione": "Composizione",
                    "direzione_orchestra": "Direzione d'Orchestra",
                    "fisarmonica": "Fisarmonica",
                    "jazz": "Jazz",
                    "musica_camera": "Musica da Camera e d'Insieme",
                    "musica_elettronica": "Musica Elettronica e Nuove Tecnologie",
                    "musica_antica": "Musica per Strumenti Antichi e Voci",
                    "pop_rock": "Musiche Pop e Rock Originali",
                    "organo": "Organo",
                    "pianoforte": "Pianoforte",
                    "musica_legni": "Strumenti a Fiato (Legni)",
                    "musica_ottoni": "Strumenti a Fiato (Ottoni)",
                    "percussioni": "Strumenti a Percussione",
                    "musica_violino_viola": "Strumenti ad Arco (Violino e Viola)",
                    "musica_violoncello_contrabbasso": "Strumenti ad Arco (Violoncello e Contrabbasso)",
                    "musica_mandolino": "Mandolino"
                }
            }
        }
    },
    "arti_visive_design": {
        label: "Arti Visive e Design",
        sezioni: {
            "arti_visive": {
                label: "Arti Visive",
                sottosezioni: {
                    "pittura": "Pittura",
                    "scultura": "Scultura",
                    "arti_grafiche": "Arti Grafiche",
                    "decorazione": "Decorazione",
                    "scenografia": "Scenografia",
                    "arte_elettronica": "Arte Elettronica",
                    "fotografia": "Fotografia",
                    "arti_performative_relazionali": "Arti Performative / Relazionali",
                    "videoinstallazione": "Videoinstallazione",
                    "installazioni_multimediali": "Installazioni Multimediali",
                    "produzioni_audiovisive": "Produzioni Audiovisive",
                    "restauro": "Restauro"
                }
            },
            "design": {
                label: "Design",
                sottosezioni: {
                    "abitare": "Design per l'Abitare",
                    "illuminazione": "Design per l'Illuminazione",
                    "mobilita": "Design per la Mobilità",
                    "lavoro": "Design per il Lavoro",
                    "persona": "Design per la Persona",
                    "food": "Food Design",
                    "materiali": "Design dei Materiali",
                    "comunicazione": "Design della Comunicazione",
                    "servizi": "Design dei Servizi",
                    "sociale": "Design per il Sociale",
                    "allestimento": "Allestimento",
                    "ricerca": "Ricerca Teorico, Storico, Critica"
                }
            }
        }
    }
};

const INSTITUTION_DATA = {
    "accademie_belle_arti": {
        label: "Accademie di Belle Arti",
        istituti: [
            "Accademia di Belle Arti Statale di Bologna",
            "Accademia di Belle Arti Statale di Ravenna",
            "Accademia di Belle Arti Statale di Roma",
            "Accademia di Belle Arti Statale di Frosinone",
            "Accademia di Belle Arti Statale di Genova",
            "Accademia di Belle Arti Statale di Milano (Brera)",
            "Politecnico delle Arti Statale - Sezione Belle Arti “G. Carrara”",
            "Accademia di Belle Arti Statale di Macerata",
            "Accademia di Belle Arti Statale di Urbino",
            "Accademia di Belle Arti Statale di Torino (Albertina)",
            "Accademia di Belle Arti Statale di Bari",
            "Accademia di Belle Arti Statale di Foggia",
            "Accademia di Belle Arti Statale di Lecce",
            "Accademia di Belle Arti Statale di Sassari",
            "Accademia di Belle Arti Statale di Palermo",
            "Accademia di Belle Arti Statale di Catania",
            "Accademia di Belle Arti Statale di Firenze",
            "Accademia di Belle Arti Statale di Carrara",
            "Accademia di Belle Arti Statale di Perugia",
            "Accademia di Belle Arti Statale di Venezia",
            "Accademia di Belle Arti Statale di Verona",
            "Accademia di Belle Arti Statale di Catanzaro",
            "Accademia di Belle Arti Statale di Reggio Calabria",
            "Accademia di Belle Arti Statale di Napoli",
            "Accademia di Belle Arti Statale di L'Aquila",
            "Libera Accademia di Belle Arti (LABA) - Rimini",
            "Accademia di Belle Arti “G.B. Tiepolo” - Udine",
            "Accademia delle Arti e Nuove Tecnologie - Roma",
            "Accademia di Belle Arti “Lorenzo da Viterbo”",
            "Rome University of Fine Arts (RUFA) - Roma",
            "Nuova Accademia di Belle Arti (NABA) - Roma",
            "Accademia di Belle Arti di Sanremo",
            "Academy of Fine Arts and Media (ACME) - Milano",
            "Accademia di Belle Arti “Aldo Galli” - Como",
            "Accademia di Belle Arti “SantaGiulia” - Brescia",
            "Libera Accademia di Belle Arti (LABA) - Brescia",
            "Nuova Accademia di Belle Arti (NABA) - Milano",
            "Accademia di Belle Arti e Design Poliarte - Ancona",
            "Accademia di Belle Arti di Cuneo",
            "Accademia di Belle Arti “Rosario Gagliardi” (MADE) - Siracusa",
            "Accademia di Design e Comunicazione visiva “Abadir” - Catania",
            "Libera Accademia di Belle Arti (LABA) - Firenze",
            "Accademia di Belle Arti “Trentino Art Academy” - Trento"
        ]
    },
    "accademie_nazionali": {
        label: "Accademie Nazionali",
        istituti: [
            "Accademia Nazionale d'Arte Drammatica “Silvio D'Amico”",
            "Accademia Nazionale di Danza"
        ]
    },
    "conservatori": {
        label: "Conservatori di Musica e ISSM",
        istituti: [
            "Conservatorio Statale di Musica L'Aquila 'Alfredo Casella'",
            "Conservatorio Statale di Musica Pescara 'Luisa d'Annunzio'",
            "Conservatorio Statale di Musica Teramo “Gaetano Braga” (ISSMC)",
            "Conservatorio Statale di Musica Potenza 'Gesualdo da Venosa'",
            "Conservatorio Statale di Musica Matera 'Egidio Romualdo Duni'",
            "Conservatorio Statale di Musica Cosenza 'Stanislao Giacomantonio'",
            "Conservatorio Statale di Musica Reggio Calabria 'Francesco Cilea'",
            "Conservatorio Statale di Musica Vibo Valentia 'Fausto Torrefranca'",
            "Conservatorio Statale di Musica Napoli 'S. Pietro a Majella'",
            "Conservatorio Statale di Musica Avellino 'Domenico Cimarosa'",
            "Conservatorio Statale di Musica Benevento 'Nicola Sala'",
            "Conservatorio Statale di Musica Salerno 'Giuseppe Martucci'",
            "Conservatorio Statale di Musica Bologna 'Giovan Battista Martini'",
            "Conservatorio Statale di Musica Ferrara 'Girolamo Frescobaldi'",
            "Conservatorio Statale di Musica Parma 'Arrigo Boito'",
            "Conservatorio Statale di Musica Piacenza 'Giuseppe Nicolini'",
            "Conservatorio Statale di Musica Ravenna “Giuseppe Verdi”",
            "Conservatorio Statale di Musica Trieste 'Giuseppe Tartini'",
            "Conservatorio Statale di Musica Udine 'Jacopo Tomadini'",
            "Conservatorio Statale di Musica Roma 'Santa Cecilia'",
            "Conservatorio Statale di Musica Frosinone 'Licinio Refice'",
            "Conservatorio Statale di Musica Latina 'Ottorino Respighi'",
            "Conservatorio Statale di Musica Genova 'Nicolò Paganini'",
            "Conservatorio Statale di Musica La Spezia 'Giacomo Puccini'",
            "Conservatorio Statale di Musica Milano 'Giuseppe Verdi'",
            "Politecnico delle Arti Statale - Sezione Musicale “G. Donizetti” - Bergamo",
            "Conservatorio Statale di Musica Brescia 'Luca Marenzio'",
            "Conservatorio Statale di Musica Como 'Giuseppe Verdi'",
            "Conservatorio Statale di Musica Cremona “Claudio Monteverdi”",
            "Conservatorio Statale di Musica Mantova 'Lucio Campiani'",
            "Conservatorio Statale di Musica Pavia “Franco Vittadini”",
            "Conservatorio Statale di Musica Fermo 'Giovambattista Pergolesi'",
            "Conservatorio Statale di Musica Pesaro 'Gioachino Rossini'",
            "Conservatorio Statale di Musica Campobasso 'Lorenzo Perosi'",
            "Conservatorio Statale di Musica Torino 'Giuseppe Verdi'",
            "Conservatorio Statale di Musica Alessandria 'Antonio Vivaldi'",
            "Conservatorio Statale di Musica Cuneo 'Giorgio Federico Ghedini'",
            "Conservatorio Statale di Musica Novara 'Guido Cantelli'",
            "Conservatorio Statale di Musica Bari 'Niccolò Piccinni'",
            "Conservatorio Statale di Musica Foggia 'Umberto Giordano'",
            "Conservatorio Statale di Musica Lecce 'Tito Schipa'",
            "Conservatorio Statale di Musica Monopoli 'Nino Rota'",
            "Conservatorio Statale di Musica Taranto “Giovanni Paisiello”",
            "Conservatorio Statale di Musica Cagliari 'Pierluigi da Palestrina'",
            "Conservatorio Statale di Musica Sassari 'Luigi Canepa'",
            "Conservatorio Statale di Musica Palermo 'Alessandro Scarlatti'",
            "Conservatorio Statale di Musica Catania “Vincenzo Bellini”",
            "Conservatorio Statale di Musica Messina 'Arcangelo Corelli'",
            "Conservatorio Statale di Musica Trapani 'Antonio Scontrino'",
            "Conservatorio Statale di Musica Firenze 'Luigi Cherubini'",
            "Conservatorio Statale di Musica Livorno 'Pietro Mascagni'",
            "Conservatorio Statale di Musica Lucca 'Luigi Boccherini'",
            "Conservatorio Statale di Musica Siena 'Rinaldo Franci'",
            "Conservatorio Statale di Musica Trento 'Francesco Antonio Bonporti'",
            "Conservatorio Statale di Musica Bolzano 'Claudio Monteverdi'",
            "Conservatorio Statale di Musica Perugia 'Francesco Morlacchi'",
            "Conservatorio Statale di Musica Terni “Giulio Briccialdi”",
            "Conservatorio Statale di Musica Venezia 'Benedetto Marcello'",
            "Conservatorio Statale di Musica Adria 'Antonio Buzzolla'",
            "Conservatorio Statale di Musica Castelfranco Veneto 'Agostino Steffani'",
            "Conservatorio Statale di Musica Padova 'Cesare Pollini'",
            "Conservatorio Statale di Musica Rovigo 'Francesco Venezze'",
            "Conservatorio Statale di Musica Verona 'Evaristo Felice Dall'Abaco'",
            "Conservatorio Statale di Musica Vicenza 'Arrigo Pedrollo'",
            "Istituto musicale pareggiato della Valle d'Aosta"
        ]
    },
    "isia": {
        label: "ISIA - Istituti Superiori per le Industrie Artistiche",
        istituti: [
            "ISIA Statale Faenza",
            "ISIA Statale Firenze",
            "ISIA Statale Roma",
            "ISIA Statale Pescara",
            "ISIA Statale Urbino"
        ]
    },
    "istituti_design_moda": {
        label: "Istituti di Design, Moda e Belle Arti",
        istituti: [
            "Istituto del Design Matera",
            "Accademia della Moda (IUAD) - Napoli",
            "Accademia di Costume e Moda - Roma",
            "Istituto Europeo del Design (IED) - Roma",
            "Istituto Pantheon Design & Technology - Roma",
            "Istituto Quasar / Quasar Institute for Advanced Design - Roma",
            "Accademia Italiana di moda, design e fotografia - Roma",
            "Accademia del Lusso - Milano",
            "Istituto Marangoni - Milano",
            "Raffles Milano - Istituto Moda e Design",
            "Istituto Secoli - Milano",
            "Istituto d'Arte Applicata e Design (IAAD) - Torino",
            "Istituto Modartech - Pontedera",
            "Istituto Italiano Design - Perugia",
            "Scuola Italiana Design (SID) - Padova"
        ]
    },
    "istituti_musicali_privati": {
        label: "Istituti Musicali (Privati/Pareggiati)",
        istituti: [
            "Saint Louis College of Music - Roma",
            "Civica Scuola di Musica “Claudio Abbado” - Milano",
            "CPM Music Institute - Milano",
            "Scuola di Musica di Fiesole",
            "Accademia Siena Jazz"
        ]
    },
    "istituti_teatro": {
        label: "Istituti di Teatro e Coreutica",
        istituti: [
            "The Bernstein School of Musical Theater - Bologna",
            "Accademia Internazionale di Teatro - Roma",
            "Accademia Teatro alla Scala - Milano",
            "Civica Scuola di Teatro “Paolo Grassi” - Milano",
            "Scuola del Teatro Musicale (STM) - Novara"
        ]
    },
    "altri": {
        label: "Altri Istituti",
        istituti: [
            "SAE Institute - Milano"
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Check if running via file protocol
    if (window.location.protocol === 'file:') {
        alert("ATTENZIONE: Stai aprendo il sito come file locale. PHP non può funzionare in questo modo.\n\nDevi avviare un server locale.\nApri il terminale nella cartella del progetto ed esegui:\nphp -S localhost:8000\n\nPoi visita: http://localhost:8000");
        return;
    }

    // Check if we are on the registration page
    const registrationForm = document.getElementById('registrationForm');
    if (registrationForm) {
        handleRegistration(registrationForm);
    }

    // Check if we are on the dashboard page
    const dashboardSection = document.getElementById('candidacies-section');
    if (dashboardSection) {
        handleDashboard();
    }
    // Check if we are on the candidacy page
    const candidacyForm = document.getElementById('candidacyForm');
    if (candidacyForm) {
        handleCandidacy(candidacyForm);
    }
});

function handleRegistration(form) {
    const tipologiaSelect = document.getElementById('tipologia_istituzione');
    const istituzioneSelect = document.getElementById('istituzione');

    if (tipologiaSelect && istituzioneSelect) {
        // Populate Tipologia
        for (const [key, value] of Object.entries(INSTITUTION_DATA)) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = value.label;
            option.classList.add('bx--select-option');
            tipologiaSelect.appendChild(option);
        }

        // Handle Change
        tipologiaSelect.addEventListener('change', (e) => {
            const selectedKey = e.target.value;
            const istituti = INSTITUTION_DATA[selectedKey]?.istituti;

            istituzioneSelect.innerHTML = '<option value="" disabled selected>Seleziona Istituzione...</option>';
            istituzioneSelect.disabled = true;

            if (istituti) {
                istituzioneSelect.disabled = false;
                istituti.forEach(nome => {
                    const option = document.createElement('option');
                    option.value = nome;
                    option.textContent = nome;
                    option.classList.add('bx--select-option');
                    istituzioneSelect.appendChild(option);
                });
            }
        });
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm_password').value;

        if (password !== confirmPassword) {
            alert('Le password non coincidono!');
            return;
        }

        const formData = new FormData(form);
        const userProfile = {};
        formData.forEach((value, key) => {
            if (key !== 'password' && key !== 'confirm_password') {
                userProfile[key] = value;
            }
        });

        // Send to PHP Backend
        fetch('api.php?action=register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userProfile),
        })
            .then(async response => {
                const text = await response.text();
                try {
                    const data = JSON.parse(text);
                    if (!response.ok) throw new Error(data.message || 'Server error');
                    return data;
                } catch (e) {
                    console.error('Server response:', text);
                    if (text.includes('<?php')) {
                        throw new Error('PHP non eseguito. Assicurati di usare un server web (es. localhost).');
                    }
                    throw new Error('Risposta del server non valida: ' + (e.message || text.substring(0, 50)));
                }
            })
            .then(data => {
                console.log('Success:', data);
                localStorage.setItem('pna_user_profile', JSON.stringify(userProfile));
                localStorage.setItem('pna_user_name', `${userProfile.nome} ${userProfile.cognome}`);
                window.location.href = 'dashboard.html';
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('Errore: ' + error.message);
            });
    });
}

function handleDashboard() {
    const userName = localStorage.getItem('pna_user_name');
    const userProfileString = localStorage.getItem('pna_user_profile');

    if (userName) {
        const userNameDisplay = document.getElementById('userNameDisplay');
        if (userNameDisplay) {
            userNameDisplay.textContent = userName;
        }
    } else {
        window.location.href = 'index.html';
        return;
    }

    // Navigation and Profile Logic... (Simplified for brevity, same as before)
    const navLinks = document.querySelectorAll('.list-item');
    const sections = document.querySelectorAll('.section-content');
    const pageTitle = document.getElementById('pageTitle');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            sections.forEach(section => section.classList.add('hidden'));
            sections.forEach(section => section.classList.remove('active'));
            const sectionId = link.getAttribute('data-section');
            const targetSection = document.getElementById(`${sectionId}-section`);
            if (targetSection) {
                targetSection.classList.remove('hidden');
                targetSection.classList.add('active');
            }
            if (pageTitle) pageTitle.textContent = link.querySelector('span').textContent;
        });
    });

    if (userProfileString) {
        try {
            const userProfile = JSON.parse(userProfileString);
            for (const [key, value] of Object.entries(userProfile)) {
                const element = document.getElementById(`profile_${key}`);
                if (element) {
                    element.value = value;
                    const label = document.querySelector(`label[for="profile_${key}"]`);
                    if (label) label.classList.add('active');
                }
            }
        } catch (e) { console.error(e); }
    }
    updateCandidacyList();
}

function updateCandidacyList() {
    const listContainer = document.getElementById('candidacies-section');
    const candidacies = JSON.parse(localStorage.getItem('pna_candidacies') || '[]');

    if (candidacies.length > 0) {
        const notification = listContainer.querySelector('.bx--inline-notification');
        if (notification) notification.style.display = 'none';

        const existingList = listContainer.querySelector('.candidacy-list');
        if (existingList) existingList.remove();

        let html = '<div class="bx--row candidacy-list mb-4">';
        candidacies.forEach((c) => {
            // Retrieve labels from IDs if possible, or use IDs
            const premioLabel = HIERARCHY_DATA[c.premio]?.label || c.premio;
            // Need safely access nested props
            const sezioneLabel = HIERARCHY_DATA[c.premio]?.sezioni[c.sezione]?.label || c.sezione;

            html += `
                <div class="bx--col-md-6 mb-3">
                    <div class="bx--tile">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div>
                                <h5 style="font-weight: 700;">${c.design_titolo || c.teatro_titolo || c.danza_titolo || 'Nuova Candidatura'}</h5>
                                <p class="bx--label-description">Premio: <strong>${premioLabel}</strong></p>
                                <p class="bx--label-description">Sezione: ${sezioneLabel}</p>
                            </div>
                            <span class="bx--tag bx--tag--green">Inviata</span>
                        </div>
                    </div>
                </div>
            `;
        });
        html += '</div>';
        const btn = listContainer.querySelector('.bx--btn');
        listContainer.insertBefore(document.createRange().createContextualFragment(html), btn);
    }
}

function handleCandidacy(form) {
    const premioSelect = document.getElementById('premio');
    const sezioneSelect = document.getElementById('sezione');
    const sottosezioneSelect = document.getElementById('sottosezione');
    const sezioneWrapper = document.getElementById('sezione_wrapper');
    const sottosezioneWrapper = document.getElementById('sottosezione_wrapper');

    // Populate Premis
    premioSelect.innerHTML = '<option value="" disabled selected>Seleziona un premio...</option>';
    for (const [key, value] of Object.entries(HIERARCHY_DATA)) {
        const option = document.createElement('option');
        option.value = key;
        option.textContent = value.label;
        option.classList.add('bx--select-option');
        premioSelect.appendChild(option);
    }

    // Handle Premio Change
    premioSelect.addEventListener('change', (e) => {
        const premioKey = e.target.value;
        const sezioni = HIERARCHY_DATA[premioKey]?.sezioni;

        // Reset Sezione
        sezioneSelect.innerHTML = '<option value="" disabled selected>Seleziona una sezione...</option>';
        sottosezioneSelect.innerHTML = '<option value="" disabled selected>Seleziona una sottosezione...</option>';
        sottosezioneWrapper.classList.add('hidden');
        hideAllSpecificFields();

        if (sezioni) {
            sezioneWrapper.classList.remove('hidden');
            for (const [key, value] of Object.entries(sezioni)) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = value.label;
                option.classList.add('bx--select-option');
                sezioneSelect.appendChild(option);
            }
        }
    });

    // Handle Sezione Change
    sezioneSelect.addEventListener('change', (e) => {
        const premioKey = premioSelect.value;
        const sezioneKey = e.target.value;
        const sottosezioni = HIERARCHY_DATA[premioKey]?.sezioni[sezioneKey]?.sottosezioni;

        sottosezioneSelect.innerHTML = '<option value="" disabled selected>Seleziona una sottosezione...</option>';
        hideAllSpecificFields();

        if (sottosezioni) {
            sottosezioneWrapper.classList.remove('hidden');
            for (const [key, label] of Object.entries(sottosezioni)) {
                const option = document.createElement('option');
                option.value = key;
                option.textContent = label;
                option.classList.add('bx--select-option');
                sottosezioneSelect.appendChild(option);
            }
        } else {
            // No subsection (unlikely per requirements, but possible)
            sottosezioneWrapper.classList.add('hidden');
        }
    });

    // Handle Sottosezione Change (Show Fields)
    sottosezioneSelect.addEventListener('change', (e) => {
        const value = e.target.value;
        const premio = premioSelect.value;
        const sezione = sezioneSelect.value;

        hideAllSpecificFields();

        // --- DESIGN ---
        if (premio === 'arti_visive_design' && sezione === 'design') {
            document.getElementById('specific_fields_design').classList.remove('hidden');
        }
        // --- ARTI VISIVE ---
        else if (premio === 'arti_visive_design' && sezione === 'arti_visive') {
            document.getElementById('specific_fields_arti_visive').classList.remove('hidden');
        }
        // --- TEATRO ---
        else if (value === 'recitazione') {
            document.getElementById('specific_fields_teatro_recitazione').classList.remove('hidden');
        } else if (value === 'regia') {
            document.getElementById('specific_fields_teatro_regia').classList.remove('hidden');
        } else if (value === 'drammaturgia') {
            document.getElementById('specific_fields_teatro_drammaturgia').classList.remove('hidden');
        }
        // --- DANZA ---
        else if (value === 'danza_classica') {
            document.getElementById('specific_fields_danza_classica').classList.remove('hidden');
        } else if (value === 'danza_contemporanea') {
            document.getElementById('specific_fields_danza_contemporanea').classList.remove('hidden');
        } else if (value === 'coreografia') {
            document.getElementById('specific_fields_danza_coreografia').classList.remove('hidden');
        }
        // --- MUSICA ---
        // --- MUSICA ---
        else if (value === 'composizione') document.getElementById('specific_fields_musica_composizione').classList.remove('hidden');
        else if (value === 'fisarmonica') document.getElementById('specific_fields_musica_fisarmonica').classList.remove('hidden');
        else if (value === 'musica_antica') document.getElementById('specific_fields_musica_antica').classList.remove('hidden');
        else if (value === 'organo') document.getElementById('specific_fields_musica_organo').classList.remove('hidden');
        else if (value === 'jazz') document.getElementById('specific_fields_musica_jazz').classList.remove('hidden');
        else if (value === 'musica_camera' || value === 'musica_vocale_camera') document.getElementById('specific_fields_musica_camera').classList.remove('hidden');
        else if (value === 'musica_legni') document.getElementById('specific_fields_musica_legni').classList.remove('hidden');
        else if (value === 'musica_ottoni') document.getElementById('specific_fields_musica_ottoni').classList.remove('hidden');
        else if (value === 'pianoforte') document.getElementById('specific_fields_musica_pianoforte').classList.remove('hidden');
        else if (value === 'percussioni') document.getElementById('specific_fields_musica_percussioni').classList.remove('hidden');
        else if (value === 'musica_violino_viola') document.getElementById('specific_fields_musica_archi').classList.remove('hidden');
        else if (value === 'musica_violoncello_contrabbasso') document.getElementById('specific_fields_musica_bassi').classList.remove('hidden');
        else if (value === 'musica_elettronica') document.getElementById('specific_fields_musica_elettronica').classList.remove('hidden');
        else if (value === 'pop_rock') document.getElementById('specific_fields_musica_pop_rock').classList.remove('hidden');
        else if (value === 'direzione_orchestra') document.getElementById('specific_fields_musica_direzione').classList.remove('hidden');
        // For now, I will map 'strumenti_arco' to `musica_archi` (Violin/Viola) and let User know if Cello is missing in Hierarchy.
        // Actually, let's map 'canto_lirico' and 'chitarra' to generic or omit if no table.
    });

    function hideAllSpecificFields() {
        document.querySelectorAll('.specific-section').forEach(el => el.classList.add('hidden'));
    }

    // --- Mock Data ---
    const MOCK_DOCENTI = [
        { id: 1, nome: "Mario", cognome: "Rossi" },
        { id: 2, nome: "Luigi", cognome: "Verdi" },
        { id: 3, nome: "Anna", cognome: "Bianchi" },
        { id: 4, nome: "Giulia", cognome: "Esposito" }
    ];

    const MOCK_STUDENTI = [
        { id: 101, nome: "Luca", cognome: "Moretti" },
        { id: 102, nome: "Sofia", cognome: "Ricci" },
        { id: 103, nome: "Marco", cognome: "Romano" },
        { id: 104, nome: "Chiara", cognome: "Colombo" }
    ];

    // Helper to create toggle UI
    function createRowUI(type, index, mockData) {
        const isTutor = type === 'docente';
        const labelStr = isTutor ? 'Docente' : 'Studente';
        const namePrefix = isTutor ? 'docente' : 'studente_collab';

        // Options for select
        let options = `<option value="" selected disabled>Seleziona ${labelStr}...</option>`;
        mockData.forEach(p => {
            options += `<option value="${p.id}">${p.nome} ${p.cognome}</option>`;
        });

        return `
            <div class="bx--col-lg-12 mb-2">
                <div class="bx--form-item">
                     <div class="bx--radio-button-group">
                        <div class="bx--radio-button-wrapper">
                            <input id="${namePrefix}_mode_list_${index}" class="bx--radio-button" type="radio" value="list" name="${namePrefix}_mode_${index}" checked onchange="toggleInputMode(this, '${namePrefix}', ${index})">
                            <label for="${namePrefix}_mode_list_${index}" class="bx--radio-button__label">
                                <span class="bx--radio-button__appearance"></span>
                                Seleziona da lista
                            </label>
                        </div>
                        <div class="bx--radio-button-wrapper">
                            <input id="${namePrefix}_mode_new_${index}" class="bx--radio-button" type="radio" value="new" name="${namePrefix}_mode_${index}" onchange="toggleInputMode(this, '${namePrefix}', ${index})">
                            <label for="${namePrefix}_mode_new_${index}" class="bx--radio-button__label">
                                <span class="bx--radio-button__appearance"></span>
                                Aggiungi Nuovo
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <!-- List Mode -->
            <div id="${namePrefix}_container_list_${index}" class="bx--col-lg-10">
                 <div class="bx--form-item">
                    <div class="bx--select">
                        <label class="bx--label">${labelStr} (da lista)</label>
                        <div class="bx--select-input__wrapper">
                            <select name="${namePrefix}_select_${index}" class="bx--select-input">
                                ${options}
                            </select>
                            <svg focusable="false" preserveAspectRatio="xMidYMid meet" style="will-change: transform;" xmlns="http://www.w3.org/2000/svg" class="bx--select__arrow" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><path d="M8 11L3 6 3.7 5.3 8 9.6 12.3 5.3 13 6z"></path></svg>
                        </div>
                    </div>
                 </div>
            </div>

            <!-- New Mode (Hidden by default) -->
            <div id="${namePrefix}_container_new_${index}" class="bx--col-lg-10 hidden" style="display: flex; gap: 1rem;">
                <div class="bx--form-item" style="flex: 1;">
                    <label class="bx--label">Nome ${labelStr}</label>
                    <input name="${namePrefix}_nome_${index}" type="text" class="bx--text-input" placeholder="Nome">
                </div>
                <div class="bx--form-item" style="flex: 1;">
                    <label class="bx--label">Cognome ${labelStr}</label>
                    <input name="${namePrefix}_cognome_${index}" type="text" class="bx--text-input" placeholder="Cognome">
                </div>
            </div>

            <div class="bx--col-lg-2" style="display: flex; align-items: flex-end;">
                <button type="button" class="bx--btn bx--btn--danger--ghost bx--btn--icon-only tooltip--bottom" aria-label="Rimuovi" onclick="this.closest('.${isTutor ? 'tutor-row' : 'student-row'}').remove()">
                    &times;
                </button>
            </div>
        `;
    }

    // Window global to be accessible from inline onchange
    window.toggleInputMode = function (radio, namePrefix, index) {
        const listContainer = document.getElementById(`${namePrefix}_container_list_${index}`);
        const newContainer = document.getElementById(`${namePrefix}_container_new_${index}`);

        if (radio.value === 'list') {
            listContainer.classList.remove('hidden');
            newContainer.classList.add('hidden');
        } else {
            listContainer.classList.add('hidden');
            newContainer.classList.remove('hidden');
        }
    };

    // --- Dynamic Tutors Logic ---
    const tutorContainer = document.getElementById('tutor_container');
    const addTutorBtn = document.getElementById('add_tutor_btn');

    function addTutorRow() {
        const index = Date.now(); // Use timestamp for unique IDs across adds/removes
        const div = document.createElement('div');
        div.className = 'bx--row mb-3 tutor-row';
        div.style.alignItems = "flex-end";
        div.innerHTML = createRowUI('docente', index, MOCK_DOCENTI);
        tutorContainer.appendChild(div);
    }

    // Add first row by default
    addTutorRow();

    addTutorBtn.addEventListener('click', addTutorRow);


    // --- Dynamic Students Logic ---
    const studentContainer = document.getElementById('student_container');
    const addStudentBtn = document.getElementById('add_student_btn');

    function addStudentRow() {
        const index = Date.now();
        const div = document.createElement('div');
        div.className = 'bx--row mb-3 student-row';
        div.style.alignItems = "flex-end";
        div.innerHTML = createRowUI('studente', index, MOCK_STUDENTI);
        studentContainer.appendChild(div);
    }

    // Add first row by default
    addStudentRow();

    addStudentBtn.addEventListener('click', addStudentRow);


    // --- Form Submission ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
            e.stopPropagation();
            form.classList.add('was-validated');
            return;
        }

        const formData = new FormData(form);
        const candidacyData = {};

        // Collect standard fields
        formData.forEach((value, key) => {
            // Skip dynamic fields keys (they have prefixes like docente_nome_, docente_mode_, etc.)
            if (!key.startsWith('docente_') && !key.startsWith('studente_collab_')) {
                candidacyData[key] = value;
            }
        });

        // Helper to extract person data from row
        function extractPersonData(row, prefix, mockData) {
            // Find the mode radio
            const modeRadio = row.querySelector(`input[name^="${prefix}_mode_"]:checked`);
            if (!modeRadio) return null; // Should not happen

            const mode = modeRadio.value;
            if (mode === 'list') {
                const select = row.querySelector(`select[name^="${prefix}_select_"]`);
                const id = select.value;
                if (!id) return null; // Not selected
                const person = mockData.find(p => p.id == id);
                return person ? { ...person, source: 'list' } : null;
            } else {
                const nomeInput = row.querySelector(`input[name^="${prefix}_nome_"]`);
                const cognomeInput = row.querySelector(`input[name^="${prefix}_cognome_"]`);
                const nome = nomeInput.value.trim();
                const cognome = cognomeInput.value.trim();
                if (nome && cognome) return { nome, cognome, source: 'new' };
                return null;
            }
        }

        // Parse Tutors
        const docenti = [];
        document.querySelectorAll('.tutor-row').forEach(row => {
            const data = extractPersonData(row, 'docente', MOCK_DOCENTI);
            if (data) docenti.push(data);
        });
        candidacyData['docenti'] = docenti;

        // Parse Collaborators
        const collaboratori = [];
        document.querySelectorAll('.student-row').forEach(row => {
            const data = extractPersonData(row, 'studente_collab', MOCK_STUDENTI);
            if (data) collaboratori.push(data);
        });
        candidacyData['studenti_collaboratori'] = collaboratori;


        const userProfile = JSON.parse(localStorage.getItem('pna_user_profile') || '{}');
        candidacyData['student_email'] = userProfile.email;

        fetch('api.php?action=submit_candidacy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(candidacyData),
        })
            .then(async response => {
                const text = await response.text();
                try { return JSON.parse(text); } catch (e) { throw new Error(text); }
            })
            .then(data => {
                const current = JSON.parse(localStorage.getItem('pna_candidacies') || '[]');
                current.push(candidacyData);
                localStorage.setItem('pna_candidacies', JSON.stringify(current));
                alert('Candidatura inviata!');
                window.location.href = 'dashboard.html';
            })
            .catch(err => alert('Errore: ' + err.message));
    });
}
