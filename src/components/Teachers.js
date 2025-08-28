// src/components/Teachers.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Box, 
    Tabs, 
    Tab, 
    Typography, 
    TextField, 
    Button, 
    Select, 
    MenuItem, 
    FormControl, 
    InputLabel, 
    List, 
    ListItem, 
    Paper, 
    IconButton,
    Grid,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import API_URL from '../apiConfig';

// TabPanel component
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

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function Teachers() {
    const [tabValue, setTabValue] = useState(0);
    const [teachers, setTeachers] = useState([]);
    const [newTeacher, setNewTeacher] = useState({
        first_name: '',
        last_name: '',
        designation: 'PRT',
        max_periods_per_week: 39,
    });

    // --- State for handling edits ---
    const [editingId, setEditingId] = useState(null);
    const [editingTeacher, setEditingTeacher] = useState(null);
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [teacherToDelete, setTeacherToDelete] = useState(null);
    
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const fetchTeachers = async () => {
        try {
            const response = await axios.get(`${API_URL}/teachers/`);
            setTeachers(response.data);
        } catch (error) {
            console.error("Error fetching teachers:", error);
        }
    };

    useEffect(() => {
        fetchTeachers();
    }, []);

    // --- Handler for the "Add New Teacher" form inputs ---
    const handleAddChange = (e) => {
        setNewTeacher({ ...newTeacher, [e.target.name]: e.target.value });
    };

    // --- CREATE logic ---
    const handleAddSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/teachers/`, {
                ...newTeacher,
                max_periods_per_week: parseInt(newTeacher.max_periods_per_week, 10)
            });
            setNewTeacher({ first_name: '', last_name: '', designation: 'PRT', max_periods_per_week: 39 });
            fetchTeachers();
        } catch (error) {
            console.error("Error adding teacher:", error);
        }
    };

    // --- DELETE logic ---
    const handleDeleteClick = (teacher) => {
        setTeacherToDelete(teacher);
        setDeleteConfirmOpen(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await axios.delete(`${API_URL}/teachers/${teacherToDelete.id}/`);
            fetchTeachers();
            setDeleteConfirmOpen(false);
            setTeacherToDelete(null);
        } catch (error) {
            console.error("Error deleting teacher:", error);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteConfirmOpen(false);
        setTeacherToDelete(null);
    };

    // --- UPDATE logic ---
    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`${API_URL}/teachers/${editingId}/`, {
                ...editingTeacher,
                max_periods_per_week: parseInt(editingTeacher.max_periods_per_week, 10)
            });
            setEditingId(null);
            setEditingTeacher(null);
            fetchTeachers();
        } catch (error) {
            console.error("Error updating teacher:", error);
        }
    };
    
    // --- Helper function to start editing ---
    const startEdit = (teacher) => {
        setEditingId(teacher.id);
        setEditingTeacher({ ...teacher });
    };

    // --- Handler for the inline "Edit Teacher" form inputs ---
    const handleEditChange = (e) => {
        setEditingTeacher({ ...editingTeacher, [e.target.name]: e.target.value });
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Manage Teachers
            </Typography>
            
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="teacher management tabs">
                    <Tab label="Add Teacher" {...a11yProps(0)} />
                    <Tab label="View Teachers" {...a11yProps(1)} />
                </Tabs>
            </Box>
            
            {/* Add Teacher Tab */}
            <TabPanel value={tabValue} index={0}>
                <Paper elevation={3} sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
                    <Typography variant="h6" component="h2" gutterBottom>
                        Add New Teacher
                    </Typography>
                    <Box component="form" onSubmit={handleAddSubmit} sx={{ '& .MuiTextField-root': { m: 1 } }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="first_name"
                                    value={newTeacher.first_name}
                                    onChange={handleAddChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="last_name"
                                    value={newTeacher.last_name}
                                    onChange={handleAddChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth sx={{ m: 1 }}>
                                    <InputLabel>Designation</InputLabel>
                                    <Select
                                        name="designation"
                                        value={newTeacher.designation}
                                        onChange={handleAddChange}
                                        label="Designation"
                                    >
                                        <MenuItem value="PPRT">PPRT</MenuItem>
                                        <MenuItem value="PRT">PRT</MenuItem>
                                        <MenuItem value="TGT">TGT</MenuItem>
                                        <MenuItem value="PGT">PGT</MenuItem>
                                        <MenuItem value="Specialist">Specialist</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Max Periods/Week"
                                    name="max_periods_per_week"
                                    type="number"
                                    value={newTeacher.max_periods_per_week}
                                    onChange={handleAddChange}
                                    required
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button 
                                    type="submit" 
                                    variant="contained" 
                                    color="primary"
                                    sx={{ mt: 2 }}
                                >
                                    Add Teacher
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </TabPanel>
            
            {/* View Teachers Tab */}
            <TabPanel value={tabValue} index={1}>
                <Typography variant="h6" component="h2" gutterBottom>
                    Existing Teachers
                </Typography>
                <List>
                    {teachers.map(teacher => (
                        <ListItem 
                            key={teacher.id}
                            sx={{ 
                                mb: 2,
                                p: 0
                            }}
                        >
                            <Paper 
                                elevation={2} 
                                sx={{ 
                                    p: 2, 
                                    width: '100%',
                                    '&:hover': {
                                        bgcolor: 'rgba(0, 0, 0, 0.03)'
                                    }
                                }}
                            >
                                {editingId === teacher.id ? (
                                    <Box component="form" onSubmit={handleUpdateSubmit} sx={{ '& .MuiTextField-root': { m: 1 } }}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="First Name"
                                                    name="first_name"
                                                    value={editingTeacher.first_name}
                                                    onChange={handleEditChange}
                                                    required
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Last Name"
                                                    name="last_name"
                                                    value={editingTeacher.last_name}
                                                    onChange={handleEditChange}
                                                    required
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <FormControl fullWidth sx={{ m: 1 }}>
                                                    <InputLabel>Designation</InputLabel>
                                                    <Select
                                                        name="designation"
                                                        value={editingTeacher.designation}
                                                        onChange={handleEditChange}
                                                        label="Designation"
                                                    >
                                                        <MenuItem value="PPRT">PPRT</MenuItem>
                                                        <MenuItem value="PRT">PRT</MenuItem>
                                                        <MenuItem value="TGT">TGT</MenuItem>
                                                        <MenuItem value="PGT">PGT</MenuItem>
                                                        <MenuItem value="Specialist">Specialist</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Max Periods/Week"
                                                    name="max_periods_per_week"
                                                    type="number"
                                                    value={editingTeacher.max_periods_per_week}
                                                    onChange={handleEditChange}
                                                    required
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Button 
                                                    type="submit" 
                                                    variant="contained" 
                                                    color="primary"
                                                    sx={{ mt: 1, mr: 1 }}
                                                >
                                                    Save
                                                </Button>
                                                <Button 
                                                    type="button"
                                                    variant="outlined"
                                                    onClick={() => setEditingId(null)}
                                                    sx={{ mt: 1 }}
                                                >
                                                    Cancel
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography>
                                            <strong>{teacher.first_name} {teacher.last_name}</strong> ({teacher.designation}) - Max {teacher.max_periods_per_week} periods/week
                                        </Typography>
                                        <Box>
                                            <IconButton 
                                                color="primary" 
                                                onClick={() => startEdit(teacher)}
                                                size="small"
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton 
                                                color="error" 
                                                onClick={() => handleDeleteClick(teacher)}
                                                size="small"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                )}
                            </Paper>
                        </ListItem>
                    ))}
                </List>
            </TabPanel>
            
            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={handleDeleteCancel}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Deletion"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete {teacherToDelete?.first_name} {teacherToDelete?.last_name}? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Teachers;