"use client";

import Link from "next/link";
import {
  Shield,
  Lock,
  FileSignature,
  ArrowRight,
  KeyRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Header from "@/components/Header";

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-hero">
      <Header />

      {/* Hero Section */}
      <section className="container px-4 py-20 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
            <Shield className="h-4 w-4" />
            Nền tảng bảo mật RSA
          </div>

          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Trải nghiệm bảo mật{" "}
            <span className="text-gradient-primary bg-clip-text">RSA</span> một
            cách trực quan
          </h1>

          <p className="mb-10 text-lg text-muted-foreground md:text-xl">
            Học và thực hành mã hóa RSA, chữ ký số điện tử một cách dễ hiểu.
            Hiểu rõ cơ chế bảo mật thông tin trong thế giới số.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="gap-2">
              <Link href="/secure-message">
                <Lock className="h-5 w-5" />
                Mã hóa tin nhắn
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary" className="gap-2">
              <Link href="/digital-signature">
                <FileSignature className="h-5 w-5" />
                Chữ ký số
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Tính năng chính
          </h2>

          <div className="grid gap-6 md:grid-cols-3 text-justify">
            <Card className="shadow-card transition-all hover:shadow-elevated">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <KeyRound className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  Tạo khóa RSA
                </CardTitle>
                <CardDescription>
                  Tạo cặp khóa công khai và khóa riêng tư từ hai số nguyên tố.
                  Hiểu rõ toán học đằng sau RSA.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-card transition-all hover:shadow-elevated">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <Lock className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  Mã hóa tin nhắn
                </CardTitle>
                <CardDescription>
                  Mã hóa và giải mã tin nhắn sử dụng khóa RSA. Trải nghiệm bảo
                  mật end-to-end một cách trực quan.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-card transition-all hover:shadow-elevated">
              <CardHeader>
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <FileSignature className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">Chữ ký số</CardTitle>
                <CardDescription>
                  Ký số và xác minh tài liệu. Đảm bảo tính toàn vẹn và xác thực
                  của dữ liệu.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* About RSA Section */}
      <section className="container px-4 py-16">
        <div className="mx-auto max-w-4xl text-justify">
          <Card className="shadow-elevated">
            <CardHeader>
              <CardTitle className="text-2xl">Về thuật toán RSA</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                RSA (Rivest–Shamir–Adleman) là một trong những thuật toán mã hóa
                bất đối xứng đầu tiên và được sử dụng rộng rãi nhất hiện nay.
              </p>
              <p>
                Thuật toán sử dụng hai khóa: khóa công khai (public key) để mã
                hóa và khóa riêng tư (private key) để giải mã. Điều này cho phép
                truyền thông an toàn mà không cần chia sẻ khóa bí mật trước.
              </p>
              <p>
                Nền tảng này giúp bạn hiểu và thực hành RSA thông qua hai ứng
                dụng thực tế: mã hóa tin nhắn và chữ ký số điện tử.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container px-4 text-center text-sm text-muted-foreground">
          <p>
            © 2024 RSA Secure Platform. Dự án giáo dục về bảo mật thông tin.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
