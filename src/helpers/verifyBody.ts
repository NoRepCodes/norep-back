type verifyT = (b: object, v: string[]) => void;
const verifyBody: verifyT = (body, validation) => {
  const keys = Object.keys(body);
  let isWrong: string | boolean = false;
  // console.log(keys);
  keys.forEach((k) => {
    if (!validation.includes(k)) isWrong = k;
  });
  if (isWrong) throw new Error(`Campos Invalidos ${isWrong}`);
};

export default verifyBody;
