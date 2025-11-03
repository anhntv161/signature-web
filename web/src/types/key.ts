export interface RSAKeys {
  publicKey: {
    e: number;
    n: number;
  };
  privateKey: {
    d: number;
    n: number;
  };
}
