import { FlowTypeSelector } from '@/components/flow/FlowTypeSelector';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">NEXT IMPULSE GREEN</h1>
          <p className="text-xl text-muted-foreground">Sistema de Trazabilidad Circular</p>
        </div>
        <FlowTypeSelector />
      </div>
    </div>
  );
}

