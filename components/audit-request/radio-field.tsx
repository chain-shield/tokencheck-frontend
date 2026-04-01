import { useFormContext } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { FormData } from "./form";

// Helper Components
export interface RadioFieldProps {
    name: keyof FormData;
    label: string;
    options: { value: string; label: string }[];
}

export function RadioField({ name, label, options }: RadioFieldProps) {
    const { control } = useFormContext<FormData>();
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className="space-y-4">
                    <FormLabel className="text-sm font-semibold text-white">{label}</FormLabel>
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value as string}
                            className="grid gap-3"
                        >
                            {options.map((option) => (
                                <FormItem
                                    key={option.value}
                                    className={[
                                      'flex items-center gap-3 rounded-xl border p-4 transition-colors',
                                      field.value === option.value
                                        ? 'border-[#8bbbff]/40 bg-[#182230]'
                                        : 'border-white/10 bg-[#20201f] hover:bg-[#262626]',
                                    ].join(' ')}
                                >
                                    <FormControl>
                                        <RadioGroupItem
                                          value={option.value}
                                          className="h-5 w-5 border-white/20 text-[#8bbbff] ring-offset-0 focus-visible:ring-[#8bbbff]"
                                        />
                                    </FormControl>
                                    <FormLabel className="cursor-pointer font-medium text-white">
                                        {option.label}
                                    </FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup>
                    </FormControl>
                    <FormMessage className="text-[#ff8e8e]" />
                </FormItem>
            )}
        />
    );
}
