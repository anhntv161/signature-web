import { DecryptedMessage, EncryptedMessage } from "@/types/secure-message";
import { appApi, BaseRequestParams } from "./api";
import { PrivateKey, PublicKey } from "@/types/key";

interface EncryptedMessageParams extends BaseRequestParams {
  message: string;
  public_key: PublicKey;
}

interface DecryptedMessageParams extends BaseRequestParams {
  ciphertext: string;
  private_key: PrivateKey;
  message_length: number;
}

export const secureMessageApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    encryptMessage: build.mutation<EncryptedMessage, EncryptedMessageParams>({
      query: ({ message, public_key }) => {
        return {
          url: `/api/encrypt-message`,
          method: "POST",
          body: { message, public_key },
        };
      },
    }),

    decryptMessage: build.mutation<DecryptedMessage, DecryptedMessageParams>({
      query: ({ ciphertext, private_key, message_length }) => {
        return {
          url: `/api/decrypt-message`,
          method: "POST",
          body: { ciphertext, private_key, message_length },
        };
      },
    }),
  }),
});

export const { useEncryptMessageMutation, useDecryptMessageMutation } =
  secureMessageApi;
