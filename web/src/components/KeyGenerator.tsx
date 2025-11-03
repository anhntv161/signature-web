import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { Copy, Key } from "lucide-react";
import { copyToClipboard } from "@/lib/utils";
import { RSAKeys } from "@/types/key";

interface KeyGeneratorProps {
  rsaKeys?: RSAKeys | null;
  onKeysGenerated?: (keys: RSAKeys) => void;
}

const KeyGenerator = ({ onKeysGenerated, rsaKeys }: KeyGeneratorProps) => {
  const [p, setP] = useState("");
  const [q, setQ] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [keys, setKeys] = useState<RSAKeys | null>(rsaKeys || null);

  const isPrime = useCallback((num: number): boolean => {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;
    const limit = Math.floor(Math.sqrt(num));
    for (let i = 2; i <= limit; i++) {
      if (num % i === 0) return false;
    }
    return true;
  }, []);

  const generateKeys = useCallback(async () => {
    const pNum = parseInt(p);
    const qNum = parseInt(q);

    if (!isPrime(pNum)) {
      toast.error("p phải là số nguyên tố!");
      return;
    }

    if (!isPrime(qNum)) {
      toast.error("q phải là số nguyên tố!");
      return;
    }

    if (pNum === qNum) {
      toast.error("p và q phải khác nhau!");
      return;
    }

    try {
      setIsGenerating(true);
      const generatedKeys: RSAKeys = await fetch(
        `http://localhost:8000/api/generate-keys`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ p: pNum, q: qNum }),
        }
      ).then((res) => res.json());

      setKeys(generatedKeys);
      if (onKeysGenerated) {
        onKeysGenerated(generatedKeys);
      }
    } catch (error) {
      console.error(error);
      toast.error("Có lỗi xảy ra khi tạo khóa!", {
        description: error instanceof Error ? error.message : String(error),
      });
    } finally {
      setIsGenerating(false);
    }

    toast.success("Khóa RSA đã được tạo thành công!");
  }, [p, q, isPrime, onKeysGenerated]);

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5 text-primary" />
          Tạo khóa RSA
        </CardTitle>
        <CardDescription>
          Nhập hai số nguyên tố p và q để tạo cặp khóa công khai và khóa riêng
          tư
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="p">Số nguyên tố p</Label>
            <Input
              id="p"
              type="number"
              placeholder="Ví dụ: 61 hoặc để trống để tạo ngẫu nhiên"
              value={p}
              onChange={(e) => setP(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="q">Số nguyên tố q</Label>
            <Input
              id="q"
              type="number"
              placeholder="Ví dụ: 53 hoặc để trống để tạo ngẫu nhiên"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>

        <Button onClick={generateKeys} className="w-full">
          {isGenerating ? (
            <>
              <svg
                className="mr-2 inline-block h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Đang tạo khóa ngẫu nhiên...
            </>
          ) : (
            "Tạo khóa RSA"
          )}
        </Button>

        {keys && (
          <div className="space-y-4 rounded-lg border border-border bg-muted/50 p-4 text-left">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Khóa công khai (Public Key)
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(
                      `e: ${keys.publicKey.e}, n: ${keys.publicKey.n}`,
                      "Khóa công khai"
                    )
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="rounded bg-background p-3 text-sm font-mono break-words whitespace-normal text-left">
                <p>e = {keys.publicKey.e}</p>
                <p>n = {keys.publicKey.n}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Khóa riêng tư (Private Key)
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    copyToClipboard(
                      `d: ${keys.privateKey.d}, n: ${keys.privateKey.n}`,
                      "Khóa riêng tư"
                    )
                  }
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="rounded bg-background p-3 text-sm font-mono break-words whitespace-normal text-left">
                <p>d = {keys.privateKey.d}</p>
                <p>n = {keys.privateKey.n}</p>
              </div>
            </div>
            {/* <Button
              onClick={downloadKeys}
              variant="secondary"
              className="w-full"
            >
              <Download className="mr-2 h-4 w-4" />
              Tải xuống khóa
            </Button> */}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KeyGenerator;
