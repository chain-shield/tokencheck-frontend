import { Dialog, DialogClose, DialogContent, DialogDescription, DialogOverlay, DialogPortal, DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { Button } from "./ui/button";
import { ScanSearch, Zap } from "lucide-react";
import AuditRequestForm from "./audit-quest/form";

export default function AuditRequestModal({ children }: { children: React.ReactNode }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>


            <DialogPortal>
                <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                <DialogContent className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow-lg focus:outline-none" >
                    <DialogTitle className="text-2xl mb-5 font-bold flex items-center">
                        <ScanSearch className="w-8 h-8 mr-2" />
                        Request Your Free Lite Audit
                    </DialogTitle>
                    <DialogDescription>
                        Please complete form below to request your free lite audit. (Coming Soon!)
                    </DialogDescription>
                    <AuditRequestForm />
                    <div className="mt-4 flex justify-end">
                        <DialogClose asChild>
                            <button className="rounded bg-red-600 px-4 py-2 text-white">
                                Close
                            </button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </DialogPortal>
        </Dialog >
    );
}