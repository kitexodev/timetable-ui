// src/pages/ConstraintsPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_URL from '../apiConfig';

function ConstraintsPage() {
    const [settings, setSettings] = useState({
        // Set a default value in the initial state
        'enforceSimultaneousCLA': false,
    });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const response = await axios.get(`${API_URL}/settings/`);
                const settingsMap = response.data.reduce((acc, setting) => {
                    acc[setting.key] = setting.value;
                    return acc;
                }, {});
                // Merge fetched settings with defaults
                setSettings(prevSettings => ({ ...prevSettings, ...settingsMap }));
            } catch (error) {
                console.error("Error fetching settings:", error);
            }
        };
        fetchSettings();
    }, []);

    const handleToggle = async (key) => {
        const currentVal = settings[key] || false; // Use false if undefined
        const newValue = !currentVal;

        try {
            // This PUT request will now work correctly for both creating and updating
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
        <div>
            <h2>Algorithm Constraints</h2>
            <p>Control the preferences (soft constraints) for the timetable generation.</p>
            
            <div>
                <label>
                    <input
                        type="checkbox"
                        checked={settings['enforceSimultaneousCLA']}
                        onChange={() => handleToggle('enforceSimultaneousCLA')}
                    />
                    Enforce Simultaneous CLA Periods for all classes
                </label>
                <p><small>Tries to schedule Creative Learning Activities at the same time across all grades.</small></p>
            </div>

            {/* You can add more soft constraints here in the future */}

        </div>
    );
}

export default ConstraintsPage;