import React, { useEffect, useRef } from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Box,
    Paper,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Stack,
    ThemeProvider,
    createTheme,
    useTheme,
    useMediaQuery
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import Chart from 'chart.js/auto';

// PALETTE: Brilliant Blues
const theme = createTheme({
    palette: {
        primary: {
            main: '#003F5C',
        },
        secondary: {
            main: '#58508D',
        },
        warning: {
            main: '#FFA600',
        },
        error: {
            main: '#BC5090',
        },
        background: {
            default: '#f8f9fa',
            paper: '#ffffff',
        },
        text: {
            primary: '#333',
            secondary: '#555',
        },
    },
    typography: {
        fontFamily: 'Inter, sans-serif',
        h1: {
            fontWeight: 700,
        },
        h2: {
            fontWeight: 700,
        },
        h3: {
            fontWeight: 600,
        },
    },
});

const wrapLabel = (label) => {
    const maxLength = 16;
    if (label.length <= maxLength) {
        return label;
    }
    const words = label.split(' ');
    let lines = [];
    let currentLine = '';
    words.forEach(word => {
        if ((currentLine + ' ' + word).length > maxLength) {
            lines.push(currentLine.trim());
            currentLine = word;
        } else {
            currentLine = (currentLine + ' ' + word).trim();
        }
    });
    if (currentLine) {
        lines.push(currentLine);
    }
    return lines;
};

const tooltipTitleCallback = (tooltipItems) => {
    const item = tooltipItems[0];
    let label = item.chart.data.labels[item.dataIndex];
    return Array.isArray(label) ? label.join(' ') : label;
};

const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        tooltip: {
            callbacks: {
                title: tooltipTitleCallback,
            },
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(0, 0, 0, 0.05)',
            },
        },
        x: {
            grid: {
                display: false,
            },
        },
    },
};

const LineChart = ({ data, options }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const chartInstance = new Chart(chartRef.current, {
            type: 'line',
            data: data,
            options: options,
        });
        return () => chartInstance.destroy();
    }, [data, options]);

    return <canvas ref={chartRef} />;
};

const BarChart = ({ data, options }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const chartInstance = new Chart(chartRef.current, {
            type: 'bar',
            data: data,
            options: options,
        });
        return () => chartInstance.destroy();
    }, [data, options]);

    return <canvas ref={chartRef} />;
};

