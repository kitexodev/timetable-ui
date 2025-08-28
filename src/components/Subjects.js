// src/components/Subjects.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
// MUI imports
import { 
    Tabs, 
    Tab, 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Paper, 
    List, 
    ListItem, 
    ListItemText, 
    IconButton 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const API_URL = 'https://timetable-backend-e1rc.onrender.com';

// Custom TabPanel component
function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function Subjects() {
    const [tabValue, setTabValue] = useState(0);
    const [subjects, setSubjects] = useState([]);
    const [newSubjectName, setNewSubjectName] = useState('');

    // --- NEW state variables for editing ---
    const [editingId, setEditingId] = useState(null); // ID of the subject being edited
    const [editText, setEditText] = useState('');   // Text in the edit input field

    const fetchSubjects = async () => {
        try {
            const response = await axios.get(`${API_URL}/subjects/`);
            setSubjects(response.data);
        } catch (error) {
            console.error("Error fetching subjects:", error);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    // --- CREATE logic (no changes) ---
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newSubjectName.trim()) return;
        try {
            await axios.post(`${API_URL}/subjects/`, { subject_name: newSubjectName });
            setNewSubjectName('');
            fetchSubjects();
        } catch (error) {
            console.error("Error adding subject:", error);
        }
    };

    // --- NEW DELETE logic ---
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this subject?")) {
            try {
                await axios.delete(`${API_URL}/subjects/${id}/`);
                fetchSubjects(); // Refresh the list after deleting
            } catch (error) {
                console.error("Error deleting subject:", error);
            }
        }
    };

    // --- NEW UPDATE logic ---
    const handleUpdate = async (id) => {
        if (!editText.trim()) return;
        try {
            await axios.put(`${API_URL}/subjects/${id}/`, { subject_name: editText });
            setEditingId(null); // Exit edit mode
            setEditText('');
            fetchSubjects(); // Refresh the list
        } catch (error) {
            console.error("Error updating subject:", error);
        }
    };

    // --- Helper function to start editing ---
    const startEdit = (subject) => {
        setEditingId(subject.id);
        setEditText(subject.subject_name);
    };

    // Handle tab change
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    return (
        <Paper elevation={3} sx={{ p: 2, maxWidth: 800, mx: 'auto', mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                Manage Subjects
            </Typography>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs 
                    value={tabValue} 
                    onChange={handleTabChange} 
                    aria-label="subject management tabs"
                    variant="fullWidth"
                >
                    <Tab label="View Subjects" />
                    <Tab label="Add Subject" />
                </Tabs>
            </Box>
            
            {/* Tab Panel for Subject List */}
            <TabPanel value={tabValue} index={0}>
                <Typography variant="h6" gutterBottom>
                    Existing Subjects
                </Typography>
                <List>
                    {subjects.map(subject => (
                        <ListItem 
                            key={subject.id}
                            secondaryAction={
                                editingId === subject.id ? (
                                    <>
                                        <IconButton edge="end" onClick={() => handleUpdate(subject.id)} color="primary">
                                            <SaveIcon />
                                        </IconButton>
                                        <IconButton edge="end" onClick={() => setEditingId(null)} color="error">
                                            <CancelIcon />
                                        </IconButton>
                                    </>
                                ) : (
                                    <>
                                        <IconButton edge="end" onClick={() => startEdit(subject)} color="primary">
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton edge="end" onClick={() => handleDelete(subject.id)} color="error">
                                            <DeleteIcon />
                                        </IconButton>
                                    </>
                                )
                            }
                        >
                            {editingId === subject.id ? (
                                <TextField
                                    fullWidth
                                    size="small"
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    variant="outlined"
                                />
                            ) : (
                                <ListItemText primary={subject.subject_name} />
                            )}
                        </ListItem>
                    ))}
                </List>
            </TabPanel>
            
            {/* Tab Panel for Adding Subjects */}
            <TabPanel value={tabValue} index={1}>
                <Typography variant="h6" gutterBottom>
                    Add New Subject
                </Typography>
                <Box component="form" onSubmit={handleAdd} sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <TextField
                        fullWidth
                        label="Subject Name"
                        variant="outlined"
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                        placeholder="Enter new subject name"
                    />
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                    >
                        Add Subject
                    </Button>
                </Box>
            </TabPanel>
        </Paper>
    );
}

export default Subjects;