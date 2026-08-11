// Mock data model + generators for the Admin operations dashboard.
// This is a self-contained bank-wide dataset (many applications/customers/vendors),
// deliberately not wired to the single-user vehicleFinanceRequests.ts data.

export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'document_verification'
  | 'credit_assessment'
  | 'approval'
  | 'disbursement'
  | 'completed'
  | 'rejected';

export type SlaStatus = 'within' | 'approaching' | 'breached';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'critical';
export type WorkloadLevel = 'light' | 'moderate' | 'heavy' | 'overloaded';

export interface AdminApplication {
  id: string;
  customerName: string;
  customerType: 'individual' | 'business';
  vehicle: string;
  amount: number;
  status: ApplicationStatus;
  region: string;
  assignedVendorId: string;
  assignedVendorName: string;
  submittedDate: string;
  lastUpdatedDate: string;
  daysInCurrentStage: number;
  isEscalated: boolean;
  escalationReason?: string;
  priority: PriorityLevel;
  slaStatus: SlaStatus;
}

export interface AdminCustomer {
  id: string;
  name: string;
  type: 'individual' | 'business';
  email: string;
  phone: string;
  region: string;
  applicationsCount: number;
  totalPortfolioValue: number;
  joinedDate: string;
  status: 'active' | 'dormant';
}

export interface AdminVendor {
  id: string;
  name: string;
  region: string;
  applicationsAssigned: number;
  completedToday: number;
  pending: number;
  avgProcessingTimeHours: number;
  slaStatus: SlaStatus;
  workload: WorkloadLevel;
  activeSince: string;
}

export interface PipelineStageStat {
  key: Exclude<ApplicationStatus, 'rejected'>;
  label: string;
  count: number;
  percentOfTotal: number;
  isBottleneck: boolean;
}

export interface FunnelStageStat {
  key: string;
  label: string;
  count: number;
  isDelayed: boolean;
}

export interface RegionalStat {
  region: string;
  applicationsProcessed: number;
  approvalRate: number;
  avgProcessingDays: number;
  slaCompliance: number;
}

export interface SlaBucket {
  key: SlaStatus;
  label: string;
  count: number;
  percent: number;
  avgResolutionHours: number;
}

export interface PortfolioSeriesPoint {
  month: string;
  applications: number;
  approvals: number;
  rejections: number;
  portfolioValue: number;
  newCustomers: number;
}

export type ActivityType =
  | 'application_submitted'
  | 'vendor_completed_review'
  | 'sla_breach'
  | 'admin_reassigned'
  | 'customer_approved'
  | 'workflow_completed'
  | 'escalation_resolved';

export interface ActivityFeedEntry {
  id: string;
  type: ActivityType;
  message: string;
  actor: string;
  timestamp: string;
  relatedApplicationId?: string;
}

export interface BottleneckInsight {
  id: string;
  category: 'stage_delay' | 'vendor_sla' | 'region_performance' | 'rejection_rate' | 'verification_backlog';
  title: string;
  detail: string;
  severity: 'low' | 'medium' | 'high';
  recommendedAction: string;
}

export type KpiFormat = 'number' | 'percent' | 'currency';

export interface KpiCardData {
  key: string;
  label: string;
  value: number;
  format: KpiFormat;
  percentChange: number;
  trend: 'up' | 'down' | 'flat';
}

export interface ApplicationsFilter {
  label: string;
  statusIn?: ApplicationStatus[];
  escalatedOnly?: boolean;
  slaStatusIn?: SlaStatus[];
}

export interface AdminDataset {
  applications: AdminApplication[];
  customers: AdminCustomer[];
  vendors: AdminVendor[];
  pipeline: PipelineStageStat[];
  funnel: FunnelStageStat[];
  regional: RegionalStat[];
  sla: SlaBucket[];
  portfolio: PortfolioSeriesPoint[];
  activity: ActivityFeedEntry[];
  bottlenecks: BottleneckInsight[];
  kpis: KpiCardData[];
}

