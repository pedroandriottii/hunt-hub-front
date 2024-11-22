import { useState } from 'react'
import { useForm } from 'react-hook-form'
import Select from 'react-select'
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from '@/hooks/use-toast'

interface CreateTaskFormProps {
    poid: string;
    onSuccess: () => void;
}

export const TagsEnum = [
    "KOTLIN", "NODE", "TYPESCRIPT", "CRIMINAL_DATA", "FIREBASE", "SQLITE",
    "SPRING", "STATISTICAL_DATA", "GOOGLE_CLOUD", "WEB_DEVELOPMENT",
    "DEEP_LEARNING", "FRONTEND", "CLOUD", "XAMARIN", "ELASTICSEARCH",
    "JAVA", "NATURAL_LANGUAGE_PROCESSING", "SCALA", "SYNCHRONOUS",
    "ACTIVEMQ", "HTML", "SQL", "DATA_SCIENCE", "NO_SQL", "MACHINE_LEARNING",
    "MEDICAL_DATA", "FULLSTACK", "RABBITMQ", "SECURITY", "ANGULAR", "C",
    "ASYNCHRONOUS", "GRAPHQL", "ANDROID", "EXPRESS", "MONGODB", "HASKELL",
    "APACHE_KAFKA", "PHP", "RUBY", "REDIS", "PYTHON", "DATABASE_MODELING",
    "REACT", "CSS", "RUST", "APACHE_CAMEL", "VUE", "GEOGRAPHICAL_DATA",
    "PRIVACY", "JAVASCRIPT", "AZURE", "OTHER", "SWIFT", "SQL_SERVER",
    "CPLUSPLUS", "API", "DATABASE", "FLUTTER", "DEVOPS", "MOBILE_DEVELOPMENT",
    "HISTORICAL_DATA", "MYSQL", "KAFKA", "REINFORCEMENT_LEARNING",
    "ARTIFICIAL_INTELLIGENCE", "BIG_DATA", "POSTGRESQL", "AWS", "CSHARP",
    "GO", "IOS", "BACKEND", "REACT_NATIVE", "APACHE_ACTIVEMQ", "ORACLE",
    "COMPUTER_VISION", "MICROSERVICES", "REST"
];

interface FormValues {
    title: string;
    description: string;
    deadline: string;
    reward: number;
    numberOfMeetings: number;
    numberOfHuntersRequired: number;
    ratingRequired: number;
    tags: string[];
}

export function CreateTaskForm({ poid, onSuccess }: CreateTaskFormProps) {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()

    const form = useForm<FormValues>({
        defaultValues: {
            title: "",
            description: "",
            deadline: "",
            reward: 1,
            numberOfMeetings: 1,
            numberOfHuntersRequired: 1,
            ratingRequired: 1,
            tags: [],
        },
    })

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/task/${poid}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify(values),
            });
    
            if (!response.ok) {
                throw new Error('Falha ao criar a task');
            }
    
            toast({
                title: "Task criada com sucesso!",
                description: "A nova task foi adicionada ao sistema.",
            });
            onSuccess();
        } catch {
            toast({
                title: "Erro ao criar a task",
                description: "Ocorreu um erro ao tentar criar a task. Tente novamente.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    rules={{ required: "Título é obrigatório" }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Título</FormLabel>
                            <FormControl>
                                <Input placeholder="Título da task" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    rules={{ required: "Descrição é obrigatória" }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Descrição da task" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="deadline"
                    rules={{ required: "Prazo é obrigatório" }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Prazo</FormLabel>
                            <FormControl>
                                <Input type="datetime-local" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="reward"
                    rules={{ required: "Recompensa é obrigatória", min: { value: 1, message: "A recompensa deve ser maior que 0" } }}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Recompensa</FormLabel>
                            <FormControl>
                                <Input type="number" min="1" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tags</FormLabel>
                            <FormControl>
                                <Select
                                    options={TagsEnum.map(tag => ({ value: tag, label: tag }))}
                                    isMulti
                                    onChange={(selected) => field.onChange(selected.map(option => option.value))}
                                    value={field.value.map(tag => ({ value: tag, label: tag }))}
                                    placeholder="Selecione uma ou mais tags"
                                    className="react-select-container"
                                    classNamePrefix="react-select"
                                    styles={{
                                        menu: base => ({
                                            ...base,
                                            maxHeight: "200px",
                                            overflowY: "auto"
                                        })
                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Criando..." : "Criar Task"}
                </Button>
            </form>
        </Form>
    )
}
