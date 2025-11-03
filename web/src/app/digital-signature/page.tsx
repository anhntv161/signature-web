"use client";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  FileSignature,
  ShieldCheck,
  Download,
  CheckCircle2,
  XCircle,
  Copy,
} from "lucide-react";
import Header from "@/components/Header";
import KeyGenerator from "@/components/KeyGenerator";
import { Textarea } from "@/components/ui/textarea";
import { copyToClipboard } from "@/lib/utils";
import { RSAKeys } from "@/types/key";
import {
  useSignDocumentsMutation,
  useVerifySignatureMutation,
} from "@/redux/apis/digital-signature-api";

const DigitalSignature = () => {
  const [keys, setKeys] = useState<RSAKeys | null>(null);
  const [fileContent, setFileContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [signature, setSignature] = useState("");

  const [signD, setSignD] = useState("");
  const [signN, setSignN] = useState("");

  const [verifyE, setVerifyE] = useState("");
  const [verifyN, setVerifyN] = useState("");
  const [verifyFileContent, setVerifyFileContent] = useState("");
  const [verifySignatureValue, setVerifySignatureValue] = useState("");
  const [verificationResult, setVerificationResult] = useState<{
    valid: boolean;
    message: string;
    fileHash?: string;
    signatureHash?: string;
  } | null>(null);

  const [signFileMutation] = useSignDocumentsMutation();
  const [verifySignatureMutation] = useVerifySignatureMutation();

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, isForVerify: boolean = false) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          if (isForVerify) {
            setVerifyFileContent(content);
          } else {
            setFileContent(content);
            setFileName(file.name);
          }
          toast.success("File đã được tải lên!");
        };
        reader.readAsText(file);
      }
    },
    []
  );

  const signFile = useCallback(async () => {
    if (!fileContent) {
      toast.error("Vui lòng tải lên file cần ký!");
      return;
    }

    const d = keys ? keys.privateKey.d : parseInt(signD);
    const n = keys ? keys.privateKey.n : parseInt(signN);

    if (!d || !n) {
      toast.error("Vui lòng nhập khóa riêng tư hoặc tạo khóa mới!");
      return;
    }

    try {
      const sig = await signFileMutation({
        text: fileContent,
        private_key: { d, n },
      }).unwrap();
      setSignature(sig.signature);

      toast.success("Ký số thành công!");
    } catch (error) {
      toast.error("Có lỗi xảy ra khi ký file!", {
        description: error instanceof Error ? error.message : String(error),
      });
    }
  }, [fileContent, keys, signD, signFileMutation, signN]);

  const handleVerifySignature = useCallback(async () => {
    if (!verifyFileContent || !verifySignatureValue) {
      toast.error("Vui lòng tải lên file và chữ ký!");
      return;
    }

    const e = keys ? keys.publicKey.e : parseInt(verifyE);
    const n = keys ? keys.publicKey.n : parseInt(verifyN);

    if (!e || !n) {
      toast.error("Vui lòng nhập khóa công khai hoặc tạo khóa mới!");
      return;
    }

    try {
      const isValid = await verifySignatureMutation({
        text: verifyFileContent,
        signature: verifySignatureValue,
        public_key: { e, n },
      }).unwrap();

      setVerificationResult({
        valid: isValid.isValid,
        message: isValid.isValid
          ? "Chữ ký hợp lệ! File không bị sửa đổi."
          : "Chữ ký không khớp hoặc file đã bị chỉnh sửa!",
      });

      if (isValid) {
        toast.success("Xác minh thành công!");
      } else {
        toast.error("Xác minh thất bại!");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi xác minh!", {
        description: error instanceof Error ? error.message : String(error),
      });
    }
  }, [
    verifyFileContent,
    verifySignatureValue,
    keys,
    verifyE,
    verifyN,
    verifySignatureMutation,
  ]);

  const downloadSignature = useCallback(() => {
    const sigData = {
      fileName: fileName,
      signature: signature,
    };

    const blob = new Blob([JSON.stringify(sigData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.sig`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Chữ ký đã được tải xuống!");
  }, [fileName, signature]);

  const loadSignatureFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const data = JSON.parse(event.target?.result as string);
            if (data.signature) {
              setVerifySignatureValue(data.signature);
              toast.success("Chữ ký đã được tải lên!");
            }
          } catch (error) {
            toast.error("File chữ ký không hợp lệ!", {
              description:
                error instanceof Error ? error.message : String(error),
            });
          }
        };
        reader.readAsText(file);
      }
    },
    []
  );

  const handleKeysGenerated = useCallback((generatedKeys: RSAKeys) => {
    setKeys(generatedKeys);
    setSignD(generatedKeys.privateKey.d.toString());
    setSignN(generatedKeys.privateKey.n.toString());
    setVerifyE(generatedKeys.publicKey.e.toString());
    setVerifyN(generatedKeys.publicKey.n.toString());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />

      <div className="container px-4 py-8">
        <div className="mx-auto max-w-6xl space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Chữ ký số RSA</h1>
            <p className="text-muted-foreground">
              Ký số và xác minh tài liệu sử dụng thuật toán RSA
            </p>
          </div>

          <Tabs defaultValue="generate" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="generate">Tạo khóa</TabsTrigger>
              <TabsTrigger value="sign">Ký số</TabsTrigger>
              <TabsTrigger value="verify">Xác minh</TabsTrigger>
            </TabsList>

            <TabsContent value="generate">
              <KeyGenerator
                rsaKeys={keys}
                onKeysGenerated={handleKeysGenerated}
              />
            </TabsContent>

            <TabsContent value="sign">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileSignature className="h-5 w-5 text-primary" />
                    Ký số tài liệu
                  </CardTitle>
                  <CardDescription>
                    Sử dụng khóa riêng tư để tạo chữ ký số cho tài liệu
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="file-upload">Tài liệu cần ký</Label>
                    <div className="flex gap-2">
                      <Textarea
                        id="message"
                        placeholder="Nhập nội dung tài liệu cần ký..."
                        value={fileContent}
                        onChange={(e) => setFileContent(e.target.value)}
                        rows={4}
                      />
                    </div>
                    {fileName && (
                      <p className="text-sm text-muted-foreground">
                        File: {fileName}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="file-upload">
                      Hoặc tải lên file tài liệu (.txt, .doc, .docx)
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".txt,.doc,.docx"
                      onChange={(e) => handleFileUpload(e)}
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="sign-d">Khóa riêng tư d</Label>
                      <Input
                        id="sign-d"
                        type="number"
                        value={signD}
                        onChange={(e) => setSignD(e.target.value)}
                        placeholder="Nhập d hoặc tạo khóa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="sign-n">Khóa riêng tư n</Label>
                      <Input
                        id="sign-n"
                        type="number"
                        value={signN}
                        onChange={(e) => setSignN(e.target.value)}
                        placeholder="Nhập n hoặc tạo khóa"
                      />
                    </div>
                  </div>

                  <Button onClick={signFile} className="w-full">
                    Ký số
                  </Button>

                  {signature && (
                    <div className="space-y-4 rounded-lg border border-border bg-muted/50 p-4 text-left">
                      {/* <div className="space-y-2">
                        <Label>Hash của file</Label>
                        <div className="rounded bg-background p-3 font-mono text-sm">
                          {fileHash}
                        </div>
                      </div> */}

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label>Chữ ký số (Signature)</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              copyToClipboard(signature, "Chữ ký số")
                            }
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="rounded bg-background p-3 font-mono text-sm break-all">
                          {signature}
                        </div>
                      </div>

                      <Button
                        onClick={downloadSignature}
                        variant="secondary"
                        className="w-full"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Tải chữ ký xuống
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="verify">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    Xác minh chữ ký
                  </CardTitle>
                  <CardDescription>
                    Sử dụng khóa công khai để xác minh tính hợp lệ của chữ ký
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="verify-file-upload">
                      Tải lên tài liệu gốc (.txt, .doc, .docx)
                    </Label>
                    <Input
                      id="verify-file-upload"
                      type="file"
                      accept=".txt,.doc,.docx"
                      onChange={(e) => handleFileUpload(e, true)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="docs-input">
                      Hoặc nhập nội dung tài liệu
                    </Label>
                    <Input
                      id="docs-input"
                      type="text"
                      value={verifyFileContent}
                      onChange={(e) => setVerifyFileContent(e.target.value)}
                      placeholder="Nhập nội dung tài liệu..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signature-upload">
                      Tải lên chữ ký (.sig)
                    </Label>
                    <Input
                      id="signature-upload"
                      type="file"
                      accept=".sig,.json"
                      onChange={loadSignatureFile}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signature-input">
                      Hoặc nhập chữ ký thủ công
                    </Label>
                    <Input
                      id="signature-input"
                      type="text"
                      value={verifySignatureValue}
                      onChange={(e) => setVerifySignatureValue(e.target.value)}
                      placeholder="Nhập chữ ký số..."
                    />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="verify-e">Khóa công khai e</Label>
                      <Input
                        id="verify-e"
                        type="text"
                        value={verifyE}
                        onChange={(e) => setVerifyE(e.target.value)}
                        placeholder="Nhập e hoặc tạo khóa"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="verify-n">Khóa công khai n</Label>
                      <Input
                        id="verify-n"
                        type="number"
                        value={verifyN}
                        onChange={(e) => setVerifyN(e.target.value)}
                        placeholder="Nhập n hoặc tạo khóa"
                      />
                    </div>
                  </div>

                  <Button onClick={handleVerifySignature} className="w-full">
                    Xác minh chữ ký
                  </Button>

                  {verificationResult && (
                    <div
                      className={`rounded-lg border p-4 ${
                        verificationResult.valid
                          ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                          : "border-red-500 bg-red-50 dark:bg-red-950/20"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {verificationResult.valid ? (
                          <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        ) : (
                          <XCircle className="h-6 w-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                        )}
                        <div className="space-y-3 flex-1">
                          <p
                            className={`font-semibold ${
                              verificationResult.valid
                                ? "text-green-900 dark:text-green-100"
                                : "text-red-900 dark:text-red-100"
                            }`}
                          >
                            {verificationResult.message}
                          </p>
                        </div>
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

export default DigitalSignature;
