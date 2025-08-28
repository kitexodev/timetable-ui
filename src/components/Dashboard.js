// src/components/Dashboard.js
import React, { useState, useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import axios from 'axios';
import { DndContext } from '@dnd-kit/core';
import TimetableGrid from './TimetableGrid';
import API_URL from '../apiConfig';



function Dashboard() {
    const [allSchedules, setAllSchedules] = useState([]);
    const [selectedScheduleIndex, setSelectedScheduleIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [viewMode, setViewMode] = useState('class');
    const [teacherList, setTeacherList] = useState([]);
    const [conflictingLessonId, setConflictingLessonId] = useState(null); // New state

    // --- MOVED THIS FUNCTION TO THE TOP ---
    const getTeacherSchedule = (teacherName) => {
        if (!allSchedules || allSchedules.length === 0) return null;

        const allLessons = allSchedules.flatMap(s => s.scheduled_lessons);
        const teacherLessons = allLessons.filter(l => l.teacher === teacherName);
        
        return {
            student_group_name: `Teacher: ${teacherName}`,
            days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            timeslots: ["Period 1", "Period 2", "Period 3", "Period 4", "Period 5", "Period 6", "Period 7", "Period 8"],
            scheduled_lessons: teacherLessons.map(l => {
                // Find the original group name for the lesson
                const originalGroup = allSchedules.find(s => s.scheduled_lessons.some(sl => sl.id === l.id));
                return {
                    ...l,
                    subject: `${l.subject} (${originalGroup ? originalGroup.student_group_name : 'N/A'})`
                };
            })
        };
    };
    
    const handleGenerate = async () => {
        setIsLoading(true);
        setError('');
        setAllSchedules([]);
        try {
            const response = await axios.post(`${API_URL}/generate/`);
            if (response.data && response.data.schedules) {
                setAllSchedules(response.data.schedules);
                const allLessons = response.data.schedules.flatMap(s => s.scheduled_lessons);
                const uniqueTeachers = [...new Set(allLessons.map(l => l.teacher))];
                setTeacherList(uniqueTeachers.sort());
                setSelectedScheduleIndex(0);
            } else {
                setError(response.data.message || 'An unknown error occurred.');
            }
        } catch (error) {
            console.error("Error generating timetable:", error);
            setError('Failed to generate timetable.');
        } finally {
            setIsLoading(false);
        }
    };

        const handleDragEnd = async (event) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            // --- Store the original state in case we need to revert ---
            const originalSchedules = JSON.parse(JSON.stringify(allSchedules));

            // --- Optimistically update the UI for a snappy feel ---
            const [newDay, newTimeslot] = over.id.split('-');
            const updatedSchedules = allSchedules.map((schedule, index) => {
                if (index !== selectedScheduleIndex) return schedule;
                const lessons = schedule.scheduled_lessons;
                const draggedLesson = lessons.find(l => l.id === active.id);
                if (draggedLesson) {
                    draggedLesson.day = newDay;
                    draggedLesson.timeslot = newTimeslot;
                }
                return { ...schedule, scheduled_lessons: lessons };
            });
            setAllSchedules(updatedSchedules);

            // --- Now, send the proposed new state to the backend for validation ---
            try {
                const response = await axios.post(`${API_URL}/validate-move/`, {
                    all_schedules: updatedSchedules, // Send the entire proposed timetable
                    moved_lesson_id: active.id,
                    new_day: newDay,
                    new_timeslot: newTimeslot,
                });

                if (!response.data.valid) {
                    // --- If the move is invalid, show an alert and revert ---
                    alert(`Invalid Move: ${response.data.reason}`);
                    setAllSchedules(originalSchedules); // Snap back to the original state
                
                    if (response.data.conflicting_lesson_id) {
                        setConflictingLessonId(response.data.conflicting_lesson_id);
                        // Optional: clear the highlight after a few seconds
                        setTimeout(() => setConflictingLessonId(null), 3000);
                    }
                }
                // If it's valid, we do nothing and keep the optimistic update.

            } catch (error) {
                console.error("Error validating move:", error);
                alert("An error occurred while validating the move. Reverting.");
                setAllSchedules(originalSchedules); // Revert on error too
            }
        }
    };

    const handleExport = async () => {
        // ... (handleExport logic is the same)
        const scheduleToExport = currentSchedule;
        if (!scheduleToExport) {
            alert("Please generate a timetable and select a schedule to export.");
            return;
        }
        try {
            const response = await axios.post(
                `${API_URL}/export/`,
                { schedule: scheduleToExport },
                { responseType: 'blob' }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            const filename = (scheduleToExport.student_group_name || 'timetable').replace(":", "").replace(" ", "_");
            link.setAttribute('download', `${filename}.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error exporting timetable:", error);
            alert("Failed to export timetable. Please try again.");
        }
    };

    // --- This code now runs AFTER getTeacherSchedule is defined ---
    let currentSchedule;
    if (viewMode === 'class' && allSchedules.length > 0) {
        currentSchedule = allSchedules[selectedScheduleIndex];
    } else if (viewMode === 'teacher' && teacherList.length > 0) {
        const validIndex = Math.min(selectedScheduleIndex, teacherList.length - 1);
        if (teacherList[validIndex]) {
            currentSchedule = getTeacherSchedule(teacherList[validIndex]);
        }
    }

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div>
                <h2>Timetable Dashboard</h2>
                
                <button onClick={handleGenerate} disabled={isLoading}>
                    {isLoading ? 'Generating...' : 'Generate Timetables'}
                </button>
                <button onClick={handleExport} disabled={!currentSchedule}>
                    Export to Excel
                </button>
                <hr />

                <div>
                    <Tabs
                        value={viewMode}
                        onChange={(e, newValue) => {
                            setViewMode(newValue);
                            setSelectedScheduleIndex(0);
                        }}
                        aria-label="View Mode Tabs"
                    >
                        <Tab label="Class View" value="class" />
                        <Tab label="Teacher View" value="teacher" />
                    </Tabs>

                    {viewMode === 'class' && allSchedules.length > 0 && (
                        <select value={selectedScheduleIndex} onChange={e => setSelectedScheduleIndex(Number(e.target.value))}>
                            {allSchedules.map((s, i) => <option key={i} value={i}>{s.student_group_name}</option>)}
                        </select>
                    )}
                    {viewMode === 'teacher' && teacherList.length > 0 && (
                        <select value={selectedScheduleIndex} onChange={e => setSelectedScheduleIndex(Number(e.target.value))}>
                            {teacherList.map((t, i) => <option key={i} value={i}>{t}</option>)}
                        </select>
                    )}
                </div>

                {isLoading && <p>Please wait, the algorithm is running...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {currentSchedule && (
                    <TimetableGrid 
                    schedule={currentSchedule}
                    conflictingLessonId={conflictingLessonId}
                    />
                )}
            </div>
        </DndContext>
    );
}

export default Dashboard;