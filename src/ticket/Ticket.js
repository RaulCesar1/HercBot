class Ticket {
    constructor(assuntoPrincipal, descricao) {
        this.assuntoPrincipal = assuntoPrincipal
        this.descricao = descricao
        this.id = this.generateID()
    }

    generateID() {
        let ticketID = ''
        const chars = '1234567890'
        for(let i = 0; i < 5; i++) {
            ticketID += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        return ticketID
    }
}

module.exports = Ticket