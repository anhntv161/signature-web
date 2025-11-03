from fastapi import FastAPI
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

@app.post("/encrypt-message")
async def encrypt_message(
    encrypt_message_request: EncryptMessageRequest
):
    cipher = encrypt(
        message=encrypt_message_request.message,
        e=int(encrypt_message_request.public_key.e),
        n=int(encrypt_message_request.public_key.n)
    )
    return EncryptMessageResponse(
        ciphertext=str(cipher), 
        message_length=len(encrypt_message_request.message)
    )

@app.post("/decrypt-message")
async def decrypt_message(
    decrypt_message_request: DecryptMessageRequest
):
    plaintext = decrypt(
        cipher_int=int(decrypt_message_request.ciphertext),
        d=int(decrypt_message_request.private_key.d),
        n=int(decrypt_message_request.private_key.n),
        message_length=decrypt_message_request.message_length
    )
    return DecryptMessageResponse(plainText=plaintext)

@app.post("/sign-docs")
async def sign_docs(
    sign_docs_request: SignDocsRequest,
):
    signature = sign(
        message=sign_docs_request.text, 
        d=int(sign_docs_request.private_key.d),
        n=int(sign_docs_request.private_key.n)
    )
    return SignDocsResponse(signature=str(signature))


@app.post("/verify-signature")
async def verify_signature(
    verify_signature_request: VerifySignatureRequest,
):
    is_valid = verify(
        message=verify_signature_request.text,
        signature_int=int(verify_signature_request.signature),
        e=int(verify_signature_request.public_key.e),
        n=int(verify_signature_request.public_key.n)
    )
    return VerifySignatureResponse(isValid=is_valid)