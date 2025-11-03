from typing import Optional
from pydantic import BaseModel

from models.response import PrivateKey, PublicKey


class GenerateKeyRequest(BaseModel):
    bits: int = 2048
    p: Optional[int] = None
    q: Optional[int] = None

class EncryptMessageRequest(BaseModel):
    message: str
    public_key: PublicKey
    
class DecryptMessageRequest(BaseModel):
    ciphertext: str
    private_key: PrivateKey
    message_length: int = 0

class SignDocsRequest(BaseModel):
    text: str
    private_key: PrivateKey

class VerifySignatureRequest(BaseModel):
    text: str
    signature: str
    public_key: PublicKey