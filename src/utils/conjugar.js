const axios = require('axios')
const cheerio = require('cheerio')

async function conjugar(verbo) {
    const url_base = `https://www.conjugacao.com.br/verbo-`
    const url = url_base + verbo

    const res = await axios.get(url)
    const data = res.data
    const $ = cheerio.load(data)

    var tabelas_conjugacao = $('.tempo-conjugacao')
    tabelas_conjugacao = tabelas_conjugacao.children('p').children('span').children('span').children('span')

    var array_conjugacoes = []

    for(let i = 0; i < 72; i++) {
        let pp = tabelas_conjugacao[i].children[0].data
        array_conjugacoes.push(pp)
    }

    var array_conjugacoes_final = []

    for(let i = 0; i < array_conjugacoes.length; i+=2) {
        array_conjugacoes_final.push(`${array_conjugacoes[i]} ${array_conjugacoes[i+1]}`)
    }

    return array_conjugacoes_final
}

exports.conjugar = conjugar