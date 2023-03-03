import { Schema, model } from "mongoose";
import ICall from "../customInterfaces/ICall";
import IGuild from "../customInterfaces/IGuild";

const Guild = new Schema<IGuild>({
  _id: { type: String, required: true },
  tokenCategory: String,
  callsCategoria: String,
  calls: Array<ICall>,
});

export default model<IGuild>("Guild", Guild);
