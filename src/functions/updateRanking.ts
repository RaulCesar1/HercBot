import IUser from "../customInterfaces/IUser";
import Herc from "../models/Herc";
import User from "../models/User";

function update() {
  User.find({}, async (err: Error, users: Array<IUser>) => {
    if (err) console.log(err);

    let usuarios = new Map();

    users.map(async (user) => {
      const calculo = (user.xp.level - 1) * 25 * user.xp.level + user.xp.xp;
      usuarios.set(`${user._id}`, calculo);
    });

    usuarios = new Map([...usuarios.entries()].sort((a, b) => b[1] - a[1]));

    const herc = (await Herc.findOne({ id: process.env.CLIENT_ID }))!;

    herc.xpRanking = [...usuarios];
    await herc.save();
  });
}

export default function () {
  setInterval(update, 5000);
}
