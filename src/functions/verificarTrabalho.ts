import Herc from "../models/Herc";

export default async function (userID: string) {
  const herc = (await Herc.findOne({ id: process.env.CLIENT_ID }))!;
  const trabalhoEmProgresso: any = herc.trabalhosAtivos.find((trabalho) => trabalho.trabalhadorID == userID);
  return !trabalhoEmProgresso ? false : true;
}
