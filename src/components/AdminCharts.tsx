import type { ReactElement } from 'react';
import './AdminDashboard.css';
import type { FunnelStageStat, KpiCardData, PipelineStageStat, SlaBucket } from './adminData';
import { formatKpiValue } from './adminData';

const SLA_COLORS: Record<SlaBucket['key'], string> = {
  within: '#16a34a',
  approaching: '#d97706',
  breached: '#dc2626',
};

function TrendUpIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  );
}

function TrendDownIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 18 13.5 8.5 8.5 13.5 1 6" />
      <polyline points="17 18 23 18 23 12" />
    </svg>
  );
}

function TrendFlatIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="1" y1="12" x2="23" y2="12" />
    </svg>
  );
}

const KPI_ICONS: Record<string, () => ReactElement> = {
  totalApplications: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" />
      <line x1="8" y1="17" x2="13" y2="17" />
    </svg>
  ),
  inProgress: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  ),
  approved: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <polyline points="8 12 11 15 16 9" />
    </svg>
  ),
  rejected: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="10" />
      <line x1="9" y1="9" x2="15" y2="15" />
      <line x1="15" y1="9" x2="9" y2="15" />
    </svg>
  ),
  pendingReview: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  escalated: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
  activeVendors: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6" />
    </svg>
  ),
  slaCompliance: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 2l8 3v6c0 5-3.4 8.4-8 10-4.6-1.6-8-5-8-10V5z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  portfolioConversion: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
};

interface KpiCardProps {
  data: KpiCardData;
  onClick?: () => void;
}

export function KpiCard({ data, onClick }: KpiCardProps) {
  const Icon = KPI_ICONS[data.key];
  const trendClass = data.trend === 'up' ? 'up' : data.trend === 'down' ? 'down' : 'flat';
  const sign = data.percentChange > 0 ? '+' : '';
  const Component = onClick ? 'button' : 'div';
  return (
    <Component
      type={onClick ? 'button' : undefined}
      className={`ad-kpi-card ${onClick ? 'ad-drilldown-hint' : ''}`}
      onClick={onClick}
    >
      <div className="ad-kpi-card-icon">{Icon ? <Icon /> : null}</div>
      <span className="ad-kpi-card-label">{data.label}</span>
      <span className="ad-kpi-card-value">{formatKpiValue(data)}</span>
      <span className={`ad-kpi-card-trend ${trendClass}`}>
        {data.trend === 'up' ? <TrendUpIcon /> : data.trend === 'down' ? <TrendDownIcon /> : <TrendFlatIcon />}
        {sign}{data.percentChange}%
      </span>
    </Component>
  );
}

interface PipelineRowProps {
  stages: PipelineStageStat[];
}

