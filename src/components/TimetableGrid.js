// src/components/TimetableGrid.js
import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import LessonItem from './LessonItem';

// A helper component for each cell in the grid
function DroppableCell({ day, slot, lesson, children }) {
    const { setNodeRef } = useDroppable({
        id: `${day}-${slot}`, // The ID remains the same
    });

    return (
        <td ref={setNodeRef} style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center', height: '80px', verticalAlign: 'top', minWidth: '100px' }}>
            {lesson ? children : '--'}
        </td>
    );
}

function TimetableGrid({ schedule }) {
    if (!schedule || !schedule.days || !schedule.timeslots || !schedule.scheduled_lessons) {
        return <p>Timetable data is incomplete.</p>;
    }

    const { days, timeslots, scheduled_lessons } = schedule;

    // Create a structured grid for easy lookup (no changes here)
    const grid = {};
    days.forEach(day => {
        grid[day] = {};
        timeslots.forEach(slot => {
            grid[day][slot] = null;
        });
    });

    // Populate the grid with the scheduled lessons (no changes here)
    scheduled_lessons.forEach(lesson => {
        if (grid[lesson.day] && grid[lesson.day][lesson.timeslot] !== undefined) {
            grid[lesson.day][lesson.timeslot] = lesson;
        }
    });

    return (
        <div style={{ marginTop: '20px', overflowX: 'auto' }}> {/* Added overflow for smaller screens */}
            <h3>Timetable for: {schedule.student_group_name}</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ccc' }}>
                {/* --- CHANGED SECTION: THEAD (TABLE HEADER) --- */}
                <thead>
                    <tr>
                        {/* The first cell is now empty */}
                        <th style={{ border: '1px solid #ccc', padding: '8px', background: '#f2f2f2' }}>Day</th>
                        {/* The top row now lists the Periods */}
                        {timeslots.map(slot => (
                            <th key={slot} style={{ border: '1px solid #ccc', padding: '8px', background: '#f2f2f2' }}>{slot}</th>
                        ))}
                    </tr>
                </thead>
                {/* --- CHANGED SECTION: TBODY (TABLE BODY) --- */}
                <tbody>
                    {/* The outer loop is now for the Days */}
                    {days.map(day => (
                        <tr key={day}>
                            {/* The first cell in each row is the Day name */}
                            <td style={{ border: '1px solid #ccc', padding: '8px', fontWeight: 'bold' }}>{day}</td>
                            {/* The inner loop is for the Periods */}
                            {timeslots.map(slot => {
                                const lesson = grid[day][slot];
                                return (
                                    <DroppableCell key={slot} day={day} slot={slot} lesson={lesson}>
                                        {lesson && <LessonItem lesson={lesson} />}
                                    </DroppableCell>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TimetableGrid;