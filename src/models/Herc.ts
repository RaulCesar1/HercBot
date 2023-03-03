import { Schema, model } from "mongoose";
import IHerc from "../customInterfaces/IHerc";

const Herc = new Schema<IHerc>({
  id: {
    type: String,
    default: process.env.CLIENT_ID as string,
    required: true,
  },
  manutencao: { type: Boolean, default: false, required: true },
  bolsaValores: { type: Number, default: 100, required: true },
  xpRanking: { type: [], default: [], required: true },
  listaCheques: { type: [], default: [], required: true },
  trabalhosAtivos: { type: [], default: [], required: true },
});

export default model<IHerc>("Herc", Herc);