export function PipelineRow({ stages }: PipelineRowProps) {
  return (
    <div className="ad-pipeline">
      {stages.map((stage, i) => (
        <div className="ad-pipeline-item" key={stage.key}>
          <div className={`ad-pipeline-stage ${stage.isBottleneck ? 'bottleneck' : ''}`}>
            {stage.isBottleneck && (
              <span className="ad-pipeline-bottleneck-badge" title="Bottleneck: queue larger than average">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5">
                  <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </span>
            )}
            <span className="ad-pipeline-stage-count">{stage.count}</span>
            <span className="ad-pipeline-stage-label">{stage.label}</span>
            <span className="ad-pipeline-stage-percent">{stage.percentOfTotal}% of active</span>
          </div>
          {i < stages.length - 1 && (
            <svg className="ad-pipeline-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5">
              <polyline points="9 6 15 12 9 18" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}

interface FunnelChartProps {
  stages: FunnelStageStat[];
}

export function FunnelChart({ stages }: FunnelChartProps) {
  const maxCount = Math.max(...stages.map((s) => s.count), 1);
  return (
    <div className="ad-funnel">
      {stages.map((stage) => {
        const widthPercent = Math.max((stage.count / maxCount) * 100, 8);
        return (
          <div className="ad-funnel-row" key={stage.key}>
            <span className="ad-funnel-label">{stage.label}</span>
            <div className="ad-funnel-track">
              <div
                className={`ad-funnel-bar ${stage.isDelayed ? 'delayed' : ''}`}
                style={{ width: `${widthPercent}%` }}
              >
                {stage.count.toLocaleString()}
              </div>
            </div>
            {stage.isDelayed && <span className="ad-funnel-delayed-tag">Delayed</span>}
          </div>
        );
      })}
    </div>
  );
}

interface BarChartProps {
  data: { label: string; value: number }[];
  color?: string;
  formatValue?: (v: number) => string;
}

export function BarChart({ data, color = '#0052CC', formatValue }: BarChartProps) {
  const maxValue = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="ad-chart-bar-row">
      {data.map((d) => (
        <div className="ad-chart-bar-col" key={d.label}>
          <span className="ad-chart-bar-value">{formatValue ? formatValue(d.value) : d.value}</span>
          <div className="ad-chart-bar-track">
            <div
              className="ad-chart-bar"
              style={{ height: `${(d.value / maxValue) * 100}%`, background: color }}
            />
          </div>
          <span className="ad-chart-bar-label">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

interface LineChartProps {
  points: number[];
  labels: string[];
  color?: string;
  area?: boolean;
  formatValue?: (v: number) => string;
}

export function LineChart({ points, labels, color = '#0052CC', area = false, formatValue }: LineChartProps) {
  const width = 560;
  const height = 160;
  const padding = 8;
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  const step = points.length > 1 ? (width - padding * 2) / (points.length - 1) : 0;

  const coords = points.map((p, i) => {
    const x = padding + i * step;
    const y = padding + (1 - (p - min) / range) * (height - padding * 2);
    return [x, y] as const;
  });

  const linePath = coords.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const areaPath = area
    ? `${linePath} L${coords[coords.length - 1][0].toFixed(1)},${height - padding} L${coords[0][0].toFixed(1)},${height - padding} Z`
    : '';

  return (
    <div className="ad-chart-line-wrap">
      <svg className="ad-chart-line-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        {area && <path d={areaPath} fill={color} opacity={0.12} stroke="none" />}
        <path d={linePath} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {coords.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3} fill="#fff" stroke={color} strokeWidth={2}>
            <title>{`${labels[i]}: ${formatValue ? formatValue(points[i]) : points[i]}`}</title>
          </circle>
        ))}
      </svg>
      <div className="ad-chart-line-labels">
        {labels.map((l) => <span key={l}>{l}</span>)}
      </div>
    </div>
  );
}

interface DonutChartProps {
  segments: { label: string; value: number; color: string }[];
  centerLabel: string;
  centerValue: string;
}

export function DonutChart({ segments, centerLabel, centerValue }: DonutChartProps) {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="ad-donut">
      <svg width="120" height="120" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="#eef1f6" strokeWidth="14" />
        {segments.map((s) => {
          const fraction = s.value / total;
          const dash = fraction * circumference;
          const circle = (
            <circle
              key={s.label}
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth="14"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              transform="rotate(-90 50 50)"
              strokeLinecap="butt"
            >
              <title>{`${s.label}: ${s.value}`}</title>
            </circle>
          );
          offset += dash;
          return circle;
        })}
      </svg>
      <div className="ad-donut-center">
        <strong>{centerValue}</strong>
        <span>{centerLabel}</span>
      </div>
      <ul className="ad-donut-legend">
        {segments.map((s) => (
          <li key={s.label}>
            <span className="ad-donut-legend-dot" style={{ background: s.color }} />
            {s.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface SlaGaugeProps {
  buckets: SlaBucket[];
}

export function SlaGauge({ buckets }: SlaGaugeProps) {
  return (
    <div className="ad-sla-gauge-group">
      {buckets.map((bucket) => (
        <div className="ad-sla-gauge-row" key={bucket.key}>
          <div className="ad-sla-gauge-head">
            <span className={`ad-sla-dot ${bucket.key}`} />
            <span className="ad-sla-gauge-label">{bucket.label}</span>
            <span className="ad-sla-gauge-count">{bucket.count} applications</span>
          </div>
          <div className="ad-sla-gauge">
            <div
              className="ad-sla-gauge-fill"
              style={{ width: `${bucket.percent}%`, background: SLA_COLORS[bucket.key] }}
            />
          </div>
          <span className="ad-sla-gauge-meta">{bucket.percent}% · avg resolution {bucket.avgResolutionHours}h</span>
        </div>
      ))}
    </div>
  );
}
