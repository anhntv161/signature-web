import random
import hashlib

def normalize_message(message):
    return message.replace(" ", "").replace("\n", "").replace("\t", "").replace("\r", "").encode('utf-8')

def hash(message):
    message = normalize_message(message)
    res = 0
    for i, char in enumerate(str(message, 'utf-8')):
        char_value = ord(char) - 32
        if char_value < 0 or char_value >= 95:
            raise ValueError(f"Character '{char}' (ASCII {ord(char)}) is not a printable ASCII character")
        res += char_value * pow(95, len(message) - 1 - i)
    return res

def hash_sha256(data):
    if isinstance(data, str):
        data = data.encode('utf-8')
    return int(hashlib.sha256(data).hexdigest(), 16)

def unhash(num, length):
    message = []
    for i in range(length):
        char_value = num % 95
        message.append(chr(char_value + 32))
        num = num // 95
    return ''.join(reversed(message))

class PrimeGenerator:
    def testSingleNumber(self, n, a, k, m):
        mod = pow(a, m, n)
        if mod == 1 or mod == n - 1:
            return True
        for _ in range(1, k):
            mod = pow(mod, 2, n)
            if mod == n - 1:
                return True
        return False

    def RabinMiller(self, n):
        if n == 2 or n == 3 or n == 5 or n == 7:
            return True
        if n < 11:
            return False

        k, m = 0, n - 1
        while m % 2 == 0:
            m = m // 2
            k += 1

        REPEAT_TIME = 60
        for _ in range(REPEAT_TIME):
            a = random.randint(2, n - 2)
            if not self.testSingleNumber(n, a, k, m):
                return False
        return True

    def generateRandomOddNunber(self, bits):
        number = random.randint(pow(2, bits - 1), pow(2, bits) - 1)
        if number % 2 == 0:
            number += 1
        return number

    def generateRandomPrime(self, bits):
        number = self.generateRandomOddNunber(bits)
        while not self.RabinMiller(number):
            number += 2
        return number


def generateKeys(bits: int, p=None, q=None):
    primeGenerator = PrimeGenerator()
    if p is None:
        p = primeGenerator.generateRandomPrime(bits)
    if q is None:
        q = primeGenerator.generateRandomPrime(bits)
    n = p * q
    phi = (p - 1) * (q - 1)

    e = random.randint(pow(2, bits - 1), pow(2, bits) - 1)
    while gcd(e, phi) != 1:
        e = random.randint(pow(2, bits - 1), pow(2, bits) - 1)
    d = ext_euclid(e, phi)[0]
    while d < 0:
        d = d + phi

    return (n, e, d)

def ext_euclid(a, b):
    m, n = a, b
    xm, ym = 1, 0
    xn, yn = 0, 1
    while n != 0:
        q = m // n
        r = m % n
        xr, yr = xm - q * xn, ym - q * yn
        m = n
        xm, ym = xn, yn
        n = r
        xn, yn = xr, yr
    return (xm, ym)


def gcd(p, q):
    while q != 0:
        p, q = q, p % q
    return p

def encrypt(message, e, n):
    m = hash(message)
    if m >= n:
        raise ValueError("Plaintext numeric too large for modulus n; increase key size or shorten message.")
    m_mod = m % n
    cipher = pow(m_mod, e, n)
    return cipher

def decrypt(cipher_int, d, n, message_length):
    m = pow(cipher_int, d, n)
    return unhash(m, message_length)

def sign(message, d, n):
    try:
        m = hash(message)
    except (ValueError, UnicodeDecodeError):
        m = hash_sha256(message)
    m_mod = m % n
    signature = pow(m_mod, d, n)
    return signature
    
def validate(cipherText, signature, e1, n1, d2, n2):
    M = pow(cipherText, d2, n2)
    S = pow(signature, e1, n1)
    if (M == S):
        return True
    return False 

def verify(message, signature_int, e, n):
    try:
        h = hash(message) % n
    except (ValueError, UnicodeDecodeError):
        # failover to SHA-256
        h = hash_sha256(message) % n
    h_from_sig = pow(signature_int, e, n)
    return h == h_from_sig

if __name__ == "__main__":
    bits = 2048
    n1, e1, d1 = generateKeys(bits)
    n2, e2, d2 = generateKeys(bits)

    message = "NGOHAIANH"
    print(f"Message: {message}")

    print(f"Public key A: ({e1}, {n1})")
    print(f"Private key A: ({d1})")
    
    print(f"Public key B: ({e2}, {n2})")
    print(f"Private key B: ({d2})")

    cipherText = encrypt(message, e2, n2)
    signature = sign(message, d1, n1)

    print(f"Cipher text: {cipherText}")
    print(f"Signature: {signature}")

    decrypted = decrypt(cipherText, d2, n2, len(message))
    print(f"Decrypted message: {decrypted}")

    isValid = validate(cipherText, signature, e1, n1, d2, n2)
    if isValid:
        print("Valid Signature")
    else:
        print("Invalid Signature")




