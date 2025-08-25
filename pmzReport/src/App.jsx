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
        { month: 'Janeiro', onTime: 2630, delayed: 8594, incomplete: 12150 },
        { month: 'Fevereiro', onTime: 7569, delayed: 14123, incomplete: 5094 },
        { month: 'Março', onTime: 5698, delayed: 14453, incomplete: 6464 },
        { month: 'Abril', onTime: 4044, delayed: 11449, incomplete: 9227 },
        { month: 'Maio', onTime: 4228, delayed: 9430, incomplete: 11140 },
        { month: 'Junho', onTime: 3952, delayed: 6418, incomplete: 12040 },
        { month: 'Julho', onTime: 5710, delayed: 9057, incomplete: 10468 },
        { month: 'Agosto', onTime: 4854, delayed: 5434, incomplete: 7511 }
    ];

    const labels = operationalData.map(d => d.month);

    const monthlyPerformanceData = {
        labels: labels,
        datasets: [{
            label: 'Taxa de Conclusão (%)',
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
            { label: 'No Prazo (App)', data: operationalData.map(d => d.onTime), backgroundColor: theme.palette.primary.main },
            { label: 'Atrasadas / Incorretas', data: operationalData.map(d => d.delayed), backgroundColor: theme.palette.warning.main },
            { label: 'Incompletas (App)', data: operationalData.map(d => d.incomplete), backgroundColor: theme.palette.error.main }
        ]
    };

    return (
        <ThemeProvider theme={theme}>
            <Box sx={{ bgcolor: 'background.default', py: 4 }}>
                <Container maxWidth={false} sx={{ px: { xs: 2, md: 4 } }}>
                    <header>
                        <Typography variant="h2" component="h1" align="center" color="primary" gutterBottom sx={{ mb: 1 }}>
                            Relatório de Performance e Análise Estratégica
                        </Typography>
                        <Typography variant="h5" align="center" color="text.secondary" sx={{ mb: 6 }}>
                            Operação PMZ | Janeiro a Agosto de 2025
                        </Typography>
                    </header>

                    <Grid container spacing={4} sx={{ mb: 6 }}>
                        <KpiCard title="Pico de Performance (Fev)" value="83.3%" description="Taxa de conclusão de entregas via app, impulsionada pela visita técnica em Manaus." color="secondary.main" />
                        <KpiCard title="Principal Desafio" value="14,453" description="Pico de entregas atrasadas ou com uso incorreto do app (Março). Este número elevado indica que o problema central é a execução operacional." color="warning.main" />
                        <KpiCard title="Status da Geofence" value="81.8%" description="Performance estável na semana de implementação, servindo como linha de base para futuras análises de impacto." color="secondary.main" />
                    </Grid>

                    <Paper sx={{ p: { xs: 2, md: 4 }, mb: 6, boxShadow: 3 }}>
                        <Typography variant="h4" align="center" color="primary" gutterBottom>Análise de Performance Mensal</Typography>
                        <Typography align="center" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', mb: 3 }}>
                            A taxa de conclusão de entregas via app demonstrou volatilidade, indicando que os impactos positivos foram pontuais e não sustentados por processos. O pico em fevereiro, ligado à visita técnica, contrasta com a baixa em junho, evidenciando a necessidade de controlos operacionais mais robustos e permanentes.
                        </Typography>
                        <Box sx={{ height: '400px' }}>
                            <LineChart data={monthlyPerformanceData} options={{...commonChartOptions, scales: { y: { beginAtZero: true, max: 100, ticks: { callback: (value) => value + '%' } }}}} />
                        </Box>
                    </Paper>

                    <Paper sx={{ p: { xs: 2, md: 4 }, mb: 6, boxShadow: 3 }}>
                        <Typography variant="h4" align="center" color="primary" gutterBottom>Qualidade da Entrega: Análise Detalhada</Typography>
                        <Typography align="center" color="text.secondary" sx={{ maxWidth: '800px', mx: 'auto', mb: 3 }}>
                           Esta análise é crucial: mostra que os motoristas usam o app, mas uma parte significativa das entregas está atrasada ou é registada incorretamente. Isto confirma que o principal gargalo está na execução física do processo de entrega.
                        </Typography>
                        <Box sx={{ height: '400px' }}>
                            <BarChart data={deliveryQualityData} options={{...commonChartOptions, scales: { x: { stacked: true }, y: { stacked: true } }}} />
                        </Box>
                    </Paper>

                    <Box sx={{ mb: 6 }}>
                        <Typography variant="h4" align="center" color="primary" sx={{ mb: 4 }}>Avaliação de Iniciativas Estratégicas</Typography>
                        <Grid container spacing={4}>
                            <Grid item xs={12} md={6}>
                                <Card sx={{ height: '100%', boxShadow: 3 }}>
                                    <CardContent sx={{p:3}}>
                                        <Typography variant="h5" color="primary" gutterBottom>Visita Técnica em Manaus (Fevereiro)</Typography>
                                        <Typography color="text.secondary" sx={{mb: 2}}>A iniciativa demonstrou um impacto positivo e imediato. O acompanhamento próximo e a otimização de processos in loco foram cruciais.</Typography>
                                        <Paper variant="outlined" sx={{ p: 2, bgcolor: 'rgba(0, 169, 224, 0.1)' }}>
                                            <Typography fontWeight="bold" color="primary.dark">Principal Lição:</Typography>
                                            <Typography color="primary.dark">A supervisão direta da gestão é um catalisador poderoso, mas temporário. A chave é transformar os ajustes bem-sucedidos em procedimentos operacionais padrão (SOPs) para garantir a estabilidade a longo prazo.</Typography>
                                        </Paper>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card sx={{ height: '100%', boxShadow: 3 }}>
                                    <CardContent sx={{p:3}}>
                                        <Typography variant="h5" color="primary" gutterBottom>Implementação de Geofence (Agosto)</Typography>
                                        <Typography color="text.secondary" sx={{mb: 2}}>Uma ação tecnológica direta para mitigar o principal ponto fraco da operação. Ao automatizar a verificação da localização, a geofence visa:</Typography>
                                        <List dense>
                                            <ListItem><ListItemText primary="Aumentar a pontualidade e otimizar rotas" secondary="Fornecendo dados precisos sobre os tempos de chegada e partida." /></ListItem>
                                            <ListItem><ListItemText primary="Garantir a conformidade do local de registo" secondary="Impedindo a confirmação da entrega fora da área designada." /></ListItem>
                                            <ListItem><ListItemText primary="Melhorar a fiabilidade dos dados para futuras análises" secondary="Automatizando a entrada de dados e eliminando erros manuais." /></ListItem>
                                        </List>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>

                     <Box sx={{ mb: 6 }}>
                        <Typography variant="h4" align="center" color="primary" sx={{ mb: 4 }}>Integridade de Dados e Otimização Operacional</Typography>
                        <Paper sx={{ p: { xs: 2, md: 4 }, maxWidth: '900px', mx: 'auto', boxShadow: 3 }}>
                            <Typography align="center" color="text.secondary" sx={{ mb: 3 }}>
                                Para construir uma base de dados confiável, foi realizada uma auditoria e limpeza completa da base de motoristas. Este trabalho é fundamental para uma medição de performance precisa e garante que as comunicações operacionais cheguem ao pessoal ativo correto.
                            </Typography>
                            <List>
                                <ListItem>
                                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                                    <ListItemText primary="Limpeza de Contas de Motoristas:" secondary="Desativação de contas de motoristas que já não trabalham com as 3PLs." />
                                </ListItem>
                                <ListItem>
                                    <ListItemIcon><CheckCircleIcon color="success" /></ListItemIcon>
                                    <ListItemText primary="Registo de Transportadoras:" secondary="Registo das transportadoras e associação dos motoristas às suas respetivas empresas." />
                                </ListItem>
                            </List>
                        </Paper>
                    </Box>

                    <Paper sx={{ p: { xs: 2, md: 4 }, boxShadow: 3 }}>
                        <Typography variant="h4" align="center" color="primary" sx={{ mb: 4 }}>Plano de Ação</Typography>
                        <Stack
                            direction={isMobile ? 'column' : 'row'}
                            spacing={isMobile ? 4 : 2}
                            justifyContent="center"
                            alignItems="center"
                            divider={!isMobile && <ArrowForwardIcon sx={{ color: 'grey.400', fontSize: 40 }} />}
                        >
                            <ActionStep completed={true} title="Monitorização de KPIs (Concluído)" description="Foi criado um relatório diário para monitorizar o impacto da geofence e comprovar quantitativamente o valor da tecnologia." />
                            <ActionStep completed={true} title="Comunicação e Formação (Concluído)" description="Foram realizadas sessões de feedback com os motoristas e caixas para identificar dificuldades e reforçar os benefícios, garantindo uma implementação tranquila e aumentando a adesão." />
                            <ActionStep inProgress={true} title="Auditoria de Processos (Em Andamento)" description="Laryssa e Luiz Henrique estão a auditar diariamente o processo para institucionalizar o que funcionou durante o pico de performance." />
                        </Stack>
                    </Paper>

                    <footer style={{ textAlign: 'center', marginTop: '48px', color: 'grey' }}>
                        <Typography variant="body2">Relatório gerado a 25 de Agosto de 2025.</Typography>
                    </footer>
                </Container>
            </Box>
        </ThemeProvider>
    );
}

export default App;