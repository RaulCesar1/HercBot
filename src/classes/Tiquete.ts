export default class Tiquete {
  id: string;
  assuntoPrincipal: string;
  descricao: string;

  constructor(assuntoPrincipal: string, descricao: string) {
    this.assuntoPrincipal = assuntoPrincipal;
    this.descricao = descricao;
    this.id = this.gerarID();
  }

  gerarID(): string {
    let tiqueteID: string = "";

    const chars = "1234567890";

    for (let i = 0; i < 5; i++) {
      tiqueteID += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return tiqueteID;
  }
}
