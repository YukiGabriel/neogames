// Sistema de salvamento global para todos os jogos
export const SaveSystem = {
    save(gameSlug, data) {
        try {
            const allSaves = this.getAllSaves();
            allSaves[gameSlug] = {
                ...data,
                lastPlayed: new Date().toISOString()
            };
            localStorage.setItem('neoGamesProgress', JSON.stringify(allSaves));
            return true;
        } catch (e) {
            console.error('Erro ao salvar:', e);
            return false;
        }
    },

    load(gameSlug) {
        try {
            const allSaves = this.getAllSaves();
            return allSaves[gameSlug] || null;
        } catch (e) {
            console.error('Erro ao carregar:', e);
            return null;
        }
    },

    getAllSaves() {
        try {
            const data = localStorage.getItem('neoGamesProgress');
            return data ? JSON.parse(data) : {};
        } catch (e) {
            return {};
        }
    },

    delete(gameSlug) {
        try {
            const allSaves = this.getAllSaves();
            delete allSaves[gameSlug];
            localStorage.setItem('neoGamesProgress', JSON.stringify(allSaves));
            return true;
        } catch (e) {
            return false;
        }
    },

    clearAll() {
        try {
            localStorage.removeItem('neoGamesProgress');
            return true;
        } catch (e) {
            return false;
        }
    }
};

if (typeof window !== 'undefined') {
    window.NeoGamesSave = SaveSystem;
}
