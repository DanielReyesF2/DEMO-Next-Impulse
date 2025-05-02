import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useLocation } from 'wouter';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  ArrowRight,
  ClipboardCheck, 
  Scale, 
  Loader2, 
  Check, 
  X, 
  Leaf,
  Database,
  Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Definición de las interfaces
interface Client {
  id: number;
  name: string;
}

interface WasteEntry {
  clientId: number;
  date: string;
  organicWaste: number;
  inorganicWaste: number;
  recyclableWaste: number;
  podaWaste: number; // Nuevo campo para residuos de poda
  recyclingBreakdown: {
    cardboard: number;
    paper: number;
    plastic: number;
    glass: number;
    metal: number;
    tetraPak: number;
  };
}

// Esquema de validación
const formSchema = z.object({
  clientId: z.number().min(1, "Selecciona un cliente"),
  date: z.string().nonempty("La fecha es requerida"),
  organicWaste: z.number().min(0, "No puede ser negativo"),
  inorganicWaste: z.number().min(0, "No puede ser negativo"),
  recyclableWaste: z.number().min(0, "No puede ser negativo"),
  podaWaste: z.number().min(0, "No puede ser negativo"),
  cardboard: z.number().min(0, "No puede ser negativo"),
  paper: z.number().min(0, "No puede ser negativo"),
  plastic: z.number().min(0, "No puede ser negativo"),
  glass: z.number().min(0, "No puede ser negativo"),
  metal: z.number().min(0, "No puede ser negativo"),
  tetraPak: z.number().min(0, "No puede ser negativo"),
});

// Enumeración para los pasos del formulario
enum FormStep {
  BASIC_INFO = 0,
  ORGANIC_WASTE = 1,
  INORGANIC_WASTE = 2,
  RECYCLABLE_WASTE = 3,
  REVIEW = 4,
}

