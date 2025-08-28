// src/pages/SetupPage.js
import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import Subjects from '../components/Subjects';
import Teachers from '../components/Teachers';
import StudentGroups from '../components/StudentGroups';
import Lessons from '../components/Lessons';

function TabPanel(props) {
    const { children, value, index } = props;
    return <div hidden={value !== index}>{value === index && <Box sx={{ p: 3 }}>{children}</Box>}</div>;
}

function SetupPage() {
    const [tabIndex, setTabIndex] = useState(0);
    const handleChange = (event, newValue) => { setTabIndex(newValue); };

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabIndex} onChange={handleChange}>
                    <Tab label="Subjects" />
                    <Tab label="Teachers" />
                    <Tab label="Student Groups" />
                    <Tab label="Lessons" />
                </Tabs>
            </Box>
            <TabPanel value={tabIndex} index={0}><Subjects /></TabPanel>
            <TabPanel value={tabIndex} index={1}><Teachers /></TabPanel>
            <TabPanel value={tabIndex} index={2}><StudentGroups /></TabPanel>
            <TabPanel value={tabIndex} index={3}><Lessons /></TabPanel>
        </Box>
    );
}

export default SetupPage;