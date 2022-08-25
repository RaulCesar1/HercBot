module.exports = function tipos(type) {
	switch(type) {
		case 2:
		case 3:
			return 'Context Menu'
		case undefined:
			return 'Slash Command'
		default:
			return 'Unknown'
	}
}