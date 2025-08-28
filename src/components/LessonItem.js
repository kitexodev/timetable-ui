// src/components/LessonItem.js
import React from 'react';
import { useDraggable } from '@dnd-kit/core';

function LessonItem({ lesson }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: lesson.id, // Unique ID for this draggable item
        data: lesson,   // Pass the full lesson object as data
    });

    const style = transform? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        backgroundColor: '#e0f7fa', // Change color when dragging
        zIndex: 100, // Ensure it appears above other elements
        cursor: 'grabbing',
    } : {
        cursor: 'grab',
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
            <strong>{lesson.subject}</strong>
            <br />
            <small>{lesson.teacher}</small>
            <br />
        </div>
    );
}

export default LessonItem;