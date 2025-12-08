interface CycleIndicatorProps {
  current: number;
  total: number;
}

export function CycleIndicator({ current, total }: CycleIndicatorProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: total }).map((_, index) => (
        <div
          key={index}
          className={`w-2 h-2 rounded-full ${
            index < current ? 'bg-primary' : 'bg-gray-300'
          }`}
        />
      ))}
      <span className="ml-2 text-sm text-muted-foreground">{current}</span>
    </div>
  );
}

