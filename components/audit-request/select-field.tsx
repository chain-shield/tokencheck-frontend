import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { FormData } from "./form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface SelectFieldProps {
    name: keyof FormData;
    label: string;
    placeholder: string;
    options: { value: string; label: string }[];
}

export function SelectField({ name, label, placeholder, options }: SelectFieldProps) {
    const { control } = useFormContext<FormData>();
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="space-y-3">
                    <FormLabel className="text-sm font-semibold text-white">{label}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value as string}>
                        <FormControl>
                            <SelectTrigger className="h-12 rounded-xl border-white/10 bg-[#20201f] text-white focus:ring-[#8bbbff] focus:ring-offset-0">
                                <SelectValue placeholder={placeholder} />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent className="border-white/10 bg-[#131313] text-white">
                            {options.map((option) => (
                                <SelectItem key={option.value} value={option.value} className="focus:bg-[#20201f] focus:text-white">
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage className="text-[#ff8e8e]" />
                </FormItem>
            )}
        />
    );
}
