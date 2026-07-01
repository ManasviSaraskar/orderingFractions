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
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAudio } from '../../context/AudioContext';

const colors = ['var(--purple-light)', 'var(--gold)', 'var(--green)', 'var(--red)', 'var(--blue-bright)'];

function SortableFractionBar({ item, color }) {
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
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    marginBottom: '12px',
    background: 'var(--bg-card-solid)',
    border: '2px solid rgba(255,255,255,0.2)',
    borderRadius: 'var(--radius-md)',
    cursor: 'grab',
    touchAction: 'none'
  };

  const widthPct = (item.n / item.d) * 100;

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div style={{
        width: '64px', textAlign: 'center', fontFamily: 'var(--font-display)',
        fontWeight: 'bold', fontSize: '1.5rem', borderRight: '2px solid rgba(255,255,255,0.2)',
        marginRight: '16px', paddingRight: '8px', color: 'white'
      }}>
        {item.n}/{item.d}
      </div>
      <div style={{
        flex: 1, background: 'rgba(255,255,255,0.1)', borderRadius: '8px',
        height: '48px', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)',
        position: 'relative'
      }}>
        <div 
          style={{ 
            height: '100%', width: `${widthPct}%`,
            transition: 'all 0.3s ease',
            backgroundColor: color
          }}
        />
      </div>
    </div>
  );
}

export default function FractionBarSimulation({ fractions, onComplete, isComplete }) {
  const [items, setItems] = useState([]);
  const { playSnap, playCorrect, playWrong } = useAudio();

  useEffect(() => {
    setItems(fractions.map((f, i) => ({ ...f, id: `frac-${f.n}-${f.d}-${i}` })));
  }, [fractions]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    if (isComplete) return;
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(i => i.id === active.id);
        const newIndex = items.findIndex(i => i.id === over.id);
        if (playSnap) playSnap();
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const checkOrder = () => {
    let isCorrect = true;
    for (let i = 0; i < items.length - 1; i++) {
      const current = items[i].n / items[i].d;
      const next = items[i+1].n / items[i+1].d;
      if (current > next) {
        isCorrect = false;
        break;
      }
    }
    
    if (isCorrect) {
      if (playCorrect) playCorrect();
      onComplete(true);
    } else {
      if (playWrong) playWrong();
      onComplete(false);
    }
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
      <DndContext 
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div style={{
          background: 'rgba(255,255,255,0.05)', padding: '24px',
          borderRadius: 'var(--radius-lg)', border: '2px dashed rgba(255,255,255,0.2)',
          minHeight: '300px'
        }}>
          <SortableContext 
            items={items}
            strategy={verticalListSortingStrategy}
          >
            {items.map((item, index) => (
              <SortableFractionBar key={item.id} item={item} color={colors[index % colors.length]} />
            ))}
          </SortableContext>
        </div>
      </DndContext>

      {!isComplete && (
        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center' }}>
          <button className="btn btn-outline" onClick={checkOrder}>Check Order</button>
        </div>
      )}
    </div>
  );
}
