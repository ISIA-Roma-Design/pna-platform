/**
 * Shared configuration for all PNA Report visualizations
 * Centralizes section colors and mapping logic
 */

window.VIZ_CONFIG = {
    COLORS: {
        design: "#ef476f",
        arti_visive: "#ffd166",
        arti_spettacolo: "#06d6a0",
        interpretazione_musicale: "#118ab2",
        default: "#999"
    },

    SECTION_LABELS: {
        design: "Design",
        arti_visive: "Arti Visive",
        arti_spettacolo: "Arti dello Spettacolo",
        interpretazione_musicale: "Interpretazione Musicale"
    },

    /**
     * Maps a section name or institution type to its primary section color
     */
    getColorBySection: function (type) {
        if (!type) return this.COLORS.default;
        const t = type.toLowerCase().trim();

        // Exact matches or simplified labels
        if (t === "design") return this.COLORS.design;
        if (t === "arti visive") return this.COLORS.arti_visive;
        if (t === "arti dello spettacolo" || t === "spettacolo") return this.COLORS.arti_spettacolo;
        if (t === "interpretazione musicale" || t === "musica") return this.COLORS.interpretazione_musicale;

        // Institution type keywords (AFAM mapping)
        if (t.includes("conservatorio") || t.includes("musica") || t.includes("issm")) return this.COLORS.interpretazione_musicale;
        if (t.includes("belle arti")) return this.COLORS.arti_visive;
        if (t.includes("danza") || t.includes("drammatica")) return this.COLORS.arti_spettacolo;
        if (t.includes("isia")) return this.COLORS.design;

        return this.COLORS.default;
    }
};
