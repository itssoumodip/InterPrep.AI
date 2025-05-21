import { Controller, Control, FieldValues, Path } from "react-hook-form";

import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
}

const FormField = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
}: FormFieldProps<T>) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="space-y-2 relative">
          <FormLabel className="text-sm font-medium text-foreground/80">{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                className="h-12 px-4 rounded-xl border-input bg-background/50 shadow-sm backdrop-blur-sm transition-all duration-200
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200/50 focus-visible:border-primary-200
                placeholder:text-muted-foreground/70 py-3 pr-10"
                type={type}
                placeholder={placeholder}
                {...field}
              />
              {type === 'email' && (
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                </span>
              )}
              {type === 'password' && (
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
              )}
              {type === 'text' && name === 'name' && (
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground/50">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
              )}
            </div>
          </FormControl>
          <FormMessage className="text-xs font-medium text-destructive-100 absolute -bottom-5" />
        </FormItem>
      )}
    />
  );
};

export default FormField;