export default function WasteDataEntry() {
  const [step, setStep] = useState<FormStep>(FormStep.BASIC_INFO);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Cargar la lista de clientes
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
    refetchOnWindowFocus: false,
  });

  // Formulario con valores por defecto
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: 4, // Club Campestre fijo para esta versión
      date: new Date().toISOString().split('T')[0],
      organicWaste: 0,
      inorganicWaste: 0,
      recyclableWaste: 0,
      podaWaste: 0,
      cardboard: 0,
      paper: 0,
      plastic: 0,
      glass: 0,
      metal: 0,
      tetraPak: 0,
    },
  });

  // Mutation para enviar los datos
  const mutation = useMutation({
    mutationFn: async (data: WasteEntry) => {
      const response = await fetch('/api/waste-data/manual', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar los datos');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/waste-data'] });
      toast({
        title: 'Éxito',
        description: 'Los datos se han guardado correctamente',
        variant: 'default',
      });
      setLocation('/');
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
      setIsSubmitting(false);
    },
  });

  // Función para avanzar al siguiente paso
  const nextStep = () => {
    switch (step) {
      case FormStep.BASIC_INFO:
        // Validar campos básicos
        if (form.formState.errors.clientId || form.formState.errors.date) {
          return;
        }
        break;
      case FormStep.ORGANIC_WASTE:
        // Validar campos de residuos orgánicos
        if (form.formState.errors.organicWaste || form.formState.errors.podaWaste) {
          return;
        }
        break;
      case FormStep.INORGANIC_WASTE:
        // Validar campos de residuos inorgánicos
        if (form.formState.errors.inorganicWaste) {
          return;
        }
        break;
      case FormStep.RECYCLABLE_WASTE:
        // Validar campos de residuos reciclables
        if (
          form.formState.errors.recyclableWaste ||
          form.formState.errors.cardboard ||
          form.formState.errors.paper ||
          form.formState.errors.plastic ||
          form.formState.errors.glass ||
          form.formState.errors.metal ||
          form.formState.errors.tetraPak
        ) {
          return;
        }
        break;
    }

    // Si todo está correcto, avanzar al siguiente paso
    setStep((prevStep) => (prevStep + 1) as FormStep);
  };

  // Función para retroceder al paso anterior
  const prevStep = () => {
    setStep((prevStep) => (prevStep - 1) as FormStep);
  };

  // Función para enviar el formulario
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    const recyclableTotal = values.cardboard + values.paper + values.plastic + 
                            values.glass + values.metal + values.tetraPak;

    // Asegurarse de que la suma de los reciclables sea igual al total
    const formData: WasteEntry = {
      clientId: values.clientId,
      date: values.date,
      organicWaste: values.organicWaste,
      inorganicWaste: values.inorganicWaste,
      recyclableWaste: recyclableTotal,
      podaWaste: values.podaWaste,
      recyclingBreakdown: {
        cardboard: values.cardboard,
        paper: values.paper,
        plastic: values.plastic,
        glass: values.glass,
        metal: values.metal,
        tetraPak: values.tetraPak,
      },
    };

    mutation.mutate(formData);
  };

  // Calcular el total de residuos para mostrar en la revisión
  const totalWaste = useMemo(() => {
    const values = form.getValues();
    return values.organicWaste + values.inorganicWaste + values.recyclableWaste + values.podaWaste;
  }, [form]);

  // Calcular el porcentaje de desviación para mostrar en la revisión
  const deviationPercentage = useMemo(() => {
    const values = form.getValues();
    const recyclable = values.recyclableWaste;
    const poda = values.podaWaste;
    const total = values.organicWaste + values.inorganicWaste + recyclable + poda;
    
    if (total === 0) return 0;
    
    // La fórmula de desviación: (Reciclable + PODA) / Total × 100
    return ((recyclable + poda) / total) * 100;
  }, [form]);

  // Renderización condicional según el paso actual
  const renderStepContent = () => {
    switch (step) {
      case FormStep.BASIC_INFO:
        return (
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cliente</FormLabel>
                  <Select
                    disabled={true} // Deshabilitado porque solo hay Club Campestre
                    value={field.value.toString()}
                    onValueChange={(value) => field.onChange(parseInt(value))}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un cliente" />
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
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de generación</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case FormStep.ORGANIC_WASTE:
        return (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <div className="bg-green-100 p-4 inline-block rounded-full mb-2">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold">Residuos Orgánicos</h3>
              <p className="text-gray-500">Ingresa las cantidades en kilogramos (kg)</p>
            </div>
            
            <FormField
              control={form.control}
              name="organicWaste"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Residuos Orgánicos (Comedor)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      min="0" 
                      onChange={e => field.onChange(Number(e.target.value))}
                      className="text-right"
                      placeholder="0.00"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="podaWaste"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Residuos Orgánicos (PODA)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      min="0" 
                      onChange={e => field.onChange(Number(e.target.value))}
                      className="text-right"
                      placeholder="0.00"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case FormStep.INORGANIC_WASTE:
        return (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <div className="bg-gray-100 p-4 inline-block rounded-full mb-2">
                <Scale className="h-8 w-8 text-gray-600" />
              </div>
              <h3 className="text-xl font-bold">Residuos Inorgánicos</h3>
              <p className="text-gray-500">Ingresa las cantidades en kilogramos (kg)</p>
            </div>
            
            <FormField
              control={form.control}
              name="inorganicWaste"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Residuos Inorgánicos</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field} 
                      min="0" 
                      onChange={e => field.onChange(Number(e.target.value))}
                      className="text-right"
                      placeholder="0.00"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        );
      case FormStep.RECYCLABLE_WASTE:
        return (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <div className="bg-blue-100 p-4 inline-block rounded-full mb-2">
                <Database className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold">Residuos Reciclables</h3>
              <p className="text-gray-500">Ingresa las cantidades en kilogramos (kg)</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="cardboard"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cartón</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        min="0" 
                        onChange={e => field.onChange(Number(e.target.value))}
                        className="text-right"
                        placeholder="0.00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="paper"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Papel</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        min="0" 
                        onChange={e => field.onChange(Number(e.target.value))}
                        className="text-right"
                        placeholder="0.00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="plastic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Plástico</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        min="0" 
                        onChange={e => field.onChange(Number(e.target.value))}
                        className="text-right"
                        placeholder="0.00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="glass"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vidrio</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        min="0" 
                        onChange={e => field.onChange(Number(e.target.value))}
                        className="text-right"
                        placeholder="0.00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="metal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metal</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        min="0" 
                        onChange={e => field.onChange(Number(e.target.value))}
                        className="text-right"
                        placeholder="0.00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tetraPak"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tetra Pak</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        {...field} 
                        min="0" 
                        onChange={e => field.onChange(Number(e.target.value))}
                        className="text-right"
                        placeholder="0.00"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-bold mb-2">Total de Reciclables</h4>
              <p className="text-2xl text-blue-600 font-bold text-right">
                {(
                  Number(form.watch('cardboard')) +
                  Number(form.watch('paper')) +
                  Number(form.watch('plastic')) +
                  Number(form.watch('glass')) +
                  Number(form.watch('metal')) +
                  Number(form.watch('tetraPak'))
                ).toFixed(2)} kg
              </p>
            </div>
          </div>
        );
      case FormStep.REVIEW:
        return (
          <div className="space-y-6">
            <div className="text-center mb-4">
              <div className="bg-lime p-4 inline-block rounded-full mb-2">
                <ClipboardCheck className="h-8 w-8 text-navy" />
              </div>
              <h3 className="text-xl font-bold">Revisar y Confirmar</h3>
              <p className="text-gray-500">Verifica la información antes de guardar</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Información Básica</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cliente:</span>
                    <span className="font-medium">Club Campestre</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Fecha:</span>
                    <span className="font-medium">{new Date(form.watch('date')).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Residuos Orgánicos</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Orgánico (Comedor):</span>
                    <span className="font-medium">{form.watch('organicWaste').toFixed(2)} kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Orgánico (PODA):</span>
                    <span className="font-medium">{form.watch('podaWaste').toFixed(2)} kg</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Residuos Inorgánicos</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Inorgánico:</span>
                    <span className="font-medium">{form.watch('inorganicWaste').toFixed(2)} kg</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg border p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Residuos Reciclables</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Cartón:</span>
                    <span className="font-medium">{form.watch('cardboard').toFixed(2)} kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Papel:</span>
                    <span className="font-medium">{form.watch('paper').toFixed(2)} kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Plástico:</span>
                    <span className="font-medium">{form.watch('plastic').toFixed(2)} kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Vidrio:</span>
                    <span className="font-medium">{form.watch('glass').toFixed(2)} kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Metal:</span>
                    <span className="font-medium">{form.watch('metal').toFixed(2)} kg</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tetra Pak:</span>
                    <span className="font-medium">{form.watch('tetraPak').toFixed(2)} kg</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                    <span className="text-sm font-medium">Total Reciclables:</span>
                    <span className="font-medium">
                      {(
                        Number(form.watch('cardboard')) +
                        Number(form.watch('paper')) +
                        Number(form.watch('plastic')) +
                        Number(form.watch('glass')) +
                        Number(form.watch('metal')) +
                        Number(form.watch('tetraPak'))
                      ).toFixed(2)} kg
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-gray-50 rounded-lg p-5">
                <h4 className="text-lg font-bold mb-2">Total de Residuos</h4>
                <p className="text-3xl font-bold text-navy">{totalWaste.toFixed(2)} kg</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-5">
                <h4 className="text-lg font-bold mb-2">Índice de Desviación</h4>
                <p className="text-3xl font-bold text-green-600">{deviationPercentage.toFixed(2)}%</p>
                <p className="text-xs text-gray-500 mt-1">
                  <span className="font-medium">Fórmula:</span> (Reciclable + PODA) / Total × 100
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  // Función para obtener el título del paso actual
  const getStepTitle = () => {
    switch (step) {
      case FormStep.BASIC_INFO: return "Paso 1: Información Básica";
      case FormStep.ORGANIC_WASTE: return "Paso 2: Residuos Orgánicos";
      case FormStep.INORGANIC_WASTE: return "Paso 3: Residuos Inorgánicos";
      case FormStep.RECYCLABLE_WASTE: return "Paso 4: Residuos Reciclables";
      case FormStep.REVIEW: return "Paso 5: Revisar y Confirmar";
      default: return "";
    }
  };

  // Función para renderizar las acciones según el paso
  const renderActions = () => {
    return (
      <div className="flex justify-between mt-6">
        {step > FormStep.BASIC_INFO && (
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={isSubmitting}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Anterior
          </Button>
        )}
        
        {step < FormStep.REVIEW ? (
          <Button
            type="button"
            className="ml-auto"
            onClick={nextStep}
          >
            Siguiente
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            className="ml-auto bg-lime hover:bg-lime/90 text-black"
            disabled={isSubmitting}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Guardar Registro
              </>
            )}
          </Button>
        )}
      </div>
    );
  };

  // Renderizar el indicador de pasos
  const renderStepIndicator = () => {
    const steps = [
      { icon: <Calendar className="h-4 w-4" />, label: "Información" },
      { icon: <Leaf className="h-4 w-4" />, label: "Orgánicos" },
      { icon: <Scale className="h-4 w-4" />, label: "Inorgánicos" },
      { icon: <Database className="h-4 w-4" />, label: "Reciclables" },
      { icon: <ClipboardCheck className="h-4 w-4" />, label: "Revisar" },
    ];

    return (
      <div className="w-full mb-8">
        <div className="flex items-center justify-between">
          {steps.map((s, i) => (
            <div key={i} className="flex flex-col items-center">
              <div 
                className={`flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
                  i === step ? 'bg-lime text-navy' : 
                  i < step ? 'bg-navy text-white' : 'bg-gray-200 text-gray-500'
                }`}
              >
                {s.icon}
              </div>
              <span className={`text-xs mt-2 ${i === step ? 'font-bold' : ''}`}>{s.label}</span>
              
              {/* Línea conectora */}
              {i < steps.length - 1 && (
                <div className="hidden sm:block absolute left-0 w-full">
                  <div 
                    className={`h-0.5 ${
                      i < step ? 'bg-navy' : 'bg-gray-200'
                    }`} 
                    style={{
                      width: `${100 / (steps.length - 1)}%`,
                      marginLeft: `${i * (100 / (steps.length - 1))}%`
                    }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <AppLayout>
      <div className="mx-auto max-w-4xl p-6">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-anton tracking-wider">{getStepTitle()}</CardTitle>
            <CardDescription>
              Registro de residuos para Club Campestre
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {renderStepIndicator()}
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {renderStepContent()}
              </form>
            </Form>
          </CardContent>
          
          <CardFooter className="border-t pt-6">
            {renderActions()}
          </CardFooter>
        </Card>
      </div>
    </AppLayout>
  );
}