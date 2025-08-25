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
import AutorenewIcon from '@mui/icons-material/Autorenew';
import Chart from 'chart.js/auto';

// PALETTE: Bringoz Brand Colors
const theme = createTheme({
    palette: {
        primary: {
            main: '#002D42', // Bringoz Dark Navy
        },
        secondary: {
            main: '#00A9E0', // Bringoz Blue
        },
        warning: {
            main: '#F58220', // Bringoz Orange
        },
        error: {
            main: '#E53935', // A suitable red for contrast
        },
        success: {
            main: '#4CAF50', // Green for "In Progress"
        },
        background: {
            default: '#f7f9fa',
            paper: '#ffffff',
        },
        text: {
            primary: '#231F20',
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
                <Typography variant="h6" color="text.secondary" gutterBottom>{title}</Typography>
                <Typography variant="h3" component="p" fontWeight="bold" color={color} my={1}>{value}</Typography>
                <Typography variant="body2" color="text.secondary">{description}</Typography>
            </CardContent>
        </Card>
    </Grid>
);

const ActionStep = ({ number, title, description, inProgress = false, completed = false }) => (
     <Box sx={{ textAlign: 'center', maxWidth: 280 }}>
        <Box
            sx={{
                bgcolor: completed ? 'secondary.main' : (inProgress ? 'success.main' : 'primary.main'),
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
            {completed ? <CheckCircleIcon sx={{ fontSize: 32 }} /> : (inProgress ? <AutorenewIcon sx={{ fontSize: 32 }} /> : <Typography variant="h4" fontWeight="bold">{number}</Typography>)}
        </Box>
        <Typography variant="h6" color="primary" gutterBottom>{title}</Typography>
        <Typography variant="body2" color="text.secondary">{description}</Typography>
    </Box>
);


function App() {
    const muiTheme = useTheme();
    const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));

    // Centralized and corrected data source
    const operationalData = [
        { month: 'January', onTime: 2630, delayed: 8594, incomplete: 12150 },
        { month: 'February', onTime: 7569, delayed: 14123, incomplete: 5094 },
        { month: 'March', onTime: 5698, delayed: 14453, incomplete: 6464 },
        { month: 'April', onTime: 4044, delayed: 11449, incomplete: 9227 },
        { month: 'May', onTime: 4228, delayed: 9430, incomplete: 11140 },
        { month: 'June', onTime: 3952, delayed: 6418, incomplete: 12040 },
        { month: 'July', onTime: 5710, delayed: 9057, incomplete: 10468 },
        { month: 'August', onTime: 4854, delayed: 5434, incomplete: 7511 }
    ];

    const labels = operationalData.map(d => d.month);

    const monthlyPerformanceData = {
        labels: labels,
        datasets: [{
            label: 'Completion Rate (%)',
            data: [60.9, 83.3, 77.9, 66.4, 58.6, 50.0, 64.1, 66.6],
            borderColor: theme.palette.secondary.main,
            backgroundColor: 'rgba(0, 169, 224, 0.1)',
            fill: true,
            tension: 0.3,
        }],
    };
    
    const deliveryQualityData = {
        labels: labels,
        datasets: [
            { label: 'On-Time (App)', data: operationalData.map(d => d.onTime), backgroundColor: theme.palette.primary.main },
            { label: 'Delayed / Incorrect', data: operationalData.map(d => d.delayed), backgroundColor: theme.palette.warning.main },
            { label: 'Incomplete (App)', data: operationalData.map(d => d.incomplete), backgroundColor: theme.palette.error.main }
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
                        <Typography variant="h5" align="center" color="text.secondary" sx={{ mb: 6 }}>
                            PMZ Operation | January to August 2025
                        </Typography>
                    </header>

                    <Grid container spacing={4} sx={{ mb: 6 }}>
                        <KpiCard title="Peak Performance (Feb)" value="83.3%" description="App-based delivery completion rate, driven by the technical visit to Manaus." color="secondary.main" />
                        <KpiCard title="Main Challenge" value="14,453" description="Peak of delayed or incorrectly logged deliveries (March). This high number indicates the core issue is operational execution." color="warning.main" />
                        <KpiCard title="Geofence Status" value="81.8%" description="Stable performance during the implementation week, serving as a baseline for future impact analysis." color="secondary.main" />
                    </Grid>

                    <Paper sx={{ p: { xs: 2, md: 4 }, mb: 6, boxShadow: 3 }}>
                        <Typography variant="h4" align="center" color="primary" gutterBottom>Monthly Performance Analysis</Typography>
                        <Typography align="center" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', mb: 3 }}>
                            The app-based delivery completion rate showed volatility, indicating that positive impacts were event-driven rather than sustained by process. The peak in February, tied to the technical visit, contrasts with the low in June, highlighting the need for more robust, permanent operational controls.
                        </Typography>
                        <Box sx={{ height: '400px' }}>
                            <LineChart data={monthlyPerformanceData} options={{...commonChartOptions, scales: { y: { beginAtZero: true, max: 100, ticks: { callback: (value) => value + '%' } }}}} />
                        </Box>
                    </Paper>

                    <Paper sx={{ p: { xs: 2, md: 4 }, mb: 6, boxShadow: 3 }}>
                        <Typography variant="h4" align="center" color="primary" gutterBottom>Delivery Quality: Detailed Analysis</Typography>
                        <Typography align="center" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', mb: 3 }}>
                           This analysis is crucial: it shows that drivers use the app, but a significant portion of deliveries are late or incorrectly logged. This confirms the main bottleneck is in the physical execution of the delivery process.
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
                                        <Typography variant="h5" color="primary" gutterBottom>Technical Visit in Manaus (February)</Typography>
                                        <Typography color="text.secondary" sx={{mb: 2}}>The initiative showed a positive and immediate impact. Close monitoring and on-site process optimization were crucial.</Typography>
                                        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'rgba(0, 169, 224, 0.1)' }}>
                                            <Typography fontWeight="bold" color="primary.dark">Key Takeaway:</Typography>
                                            <Typography color="primary.dark">Direct managerial oversight is a powerful but temporary catalyst. The key is to turn successful adjustments into standard operating procedures (SOPs) to ensure long-term stability.</Typography>
                                        </Paper>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card sx={{ height: '100%', boxShadow: 3 }}>
                                    <CardContent sx={{p:3}}>
                                        <Typography variant="h5" color="primary" gutterBottom>Geofence Implementation (August)</Typography>
                                        <Typography color="text.secondary" sx={{mb: 2}}>A direct technological action to mitigate the operation's main weakness. By automating location verification, the geofence aims to:</Typography>
                                        <List dense>
                                            <ListItem><ListItemText primary="Increase punctuality and optimize routes" secondary="By providing precise data on arrival and departure times." /></ListItem>
                                            <ListItem><ListItemText primary="Ensure compliance of the registration location" secondary="By preventing delivery confirmation outside the designated area." /></ListItem>
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
                                To build a reliable database, a full audit and cleanup of the driver database was conducted. This is essential for accurate performance measurement and ensures that communications reach the correct, active personnel.
                            </Typography>
                            <List>
                                <ListItem>
                                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                                    <ListItemText primary="Driver Account Cleanup:" secondary="Deactivated accounts of drivers no longer working with the 3PLs." />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                                    <ListItemText primary="Carrier Registration:" secondary="Registered carriers and linked drivers to their respective companies." />
                                </ListItem>
                            </List>
                        </Paper>
                    </Box>

                    <Paper sx={{ p: { xs: 2, md: 4 }, boxShadow: 3 }}>
                        <Typography variant="h4" align="center" color="primary" sx={{ mb: 4 }}>Action Plan</Typography>
                        <Stack
                            direction={isMobile ? 'column' : 'row'}
                            spacing={isMobile ? 4 : 2}
                            justifyContent="center"
                            alignItems="center"
                            divider={!isMobile && <ArrowForwardIcon sx={{ color: 'grey.400', fontSize: 40 }} />}
                        >
                            <ActionStep completed={true} title="KPI Monitoring (Completed)" description="A daily report was created to monitor the geofence's impact, quantitatively proving the technology's value." />
                            <ActionStep completed={true} title="Communication & Training (Completed)" description="Feedback sessions were held with drivers and cashiers to identify difficulties and reinforce benefits, ensuring a smooth rollout and increasing buy-in." />
                            <ActionStep inProgress={true} title="Process Audit (In Progress)" description="Laryssa and Luiz Henrique are auditing the process daily to institutionalize what worked during the peak performance period." />
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