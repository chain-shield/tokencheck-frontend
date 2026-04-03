import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { FormData } from "./form";
import { Input } from "../ui/input";

interface InputFieldProps {
    name: keyof FormData;
    label: string;
    placeholder: string;
    required?: boolean;
    onFocus?: () => void;
}

export function InputField({ name, label, placeholder, required, onFocus }: InputFieldProps) {
    const { control } = useFormContext<FormData>();
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-semibold text-white">{label}{required && ' *'}</FormLabel>
                    <FormControl>
                        <Input
                          placeholder={placeholder}
                          {...field}
                          onFocus={onFocus}
                          className="h-12 rounded-xl border-white/10 bg-[#20201f] text-white placeholder:text-[#767575] focus-visible:border-[#8bbbff] focus-visible:ring-[#8bbbff] focus-visible:ring-offset-0"
                        />
                    </FormControl>
                    <FormMessage className="text-[#ff8e8e]" />
                </FormItem>
            )}
        />
    );
}