// src/pages/ConstraintsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../apiConfig';

// --- MUI Imports ---
import {
    Box,
    Typography,
    Switch,
    FormControlLabel,
    Paper
} from '@mui/material';

function ConstraintsPage() {
    const [settings, setSettings] = useState({
        'enforceSimultaneousCLA': false,
    });

    // --- (The useEffect and handleToggle functions remain exactly the same) ---
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get(`${API_URL}/settings/`);
                const settingsMap = response.data.reduce((acc, setting) => {
                    acc[setting.key] = setting.value;
                    return acc;
                }, {});
                setSettings(prevSettings => ({ ...prevSettings, ...settingsMap }));
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        };
        fetchSettings();
    }, []);

    const handleToggle = async (key) => {
        const currentVal = settings[key] || false;
        const newValue = !currentVal;
        try {
            await axios.put(`${API_URL}/settings/${key}/`, { key, value: newValue });
            setSettings(prevSettings => ({
                ...prevSettings,
                [key]: newValue
            }));
        } catch (error) {
            console.error("Error updating setting:", error);
            alert("Failed to update setting. See console for details.");
        }
    };

    return (
        // Use MUI's Box and Paper components for better layout and elevation
        <Box component={Paper} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
                Algorithm Constraints
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
                Control the preferences (soft constraints) for the timetable generation.
            </Typography>
            
            {/* Use FormControlLabel and Switch for a professional toggle */}
            <FormControlLabel
                control={
                    <Switch
                        checked={settings['enforceSimultaneousCLA']}
                        onChange={() => handleToggle('enforceSimultaneousCLA')}
                        name="enforceSimultaneousCLA"
                        color="primary"
                    />
                }
                label="Enforce Simultaneous CLA Periods"
            />
            <Typography variant="body2" color="textSecondary" sx={{ ml: 4 }}>
                When enabled, the algorithm will try to schedule Creative Learning Activities at the same time across all grades.
            </Typography>

            {/* You can add more constraints here in the future using the same pattern */}

        </Box>
    );
}

export default ConstraintsPage;