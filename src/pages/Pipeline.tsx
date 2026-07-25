import { useState } from 'react';
import { useCrmStore } from '../store/useCrmStore';
import type { DealStage } from '../lib/mockData';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { GripVertical, DollarSign, Calendar } from 'lucide-react';
import { format } from 'date-fns';

const STAGES: DealStage[] = ['New', 'Contacted', 'Proposal', 'Won', 'Lost'];

function SortableDealCard({ deal }: { deal: any }) {
  const { customers } = useCrmStore();
  const customer = customers.find(c => c.id === deal.customerId);
  
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: deal.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const priorityColor = {
    low: 'secondary',
    medium: 'warning',
    high: 'destructive'
  } as const;

  return (
    <div ref={setNodeRef} style={style} {...attributes} className="mb-3">
      <Card className="hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing border-border group relative">
        <div {...listeners} className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
           <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        <CardContent className="p-4 pl-8">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-medium text-sm line-clamp-1" title={deal.title}>{deal.title}</h4>
            <Badge variant={priorityColor[deal.priority as keyof typeof priorityColor] as any}>{deal.priority}</Badge>
          </div>
          <div className="text-sm text-muted-foreground mb-3">{customer?.name} - {customer?.company}</div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2 pt-2 border-t border-border/50">
            <div className="flex items-center gap-1 font-medium text-foreground">
              <DollarSign className="h-3 w-3" />
              {deal.value.toLocaleString()}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(deal.expectedCloseDate), 'MMM d')}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function KanbanColumn({ title, deals }: { title: string, deals: any[] }) {
  return (
    <div className="flex flex-col w-80 shrink-0">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-semibold">{title}</h3>
        <Badge variant="secondary">{deals.length}</Badge>
      </div>
      <div className="bg-secondary/30 rounded-lg p-3 min-h-[500px] flex-1">
        <SortableContext items={deals.map(d => d.id)} strategy={verticalListSortingStrategy}>
          {deals.map(deal => (
            <SortableDealCard key={deal.id} deal={deal} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

export function Pipeline() {
  const { deals, updateDealStage } = useCrmStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const activeDeal = deals.find(d => d.id === active.id);
    const overDeal = deals.find(d => d.id === over.id);

    if (activeDeal && overDeal && activeDeal.stage !== overDeal.stage) {
      updateDealStage(activeDeal.id, overDeal.stage);
    }
  };

  const activeDeal = activeId ? deals.find(d => d.id === activeId) : null;

  return (
    <div className="h-full flex flex-col animate-in fade-in duration-500">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Sales Pipeline</h1>
        <p className="text-muted-foreground">Manage your deals across different stages.</p>
      </div>

      <div className="flex-1 overflow-x-auto pb-4">
        <div className="flex gap-4 h-full">
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCorners} 
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            {STAGES.map(stage => (
              <KanbanColumn 
                key={stage} 
                title={stage} 
                deals={deals.filter(d => d.stage === stage)} 
              />
            ))}
            
            <DragOverlay>
              {activeDeal ? (
                <div className="w-80 opacity-80 rotate-2">
                  <SortableDealCard deal={activeDeal} />
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
