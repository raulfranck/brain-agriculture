import React from 'react';
import styled from 'styled-components';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ChartData {
  name: string;
  value: number;
  percentage: number;
}

interface PieChartProps {
  title: string;
  data: ChartData[];
  colors?: string[];
  formatValue?: (value: number) => string;
}

const ChartContainer = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 400px;
  display: flex;
  flex-direction: column;
`;

const ChartTitle = styled.h3`
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
  text-align: center;
`;

const ChartWrapper = styled.div`
  flex: 1;
  min-height: 300px;
`;

const CustomTooltip = styled.div`
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const TooltipTitle = styled.div`
  font-weight: 600;
  color: #111827;
  margin-bottom: 4px;
`;

const TooltipValue = styled.div`
  color: #6b7280;
  font-size: 14px;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #6b7280;
  font-size: 14px;
  font-style: italic;
`;

const DEFAULT_COLORS = [
  '#3b82f6', // Azul
  '#10b981', // Verde
  '#f59e0b', // Amarelo
  '#ef4444', // Vermelho
  '#8b5cf6', // Roxo
  '#06b6d4', // Ciano
  '#f97316', // Laranja
  '#84cc16', // Verde lima
  '#ec4899', // Rosa
  '#6b7280', // Cinza
];

const CustomTooltipComponent: React.FC<any> = ({ active, payload, label, formatValue }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <CustomTooltip>
        <TooltipTitle>{data.name}</TooltipTitle>
        <TooltipValue>
          {formatValue ? formatValue(data.value) : data.value}
        </TooltipValue>
        <TooltipValue>
          {data.payload.percentage.toFixed(1)}%
        </TooltipValue>
      </CustomTooltip>
    );
  }

  return null;
};

export const PieChart: React.FC<PieChartProps> = ({
  title,
  data,
  colors = DEFAULT_COLORS,
  formatValue,
}) => {
  if (!data || data.length === 0) {
    return (
      <ChartContainer>
        <ChartTitle>{title}</ChartTitle>
        <EmptyState>Nenhum dado disponível</EmptyState>
      </ChartContainer>
    );
  }

  return (
    <ChartContainer>
      <ChartTitle>{title}</ChartTitle>
      <ChartWrapper>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ percentage }) => `${percentage.toFixed(1)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={colors[index % colors.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
              content={<CustomTooltipComponent formatValue={formatValue} />}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => (
                <span style={{ color: entry?.color }}>
                  {value}
                </span>
              )}
            />
          </RechartsPieChart>
        </ResponsiveContainer>
      </ChartWrapper>
    </ChartContainer>
  );
}; 