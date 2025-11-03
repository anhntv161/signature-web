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

export interface PublicKey {
  e: number;
  n: number;
}

export interface PrivateKey {
  d: number;
  n: number;
}
