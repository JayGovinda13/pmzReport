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
    Divider
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import GroupRemoveIcon from '@mui/icons-material/GroupRemove';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
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
            main: '#4CAF50', // Green for success states
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
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 600 },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
    },
});

const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: { color: 'rgba(0, 0, 0, 0.05)' },
        },
        x: {
            grid: { display: false },
        },
    },
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

const InfoCard = ({ title, value, icon, color }) => (
    <Grid item xs={12} sm={6} md={4}>
        <Card sx={{ height: '100%', boxShadow: 3 }}>
            <CardContent sx={{ textAlign: 'center', p: 3 }}>
                <Box color={color} mb={1}>{icon}</Box>
                <Typography variant="h4" component="p" fontWeight="bold">{value}</Typography>
                <Typography variant="body1" color="text.secondary">{title}</Typography>
            </CardContent>
        </Card>
    </Grid>
);

const Section = ({ title, children }) => (
    <Paper sx={{ p: { xs: 2, md: 4 }, mb: 4, boxShadow: 3 }}>
        <Typography variant="h4" color="primary" gutterBottom>{title}</Typography>
        <Divider sx={{ mb: 3 }} />
        {children}
    </Paper>
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
    // Data from CSVs
    const monthlyBreakdownData = [
        { month: 'Dec/24', onTime: 1051, delayed: 6907, incomplete: 13121 },
        { month: 'Jan/25', onTime: 2630, delayed: 8594, incomplete: 12150 },
        { month: 'Feb/25', onTime: 7569, delayed: 14123, incomplete: 5094 },
        { month: 'Mar/25', onTime: 5698, delayed: 14453, incomplete: 6464 },
        { month: 'Apr/25', onTime: 4044, delayed: 11449, incomplete: 9227 },
        { month: 'May/25', onTime: 4228, delayed: 9430, incomplete: 11140 },
        { month: 'Jun/25', onTime: 3952, delayed: 6418, incomplete: 12040 },
        { month: 'Jul/25', onTime: 5710, delayed: 9057, incomplete: 10468 },
        { month: 'Aug/25', onTime: 5294, delayed: 5759, incomplete: 7848 }
    ];

    const engagementData = {
        labels: ['Baseline (Dec)', 'Key Stores', 'Benchmark Store 82'],
        datasets: [{
            label: 'Engagement Rate',
            data: [38.6, 75, 90],
            backgroundColor: ['rgba(229, 57, 53, 0.7)', theme.palette.warning.main, theme.palette.success.main],
            borderColor: ['#E53935', '#F58220', '#4CAF50'],
            borderWidth: 1,
        }],
    };

    const monthlyCompletionRateData = {
        labels: monthlyBreakdownData.map(d => d.month),
        datasets: [{
            label: 'Completion Rate (%)',
            data: monthlyBreakdownData.map(d => {
                const total = d.onTime + d.delayed + d.incomplete;
                return total > 0 ? (((d.onTime + d.delayed) / total) * 100).toFixed(1) : 0;
            }),
            borderColor: theme.palette.secondary.main,
            backgroundColor: 'rgba(0, 169, 224, 0.1)',
            fill: true,
            tension: 0.3,
        }],
    };

    const monthlyQualityData = {
        labels: monthlyBreakdownData.map(d => d.month),
        datasets: [
            { label: 'On Time', data: monthlyBreakdownData.map(d => d.onTime), backgroundColor: theme.palette.primary.main },
            { label: 'Delayed/Incorrect', data: monthlyBreakdownData.map(d => d.delayed), backgroundColor: theme.palette.warning.main },
            { label: 'Incomplete', data: monthlyBreakdownData.map(d => d.incomplete), backgroundColor: theme.palette.error.main },
        ],
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ bgcolor: 'background.default' }}>
                <Container maxWidth={false} sx={{ py: 4, px: { xs: 2, md: 4 } }}>
                    <header>
                        <Typography variant="h2" component="h1" align="center" color="primary" gutterBottom>
                            PMZ Operational Performance Report - Manaus
                        </Typography>
                        <Typography variant="h5" align="center" color="text.secondary" sx={{ mb: 4 }}>
                            The Story of the Operational Turnaround: Before and After
                        </Typography>
                    </header>

                    <Section title="Executive Summary">
                        <Typography variant="body1" color="text.secondary">
                            This report details the significant operational turnaround in Manaus, driven by focused strategic initiatives. We started from an engagement rate of just **38%** and a bloated, inactive driver base. Through focused actions, including the appointment of operational owners and a thorough data cleanup, we have successfully increased the engagement rate to over **75% in key stores**, with our benchmark store reaching **90%**.
                        </Typography>
                    </Section>

                    <Section title="The Transformation in Numbers">
                        <Grid container spacing={3} alignItems="center">
                            <Grid item xs={12} md={8}>
                                <Typography variant="h5" color="primary" gutterBottom>Engagement Rate Growth</Typography>
                                <Box sx={{ height: '350px' }}>
                                    <BarChart data={engagementData} options={{...commonChartOptions, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, max: 100, ticks: { callback: (value) => value + '%' } } } }} />
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Grid container spacing={2}>
                                    <InfoCard title="Initial Engagement" value="38%" icon={<TrendingUpIcon sx={{ fontSize: 40 }} />} color="error.main" />
                                    <InfoCard title="Driver Base Reduction" value=">1000 to <200" icon={<GroupRemoveIcon sx={{ fontSize: 40 }} />} color="primary.main" />
                                    <InfoCard title="Dedicated Focal Points" value="2" icon={<PersonAddIcon sx={{ fontSize: 40 }} />} color="success.main" />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Section>

                    <Section title="Detailed Monthly Analysis">
                         <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <Typography variant="h5" color="primary" gutterBottom>Evolution of Completion Rate</Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    The chart below illustrates the monthly evolution of the completion rate (on-time + delayed deliveries), showing the recovery from the December baseline.
                                </Typography>
                                <Box sx={{ height: '300px' }}>
                                    <LineChart data={monthlyCompletionRateData} options={{...commonChartOptions, scales: { y: { beginAtZero: true, max: 100, ticks: { callback: (value) => value + '%' } } } }} />
                                </Box>
                            </Grid>
                             <Grid item xs={12}>
                                <Typography variant="h5" color="primary" gutterBottom>Delivery Quality Analysis</Typography>
                                 <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    The detailed breakdown shows each month's composition, highlighting that the main challenge lies in the high rate of delayed or incorrectly logged deliveries.
                                </Typography>
                                <Box sx={{ height: '300px' }}>
                                    <BarChart data={monthlyQualityData} options={{...commonChartOptions, scales: { x: { stacked: true }, y: { stacked: true } } }} />
                                </Box>
                            </Grid>
                        </Grid>
                    </Section>
                    
                    <Section title="Initial Situation (December Baseline)">
                        <List>
                            <ListItem><ListItemIcon><CheckCircleIcon color="error" /></ListItemIcon><ListItemText primary="Low Engagement" secondary="Only a 38% driver engagement rate across all stores." /></ListItem>
                            <ListItem><ListItemIcon><CheckCircleIcon color="error" /></ListItemIcon><ListItemText primary="Inactive Driver Base" secondary="Over 1,000 drivers in the system, the vast majority being inactive." /></ListItem>
                            <ListItem><ListItemIcon><CheckCircleIcon color="error" /></ListItemIcon><ListItemText primary="Lack of Ownership" secondary="No centralized ownership of delivery operations within PMZ." /></ListItem>
                        </List>
                    </Section>

                    <Section title="Actions Taken">
                        <List dense>
                            <ListItem><ListItemText primary="1. Nominated 2 focal points to manage and oversee operations." /></ListItem>
                            <ListItem><ListItemText primary="2. Selected 5 key stores for focus and Store 82 as a benchmark." /></ListItem>
                            <ListItem><ListItemText primary="3. Removed inactive drivers (base reduced to <200)." /></ListItem>
                            <ListItem><ListItemText primary="4. Onboarded and trained the focal points." /></ListItem>
                            <ListItem><ListItemText primary="5. Daily monitoring of store and driver performance." /></ListItem>
                            <ListItem><ListItemText primary="6. Created customized reports for management." /></ListItem>
                            <ListItem><ListItemText primary="7. Activated Geofencing to ensure task completion at the correct location." /></ListItem>
                        </List>
                    </Section>
                    
                    <Section title="Action Plan">
                        <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={4}
                            justifyContent="center"
                            alignItems="center"
                        >
                            <ActionStep completed={true} title="KPI Monitoring (Completed)" description="A daily report was created to monitor the geofence's impact and quantitatively prove the technology's value." />
                            <ActionStep completed={true} title="Communication & Training (Completed)" description="Feedback sessions were held with drivers and cashiers to identify difficulties and reinforce benefits." />
                            <ActionStep inProgress={true} title="Process Audit (In Progress)" description="Laryssa and Luiz Henrique are auditing the process daily to institutionalize what worked during the peak performance period." />
                        </Stack>
                    </Section>

                    <Section title="Support Needed from PMZ">
                        <List>
                            <ListItem><ListItemIcon><ArrowForwardIcon color="secondary" /></ListItemIcon><ListItemText primary="Consistent daily oversight by the nominated focal points." /></ListItem>
                            <ListItem><ListItemIcon><ArrowForwardIcon color="secondary" /></ListItemIcon><ListItemText primary="Store-level accountability for hitting targets." /></ListItem>
                            <ListItem><ListItemIcon><ArrowForwardIcon color="secondary" /></ListItemIcon><ListItemText primary="Continued driver discipline and monitoring." /></ListItem>
                        </List>
                    </Section>

                    <footer style={{ textAlign: 'center', marginTop: '32px', color: 'grey' }}>
                        <Typography variant="body2">Report generated on August 26, 2025.</Typography>
                    </footer>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default App;
