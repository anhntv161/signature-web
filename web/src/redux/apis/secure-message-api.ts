import { DecryptedMessage, EncryptedMessage } from "@/types/secure-message";
import { appApi, BaseRequestParams } from "./api";
import { PrivateKey, PublicKey } from "@/types/key";

/** 
 * Cho phép 2 dạng payload cho encrypt:
 * 1) Kiểu mới: gửi e, n ở top-level
 * 2) Kiểu cũ: gói trong public_key
 */
type EncryptWithTopLevel = BaseRequestParams & {
  message: string;
  e: string;
  n: string;
};

type EncryptWithPublicKey = BaseRequestParams & {
  message: string;
  public_key: PublicKey;
};

export type EncryptedMessageParams = EncryptWithTopLevel | EncryptWithPublicKey;

export interface DecryptedMessageParams extends BaseRequestParams {
  ciphertext: string;
  private_key: PrivateKey;
  message_length: number;
}

export const secureMessageApi = appApi.injectEndpoints({
  endpoints: (build) => ({
    /** 
     * /api/encrypt-message
     * Không ép body nữa, để nguyên để client có thể gửi {message,e,n} hoặc {message, public_key:{e,n}}
     */
    encryptMessage: build.mutation<EncryptedMessage, EncryptedMessageParams>({
      query: (body) => ({
        url: `/api/encrypt-message`,
        method: "POST",
        body,
      }),
    }),

    /**
     * /api/decrypt-message
     */
    decryptMessage: build.mutation<DecryptedMessage, DecryptedMessageParams>({
      query: ({ ciphertext, private_key, message_length }) => ({
        url: `/api/decrypt-message`,
        method: "POST",
        body: { ciphertext, private_key, message_length },
      }),
    }),
  }),
});

export const { useEncryptMessageMutation, useDecryptMessageMutation } =
  secureMessageApi;
