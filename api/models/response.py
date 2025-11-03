from pydantic import BaseModel

class PublicKey(BaseModel):
    e: str
    n: str


class PrivateKey(BaseModel):
    d: str
    n: str


class GenerateKeyResponse(BaseModel):
    publicKey: PublicKey
    privateKey: PrivateKey


class EncryptMessageResponse(BaseModel):
    ciphertext: str
    message_length: int = 0
    

class DecryptMessageResponse(BaseModel):
    plainText: str


class SignDocsResponse(BaseModel):
    signature: str
    
class VerifySignatureResponse(BaseModel):
    isValid: bool