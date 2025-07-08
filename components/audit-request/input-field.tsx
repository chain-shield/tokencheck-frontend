import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { FormData } from "./form";
import { Input } from "../ui/input";

interface InputFieldProps {
    name: keyof FormData;
    label: string;
    placeholder: string;
    required?: boolean;
}

export function InputField({ name, label, placeholder, required }: InputFieldProps) {
    const { control } = useFormContext<FormData>();
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}{required && ' *'}</FormLabel>
                    <FormControl>
                        <Input placeholder={placeholder} {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}