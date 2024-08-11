export class Utils {
  static generateOtp(length: number) {
    const code = Math.floor(
      10 ** (length - 1) + Math.random() * 9 * 10 ** (length - 1),
    );

    return code;
  }
}
