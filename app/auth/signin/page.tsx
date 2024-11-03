import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@radix-ui/react-label"
import Link from "next/link"

export default function Signin() {
    return (
        <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            <div className="flex items-center justify-center py-12">
                <div className="mx-auto grid w-[350px] gap-6">
                    <div className="grid gap-2 text-center">
                        <h1 className="text-3xl font-bold">Entrar</h1>
                        <p className="text-balance text-muted-foreground">
                        Você está a apenas alguns passos de se juntar a um Developer Hub confiável e de código aberto, especializado em conectar Devs e POs!
                        </p>
                    </div>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="johndoe@example.com"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Senha</Label>
                            </div>
                            <Input id="password" type="password" placeholder="******" required />
                        </div>
                        <Button type="submit" className="w-full">
                            Entrar
                        </Button>
                    </div>
                    <div className=" text-center text-sm">
                        Ainda não tem conta?{" "}
                        <Link href="#" className="underline">
                            Cadastre-se
                        </Link>
                    </div>
                </div>
            </div>
            <div className="hidden bg-muted lg:block">
            </div>
        </div>
    )
}