// src/components/StudentGroups.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Tabs, Tab, Box, TextField, Button, Typography, Paper, List, ListItem, ListItemText, IconButton, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const API_URL = 'http://127.0.0.1:8000/api';


function StudentGroups() {
    const [studentGroups, setStudentGroups] = useState([]);
    const [newGroup, setNewGroup] = useState({ group_name: '', grade_level: '' });
    const [editingId, setEditingId] = useState(null);
    const [editingGroup, setEditingGroup] = useState(null);
    const [tab, setTab] = useState(0);

    const fetchStudentGroups = async () => {
        try {
            const response = await axios.get(`${API_URL}/student-groups/`);
            setStudentGroups(response.data);
        } catch (error) {
            console.error("Error fetching student groups:", error);
        }
    };

    useEffect(() => {
        fetchStudentGroups();
    }, []);

    const handleAddChange = (e) => {
        setNewGroup({ ...newGroup, [e.target.name]: e.target.value });
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        if (!newGroup.group_name.trim() || !newGroup.grade_level.trim()) return;
        try {
            await axios.post(`${API_URL}/student-groups/`, newGroup);
            setNewGroup({ group_name: '', grade_level: '' });
            fetchStudentGroups();
        } catch (error) {
            console.error("Error adding student group:", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this group?")) {
            try {
                await axios.delete(`${API_URL}/student-groups/${id}/`);
                fetchStudentGroups();
            } catch (error) {
                console.error("Error deleting student group:", error);
            }
        }
    };

    const startEdit = (group) => {
        setEditingId(group.id);
        setEditingGroup({ ...group });
    };

    const handleEditChange = (e) => {
        setEditingGroup({ ...editingGroup, [e.target.name]: e.target.value });
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_URL}/student-groups/${editingId}/`, editingGroup);
            setEditingId(null);
            setEditingGroup(null);
            fetchStudentGroups();
        } catch (error) {
            console.error("Error updating student group:", error);
        }
    };

    const handleTabChange = (event, newValue) => {
        setTab(newValue);
    };

    return (
        <Paper elevation={3} sx={{ p: 3, maxWidth: 600, margin: 'auto', mt: 4 }}>
            <Typography variant="h5" gutterBottom>Manage Student Groups</Typography>
            <Tabs value={tab} onChange={handleTabChange} aria-label="student group tabs" sx={{ mb: 2 }}>
                <Tab label="View Groups" />
                <Tab label="Add Group" />
            </Tabs>
            {tab === 0 && (
                <Box>
                    <Typography variant="h6" sx={{ mb: 1 }}>Existing Student Groups</Typography>
                    <List>
                        {studentGroups.map(group => (
                            <ListItem key={group.id} alignItems="flex-start" sx={{ display: 'block', mb: 1, bgcolor: '#f9f9f9', borderRadius: 1 }}>
                                {editingId === group.id ? (
                                    <Box component="form" onSubmit={handleUpdateSubmit} sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                        <TextField size="small" name="group_name" value={editingGroup.group_name} onChange={handleEditChange} label="Group Name" required />
                                        <TextField size="small" name="grade_level" value={editingGroup.grade_level} onChange={handleEditChange} label="Grade Level" required />
                                        <Button type="submit" variant="contained" color="primary" size="small">Save</Button>
                                        <Button type="button" variant="outlined" size="small" onClick={() => setEditingId(null)}>Cancel</Button>
                                    </Box>
                                ) : (
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <ListItemText primary={`${group.group_name} (Grade: ${group.grade_level})`} />
                                        <Box>
                                            <IconButton color="primary" onClick={() => startEdit(group)}><EditIcon /></IconButton>
                                            <IconButton color="error" onClick={() => handleDelete(group.id)}><DeleteIcon /></IconButton>
                                        </Box>
                                    </Stack>
                                )}
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}
            {tab === 1 && (
                <Box component="form" onSubmit={handleAddSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                    <TextField name="group_name" value={newGroup.group_name} onChange={handleAddChange} label="Group Name (e.g., Grade 9A)" required />
                    <TextField name="grade_level" value={newGroup.grade_level} onChange={handleAddChange} label="Grade Level (e.g., 9)" required />
                    <Button type="submit" variant="contained">Add Student Group</Button>
                </Box>
            )}
        </Paper>
    );
}

export default StudentGroups;