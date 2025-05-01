import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQueryClient } from '@tanstack/react-query';
import { insertWasteDataSchema, type Client } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Extend the waste data schema with additional validation
const formSchema = insertWasteDataSchema.extend({
  date: z.date({
    required_error: "La fecha es requerida",
  }),
  clientId: z.number({
    required_error: "El cliente es requerido",
  }),
  organicWaste: z.coerce.number().min(0, { message: "El valor debe ser mayor o igual a 0" }),
  inorganicWaste: z.coerce.number().min(0, { message: "El valor debe ser mayor o igual a 0" }),
  recyclableWaste: z.coerce.number().min(0, { message: "El valor debe ser mayor o igual a 0" }),
  podaWaste: z.coerce.number().min(0, { message: "El valor debe ser mayor o igual a 0" }),
});

type WasteDataFormValues = z.infer<typeof formSchema>;

interface WasteDataFormProps {
  clients: Client[];
  onSuccess?: () => void;
}

export default function WasteDataForm({ clients, onSuccess }: WasteDataFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Use the default client if only one is provided
  const defaultClient = clients.length === 1 ? clients[0].id : undefined;
  
  const form = useForm<WasteDataFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: defaultClient,
      organicWaste: 0,
      inorganicWaste: 0,
      recyclableWaste: 0,
      podaWaste: 0,
      documentId: null, // No document associated with manual entries
      date: new Date(),
    },
  });
  
  async function onSubmit(values: WasteDataFormValues) {
    setIsSubmitting(true);
    
    try {
      // Calculate total waste and deviation
      const totalWaste = 
        values.organicWaste + 
        values.inorganicWaste + 
        values.recyclableWaste + 
        values.podaWaste;
      
      // Calculate deviation using only recyclable and PODA waste
      // Formula: (recyclable + poda) / total * 100
      const deviation = totalWaste > 0 
        ? ((values.recyclableWaste + values.podaWaste) / totalWaste) * 100 
        : 0;
      
      // Build the payload
      const payload = {
        ...values,
        totalWaste,
        deviation: Math.round(deviation * 100) / 100, // Round to 2 decimal places
      };
      
      // Submit the data
      const response = await fetch('/api/waste-data/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error('Error al guardar los datos');
      }
      
      // Success
      toast({
        title: "Datos guardados",
        description: "Los datos de residuos se han registrado correctamente.",
      });
      
      // Reset the form
      form.reset({
        clientId: defaultClient,
        organicWaste: 0,
        inorganicWaste: 0,
        recyclableWaste: 0,
        podaWaste: 0,
        documentId: null,
        date: new Date(),
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/waste-data'] });
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting waste data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Ocurrió un error al guardar los datos de residuos.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Client Selection - Only show if multiple clients */}
          {clients.length > 1 && (
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select 
                    onValueChange={(value) => field.onChange(parseInt(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar cliente" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id.toString()}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          {/* Date picker */}
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: es })
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Organic Waste */}
          <FormField
            control={form.control}
            name="organicWaste"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Residuos Orgánicos (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Residuos orgánicos principalmente de comedor
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* PODA Waste */}
          <FormField
            control={form.control}
            name="podaWaste"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Residuos de PODA (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Residuos orgánicos de jardinería y poda
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Inorganic Waste */}
          <FormField
            control={form.control}
            name="inorganicWaste"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Residuos Inorgánicos (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Residuos inorgánicos no reciclables
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Recyclable Waste */}
          <FormField
            control={form.control}
            name="recyclableWaste"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Residuos Reciclables (kg)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Residuos reciclables (papel, cartón, plástico, vidrio, etc.)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              "Guardar Registro"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}