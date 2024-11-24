'use client'

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import Link from "next/link";
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import PublicNavbar from '@/components/base/public-navbar';

export default function Signin() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };    

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        setError(null);

        try {
            const response = await fetch('http://localhost:8080/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Erro ao fazer login');
            }

            const data = await response.json();
            const { token, role, id: userId } = data;

            localStorage.setItem('accessToken', token);
            localStorage.setItem('role', role);
            localStorage.setItem('userId', userId);

            console.log(localStorage.getItem('accessToken'));
            console.log(localStorage.getItem('role'));
            console.log(localStorage.getItem('userId'));

            router.push('/home');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <PublicNavbar />
            <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
                <div className="flex items-center justify-center py-12">
                    <div className="mx-auto grid w-[350px] gap-6">
                        <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold">Entrar</h1>
                            <p className="text-balance text-muted-foreground">
                                Você está a apenas alguns passos de se juntar a um Developer Hub confiável e de código aberto, especializado em conectar Devs e POs!
                            </p>
                        </div>
                        <form onSubmit={handleSubmit} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="johndoe@example.com"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Senha</Label>
                                </div>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="******"
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                />
                            </div>
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            <Button type="submit" className="w-full">
                                Entrar
                            </Button>
                        </form>
                        <div className="text-center text-sm">
                            Ainda não tem conta?{" "}
                            <Link href="/signup" className="underline">
                                Cadastre-se
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="hidden lg:flex items-center justify-center bg-muted">
                    <Image src="/signIn.svg" width={400} height={400} alt="SignIn Illustration" className="max-w-[400px]" />
                </div>
            </div>  
        </div>
    );
}
