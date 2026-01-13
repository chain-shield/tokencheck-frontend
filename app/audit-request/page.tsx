import AuditRequestForm from "@/components/audit-request/form";
import { Activity } from "lucide-react";

export default function AuditRequestPage() {
  return (

    <div className="container mx-auto max-w-4xl px-4 py-12">

      <p className="text-2xl font-bold text-slate-800 mb-2 leading-relaxed">
        <Activity className="w-8 h-8 text-blue-600 mx-2 inline-block" />
        Audit Request Form
      </p>

      <p className="text-lg text-slate-600 mb-8 leading-relaxed">
        Take a minute to fill out form below to see if your are a good candidate
      </p>
      <AuditRequestForm />
    </div>
  );
}
