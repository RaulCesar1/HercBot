const { carregarComandos } = require('../commandHandler.js');
const { emQuestaoReset } = require('../utils/emQuestaoReset.js');
const { loadGuilds } = require('../utils/loadGuilds.js');
const { updateRanking } = require('../utils/updateRanking.js');
const { updateTrabalhos } = require('../utils/updateTrabalhos.js');
const { rStatus } = require('../utils/rStatus.js');
const { oneTimeHerc } = require('../utils/oneTimeHerc.js');

module.exports = {
	async execute(client) {
        carregarComandos()
        emQuestaoReset()
        oneTimeHerc()
        setInterval(rStatus, 10000)
        setInterval(updateRanking, 5000)
        setInterval(updateTrabalhos, 5000)
        setInterval(loadGuilds, 6000)
	},
};