from typing import Optional
from pydantic import BaseModel,model_validator   

from models.response import PrivateKey, PublicKey


class GenerateKeyRequest(BaseModel):
    bits: int = 2048
    p: Optional[int] = None
    q: Optional[int] = None

# class EncryptMessageRequest(BaseModel):
#     message: str
#     public_key: PublicKey
class EncryptMessageRequest(BaseModel):
    message: str
    public_key: Optional[PublicKey] = None
    e: Optional[str] = None
    n: Optional[str] = None

    @model_validator(mode="after")
    def ensure_key_present(self):
        if self.public_key and getattr(self.public_key, "e", None) and getattr(self.public_key, "n", None):
            return self
        if self.e and self.n:
            return self
        raise ValueError(
            "Thiếu khóa công khai: cung cấp 'public_key.e & public_key.n' hoặc 'e & n'."
        )
class DecryptMessageRequest(BaseModel):
    ciphertext: str
    private_key: PrivateKey

class SignDocsRequest(BaseModel):
    text: str
    private_key: PrivateKey

class VerifySignatureRequest(BaseModel):
    text: str
    signature: str
    public_key: PublicKey