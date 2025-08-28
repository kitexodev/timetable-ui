// src/components/Layout.js
import React, { useState } from 'react';
import { Box, Tabs, Tab, Toolbar, Typography } from '@mui/material';
import Dashboard from './Dashboard';
import Lessons from './Lessons';
import Teachers from './Teachers';
import Subjects from './Subjects';
import StudentGroups from './StudentGroups';
import TimetableGrid from './TimetableGrid';

function Layout() {
    const [tabIndex, setTabIndex] = useState(0);

    const handleTabChange = (event, newValue) => {
        setTabIndex(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Toolbar>
                <Typography variant="h6" noWrap>
                    Timetable App
                </Typography>
            </Toolbar>
            <Tabs value={tabIndex} onChange={handleTabChange} centered>
                <Tab label="Dashboard" />
                <Tab label="Lessons" />
                <Tab label="Teachers" />
                <Tab label="Subjects" />
                <Tab label="Student Groups" />
                <Tab label="Timetable Grid" />
            </Tabs>
            <Box sx={{ mt: 2 }}>
                {tabIndex === 0 && <Dashboard />}
                {tabIndex === 1 && <Lessons />}
                {tabIndex === 2 && <Teachers />}
                {tabIndex === 3 && <Subjects />}
                {tabIndex === 4 && <StudentGroups />}
                {tabIndex === 5 && <TimetableGrid />}
            </Box>
        </Box>
    );
}

export default Layout;