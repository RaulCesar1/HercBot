export default function (numeroDecimal: number, paraBase: number): string[] {
  let numeroConvertido: string = "";
  let conversoes = "";

  let paraDividir = numeroDecimal;

  let i = 1;

  do {
    numeroConvertido += (paraDividir % paraBase).toString();
    conversoes += `${i} -> ${paraDividir} ÷ ${paraBase} | Resto: ${paraDividir % paraBase}\n`;
    paraDividir = Math.floor(paraDividir / paraBase);
    i++;
  } while (paraDividir >= paraBase);

  numeroConvertido += paraDividir.toString();

  const nco = numeroConvertido;

  conversoes += `${i} - + ${paraDividir}\n`;

  const array1 = numeroConvertido.split("");
  const arrayReversa = array1.reverse();

  numeroConvertido = arrayReversa.join("");

  conversoes += `${i + 1} - ${nco} -> (inverte) -> ${numeroConvertido}`;

  return [numeroConvertido, conversoes];
}
