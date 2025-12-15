---
config:
  layout: dagre
  look: classic
  theme: neo
---
flowchart LR
    A["INIZIO: Iscrizione Studente AFAM (A.A. 2024/2025)"] --> B{"AFAM: Preselezione Interna e Invio Modulo Ufficiale (Firmato dal Direttore)"}
    B -- Via PEC/Mail/Online --> C{"SCELTA SEZIONE PNA"}
    C --> D("DESIGN: Misto Digitale + Fisico (XVIII Ed.)") & V("ARTI VISIVE: Figurative, Digitali, Scenografiche (XVIII Ed.)") & S{"ARTI DELLO SPETTACOLO"} & M{"INTERPRETAZIONE MUSICALE"}
    D --> D1["FASE 1/2: INVIO ADESIONE Istituzione (Modulo A) & CANDIDATURE PROGETTI (Modulo B + Materiale Digitale)"]
    D1 -- Entro 26 Ago 2024 --> D2{"FASE 3: Giuria - PRESELEZIONE su Materiale Digitale"}
    D2 -- NON Selezionato --> Z1["Esclusione"]
    D2 -- Selezionato (Elenco pubblicato entro Settembre 2024) --> D3["FASE 4: INVIO MATERIALI MOSTRA (Pannelli, Modelli Fisici)"]
    D3 -- Spese a carico AFAM --> DF["FASE 5: PREMIAZIONE e Mostra (8-11 Nov 2024, Firenze)"]
    V --> V1["FASE 1: SOTTOMISSIONE DOCUMENTALE DIGITALE (Modulo Iscrizione firmato + 3 Immagini TIFF/Video)"]
    V1 -- Entro 31 Luglio 2024 (via PEO) --> V2{"FASE 2: Giuria - SELEZIONE su Materiale Documentale"}
    V2 -- NON Selezionato --> Z2["Esclusione"]
    V2 -- Selezionato (Comunicazione 10 Settembre 2024) --> V3["FASE 3: CONSEGNA OPERE FISICHE (Opere/Pannelli forex per Restauro)"]
    V3 -- "11-25 Settembre 2024 (Spese a carico AFAM)" --> VF["FASE 4: Cerimonia PREMIAZIONE e Mostra (18 Ottobre 2024, Catania)"]
    S --> SD("Danza (XVIII/XIX Ed.): Video Eliminatorio + Finale In Presenza") & ST("Teatro (XIX Ed.): Digitale + Finali In Presenza")
    SD --> SD1["FASE 1: Iscrizione (PEC) + Invio Link Video Eliminatorio (VIMEO, senza editing, ripresa totale)"]
    SD1 -- Entro 30 Set 2024 / 10 Ott 2025 --> SD2{"Giuria: Valutazione Video (Eliminatoria)"}
    SD2 -- Non selezionato --> Z3["Esclusione"]
    SD2 -- Selezionato --> SD3["FASE 2: Prova Finale IN PRESENZA (Esecuzione brano indicato dalla Giuria + Consegna Chiavetta USB)"]
    SD3 -- Nov 2024/2025 --> SF["Proclamazione Vincitore Unico (AND Roma)"]
    ST --> ST1["FASE 1: Iscrizione (Mail) + Invio Materiali Digitali (Video/Script + Application Form)"]
    ST1 -- Entro 27 Settembre 2025 --> ST2{"Giuria: Valutazione Preselezione (Interna AFAM esterni / In presenza interni ANDAD)"}
    ST2 -- Non selezionato --> Z4["Esclusione"]
    ST2 -- Selezionato --> ST3["Pubblicazione Elenco Finalisti (Entro 8 Nov 2025)"]
    ST3 --> ST4{"FASE 2: Selezioni FINALI PUBBLICHE IN PRESENZA"}
    ST4 -- Prove Tecniche Obbligatorie --> TF["PREMIAZIONE Finale (Entro 31 Dicembre 2025)"]
    M --> MC["MUSICA: Composizione - Anonimato"] & M3V["MUSICA: 3 Fasi con Filtro Video [Pianoforte, Jazz, Ottoni, Violino/Viola, Pop/Rock, Dir. Orchestra]"] & M2P["MUSICA: 2 Fasi In Presenza [Fisarmonica, Organo, Musica Antica, Percussioni, Legni, Violoncello/Contrabbasso]"] & ME["MUSICA ELETTRONICA: Esecuzione Curata"]
    MC --> MC1["FASE 1: Iscrizione (PEC) + Invio Partitura/Parti in Formato ANOMINO con MOTTO (Link Drive)"]
    MC1 -- Entro 5 Ottobre 2025 --> MC2{"FASE 2: Giuria - Valutazione Remota (Anonima). Seleziona 5 partiture"}
    MC2 -- Non Selezionato --> Z5["Esclusione"]
    MC2 -- Selezionato (Elenco 15 Ottobre 2025) --> MC3["FASE 3: Esecuzione Pubblica Finale (22 Nov 2025, Milano)"]
    MC3 --> MF["Fine Sezione Musica"]
    M3V --> M3V1["FASE 1: Iscrizione + Invio Link Video Eliminatorio (Video senza editing/montaggio, ripresa fissa)"]
    M3V1 -- Giuria Valuta (Remoto) --> M3V2{"FASE 2: Prova Semifinale IN PRESENZA (Sorteggio obbligatorio, Programma diverso/libero)"}
    M3V2 -- Non Ammesso --> Z6["Esclusione"]
    M3V2 -- Selezionato --> M3V3["FASE 3: Prova Finale IN PRESENZA (Concerto Pubblico/Brani Obbligo)"]
    M3V3 --> MF
    M2P --> M2P1["FASE 1: Iscrizione (PEC) con Programma Eliminatorio e Finale completo"]
    M2P1 -- Sorteggio Pubblico (Ordine di Esecuzione) --> M2P2["FASE 2: Prova Eliminatoria (In Presenza/Durata max definita)"]
    M2P2 -- Non Ammesso --> Z7["Esclusione"]
    M2P2 -- Ammesso (Numero max definito) --> M2P3["FASE 3: Prova Finale (In Presenza/Concerto Pubblico, Brani NON ripetibili)"]
    M2P3 --> MF
    ME --> ME1["FASE 1: Iscrizione (PEC) + Sottomissione Digitale Opere (Max 10 min, Cat. A, B, C)"]
    ME1 -- Entro 1 Settembre 2025 --> ME2{"Giuria: Valutazione Opere e Selezione per Sessioni Pubbliche"}
    ME2 -- Non Selezionato --> Z8["Esclusione"]
    ME2 -- Selezionato --> ME3["FASE 2: Sessioni Aperte al Pubblico (Partecipazione obbligatoria per Esecuzione/Allestimento)"]
    ME3 --> MF
    DF --> END["END: Processo Concluso/Proclamazione Vincitori (Non Ex Aequo)"]
    VF --> END
    SF --> END
    TF --> END
    MF --> END
