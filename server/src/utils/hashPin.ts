import bcrypt from "bcrypt";

export const hashPin = async (pin: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPin = await bcrypt.hash(pin, saltRounds);
  return hashedPin;
};


export const comparePin = async (
  plainPin: string,
  hashedPin: string
): Promise<boolean> => {
  const match = await bcrypt.compare(plainPin, hashedPin);
  return match;
};