// ---------------------------------------------------------------------------
// Deterministic seeded RNG so the initial mock dataset is stable across
// re-renders/reloads; genuine randomness is reserved for randomizeMetrics().
// ---------------------------------------------------------------------------
function mulberry32(seed: number) {
  let s = seed;
  return function rand() {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hoursAgoIso(hours: number) {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function daysAgoIso(days: number) {
  return hoursAgoIso(days * 24);
}

const FIRST_NAMES = ['Adaeze', 'Chinedu', 'Ngozi', 'Emeka', 'Folake', 'Tunde', 'Aisha', 'Ibrahim', 'Bukola', 'Segun', 'Amaka', 'Yusuf', 'Chioma', 'Kelechi', 'Funmi', 'Obiora', 'Zainab', 'Kayode', 'Ifeoma', 'Musa', 'Temitope', 'Uche', 'Halima', 'Damilola', 'Chukwuemeka'];
const LAST_NAMES = ['Okafor', 'Adeyemi', 'Balogun', 'Eze', 'Bello', 'Okonkwo', 'Abubakar', 'Nwosu', 'Ogunleye', 'Suleiman', 'Chukwu', 'Adebayo', 'Yakubu', 'Ogundipe', 'Okoro', 'Aliyu', 'Nnamdi', 'Fashola', 'Danjuma', 'Ibekwe'];
const BUSINESS_NAMES = ['Zenith Logistics Ltd', 'Prime Traders Nigeria', 'Coastal Freight Co', 'Everstrong Ventures', 'Bluewave Holdings', 'Northgate Industries', 'Apex Retail Group', 'Silverline Enterprises', 'Trustcore Nigeria Ltd', 'Goldcrest Logistics'];
const REGIONS = ['Lagos', 'Abuja', 'Port Harcourt', 'Kano', 'Ibadan'];
const VEHICLES = ['Toyota Camry 2023', 'Honda Accord 2022', 'Lexus RX350 2021', 'Toyota Land Cruiser 2020', 'Mercedes-Benz C300 2022', 'Kia Sportage 2023', 'Hyundai Tucson 2021', 'Mitsubishi Outlander 2020', 'Toyota Corolla 2022', 'Ford Explorer 2021', 'Nissan X-Trail 2022', 'Toyota Hilux 2021'];
const VENDOR_NAMES = ['Autocheck', 'CarZone Nigeria', 'DriveDeal Motors', 'Prestige Auto Hub', 'Elite Motors NG', 'SwiftCars Ltd', 'MotorPoint Nigeria', 'FastTrack Vehicles', 'Continental Auto', 'NaijaWheels', 'Prime Motors Auto', 'Urban Auto Group', 'Coastal Cars', 'Metro Vehicle Finance'];
const ESCALATION_REASONS = [
  'Missing income documentation',
  'Credit score below threshold — manual review requested',
  'Vendor inspection overdue',
  'Customer disputes offer terms',
  'Duplicate application flagged',
  'KYC verification mismatch',
  'Equity contribution delayed',
  'Vehicle valuation discrepancy',
];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  submitted: 'Submitted',
  under_review: 'Under Review',
  document_verification: 'Document Verification',
  credit_assessment: 'Credit Assessment',
  approval: 'Approval',
  disbursement: 'Disbursement',
  completed: 'Completed',
  rejected: 'Rejected',
};

const PIPELINE_STAGE_ORDER: Exclude<ApplicationStatus, 'rejected'>[] = [
  'submitted', 'under_review', 'document_verification', 'credit_assessment', 'approval', 'disbursement', 'completed',
];

const SLA_LABELS: Record<SlaStatus, string> = {
  within: 'Within SLA',
  approaching: 'Approaching SLA',
  breached: 'SLA Breached',
};

// ---------------------------------------------------------------------------
// Generators
// ---------------------------------------------------------------------------

export function generateAdminVendors(count = 14): AdminVendor[] {
  const rand = mulberry32(4242);
  return VENDOR_NAMES.slice(0, count).map((name, i) => {
    const assigned = 8 + Math.floor(rand() * 40);
    const completedToday = Math.floor(rand() * 6);
    const pending = Math.max(assigned - completedToday - Math.floor(rand() * assigned * 0.5), 1);
    const avgProcessingTimeHours = 6 + Math.round(rand() * 60);
    const slaStatus: SlaStatus = avgProcessingTimeHours > 48 ? 'breached' : avgProcessingTimeHours > 30 ? 'approaching' : 'within';
    const workloadRatio = pending / assigned;
    const workload: WorkloadLevel = workloadRatio > 0.7 ? 'overloaded' : workloadRatio > 0.5 ? 'heavy' : workloadRatio > 0.3 ? 'moderate' : 'light';
    return {
      id: `VND-${1000 + i}`,
      name,
      region: REGIONS[i % REGIONS.length],
      applicationsAssigned: assigned,
      completedToday,
      pending,
      avgProcessingTimeHours,
      slaStatus,
      workload,
      activeSince: daysAgoIso(180 + Math.floor(rand() * 900)),
    };
  });
}

export function generateAdminApplications(vendors: AdminVendor[], count = 65): AdminApplication[] {
  const rand = mulberry32(1337);
  const statuses: ApplicationStatus[] = ['submitted', 'under_review', 'document_verification', 'credit_assessment', 'approval', 'disbursement', 'completed', 'rejected'];
  const weights = [14, 12, 10, 9, 7, 6, 20, 7];
  const weightedStatuses = statuses.flatMap((s, i) => Array(weights[i]).fill(s));

  return Array.from({ length: count }, (_, i) => {
    const isBusiness = rand() < 0.3;
    const customerName = isBusiness
      ? BUSINESS_NAMES[Math.floor(rand() * BUSINESS_NAMES.length)]
      : `${FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)]} ${LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)]}`;
    const status = weightedStatuses[Math.floor(rand() * weightedStatuses.length)];
    const vendor = vendors[Math.floor(rand() * vendors.length)];
    const submittedDaysAgo = 1 + Math.floor(rand() * 45);
    const daysInCurrentStage = 1 + Math.floor(rand() * Math.min(submittedDaysAgo, 14));
    const isTerminal = status === 'completed' || status === 'rejected';
    const slaStatus: SlaStatus = isTerminal ? 'within' : daysInCurrentStage > 10 ? 'breached' : daysInCurrentStage > 6 ? 'approaching' : 'within';
    const isEscalated = !isTerminal && (slaStatus === 'breached' ? rand() < 0.55 : slaStatus === 'approaching' ? rand() < 0.15 : rand() < 0.03);
    const priority: PriorityLevel = isEscalated
      ? (slaStatus === 'breached' && daysInCurrentStage > 14 ? 'critical' : slaStatus === 'breached' ? 'high' : 'medium')
      : (rand() < 0.1 ? 'medium' : 'low');
    const amount = 2_500_000 + Math.floor(rand() * 45) * 500_000;

    return {
      id: `APP-${10234 + i}`,
      customerName,
      customerType: isBusiness ? 'business' : 'individual',
      vehicle: VEHICLES[Math.floor(rand() * VEHICLES.length)],
      amount,
      status,
      region: REGIONS[Math.floor(rand() * REGIONS.length)],
      assignedVendorId: vendor.id,
      assignedVendorName: vendor.name,
      submittedDate: daysAgoIso(submittedDaysAgo),
      lastUpdatedDate: daysAgoIso(Math.max(submittedDaysAgo - daysInCurrentStage, 0)),
      daysInCurrentStage,
      isEscalated,
      escalationReason: isEscalated ? ESCALATION_REASONS[Math.floor(rand() * ESCALATION_REASONS.length)] : undefined,
      priority,
      slaStatus,
    };
  });
}

export function generateAdminCustomers(apps: AdminApplication[]): AdminCustomer[] {
  const rand = mulberry32(99);
  const map = new Map<string, AdminCustomer>();
  apps.forEach((app) => {
    const existing = map.get(app.customerName);
    if (existing) {
      existing.applicationsCount += 1;
      existing.totalPortfolioValue += app.amount;
      if (new Date(app.submittedDate) < new Date(existing.joinedDate)) {
        existing.joinedDate = app.submittedDate;
      }
      return;
    }
    const slug = app.customerName.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/(^\.|\.$)/g, '');
    map.set(app.customerName, {
      id: `CUS-${(map.size + 1).toString().padStart(4, '0')}`,
      name: app.customerName,
      type: app.customerType,
      email: `${slug}@example.com`,
      phone: `080${Math.floor(10000000 + rand() * 89999999)}`,
      region: app.region,
      applicationsCount: 1,
      totalPortfolioValue: app.amount,
      joinedDate: app.submittedDate,
      status: rand() < 0.85 ? 'active' : 'dormant',
    });
  });
  return Array.from(map.values());
}

export function buildPipelineStages(apps: AdminApplication[]): PipelineStageStat[] {
  const nonTerminal = apps.filter((a) => a.status !== 'rejected');
  const total = nonTerminal.length || 1;
  const counts = PIPELINE_STAGE_ORDER.map((stage) => nonTerminal.filter((a) => a.status === stage).length);
  const mean = counts.reduce((a, b) => a + b, 0) / counts.length;
  return PIPELINE_STAGE_ORDER.map((stage, i) => ({
    key: stage,
    label: APPLICATION_STATUS_LABELS[stage],
    count: counts[i],
    percentOfTotal: Math.round((counts[i] / total) * 100),
    isBottleneck: stage !== 'completed' && counts[i] > mean * 1.5,
  }));
}

export function buildFunnelStages(): FunnelStageStat[] {
  const stages: { label: string; count: number; isDelayed: boolean }[] = [
    { label: 'New Applications', count: 1240, isDelayed: false },
    { label: 'Verification', count: 1080, isDelayed: false },
    { label: 'Compliance Review', count: 860, isDelayed: false },
    { label: 'Credit Review', count: 705, isDelayed: false },
    { label: 'Approval Queue', count: 610, isDelayed: false },
    { label: 'Awaiting Customer', count: 480, isDelayed: true },
    { label: 'Completed', count: 402, isDelayed: false },
    { label: 'Failed', count: 78, isDelayed: false },
  ];
  return stages.map((s, i) => ({ key: `funnel-${i}`, ...s }));
}

export function buildRegionalStats(apps: AdminApplication[]): RegionalStat[] {
  return REGIONS.map((region) => {
    const regionApps = apps.filter((a) => a.region === region);
    const processed = regionApps.length;
    const approved = regionApps.filter((a) => a.status === 'completed').length;
    const rejected = regionApps.filter((a) => a.status === 'rejected').length;
    const decided = approved + rejected;
    const approvalRate = decided ? Math.round((approved / decided) * 100) : 0;
    const avgProcessingDays = processed
      ? Math.round((regionApps.reduce((sum, a) => sum + a.daysInCurrentStage, 0) / processed) * 10) / 10
      : 0;
    const withinSla = regionApps.filter((a) => a.slaStatus === 'within').length;
    const slaCompliance = processed ? Math.round((withinSla / processed) * 100) : 0;
    return { region, applicationsProcessed: processed, approvalRate, avgProcessingDays, slaCompliance };
  });
}

export function buildSlaBuckets(apps: AdminApplication[]): SlaBucket[] {
  const active = apps.filter((a) => a.status !== 'completed' && a.status !== 'rejected');
  const total = active.length || 1;
  const groups: SlaStatus[] = ['within', 'approaching', 'breached'];
  return groups.map((key) => {
    const items = active.filter((a) => a.slaStatus === key);
    const avgResolutionHours = items.length
      ? Math.round(items.reduce((sum, a) => sum + a.daysInCurrentStage * 24, 0) / items.length)
      : 0;
    return {
      key,
      label: SLA_LABELS[key],
      count: items.length,
      percent: Math.round((items.length / total) * 100),
      avgResolutionHours,
    };
  });
}

export function buildBottleneckInsights(
  pipeline: PipelineStageStat[],
  vendors: AdminVendor[],
  regional: RegionalStat[],
  apps: AdminApplication[]
): BottleneckInsight[] {
  const insights: BottleneckInsight[] = [];

  const worstStage = [...pipeline].filter((s) => s.isBottleneck).sort((a, b) => b.count - a.count)[0];
  if (worstStage) {
    insights.push({
      id: 'insight-stage',
      category: 'stage_delay',
      title: `${worstStage.label} queue is backing up`,
      detail: `${worstStage.count} applications (${worstStage.percentOfTotal}% of active volume) are sitting in ${worstStage.label}, well above the average stage load.`,
      severity: 'high',
      recommendedAction: `Reassign idle reviewers to ${worstStage.label} or escalate the oldest applications in this stage.`,
    });
  }

  const worstVendor = [...vendors].filter((v) => v.slaStatus === 'breached').sort((a, b) => b.avgProcessingTimeHours - a.avgProcessingTimeHours)[0];
  if (worstVendor) {
    insights.push({
      id: 'insight-vendor',
      category: 'vendor_sla',
      title: `${worstVendor.name} is exceeding SLA`,
      detail: `Average processing time of ${worstVendor.avgProcessingTimeHours}h, with ${worstVendor.pending} pending applications and a ${worstVendor.workload} workload.`,
      severity: 'high',
      recommendedAction: `Redistribute part of ${worstVendor.name}'s pending queue to lighter-workload vendors.`,
    });
  }

  const worstRegion = [...regional].sort((a, b) => a.slaCompliance - b.slaCompliance)[0];
  if (worstRegion && worstRegion.slaCompliance < 85) {
    insights.push({
      id: 'insight-region',
      category: 'region_performance',
      title: `${worstRegion.region} is underperforming on SLA compliance`,
      detail: `Only ${worstRegion.slaCompliance}% SLA compliance and a ${worstRegion.avgProcessingDays}-day average processing time.`,
      severity: worstRegion.slaCompliance < 70 ? 'high' : 'medium',
      recommendedAction: `Review vendor capacity and staffing allocation in ${worstRegion.region}.`,
    });
  }

  const rejected = apps.filter((a) => a.status === 'rejected').length;
  const decided = apps.filter((a) => a.status === 'rejected' || a.status === 'completed').length || 1;
  const rejectionRate = Math.round((rejected / decided) * 100);
  if (rejectionRate > 12) {
    insights.push({
      id: 'insight-rejection',
      category: 'rejection_rate',
      title: 'Rejection rate is trending high',
      detail: `${rejectionRate}% of decided applications were rejected this period, above the 12% target ceiling.`,
      severity: rejectionRate > 20 ? 'high' : 'medium',
      recommendedAction: 'Audit recent rejections for common causes (income verification, credit thresholds) and review underwriting criteria.',
    });
  }

  const verificationBacklog = apps.filter((a) => a.status === 'document_verification').length;
  if (verificationBacklog > 6) {
    insights.push({
      id: 'insight-verification',
      category: 'verification_backlog',
      title: 'Document verification backlog building up',
      detail: `${verificationBacklog} applications are awaiting document verification.`,
      severity: verificationBacklog > 12 ? 'high' : 'medium',
      recommendedAction: 'Assign additional compliance staff to clear the verification queue.',
    });
  }

  return insights;
}

export function buildPortfolioSeries(): PortfolioSeriesPoint[] {
  const rand = mulberry32(777);
  const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
  let portfolioValue = 180_000_000;
  return months.map((month) => {
    const applications = 60 + Math.floor(rand() * 50);
    const approvals = Math.floor(applications * (0.55 + rand() * 0.25));
    const rejections = Math.floor(applications * (0.08 + rand() * 0.1));
    portfolioValue += approvals * (2_000_000 + Math.floor(rand() * 3_000_000));
    const newCustomers = 15 + Math.floor(rand() * 30);
    return { month, applications, approvals, rejections, portfolioValue, newCustomers };
  });
}

const ACTIVITY_TEMPLATES: { type: ActivityType; message: (actor: string, appId: string) => string }[] = [
  { type: 'application_submitted', message: (actor) => `New application submitted by ${actor}` },
  { type: 'vendor_completed_review', message: (actor) => `${actor} completed inspection review` },
  { type: 'sla_breach', message: (_actor, appId) => `SLA breach detected on ${appId}` },
  { type: 'admin_reassigned', message: (actor, appId) => `${actor} reassigned ${appId} to a new vendor` },
  { type: 'customer_approved', message: (actor) => `${actor}'s application was approved` },
  { type: 'workflow_completed', message: (actor) => `Workflow completed for ${actor}` },
  { type: 'escalation_resolved', message: (actor, appId) => `Escalation resolved for ${appId} (${actor})` },
];

export function buildActivityFeed(apps: AdminApplication[], vendors: AdminVendor[], count = 24): ActivityFeedEntry[] {
  const rand = mulberry32(555);
  return Array.from({ length: count }, (_, i) => {
    const template = ACTIVITY_TEMPLATES[Math.floor(rand() * ACTIVITY_TEMPLATES.length)];
    const app = apps[Math.floor(rand() * apps.length)];
    const actorPool = template.type === 'vendor_completed_review'
      ? vendors.map((v) => v.name)
      : template.type === 'admin_reassigned' || template.type === 'escalation_resolved'
        ? ['Admin']
        : [app.customerName];
    const actor = actorPool[Math.floor(rand() * actorPool.length)];
    return {
      id: `act-${i}`,
      type: template.type,
      message: template.message(actor, app.id),
      actor,
      timestamp: hoursAgoIso(Math.floor(rand() * 120)),
      relatedApplicationId: app.id,
    };
  }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function buildKpiCards(apps: AdminApplication[], vendors: AdminVendor[], slaBuckets: SlaBucket[]): KpiCardData[] {
  const total = apps.length;
  const inProgress = apps.filter((a) => a.status !== 'completed' && a.status !== 'rejected').length;
  const approved = apps.filter((a) => a.status === 'completed').length;
  const rejected = apps.filter((a) => a.status === 'rejected').length;
  const pendingReview = apps.filter((a) => a.status === 'submitted' || a.status === 'under_review').length;
  const escalated = apps.filter((a) => a.isEscalated).length;
  const activeVendors = vendors.filter((v) => v.pending > 0 || v.completedToday > 0).length;
  const withinCount = slaBuckets.find((b) => b.key === 'within')?.count ?? 0;
  const slaTotal = slaBuckets.reduce((s, b) => s + b.count, 0) || 1;
  const slaCompliance = Math.round((withinCount / slaTotal) * 100);
  const decided = approved + rejected || 1;
  const portfolioConversion = Math.round((approved / decided) * 100);

  const defs: { key: string; label: string; value: number; format: KpiFormat }[] = [
    { key: 'totalApplications', label: 'Total Applications', value: total, format: 'number' },
    { key: 'inProgress', label: 'Applications In Progress', value: inProgress, format: 'number' },
    { key: 'approved', label: 'Approved Applications', value: approved, format: 'number' },
    { key: 'rejected', label: 'Rejected Applications', value: rejected, format: 'number' },
    { key: 'pendingReview', label: 'Pending Review', value: pendingReview, format: 'number' },
    { key: 'escalated', label: 'Escalated Applications', value: escalated, format: 'number' },
    { key: 'activeVendors', label: 'Active Vendors', value: activeVendors, format: 'number' },
    { key: 'slaCompliance', label: 'SLA Compliance Rate', value: slaCompliance, format: 'percent' },
    { key: 'portfolioConversion', label: 'Portfolio Conversion Rate', value: portfolioConversion, format: 'percent' },
  ];

  const rand = mulberry32(2024);
  return defs.map((d) => {
    const percentChange = Math.round((rand() * 16 - 6) * 10) / 10;
    return { ...d, percentChange, trend: percentChange > 0.3 ? 'up' : percentChange < -0.3 ? 'down' : 'flat' };
  });
}

/** Pure — nudges a random 2-3 KPI values by a small bounded amount, used by the Refresh button and the live-tick interval. */
export function randomizeMetrics(kpis: KpiCardData[]): KpiCardData[] {
  const indices = new Set<number>();
  while (indices.size < Math.min(3, kpis.length)) {
    indices.add(Math.floor(Math.random() * kpis.length));
  }
  return kpis.map((kpi, i) => {
    if (!indices.has(i)) return kpi;
    const delta = kpi.format === 'percent'
      ? Math.round((Math.random() * 4 - 1.5) * 10) / 10
      : Math.max(1, Math.round(kpi.value * (Math.random() * 0.05 - 0.02)));
    const nextValue = kpi.format === 'percent'
      ? Math.min(100, Math.max(0, kpi.value + delta))
      : Math.max(0, kpi.value + delta);
    const percentChange = Math.round(((nextValue - kpi.value) / (kpi.value || 1)) * 1000) / 10;
    return {
      ...kpi,
      value: nextValue,
      percentChange,
      trend: percentChange > 0.1 ? 'up' : percentChange < -0.1 ? 'down' : 'flat',
    };
  });
}

export function buildAdminDataset(): AdminDataset {
  const vendors = generateAdminVendors();
  const applications = generateAdminApplications(vendors);
  const customers = generateAdminCustomers(applications);
  const pipeline = buildPipelineStages(applications);
  const funnel = buildFunnelStages();
  const regional = buildRegionalStats(applications);
  const sla = buildSlaBuckets(applications);
  const bottlenecks = buildBottleneckInsights(pipeline, vendors, regional, applications);
  const portfolio = buildPortfolioSeries();
  const activity = buildActivityFeed(applications, vendors);
  const kpis = buildKpiCards(applications, vendors, sla);
  return { applications, customers, vendors, pipeline, funnel, regional, sla, portfolio, activity, bottlenecks, kpis };
}

// ---------------------------------------------------------------------------
// KPI -> Applications-view drill-down filters
// ---------------------------------------------------------------------------

export const KPI_DRILLDOWN_FILTERS: Record<string, ApplicationsFilter> = {
  totalApplications: { label: 'All Applications' },
  inProgress: { label: 'In Progress', statusIn: ['submitted', 'under_review', 'document_verification', 'credit_assessment', 'approval', 'disbursement'] },
  approved: { label: 'Approved', statusIn: ['approval', 'disbursement', 'completed'] },
  rejected: { label: 'Rejected', statusIn: ['rejected'] },
  pendingReview: { label: 'Pending Review', statusIn: ['submitted', 'under_review'] },
  escalated: { label: 'Escalated', escalatedOnly: true },
  slaCompliance: { label: 'At Risk / Breached SLA', slaStatusIn: ['approaching', 'breached'] },
  portfolioConversion: { label: 'Completed (Converted)', statusIn: ['completed'] },
};

export function applyApplicationsFilter(apps: AdminApplication[], filter: ApplicationsFilter | null): AdminApplication[] {
  if (!filter) return apps;
  return apps.filter((a) => {
    if (filter.statusIn && !filter.statusIn.includes(a.status)) return false;
    if (filter.escalatedOnly && !a.isEscalated) return false;
    if (filter.slaStatusIn && !filter.slaStatusIn.includes(a.slaStatus)) return false;
    return true;
  });
}

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

export function formatNaira(value: number): string {
  return `₦${value.toLocaleString()}`;
}

export function formatKpiValue(kpi: KpiCardData): string {
  if (kpi.format === 'currency') return formatNaira(kpi.value);
  if (kpi.format === 'percent') return `${kpi.value}%`;
  return kpi.value.toLocaleString();
}

// ---------------------------------------------------------------------------
// CSV export
// ---------------------------------------------------------------------------

export interface CsvColumn {
  key: string;
  label: string;
}

export interface CsvSection {
  title: string;
  columns: CsvColumn[];
  rows: Record<string, unknown>[];
}

function csvEscape(value: unknown): string {
  const str = value === null || value === undefined ? '' : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadCsv(filename: string, content: string) {
  const blob = new Blob(['﻿' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportToCsv(filename: string, columns: CsvColumn[], rows: Record<string, unknown>[]): void {
  const lines = [
    columns.map((c) => csvEscape(c.label)).join(','),
    ...rows.map((row) => columns.map((c) => csvEscape(row[c.key])).join(',')),
  ];
  downloadCsv(filename, lines.join('\n'));
}

export function exportMultiSectionCsv(filename: string, sections: CsvSection[]): void {
  const lines: string[] = [];
  sections.forEach((section, i) => {
    if (i > 0) lines.push('');
    lines.push(csvEscape(section.title));
    lines.push(section.columns.map((c) => csvEscape(c.label)).join(','));
    section.rows.forEach((row) => {
      lines.push(section.columns.map((c) => csvEscape(row[c.key])).join(','));
    });
  });
  downloadCsv(filename, lines.join('\n'));
}
