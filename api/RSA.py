import string
import random

def hash(message):
    dict = {}
    for i in range(26):
        dict[chr(ord('a') + i)] = i
    message = message.lower()
    res = 0
    for i in range(len(message)):
        res += dict[message[i]] * pow(26, len(message) - 1 - i)
    return res

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


def generateKeys(bits):
    primeGenerator = PrimeGenerator()
    p = primeGenerator.generateRandomPrime(bits)
    q = primeGenerator.generateRandomPrime(bits)
    n = p * q
    phi = (p - 1) * (q - 1)

    e = random.randint(pow(2, bits - 1), pow(2, bits) - 1)
    while gcd(e, phi) != 1:
        e = random.randint(pow(2, bits - 1), pow(2, bits) - 1)
    d = ext_euclid(e, phi)[0]
    while d < 0:
        d = d + phi

    return (p, q, n, e, d)


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


class RSA:
    def __init__(self, bits):
        self.bits = bits
        p, q, n, e, d = generateKeys(bits)
        self.p = p
        self.q = q
        self.n = n
        self.e = e
        self.d = d

    def encrypt(self, message):
        m = hash(message)
        cipher = pow(m, self.e, self.n)
        return cipher

    def decrypt(self, cipher):
        message = pow(cipher, self.d, self.n)
        return message


if __name__ == "__main__":
    rsa = RSA(2048)

    message = "NGOHAIANH"
    enc = rsa.encrypt(message)
    print(f"p: {rsa.p}")
    print(f"q: {rsa.q}")
    print(f"e: {rsa.e}")
    print(f"d: {rsa.d}")
    print(f"n: {rsa.n}")
    print(f"Encrypt: {enc}")
    print(f"Decrypt: {rsa.decrypt(enc)}")
