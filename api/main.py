from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from RSASignature import decrypt, encrypt, generateKeys, sign, verify
from models.response import DecryptMessageResponse, EncryptMessageResponse, GenerateKeyResponse, PrivateKey, PublicKey, SignDocsResponse, VerifySignatureResponse
from models.request import DecryptMessageRequest, EncryptMessageRequest, GenerateKeyRequest, SignDocsRequest, VerifySignatureRequest

app = FastAPI()
router = app.router

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
router.prefix = "/api"

@app.get("/")
async def read_root():
    return {"status": "ok"}

@app.post("/generate-keys")
async def generate_key(generate_key_request: GenerateKeyRequest):
    try:
        n, e, d = generateKeys(
            generate_key_request.bits,
            generate_key_request.p, 
            generate_key_request.q
        )
        response = GenerateKeyResponse(
            publicKey=PublicKey(e=str(e), n=str(n)),
            privateKey=PrivateKey(d=str(d), n=str(n))
        )
        return response
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

# @app.post("/encrypt-message")
# async def encrypt_message(
#     encrypt_message_request: EncryptMessageRequest
# ):
#     try:
#         cipher = encrypt(
#             message=encrypt_message_request.message,
#             e=int(encrypt_message_request.public_key.e),
#             n=int(encrypt_message_request.public_key.n)
#         )
#         return EncryptMessageResponse(
#             cipherText=str(cipher), 
#         )
#     except ValueError as e:
#         raise HTTPException(status_code=400, detail=str(e))
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
@app.post("/encrypt-message")
async def encrypt_message(req: EncryptMessageRequest):
    try:
        if req.public_key and req.public_key.e and req.public_key.n:
            e_str, n_str = req.public_key.e, req.public_key.n
        else:
            e_str, n_str = req.e, req.n  # đã được validator đảm bảo không None

        e_val = int(e_str)  # ép về int ở server để an toàn
        n_val = int(n_str)

        cipher = encrypt(message=req.message, e=e_val, n=n_val)

        # (Khuyến nghị) trả thêm message_length để tiện giải mã về sau
        return EncryptMessageResponse(
            cipherText=str(cipher),
            # nếu model hiện chưa có field này, bạn có thể thêm:
            # message_length=len(req.message)
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.post("/decrypt-message")
async def decrypt_message(
    decrypt_message_request: DecryptMessageRequest
):
    try:
        plaintext = decrypt(
            cipher_int=int(decrypt_message_request.ciphertext),
            d=int(decrypt_message_request.private_key.d),
            n=int(decrypt_message_request.private_key.n)
        )
        return DecryptMessageResponse(plainText=plaintext)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@app.post("/sign-docs")
async def sign_docs(
    sign_docs_request: SignDocsRequest,
):
    try:
        signature = sign(
            message=sign_docs_request.text, 
            d=int(sign_docs_request.private_key.d),
            n=int(sign_docs_request.private_key.n)
        )
        return SignDocsResponse(signature=str(signature))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


@app.post("/verify-signature")
async def verify_signature(
    verify_signature_request: VerifySignatureRequest,
):
    try:
        is_valid = verify(
            message=verify_signature_request.text,
            signature_int=int(verify_signature_request.signature),
            e=int(verify_signature_request.public_key.e),
            n=int(verify_signature_request.public_key.n)
        )
        return VerifySignatureResponse(isValid=is_valid)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")