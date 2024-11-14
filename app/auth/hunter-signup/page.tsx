'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import LoginNavbar from '@/components/base/login-navbar'
import { useRouter } from 'next/navigation'

export default function HunterPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        cpf: '',
        name: '',
        email: '',
        password: '',
        username: ''
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const response = await fetch('http://localhost:8080/hunters', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                throw new Error('Erro ao enviar o formulário')
            }

            const data = await response.json()
            router.push('/auth/signin')
        } catch (error) {
            console.error('Erro:', error)
        }
    }

    return (
        <div>
            <LoginNavbar />
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Formulário de Cadastro</CardTitle>
                    <CardDescription>Por favor, preencha suas informações</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="cpf">CPF</Label>
                            <Input
                                id="cpf"
                                name="cpf"
                                value={formData.cpf}
                                onChange={handleInputChange}
                                placeholder="Digite seu CPF"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Nome</Label>
                            <Input
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Digite seu nome"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">E-mail</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Digite seu e-mail"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Senha</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Digite sua senha"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="username">Nome de usuário</Label>
                            <Input
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                placeholder="Digite seu nome de usuário"
                            />
                        </div>
                    </form>
                </CardContent>
                <CardFooter>
                    <Button type="submit" onClick={handleSubmit}>Enviar</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
