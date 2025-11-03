# RSA Signature & Secure Messaging Web Application

An educational web application demonstrating RSA cryptography concepts including digital signatures and secure messaging. Built with Next.js frontend and Python FastAPI backend.

## Features

- **RSA Key Generation**: Generate custom RSA key pairs with configurable bit length and optional custom prime numbers (p, q)
- **Digital Signature**: Sign and verify documents/messages using RSA digital signatures with SHA-256 hashing
- **Secure Messaging**: Encrypt and decrypt messages using RSA encryption
- **Educational Interface**: Interactive UI to learn and experiment with RSA cryptography

## Project Structure

```
signature-web/
├── api/                    # Python FastAPI Backend
│   ├── main.py            # API endpoints
│   ├── RSASignature.py    # RSA implementation
│   ├── models/            # Pydantic models
│   └── requirements.txt   # Python dependencies
└── web/                   # Next.js Frontend
    ├── src/
    │   ├── app/          # Next.js App Router pages
    │   ├── components/   # React components
    │   ├── hooks/        # Custom hooks
    │   └── lib/          # Utilities
    └── package.json      # Node dependencies
```

## Getting Started

### Prerequisites

- **Python 3.11+**
- **Node.js 18+** and **pnpm**
- **Git**

### Backend Setup (FastAPI)

1. Navigate to the API directory:

```bash
cd api
```

2. Create and activate a virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate  # On macOS/Linux
# or
.venv\Scripts\activate     # On Windows
```

3. Install Python dependencies:

```bash
pip install -r requirements.txt
```

4. Run the FastAPI server:

```bash
uvicorn main:app --reload --port 8000
```

The API will be available at [http://localhost:8000](http://localhost:8000)

### Frontend Setup (Next.js)

1. Navigate to the web directory:

```bash
cd web
```

2. Install dependencies:

```bash
pnpm install
```

3. Run the development server:

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## API Endpoints

### `POST /generate-keys`

Generate RSA key pairs.

**Request:**

```json
{
  "bits": 2048,
  "p": null, // Optional: custom prime p
  "q": null // Optional: custom prime q
}
```

**Response:**

```json
{
  "publicKey": {
    "e": "65537",
    "n": "large_number..."
  },
  "privateKey": {
    "d": "large_number...",
    "n": "large_number..."
  }
}
```

### `POST /sign-docs`

Sign a message or document.

**Request:**

```json
{
  "text": "message_or_binary_data",
  "private_key": {
    "d": "private_exponent",
    "n": "modulus"
  }
}
```

**Response:**

```json
{
  "signature": "signature_as_string"
}
```

### `POST /verify-signature`

Verify a digital signature.

**Request:**

```json
{
  "text": "original_message",
  "signature": "signature_string",
  "public_key": {
    "e": "public_exponent",
    "n": "modulus"
  }
}
```

**Response:**

```json
{
  "isValid": true
}
```

### `POST /encrypt-message`

Encrypt a message using RSA public key.

**Request:**

```json
{
  "message": "text_to_encrypt",
  "public_key": {
    "e": "public_exponent",
    "n": "modulus"
  }
}
```

**Response:**

```json
{
  "ciphertext": "encrypted_string",
  "message_length": 10
}
```

### `POST /decrypt-message`

Decrypt a ciphertext using RSA private key.

**Request:**

```json
{
  "ciphertext": "encrypted_string",
  "private_key": {
    "d": "private_exponent",
    "n": "modulus"
  },
  "message_length": 10
}
```

**Response:**

```json
{
  "plainText": "decrypted_message"
}
```

## RSA Implementation Details

### Key Generation

- Uses **Rabin-Miller primality testing** for generating prime numbers
- Supports custom bit lengths (default: 2048-bit)
- Public exponent (e) defaults to **65537** (2^16 + 1) for optimal security and performance
- Falls back to other common primes (3, 5, 17, 257) if needed

### Digital Signatures

- Uses **SHA-256** hashing for document signing (supports binary data)
- Falls back to custom base-95 encoding for simple text messages
- Supports signing any file format (DOCX, PDF, images, etc.)

### Encryption/Decryption

- Implements textbook RSA for educational purposes
- Uses custom base-95 character encoding for message conversion
- Validates that message hash is smaller than modulus

### Security Notes

**Educational Purpose Only**: This implementation is for learning RSA concepts and should NOT be used in production environments. Production systems should use:

- Proper padding schemes (OAEP for encryption, PSS for signatures)
- Established cryptography libraries (PyCryptodome, cryptography.io)
- Key sizes of at least 2048 bits (preferably 4096 bits)

## Technology Stack

### Backend

- **FastAPI**: Modern Python web framework
- **Pydantic**: Data validation
- **hashlib**: SHA-256 hashing
- **Python 3.13**: Core implementation

### Frontend

- **Next.js 15**: React framework with App Router
- **React 18**: UI library
- **TypeScript**: Type safety
- **Tailwind CSS v3**: Styling
- **Radix UI**: Accessible components
- **Sonner**: Toast notifications

## Educational Use Cases

This project demonstrates:

1. **Prime number generation** using probabilistic testing
2. **Modular arithmetic** and the Extended Euclidean Algorithm
3. **Public-key cryptography** concepts
4. **Digital signatures** for authentication and non-repudiation
5. **Asymmetric encryption** for secure communication

## Contributing

This is an educational project. Contributions for improving the learning experience are welcome!
