import { Chart, ChartConfiguration, ChartDataset, registerables } from "chart.js";
import { useEffect, useRef, useMemo } from "react";

export interface GaugeChartProps {
    needleCurrentValue?: number;
    minValue?: number;
    maxValue?: number;
    veryLowLimit?: number;
    lowLimit?: number;
    highLimit?: number;
    veryHighLimit?: number;

    veryLowColor?: string;
    lowColor?: string;
    goodColor?: string;
    highColor?: string;
    veryHighColor?: string;
    borderVeryLowColor?: string;
    borderLowColor?: string;
    borderGoodColor?: string;
    borderHighColor?: string;
    borderVeryHighColor?: string;

    needleBorderColor?: string;
    needleFillColor?: string;
    needleWidth?: number;
    meterFont?: string;
    meterColor?: string;
    labelFont?: string;
    labelColor?: string;

    aspectRatio?: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;

    arcBorderWidth?: number;
    arcBorderColor?: string;
    datasetBorderWidth?: number;
    cutout?: string;

    canvasWidth?: number;
}

interface CustomDataset extends ChartDataset<"doughnut", number[]> {
    needleValue?: number;
}

export default function GaugeChart({
    needleCurrentValue = 0,
    minValue = 0,
    maxValue = 100,
    veryLowLimit = 20,
    lowLimit = 40,
    highLimit = 80,
    veryHighLimit = 90,
    veryLowColor = "rgba(27, 98, 190, 0.77)",
    lowColor = "rgba(255, 227, 68, 0.77)",
    goodColor = "rgba(71, 185, 48, 0.77)",
    highColor = "rgba(255, 132, 31, 0.77)",
    veryHighColor = "rgba(190, 27, 27, 0.77)",
    borderVeryLowColor = "rgba(27, 98, 190, 0.77)",
    borderLowColor = "rgba(255, 227, 68, 0.77)",
    borderGoodColor = "rgba(71, 185, 48, 0.77)",
    borderHighColor = "rgba(255, 132, 31, 0.77)",
    borderVeryHighColor = "rgba(190, 27, 27, 0.77)",
    needleBorderColor = "rgb(136, 136, 136)",
    needleFillColor = "rgb(136, 136, 136)",
    needleWidth = 5,
    meterFont = "bold 30px sans-serif",
    meterColor = "rgb(34, 34, 34)",
    labelFont = "14px sans-serif",
    labelColor = "rgb(34, 34, 34)",
    aspectRatio = 1.5,
    paddingTop = 30,
    paddingBottom = 40,
    paddingLeft = 40,
    paddingRight = 40,
    arcBorderWidth = 0,
    arcBorderColor = "transparent",
    datasetBorderWidth = 0,
    cutout = "65%",
    canvasWidth
}: GaugeChartProps) {

    const needleValue = needleCurrentValue ?? minValue;

    // Cálculos para el gráfico
    const veryLowValue = veryLowLimit - minValue;
    const lowValue = lowLimit - veryLowLimit;
    const goodValue = highLimit - lowLimit;
    const highValue = veryHighLimit - highLimit;
    const veryHighValue = maxValue - veryHighLimit;

    // Gráfico
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const chartInstanceRef = useRef<Chart | null>(null);
    Chart.register(...registerables);

    // Plugins para el Gauge
    const gaugeNeedle = useMemo(() => ({
        id: "gaugeNeedle",
        afterDatasetsDraw(chart: { getDatasetMeta?: any; ctx?: any; data?: any; }) {
            const { ctx, data } = chart;
            ctx.save();
            const meta = chart.getDatasetMeta(0);
            const xCenter = meta.data[0].x;
            const yCenter = meta.data[0].y;
            const innerRadius = meta.data[0].innerRadius;
            const outerRadius = meta.data[0].outerRadius;
            const radius = needleWidth;
            const needleVal = data.datasets[0].needleValue || 0;
            const widthSlice = (outerRadius - innerRadius) / 2;
            const circumference = (meta.data[0].circumference / Math.PI / data.datasets[0].data[0]) * needleVal;

            ctx.translate(xCenter, yCenter);
            ctx.rotate(Math.PI * (circumference + 1.5));

            ctx.beginPath();
            ctx.strokeStyle = needleBorderColor;
            ctx.fillStyle = needleFillColor;
            ctx.lineWidth = 1;
            ctx.moveTo(0 - radius, 0);
            ctx.lineTo(0, 0 - innerRadius - widthSlice);
            ctx.lineTo(0 + radius, 0);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();

            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2, false);
            ctx.fill();

            ctx.restore();
        },
    }), []);

    const gaugeFlowMeter = useMemo(() => ({
        id: "gaugeFlowMeter",
        afterDatasetsDraw(chart: { getDatasetMeta?: any; ctx?: any; data?: any; }) {
            const { ctx, data } = chart;
            const xCenter = chart.getDatasetMeta(0).data[0].x;
            const yCenter = chart.getDatasetMeta(0).data[0].y;
            const needleValue = data.datasets[0].needleValue || 0;

            ctx.font = meterFont;
            ctx.fillStyle = meterColor;
            ctx.textAlign = "center";
            ctx.fillText(needleValue, xCenter, yCenter + 45);
        },
    }), []);

    const gaugeLabels = useMemo(() => {
        return {
            id: 'gaugeLabels',
            afterDatasetsDraw(chart: { getDatasetMeta?: any; ctx?: any; }) {
                const { ctx } = chart;

                const xCenter = chart.getDatasetMeta(0).data[0].x;
                const yCenter = chart.getDatasetMeta(0).data[0].y;
                const outerRadius = chart.getDatasetMeta(0).data[0].outerRadius;
                const innerRadius = chart.getDatasetMeta(0).data[0].innerRadius;
                const widthSlice = (outerRadius - innerRadius) / 2;

                const calculateAngle = (value: number) => {
                    const range = maxValue - minValue;
                    const normalizedValue = (value - minValue) / range;
                    return normalizedValue * 180;
                };
    
                const positions = [
                    { value: veryLowLimit },
                    { value: lowLimit },
                    { value: highLimit },
                    { value: veryHighLimit },
                ].map(({ value }) => ({
                    value,
                    angle: calculateAngle(value),
                }));

                ctx.save();
                ctx.font = labelFont;
                ctx.fillStyle = labelColor;
                ctx.textAlign = 'center';

                positions.forEach(({ value, angle }) => {
                    const radians = (Math.PI / 180) * (angle + 180);
                    const x = xCenter + Math.cos(radians) * (outerRadius + 20);
                    const y = yCenter + Math.sin(radians) * (outerRadius + 20);
                    ctx.fillText(value.toString(), x, y);
                });

                ctx.font = 'bold 14px sans-serif';
                ctx.fillText(minValue, xCenter - innerRadius - widthSlice, yCenter + 20);
                ctx.fillText(maxValue, xCenter + innerRadius + widthSlice, yCenter + 20);

                ctx.restore();
            }
        };
    }, [minValue, veryLowLimit, lowLimit, highLimit, veryHighLimit, maxValue]);

    const data = {
        labels: [],
        datasets: [
            {
                label: "",
                data: [veryLowValue, lowValue, goodValue, highValue, veryHighValue],
                backgroundColor: [veryLowColor, lowColor, goodColor, highColor, veryHighColor],
                borderColor: [borderVeryLowColor, borderLowColor, borderGoodColor, borderHighColor, borderVeryHighColor],
                borderWidth: datasetBorderWidth,
                circumference: 180,
                rotation: 270,
                cutout: cutout,
                needleValue: needleValue,
            } as CustomDataset,
        ],
    };

    const config: ChartConfiguration<"doughnut", number[], string> = {
        type: "doughnut",
        data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            aspectRatio: aspectRatio,
            layout: {
                padding: {
                    bottom: paddingBottom,
                    left: paddingLeft,
                    right: paddingRight,
                    top: paddingTop
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false },
            },
            elements: {
                arc: {
                    borderWidth: arcBorderWidth,
                    borderColor: arcBorderColor,
                },
            },
        },
        plugins: [gaugeNeedle, gaugeFlowMeter, gaugeLabels],
    };

    useEffect(() => {
        if (canvasRef.current) {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
            chartInstanceRef.current = new Chart(canvasRef.current, config);
        }

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, [minValue, veryLowValue, lowValue, goodValue, highValue, veryHighValue, maxValue]);

    useEffect(() => {
        if (chartInstanceRef.current) {
            (chartInstanceRef.current.data.datasets[0] as CustomDataset).needleValue = needleValue;
            chartInstanceRef.current.update();
        }
    }, [needleValue]);

    return <canvas ref={canvasRef} style={{ width: canvasWidth? canvasWidth : "auto", height: "auto" }}></canvas>;
}