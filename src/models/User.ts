import { Schema, model } from "mongoose";
import { randomUUID } from "crypto";
import IAnotacao from "../customInterfaces/IAnotacao";
import IUser from "../customInterfaces/IUser";

const User = new Schema<IUser>({
  _id: { type: String, required: true },
  username: { type: String, required: true },
  userTag: { type: String, required: true },
  economia: {
    banco: {
      saldo: { type: Number, required: true, default: 0 },
      id: { type: String, required: true, default: randomUUID() },
    },
    carteira: {
      saldo: { type: Number, required: true, default: 0 },
    },
    trabalhando: { type: Boolean, required: true, default: false },
  },
  xp: {
    xp: { type: Number, required: true, default: 1 },
    level: { type: Number, required: true, default: 1 },
    rankPos: { type: Number, required: true, default: 0 },
  },
  anotacoes: Array<IAnotacao>,
});

export default model<IUser>("User", User);
