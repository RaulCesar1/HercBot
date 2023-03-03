import ICall from "./ICall";

export default interface IGuild {
  _id: string;
  tokenCategory?: string;
  callsCategoria?: string;
  calls: Array<ICall>;
}
