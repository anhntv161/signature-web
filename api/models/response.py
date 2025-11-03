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
    cipherText: str
    

class DecryptMessageResponse(BaseModel):
    plainText: str


class SignDocsResponse(BaseModel):
    signature: str
    
class VerifySignatureResponse(BaseModel):
    isValid: bool