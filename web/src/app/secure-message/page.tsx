"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Copy, Lock, Unlock } from "lucide-react";
import Header from "@/components/Header";
import { copyToClipboard } from "@/lib/utils";
import KeyGenerator from "@/components/KeyGenerator";
import { RSAKeys } from "@/types/key";

const SecureMessage = () => {
  const [keys, setKeys] = useState<RSAKeys | null>(null);
  const [message, setMessage] = useState("");
  const [encryptedMessage, setEncryptedMessage] = useState("");
  const [decryptedMessage, setDecryptedMessage] = useState("");

  const [encryptE, setEncryptE] = useState("");
  const [encryptN, setEncryptN] = useState("");

  const [decryptD, setDecryptD] = useState("");
  const [decryptN, setDecryptN] = useState("");
  const [ciphertext, setCiphertext] = useState("");

  const encryptMessage = useCallback(async () => {
    if (!message) {
      toast.error("Vui lòng nhập tin nhắn!");
      return;
    }

    const e = keys ? keys.publicKey.e : parseInt(encryptE);
    const n = keys ? keys.publicKey.n : parseInt(encryptN);

    if (!e || !n) {
      toast.error("Vui lòng nhập khóa công khai hoặc tạo khóa mới!");
      return;
    }

    try {
      const encrypted = await fetch(
        "http://localhost:8000/api/encrypt-message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message, public_key: { e, n } }),
        }
      )
        .then((res) => res.json())
        .then((data) => data.ciphertext);

      setEncryptedMessage(encrypted);
      toast.success("Mã hóa thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi mã hóa!", {
        description: error instanceof Error ? error.message : String(error),
      });
    }
  }, [message, encryptE, encryptN, keys]);

  const decryptMessage = useCallback(async () => {
    if (!ciphertext) {
      toast.error("Vui lòng nhập bản mã!");
      return;
    }

    const d = keys ? keys.privateKey.d : parseInt(decryptD);
    const n = keys ? keys.privateKey.n : parseInt(decryptN);

    if (!d || !n) {
      toast.error("Vui lòng nhập khóa riêng tư hoặc tạo khóa mới!");
      return;
    }

    try {
      const decrypted = await fetch(
        "http://localhost:8000/api/decrypt-message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ciphertext,
            private_key: { d, n },
            message_length: message.length,
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => data.plainText);

      setDecryptedMessage(decrypted);
      toast.success("Giải mã thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi giải mã!", {
        description: error instanceof Error ? error.message : String(error),
      });
    }
  }, [ciphertext, decryptD, decryptN, keys, message.length]);

  const handleKeysGenerated = useCallback((generatedKeys: RSAKeys) => {
    setKeys(generatedKeys);
    setEncryptE(generatedKeys.publicKey.e.toString());
    setEncryptN(generatedKeys.publicKey.n.toString());
    setDecryptD(generatedKeys.privateKey.d.toString());
    setDecryptN(generatedKeys.privateKey.n.toString());
  }, []);

  const loadKeysFromFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement | null;
      const file = target?.files ? target.files[0] : null;
      if (!file) {
        toast.error("Không có file được chọn!");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.publicKey && data.privateKey) {
            setEncryptE(data.publicKey.e.toString());
            setEncryptN(data.publicKey.n.toString());
            setDecryptD(data.privateKey.d.toString());
            setDecryptN(data.privateKey.n.toString());
            toast.success("Tải khóa thành công!");
          }
        } catch (error) {
          toast.error("File không hợp lệ!", {
            description: error instanceof Error ? error.message : String(error),
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />
      <div className="container px-4 py-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Mã hóa tin nhắn</h1>
            <p className="text-muted-foreground">
              Mã hóa và giải mã tin nhắn sử dụng thuật toán RSA
            </p>
          </div>

          <Tabs defaultValue="generate" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generate">Tạo khóa</TabsTrigger>
              <TabsTrigger value="encrypt">Mã hóa</TabsTrigger>
              <TabsTrigger value="decrypt">Giải mã</TabsTrigger>
            </TabsList>

            <TabsContent value="generate">
              <KeyGenerator
                rsaKeys={keys}
                onKeysGenerated={handleKeysGenerated}
              />
            </TabsContent>

            <TabsContent value="encrypt">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-primary" />
                    Mã hóa tin nhắn
                  </CardTitle>
                  <CardDescription>
                    Sử dụng khóa công khai để mã hóa tin nhắn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="message">Tin nhắn gốc</Label>
                    <Textarea
                      id="message"
                      placeholder="Nhập tin nhắn cần mã hóa..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="encrypt-e">Khóa công khai e</Label>
                      <Input
                        id="encrypt-e"
                        type="text"
                        value={encryptE}
                        onChange={(e) => setEncryptE(e.target.value)}
                        placeholder="Nhập e hoặc tạo khóa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="encrypt-n">Khóa công khai n</Label>
                      <Input
                        id="encrypt-n"
                        type="text"
                        value={encryptN}
                        onChange={(e) => setEncryptN(e.target.value)}
                        placeholder="Nhập n hoặc tạo khóa"
                      />
                    </div>
                  </div>

                  <Button onClick={encryptMessage} className="w-full">
                    Mã hóa
                  </Button>

                  {encryptedMessage && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label>Bản mã</Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            copyToClipboard(encryptedMessage, "Bản mã")
                          }
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="rounded-lg border border-border bg-muted/50 p-4">
                        <p className="break-all font-mono text-sm">
                          {encryptedMessage}
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="decrypt">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Unlock className="h-5 w-5 text-primary" />
                    Giải mã tin nhắn
                  </CardTitle>
                  <CardDescription>
                    Sử dụng khóa riêng tư để giải mã tin nhắn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="ciphertext">Bản mã</Label>
                    <Textarea
                      id="ciphertext"
                      placeholder="Nhập bản mã cần giải mã..."
                      value={ciphertext}
                      onChange={(e) => setCiphertext(e.target.value)}
                      rows={4}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="decrypt-d">Khóa riêng tư d</Label>
                      <Input
                        id="decrypt-d"
                        type="number"
                        value={decryptD}
                        onChange={(e) => setDecryptD(e.target.value)}
                        placeholder="Nhập d hoặc tạo khóa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="decrypt-n">Khóa riêng tư n</Label>
                      <Input
                        id="decrypt-n"
                        type="number"
                        value={decryptN}
                        onChange={(e) => setDecryptN(e.target.value)}
                        placeholder="Nhập n hoặc tạo khóa"
                      />
                    </div>
                  </div>

                  <Button onClick={decryptMessage} className="w-full">
                    Giải mã
                  </Button>

                  {decryptedMessage && (
                    <div className="space-y-2">
                      <Label>Tin nhắn gốc</Label>
                      <div className="rounded-lg border border-border bg-muted/50 p-4">
                        <p className="break-all">{decryptedMessage}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default SecureMessage;
