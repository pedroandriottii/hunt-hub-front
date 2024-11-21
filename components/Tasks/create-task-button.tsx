import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { CreateTaskForm } from './create-task-form';


interface CreateTaskButtonProps {
    poid: string;
    userRole: string;
}

export function CreateTaskButton({ poid, userRole }: CreateTaskButtonProps) {
    const [isOpen, setIsOpen] = useState(false)

    if (userRole !== 'ROLE_PO') {
        return null
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>Criar Task</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Criar Nova Task</DialogTitle>
                </DialogHeader>
                <CreateTaskForm poid={poid} onSuccess={() => setIsOpen(false)} />
            </DialogContent>
        </Dialog>
    )
}