const KpiCard = ({ title, value, description, color }) => (
    <Grid item xs={12} md={4}>
        <Card sx={{ height: '100%', boxShadow: 3 }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Typography variant="h6" color="secondary" gutterBottom>{title}</Typography>
                <Typography variant="h3" component="p" fontWeight="bold" color={color} my={1}>{value}</Typography>
                <Typography variant="body2" color="text.secondary">{description}</Typography>
            </CardContent>
        </Card>
    </Grid>
);

const ActionStep = ({ number, title, description }) => (
     <Box sx={{ textAlign: 'center', maxWidth: 280 }}>
        <Box
            sx={{
                bgcolor: 'primary.main',
                color: 'white',
                width: 64,
                height: 64,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2,
            }}
        >
            <Typography variant="h4" fontWeight="bold">{number}</Typography>
        </Box>
        <Typography variant="h6" color="secondary" gutterBottom>{title}</Typography>
        <Typography variant="body2" color="text.secondary">{description}</Typography>
    </Box>
);


function App() {
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

    const monthlyPerformanceData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'],
        datasets: [{
            label: 'Delivery Completion Rate (%)',
            data: [
                ((2630 + 8594) / (2630 + 8594 + 12150) * 100).toFixed(1), // Jan: 48.0
                83.3, // Feb: As per text
                ((5698 + 14453) / (5698 + 14453 + 6464) * 100).toFixed(1), // Mar: 75.7
                ((4044 + 11449) / (4044 + 11449 + 9227) * 100).toFixed(1), // Apr: 62.7
                ((4228 + 9430) / (4228 + 9430 + 11140) * 100).toFixed(1), // May: 55.1
                50.0, // Jun: As per text
                ((5710 + 9057) / (5710 + 9057 + 10468) * 100).toFixed(1), // Jul: 58.6
                ((4854 + 5434) / (4854 + 5434 + 7511) * 100).toFixed(1)  // Aug: 57.7
            ],
            borderColor: theme.palette.secondary.main,
            backgroundColor: 'rgba(88, 80, 141, 0.1)',
            fill: true,
            tension: 0.3,
        }],
    };
    
    const deliveryQualityData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August'],
        datasets: [
            { label: 'On-Time Deliveries (App)', data: [2630, 7569, 5698, 4044, 4228, 3952, 5710, 4854], backgroundColor: theme.palette.primary.main },
            { label: wrapLabel('Delayed/Incorrect Use'), data: [8594, 14123, 14453, 11449, 9430, 6418, 9057, 5434], backgroundColor: theme.palette.warning.main },
            { label: wrapLabel('Incomplete Deliveries (App)'), data: [12150, 5094, 6464, 9227, 11140, 12040, 10468, 7511], backgroundColor: theme.palette.error.main }
        ]
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ bgcolor: 'background.default', py: 4 }}>
                <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
                    <header>
                        <Typography variant="h2" component="h1" align="center" color="primary" gutterBottom sx={{ mb: 1 }}>
                            Performance Report and Strategic Analysis
                        </Typography>
                        <Typography variant="h5" align="center" color="secondary" sx={{ mb: 6 }}>
                            PMZ Operation | January to August 2025
                        </Typography>
                    </header>

                    <Grid container spacing={4} sx={{ mb: 6 }}>
                        <KpiCard title="Peak Performance (Feb)" value="83.3%" description="App-based delivery completion rate, driven by the technical visit to Manaus." color="primary.main" />
                        <KpiCard title="Main Challenge" value="14,453" description="Peak of delayed or incorrectly logged deliveries (March). This high number indicates the core issue is operational execution, not technology adoption." color="warning.main" />
                        <KpiCard title="Geofence Status" value="81.8%" description="Stable performance during the implementation week, serving as a baseline for future impact analysis." color="primary.main" />
                    </Grid>

                    <Paper sx={{ p: { xs: 2, md: 4 }, mb: 6, boxShadow: 3 }}>
                        <Typography variant="h4" align="center" color="primary" gutterBottom>Monthly Performance Analysis</Typography>
                        <Typography align="center" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', mb: 3 }}>
                            The app-based delivery completion rate showed considerable volatility, indicating that positive impacts have been event-driven rather than sustained by process. The peak in February, tied to the technical visit, contrasts sharply with the low in June, highlighting a need for more robust, permanent operational controls.
                        </Typography>
                        <Box sx={{ height: '400px' }}>
                            <LineChart data={monthlyPerformanceData} options={{...commonChartOptions, scales: { y: { beginAtZero: true, max: 100, ticks: { callback: (value) => value + '%' } }}}} />
                        </Box>
                    </Paper>

                    <Paper sx={{ p: { xs: 2, md: 4 }, mb: 6, boxShadow: 3 }}>
                        <Typography variant="h4" align="center" color="primary" gutterBottom>Delivery Quality: Detailed Analysis</Typography>
                        <Typography align="center" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', mb: 3 }}>
                           This breakdown is crucial: it shows that drivers are using the app, but a significant portion of deliveries are either late or logged incorrectly. This confirms the primary bottleneck is in the physical execution of the delivery process (route planning, time management) rather than a failure to adopt the digital tool.
                        </Typography>
                        <Box sx={{ height: '400px' }}>
                            <BarChart data={deliveryQualityData} options={{...commonChartOptions, scales: { x: { stacked: true }, y: { stacked: true } }}} />
                        </Box>
                    </Paper>

                    <Box sx={{ mb: 6 }}>
                        <Typography variant="h4" align="center" color="primary" sx={{ mb: 4 }}>Evaluation of Strategic Initiatives</Typography>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Card sx={{ height: '100%', boxShadow: 3 }}>
                                    <CardContent sx={{p:3}}>
                                        <Typography variant="h5" color="secondary" gutterBottom>Technical Visit in Manaus (February)</Typography>
                                        <Typography color="text.secondary" sx={{mb: 2}}>The initiative showed a positive and immediate impact. Close monitoring and on-site process optimization were crucial.</Typography>
                                        <Paper variant="outlined" sx={{ p: 2, bgcolor: '#E6F0FF' }}>
                                            <Typography fontWeight="bold" color="primary.dark">Key Takeaway:</Typography>
                                            <Typography color="primary.dark">Direct managerial oversight is a powerful but temporary catalyst. The key is to codify the successful on-site adjustments into standard operating procedures (SOPs) that can be monitored and enforced remotely to ensure long-term stability.</Typography>
                                        </Paper>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card sx={{ height: '100%', boxShadow: 3 }}>
                                    <CardContent sx={{p:3}}>
                                        <Typography variant="h5" color="secondary" gutterBottom>Geofence Implementation (August)</Typography>
                                        <Typography color="text.secondary" sx={{mb: 2}}>A direct technological action to mitigate the operation's main weakness. By automating location verification, the geofence aims to:</Typography>
                                        <List dense>
                                            <ListItem><ListItemText primary="Increase punctuality and optimize routes" secondary="By providing precise data on arrival and departure times." /></ListItem>
                                            <ListItem><ListItemText primary="Ensure compliance of the delivery registration location" secondary="By preventing delivery confirmation outside the designated area." /></ListItem>
                                            <ListItem><ListItemText primary="Improve data reliability for future analysis" secondary="By automating data entry and eliminating manual errors." /></ListItem>
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>

                     <Box sx={{ mb: 6 }}>
                        <Typography variant="h4" align="center" color="primary" sx={{ mb: 4 }}>Data Integrity and Operational Cleanup</Typography>
                        <Paper sx={{ p: { xs: 2, md: 4 }, maxWidth: '900px', mx: 'auto', boxShadow: 3 }}>
                            <Typography align="center" color="text.secondary" sx={{ mb: 3 }}>
                                To build a foundation of trustworthy data, a full audit and cleanup of the driver database was conducted. This foundational work is critical for accurate performance measurement and ensures that operational communications reach the correct, active personnel.
                            </Typography>
                            <List>
                                <ListItem>
                                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                                    <ListItemText primary="Driver Account Cleanup:" secondary="Deactivated accounts of drivers no longer working with the 3PLs." />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                                    <ListItemText primary="Carrier Registration:" secondary="Registered transport carriers and linked drivers to their respective companies." />
                                </ListItem>
                            </List>
                        </Paper>
                    </Box>

                    <Paper sx={{ p: { xs: 2, md: 4 }, boxShadow: 3 }}>
                        <Typography variant="h4" align="center" color="primary" sx={{ mb: 4 }}>Recommended Action Plan</Typography>
                        <Stack
                            direction={isMobile ? 'column' : 'row'}
                            spacing={isMobile ? 4 : 2}
                            justifyContent="center"
                            alignItems="center"
                            divider={!isMobile && <ArrowForwardIcon sx={{ color: 'grey.400', fontSize: 40 }} />}
                        >
                            <ActionStep number="1" title="KPI Monitoring" description="Create a dashboard to weekly monitor the geofence's impact and calculate its ROI. The goal is to quantitatively prove the technology's value." />
                            <ActionStep number="2" title="Communication & Training" description="Conduct feedback sessions with drivers to identify difficulties and reinforce benefits. This ensures a smooth rollout and increases buy-in." />
                            <ActionStep number="3" title="Process Audit" description="Map the controls from February and assess their feasibility for permanent implementation. The objective is to institutionalize what worked during the peak performance period." />
                        </Stack>
                    </Paper>

                    <footer style={{ textAlign: 'center', marginTop: '48px', color: 'grey' }}>
                        <Typography variant="body2">Report generated on August 25, 2025.</Typography>
                    </footer>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default App;