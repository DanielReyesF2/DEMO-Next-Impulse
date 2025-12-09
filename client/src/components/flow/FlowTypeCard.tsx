import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FlowTypeInfo } from '@shared/types';

interface FlowTypeCardProps {
  flowType: FlowTypeInfo;
}

export function FlowTypeCard({ flowType }: FlowTypeCardProps) {
  return (
    <Link href={`/lots/${flowType.id}`}>
      <Card className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 h-full">
        <CardHeader className="text-center">
          <div className="text-6xl mb-4">{flowType.icon}</div>
          <CardTitle className="text-xl">{flowType.name}</CardTitle>
          <CardDescription className="text-sm">{flowType.description}</CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-2xl font-bold text-primary">{flowType.lotCount}</p>
          <p className="text-sm text-muted-foreground">lotes disponibles</p>
        </CardContent>
      </Card>
    </Link>
  );
}


