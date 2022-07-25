import bcrypt from 'bcrypt';

export default class Authservice {
  public static async hashPassword(
    password: string,
    salt = 10
  ): Promise<string> {
    return await bcrypt.hash(password, salt);
  }

  public static async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<Boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
