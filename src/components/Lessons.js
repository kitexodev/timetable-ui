// src/components/Lessons.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api';

function Lessons() {
    // State for the list of all lessons
    const [lessons, setLessons] = useState([]);
    
    // State for the data needed to populate the form's dropdowns
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [studentGroups, setStudentGroups] = useState([]);

    // State for the form inputs
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTeacher, setSelectedTeacher] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('');
    const [periodsPerWeek, setPeriodsPerWeek] = useState(1);
    const [isDouble, setIsDouble] = useState(false);

    // State for tracking editing mode
    const [editMode, setEditMode] = useState(false);
    const [currentLessonId, setCurrentLessonId] = useState(null);

    // Fetch all necessary data when the component loads
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Perform all API calls in parallel for efficiency
                const [lessonsRes, subjectsRes, teachersRes, groupsRes] = await Promise.all([
                    axios.get(`${API_URL}/lessons/`),
                    axios.get(`${API_URL}/subjects/`),
                    axios.get(`${API_URL}/teachers/`),
                    axios.get(`${API_URL}/student-groups/`)
                ]);

                setLessons(lessonsRes.data);
                setSubjects(subjectsRes.data);
                setTeachers(teachersRes.data);
                setStudentGroups(groupsRes.data);

                // Set default selections for dropdowns
                if (subjectsRes.data.length > 0) setSelectedSubject(subjectsRes.data[0].id);
                if (teachersRes.data.length > 0) setSelectedTeacher(teachersRes.data[0].id);
                if (groupsRes.data.length > 0) setSelectedGroup(groupsRes.data[0].id);

            } catch (error) {
                console.error("Error fetching initial data for lessons form:", error);
            }
        };
        fetchData();
    }, []);

    const fetchLessons = async () => {
        try {
            const response = await axios.get(`${API_URL}/lessons/`);
            setLessons(response.data);
        } catch (error) {
            console.error("Error fetching lessons:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const lessonData = {
            subject: selectedSubject,
            student_group: selectedGroup,
            teachers: [selectedTeacher], // API expects a list of teacher IDs
            periods_per_week: periodsPerWeek,
            is_double_period: isDouble,
        };

        try {
            if (editMode) {
                // Update existing lesson
                await axios.put(`${API_URL}/lessons/${currentLessonId}/`, lessonData);
                setEditMode(false);
                setCurrentLessonId(null);
                // Reset form fields to default values
                if (subjects.length > 0) setSelectedSubject(subjects[0].id);
                if (teachers.length > 0) setSelectedTeacher(teachers[0].id);
                if (studentGroups.length > 0) setSelectedGroup(studentGroups[0].id);
                setPeriodsPerWeek(1);
                setIsDouble(false);
            } else {
                // Create new lesson
                await axios.post(`${API_URL}/lessons/`, lessonData);
            }
            fetchLessons(); // Refresh the list of lessons
        } catch (error) {
            console.error("Error saving lesson:", error.response ? error.response.data : error);
            alert(`Failed to ${editMode ? 'update' : 'add'} lesson. Check console for details.`);
        }
    };
    
    const handleEdit = (lesson) => {
        setEditMode(true);
        setCurrentLessonId(lesson.id);
        setSelectedSubject(lesson.subject);
        setSelectedGroup(lesson.student_group);
        setSelectedTeacher(lesson.teachers[0]); // Assuming single teacher for simplicity
        setPeriodsPerWeek(lesson.periods_per_week);
    };
    
    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this lesson?')) {
            try {
                await axios.delete(`${API_URL}/lessons/${id}/`);
                fetchLessons(); // Refresh the list of lessons
            } catch (error) {
                console.error("Error deleting lesson:", error.response ? error.response.data : error);
                alert("Failed to delete lesson. Check console for details.");
            }
        }
    };
    
    const handleCancel = () => {
        setEditMode(false);
        setCurrentLessonId(null);
        // Reset form to default values
        if (subjects.length > 0) setSelectedSubject(subjects[0].id);
        if (teachers.length > 0) setSelectedTeacher(teachers[0].id);
        if (studentGroups.length > 0) setSelectedGroup(studentGroups[0].id);
        setPeriodsPerWeek(1);
    };
    
    // Helper function to get names from IDs for display
    const getDetail = (id, list, field) => {
        const item = list.find(item => item.id === id);
        return item ? item[field] : `ID ${id}`;
    };

    return (
        <div>
            <h2>Manage Lessons (Curriculum)</h2>
            <p>Define what subjects are taught to each group and by whom.</p>
            <form onSubmit={handleSubmit}>
                <label>Student Group: </label>
                <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)}>
                    {studentGroups.map(group => <option key={group.id} value={group.id}>{group.group_name}</option>)}
                </select>

                <label> Subject: </label>
                <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                    {subjects.map(subject => <option key={subject.id} value={subject.id}>{subject.subject_name}</option>)}
                </select>

                <label> Teacher: </label>
                <select value={selectedTeacher} onChange={(e) => setSelectedTeacher(e.target.value)}>
                    {teachers.map(teacher => <option key={teacher.id} value={teacher.id}>{`${teacher.first_name} ${teacher.last_name}`}</option>)}
                </select>

                <label> Periods per Week: </label>
                <input
                    type="number"
                    value={periodsPerWeek}
                    onChange={(e) => setPeriodsPerWeek(parseInt(e.target.value, 10))}
                    min="1"
                />
                <label>
                    <input
                        type="checkbox"
                        checked={isDouble}
                        onChange={e => setIsDouble(e.target.checked)}
                    />
                    Is Double Period (Block)?
                </label>
                <div>
                    <button type="submit">{editMode ? 'Update Lesson' : 'Add Lesson'}</button>
                    {editMode && <button type="button" onClick={handleCancel}>Cancel</button>}
                </div>
            </form>

            <h3>Defined Lessons:</h3>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Group</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Subject</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Teacher</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Periods/Week</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {lessons.map(lesson => (
                        <tr key={lesson.id}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                {getDetail(lesson.student_group, studentGroups, 'group_name')}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                {getDetail(lesson.subject, subjects, 'subject_name')}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                {lesson.teachers.map(tid => getDetail(tid, teachers, 'first_name') + ' ' + 
                                    getDetail(tid, teachers, 'last_name')).join(', ')}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                {lesson.periods_per_week}
                            </td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                <button 
                                    onClick={() => handleEdit(lesson)}
                                    style={{ marginRight: '10px' }}
                                >
                                    Edit
                                </button>
                                <button 
                                    onClick={() => handleDelete(lesson.id)}
                                    style={{ backgroundColor: '#f44336' }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Lessons;