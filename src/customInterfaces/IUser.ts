import IAnotacao from "./IAnotacao";

export default interface IUser {
  _id: string;
  username: string;
  userTag: string;
  economia: {
    banco: {
      saldo: number;
      id: string;
    };
    carteira: {
      saldo: number;
    };
    trabalhando: boolean;
  };
  xp: {
    xp: number;
    level: number;
    rankPos: number;
  };
  anotacoes?: Array<IAnotacao>;
}
