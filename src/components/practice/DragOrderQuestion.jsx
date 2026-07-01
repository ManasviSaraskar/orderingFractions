import React, { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import FractionDisplay from '../ui/FractionDisplay';

function SortableFractionToken({ item }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    background: 'var(--bg-card-solid)',
    borderRadius: '16px',
    boxShadow: 'var(--shadow-button)',
    border: '4px solid rgba(255,255,255,0.2)',
    cursor: 'grab',
    padding: '16px',
    margin: '0 8px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    touchAction: 'none'
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} 
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--gold)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)'; }}
    >
      <FractionDisplay n={item.n} d={item.d} size="lg" />
    </div>
  );
}

export default function DragOrderQuestion({ question, onAnswer, disabled }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(question.fractions.map((f, i) => ({ ...f, id: `prac-${f.n}-${f.d}-${i}` })));
  }, [question]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    if (disabled) return;
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div style={{ width: '100%', marginTop: '24px' }}>
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div style={{
          background: 'rgba(255,255,255,0.05)',
          padding: '24px',
          borderRadius: 'var(--radius-lg)',
          border: '2px dashed rgba(255,255,255,0.2)',
          minHeight: '160px',
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <SortableContext 
            items={items}
            strategy={horizontalListSortingStrategy}
          >
            {items.map((item) => (
              <SortableFractionToken key={item.id} item={item} />
            ))}
          </SortableContext>
        </div>
      </DndContext>

      {!disabled && (
        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={() => onAnswer(items)}>Check Answer</button>
        </div>
      )}
    </div>
  );
}
