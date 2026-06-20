import { useState, type ComponentType, type ReactNode } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  LayoutDashboard, CreditCard, List, RotateCcw, Key,
  Link2, Plug, Landmark, BarChart2, Shield, Building,
  Monitor, Search, Bell, LogOut, Eye, EyeOff, Copy,
  Plus, Filter, Download, ArrowUpRight, ArrowDownRight,
  CheckCircle, XCircle, Clock, ChevronRight, MoreHorizontal,
  ArrowLeft, AlertTriangle, TrendingUp, Lock, Globe, Activity,
  Settings, Hash, Zap, AlertCircle, Mail, X, ChevronDown,
  Terminal, Database, Cpu, Wifi, Check, RefreshCw, Radio,
  ShieldAlert, Layers, ToggleLeft, ToggleRight,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type Screen =
  | "login" | "register" | "recovery"
  | "dashboard" | "payments" | "payment-detail" | "transactions" | "refunds"
  | "api-keys" | "webhooks" | "integrations"
  | "settlements" | "reports"
  | "fraud"
  | "merchants" | "platform";

type Nav = (screen: Screen) => void;

// ── Utilities ─────────────────────────────────────────────────────────────────
const cn = (...c: (string | boolean | undefined | null)[]) => c.filter(Boolean).join(" ");

const fmt = {
  currency: (n: number, cur = "USD") =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: cur }).format(n),
  number: (n: number) => new Intl.NumberFormat("en-US").format(n),
  pct: (n: number) => `${n.toFixed(2)}%`,
  compact: (n: number) =>
    n >= 1e6 ? `$${(n / 1e6).toFixed(2)}M` : n >= 1e3 ? `$${(n / 1e3).toFixed(1)}K` : `$${n}`,
};

// ── Mock Data ─────────────────────────────────────────────────────────────────
const VOLUME_DATA = [
  { d: "Jan", volume: 31.4, success: 29.8, failed: 1.6 },
  { d: "Feb", volume: 28.7, success: 27.2, failed: 1.5 },
  { d: "Mar", volume: 34.2, success: 32.5, failed: 1.7 },
  { d: "Apr", volume: 42.1, success: 40.1, failed: 2.0 },
  { d: "May", volume: 38.9, success: 37.0, failed: 1.9 },
  { d: "Jun", volume: 51.3, success: 48.9, failed: 2.4 },
  { d: "Jul", volume: 47.8, success: 45.6, failed: 2.2 },
  { d: "Aug", volume: 55.4, success: 52.7, failed: 2.7 },
  { d: "Sep", volume: 49.2, success: 46.8, failed: 2.4 },
  { d: "Oct", volume: 61.7, success: 58.8, failed: 2.9 },
  { d: "Nov", volume: 73.4, success: 69.9, failed: 3.5 },
  { d: "Dec", volume: 84.1, success: 80.2, failed: 3.9 },
];

const FRAUD_TREND = [
  { d: "Mon", alerts: 12, blocked: 4 },
  { d: "Tue", alerts: 18, blocked: 7 },
  { d: "Wed", alerts: 9, blocked: 3 },
  { d: "Thu", alerts: 24, blocked: 11 },
  { d: "Fri", alerts: 31, blocked: 14 },
  { d: "Sat", alerts: 8, blocked: 2 },
  { d: "Sun", alerts: 6, blocked: 1 },
];

const TXN_STATUS_COLORS: Record<string, string> = {
  succeeded: "text-[#10B981]",
  failed: "text-[#EF4444]",
  pending: "text-[#F59E0B]",
  refunded: "text-[#8B5CF6]",
  disputed: "text-[#F97316]",
};

const TXN_STATUS_BG: Record<string, string> = {
  succeeded: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20",
  failed: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
  pending: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
  refunded: "bg-[#8B5CF6]/10 text-[#8B5CF6] border-[#8B5CF6]/20",
  disputed: "bg-[#F97316]/10 text-[#F97316] border-[#F97316]/20",
};

const TRANSACTIONS = [
  { id: "txn_1PqRsT2UvWxYz3A", merchant: "Acme Retail Corp", amount: 2847.50, currency: "USD", status: "succeeded", gateway: "Stripe", country: "US", ts: "2024-12-15 14:23:07", card: "•••• 4242", ip: "104.23.184.12" },
  { id: "txn_7BcDe8FgHiJkL9M", merchant: "TechFlow Ltd", amount: 459.99, currency: "EUR", status: "failed", gateway: "Adyen", country: "DE", ts: "2024-12-15 14:21:33", card: "•••• 0005", ip: "185.76.14.33" },
  { id: "txn_4NoPqRsT5UvWxYz", merchant: "GlobalShop Inc", amount: 12400.00, currency: "USD", status: "pending", gateway: "Braintree", country: "GB", ts: "2024-12-15 14:18:52", card: "•••• 1111", ip: "78.46.201.7" },
  { id: "txn_6AbCd7EfGhIjKlMn", merchant: "NovaPay Systems", amount: 899.00, currency: "GBP", status: "succeeded", gateway: "Stripe", country: "GB", ts: "2024-12-15 14:15:41", card: "•••• 5100", ip: "82.45.12.199" },
  { id: "txn_2OpQrSt3UvWxYzAb", merchant: "MegaStore EU", amount: 3299.99, currency: "EUR", status: "refunded", gateway: "Adyen", country: "FR", ts: "2024-12-15 14:12:09", card: "•••• 9999", ip: "91.121.88.44" },
  { id: "txn_8CdEfGh9IjKlMnOp", merchant: "Acme Retail Corp", amount: 187.50, currency: "USD", status: "succeeded", gateway: "Stripe", country: "US", ts: "2024-12-15 14:09:27", card: "•••• 4242", ip: "104.23.184.12" },
  { id: "txn_1QrStUv2WxYzAbCd", merchant: "Quantum Pay Ltd", amount: 7650.00, currency: "USD", status: "disputed", gateway: "PayPal", country: "CA", ts: "2024-12-15 14:07:14", card: "•••• 3782", ip: "172.56.98.101" },
  { id: "txn_5EfGhIj6KlMnOpQr", merchant: "TechFlow Ltd", amount: 2100.00, currency: "EUR", status: "succeeded", gateway: "Adyen", country: "NL", ts: "2024-12-15 14:04:59", card: "•••• 6011", ip: "213.73.122.8" },
  { id: "txn_9StUvWx0YzAbCdEf", merchant: "CloudCart Co", amount: 549.99, currency: "USD", status: "failed", gateway: "Stripe", country: "US", ts: "2024-12-15 14:02:38", card: "•••• 0004", ip: "50.116.18.174" },
  { id: "txn_3GhIjKl4MnOpQrSt", merchant: "NovaPay Systems", amount: 4800.00, currency: "GBP", status: "succeeded", gateway: "Braintree", country: "AU", ts: "2024-12-15 14:00:17", card: "•••• 5555", ip: "1.44.132.71" },
  { id: "txn_7UvWxYz8AbCdEfGh", merchant: "MegaStore EU", amount: 299.00, currency: "EUR", status: "succeeded", gateway: "Adyen", country: "ES", ts: "2024-12-15 13:58:44", card: "•••• 2222", ip: "77.109.8.14" },
  { id: "txn_2IjKlMn3OpQrStUv", merchant: "GlobalShop Inc", amount: 18900.00, currency: "USD", status: "pending", gateway: "Stripe", country: "SG", ts: "2024-12-15 13:55:30", card: "•••• 1234", ip: "103.28.251.9" },
];

const MERCHANTS = [
  { id: "mch_A1b2C3d4E5f6", name: "Acme Retail Corp", plan: "Enterprise", volume: 4200000, txns: 18240, status: "active", country: "US", joined: "2022-03-14", risk: "low" },
  { id: "mch_B2c3D4e5F6g7", name: "TechFlow Ltd", plan: "Growth", volume: 1890000, txns: 9400, status: "active", country: "DE", joined: "2022-09-07", risk: "low" },
  { id: "mch_C3d4E5f6G7h8", name: "GlobalShop Inc", plan: "Enterprise", volume: 7100000, txns: 31200, status: "active", country: "GB", joined: "2021-11-22", risk: "medium" },
  { id: "mch_D4e5F6g7H8i9", name: "NovaPay Systems", plan: "Growth", volume: 920000, txns: 4100, status: "active", country: "AU", joined: "2023-01-30", risk: "low" },
  { id: "mch_E5f6G7h8I9j0", name: "MegaStore EU", plan: "Starter", volume: 340000, txns: 2800, status: "suspended", country: "FR", joined: "2023-06-15", risk: "high" },
  { id: "mch_F6g7H8i9J0k1", name: "Quantum Pay Ltd", plan: "Growth", volume: 2100000, txns: 11300, status: "review", country: "CA", joined: "2023-04-08", risk: "medium" },
  { id: "mch_G7h8I9j0K1l2", name: "CloudCart Co", plan: "Starter", volume: 180000, txns: 1200, status: "active", country: "US", joined: "2024-02-20", risk: "low" },
];

const WEBHOOKS_DATA = [
  { id: "wh_1a2b3c4d", url: "https://api.acmecorp.com/webhooks/paygate", events: ["payment.succeeded", "payment.failed"], status: "active", lastDelivery: "2024-12-15 14:23:09", latency: "142ms", success: 99.8 },
  { id: "wh_5e6f7g8h", url: "https://hooks.techflow.io/payments", events: ["payment.succeeded", "refund.created"], status: "active", lastDelivery: "2024-12-15 14:21:35", latency: "89ms", success: 100.0 },
  { id: "wh_9i0j1k2l", url: "https://globalshop.net/api/events", events: ["payment.succeeded", "payment.failed", "dispute.created"], status: "failing", lastDelivery: "2024-12-15 13:44:01", latency: "5021ms", success: 71.2 },
  { id: "wh_3m4n5o6p", url: "https://novapay.com.au/callbacks", events: ["settlement.completed"], status: "active", lastDelivery: "2024-12-15 12:00:04", latency: "201ms", success: 98.4 },
];

const API_KEYS_DATA = [
  { id: "pk_live_1a2b3c4d5e6f7g8h9i0j", name: "Production — Server SDK", type: "secret", env: "live", created: "2024-09-01", lastUsed: "2 min ago", perms: ["read", "write", "refund"] },
  { id: "pk_live_9k8l7m6n5o4p3q2r1s0t", name: "Production — Webhook Signer", type: "restricted", env: "live", created: "2024-09-01", lastUsed: "14 min ago", perms: ["read"] },
  { id: "pk_test_Ab1Cd2Ef3Gh4Ij5Kl6Mn", name: "Staging — Integration Tests", type: "secret", env: "test", created: "2024-07-14", lastUsed: "3 hours ago", perms: ["read", "write", "refund"] },
  { id: "pk_test_Op7Qr8St9Uv0Wx1Yz2Ab", name: "Dev — Local Environment", type: "publishable", env: "test", created: "2024-11-03", lastUsed: "1 day ago", perms: ["read"] },
];

const SETTLEMENTS = [
  { id: "stl_1A2B3C4D", period: "2024-12-14", gross: 847200.00, fees: 16944.00, net: 830256.00, txns: 3841, status: "completed", bank: "••••7823", arrivalDate: "2024-12-16" },
  { id: "stl_5E6F7G8H", period: "2024-12-13", gross: 1124800.00, fees: 22496.00, net: 1102304.00, txns: 5102, status: "completed", bank: "••••7823", arrivalDate: "2024-12-15" },
  { id: "stl_9I0J1K2L", period: "2024-12-12", gross: 693400.00, fees: 13868.00, net: 679532.00, txns: 3142, status: "completed", bank: "••••7823", arrivalDate: "2024-12-14" },
  { id: "stl_3M4N5O6P", period: "2024-12-15", gross: 924100.00, fees: 18482.00, net: 905618.00, txns: 4198, status: "in-progress", bank: "••••7823", arrivalDate: "2024-12-17" },
  { id: "stl_7Q8R9S0T", period: "2024-12-16", gross: 0, fees: 0, net: 0, txns: 0, status: "scheduled", bank: "••••7823", arrivalDate: "2024-12-18" },
];

const FRAUD_ALERTS = [
  { id: "fra_1a2b3c", txnId: "txn_1PqRsT2UvWxYz3A", merchant: "MegaStore EU", amount: 4200.00, risk: 94, reason: "Velocity: 12 txns in 4 min from same IP", ts: "14:23:07", action: "blocked" },
  { id: "fra_4d5e6f", txnId: "txn_7UvWxYz8AbCdEfGh", merchant: "Quantum Pay Ltd", amount: 7650.00, risk: 87, reason: "Card not present + new device + proxy IP", ts: "14:21:33", action: "review" },
  { id: "fra_7g8h9i", txnId: "txn_2IjKlMn3OpQrStUv", merchant: "GlobalShop Inc", amount: 18900.00, risk: 78, reason: "Amount 340% above merchant avg", ts: "14:18:52", action: "review" },
  { id: "fra_0j1k2l", txnId: "txn_9StUvWx0YzAbCdEf", merchant: "CloudCart Co", amount: 549.99, risk: 61, reason: "Shipping/billing country mismatch", ts: "13:55:30", action: "flagged" },
  { id: "fra_3m4n5o", txnId: "txn_8CdEfGh9IjKlMnOp", merchant: "Acme Retail Corp", amount: 187.50, risk: 32, reason: "Minor: email domain < 48 hours old", ts: "13:44:01", action: "allowed" },
];

const REFUNDS = [
  { id: "ref_1a2b3c4d", txnId: "txn_2OpQrSt3UvWxYzAb", merchant: "MegaStore EU", amount: 3299.99, currency: "EUR", reason: "Customer request", status: "completed", requested: "2024-12-14 09:12:00", processed: "2024-12-14 09:14:22" },
  { id: "ref_5e6f7g8h", txnId: "txn_7BcDe8FgHiJkL9M", merchant: "TechFlow Ltd", amount: 459.99, currency: "EUR", reason: "Item not received", status: "pending", requested: "2024-12-15 11:30:00", processed: "—" },
  { id: "ref_9i0j1k2l", txnId: "txn_4NoPqRsT5UvWxYz", merchant: "GlobalShop Inc", amount: 200.00, currency: "USD", reason: "Partial refund - damaged item", status: "pending", requested: "2024-12-15 13:45:00", processed: "—" },
  { id: "ref_3m4n5o6p", txnId: "txn_6AbCd7EfGhIjKlMn", merchant: "NovaPay Systems", amount: 899.00, currency: "GBP", reason: "Duplicate charge", status: "completed", requested: "2024-12-13 16:00:00", processed: "2024-12-13 16:02:11" },
  { id: "ref_7q8r9s0t", txnId: "txn_1QrStUv2WxYzAbCd", merchant: "Quantum Pay Ltd", amount: 7650.00, currency: "USD", reason: "Fraud — chargeback pre-emption", status: "rejected", requested: "2024-12-12 08:00:00", processed: "2024-12-12 08:45:00" },
];

// ── Primitive UI ───────────────────────────────────────────────────────────────
function Badge({ status }: { status: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border uppercase tracking-wider", TXN_STATUS_BG[status] ?? "bg-muted text-muted-foreground border-border")}>
      <span className="size-1 rounded-full bg-current" />
      {status}
    </span>
  );
}

function RiskBadge({ score }: { score: number }) {
  const color = score >= 80 ? "text-[#EF4444] bg-[#EF4444]/10 border-[#EF4444]/20"
    : score >= 60 ? "text-[#F97316] bg-[#F97316]/10 border-[#F97316]/20"
    : score >= 40 ? "text-[#F59E0B] bg-[#F59E0B]/10 border-[#F59E0B]/20"
    : "text-[#10B981] bg-[#10B981]/10 border-[#10B981]/20";
  return <span className={cn("font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded border", color)}>{score}</span>;
}

function MerchantStatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20",
    suspended: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
    review: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
    onboarding: "bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20",
  };
  return <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border uppercase tracking-wider", map[status] ?? "bg-muted/50 text-muted-foreground border-border")}><span className="size-1 rounded-full bg-current" />{status}</span>;
}

function KPI({ label, value, delta, sub, icon: Icon }: { label: string; value: string; delta?: number; sub?: string; icon?: ComponentType<{ size?: number; className?: string }> }) {
  return (
    <div className="bg-card border border-border rounded p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">{label}</span>
        {Icon && <Icon size={14} className="text-muted-foreground" />}
      </div>
      <div className="flex items-end justify-between gap-2">
        <span className="text-xl font-semibold text-foreground tabular-nums">{value}</span>
        {delta !== undefined && (
          <span className={cn("flex items-center gap-0.5 text-[11px] font-medium", delta >= 0 ? "text-[#10B981]" : "text-[#EF4444]")}>
            {delta >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(delta).toFixed(1)}%
          </span>
        )}
      </div>
      {sub && <span className="text-[11px] text-muted-foreground">{sub}</span>}
    </div>
  );
}

function Th({ children, className }: { children: ReactNode; className?: string }) {
  return <th className={cn("px-3 py-2 text-left text-[10px] font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap border-b border-border", className)}>{children}</th>;
}

function Td({ children, mono, className }: { children: ReactNode; mono?: boolean; className?: string }) {
  return <td className={cn("px-3 py-2 text-sm border-b border-border/50", mono && "font-mono text-[11px]", className)}>{children}</td>;
}

function SectionCard({ title, children, action }: { title?: string; children: ReactNode; action?: ReactNode }) {
  return (
    <div className="bg-card border border-border rounded">
      {title && (
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
          <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{title}</span>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

function PageHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div>
        <h1 className="text-base font-semibold text-foreground">{title}</h1>
        {subtitle && <p className="text-[11px] text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

function Btn({ children, variant = "primary", onClick, className, size = "sm" }: {
  children: ReactNode; variant?: "primary" | "ghost" | "outline" | "danger";
  onClick?: () => void; className?: string; size?: "xs" | "sm";
}) {
  const base = "inline-flex items-center gap-1.5 font-medium rounded cursor-pointer transition-colors";
  const sizes = { xs: "px-2 py-1 text-[11px]", sm: "px-3 py-1.5 text-xs" };
  const vars = {
    primary: "bg-primary text-primary-foreground hover:bg-[#4F46E5]",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-muted/50",
    outline: "border border-border text-foreground hover:bg-muted/30",
    danger: "border border-[#EF4444]/30 text-[#EF4444] hover:bg-[#EF4444]/10",
  };
  return <button onClick={onClick} className={cn(base, sizes[size], vars[variant], className)}>{children}</button>;
}

function Input({ placeholder, value, onChange, icon: Icon, type = "text" }: {
  placeholder?: string; value?: string; onChange?: (v: string) => void;
  icon?: ComponentType<{ size?: number; className?: string }>; type?: string;
}) {
  return (
    <div className="relative flex items-center">
      {Icon && <Icon size={13} className="absolute left-2.5 text-muted-foreground pointer-events-none" />}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        className={cn("bg-secondary border border-border rounded text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors py-1.5", Icon ? "pl-8 pr-3" : "px-3", "w-full")}
      />
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; name: string; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded p-2.5 text-[11px] shadow-lg">
      <p className="text-muted-foreground mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <span className="size-1.5 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-muted-foreground capitalize">{p.name}:</span>
          <span className="font-mono font-medium text-foreground">${p.value}M</span>
        </div>
      ))}
    </div>
  );
};

// ── Sidebar ────────────────────────────────────────────────────────────────────
const NAV_SECTIONS = [
  {
    label: "Operations",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "payments", label: "Payments", icon: CreditCard },
      { id: "transactions", label: "Transactions", icon: List },
      { id: "refunds", label: "Refunds", icon: RotateCcw },
    ],
  },
  {
    label: "Configuration",
    items: [
      { id: "api-keys", label: "API Keys", icon: Key },
      { id: "webhooks", label: "Webhooks", icon: Radio },
      { id: "integrations", label: "Integrations", icon: Plug },
    ],
  },
  {
    label: "Finance",
    items: [
      { id: "settlements", label: "Settlements", icon: Landmark },
      { id: "reports", label: "Reports", icon: BarChart2 },
    ],
  },
  {
    label: "Risk",
    items: [{ id: "fraud", label: "Fraud Monitor", icon: ShieldAlert }],
  },
  {
    label: "Administration",
    items: [
      { id: "merchants", label: "Merchants", icon: Building },
      { id: "platform", label: "Platform", icon: Monitor },
    ],
  },
];

function Sidebar({ current, nav }: { current: Screen; nav: Nav }) {
  const activeGroup = NAV_SECTIONS.find(s => s.items.some(i => i.id === current || (current === "payment-detail" && i.id === "payments")));
  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] bg-secondary border-r border-border flex flex-col z-30 overflow-y-auto">
      {/* Logo */}
      <div className="px-4 py-3.5 border-b border-border flex items-center gap-2.5">
        <div className="size-6 bg-primary rounded flex items-center justify-center">
          <Zap size={13} className="text-white" />
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground tracking-tight">PayGate</div>
          <div className="text-[9px] text-muted-foreground font-mono uppercase tracking-widest">Infrastructure</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-3 space-y-4">
        {NAV_SECTIONS.map(section => (
          <div key={section.label}>
            <div className="px-2 mb-1 text-[9px] font-semibold text-muted-foreground uppercase tracking-widest">{section.label}</div>
            {section.items.map(item => {
              const isActive = current === item.id || (current === "payment-detail" && item.id === "payments");
              return (
                <button
                  key={item.id}
                  onClick={() => nav(item.id as Screen)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-2 py-1.5 rounded text-[12px] font-medium transition-colors cursor-pointer",
                    isActive
                      ? "bg-primary/15 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  )}
                >
                  <item.icon size={13} />
                  {item.label}
                  {item.id === "fraud" && (
                    <span className="ml-auto bg-[#EF4444] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">4</span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="border-t border-border px-3 py-3 flex items-center gap-2.5">
        <div className="size-6 rounded bg-primary/20 flex items-center justify-center text-[10px] font-semibold text-primary">JR</div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-medium text-foreground truncate">Jamie Rodriguez</div>
          <div className="text-[10px] text-muted-foreground truncate">admin@paygate.io</div>
        </div>
        <button className="text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          <LogOut size={13} />
        </button>
      </div>
    </aside>
  );
}

function TopBar({ title, subtitle }: { title: string; subtitle?: string }) {
  const [notifs, setNotifs] = useState(true);
  return (
    <header className="fixed left-[220px] right-0 top-0 h-11 bg-secondary border-b border-border flex items-center px-4 gap-3 z-20">
      <div className="flex-1 flex items-center gap-2">
        <div className="relative">
          <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search transactions, merchants..."
            className="bg-background/80 border border-border rounded pl-8 pr-3 py-1 text-[11px] text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors w-56"
          />
          <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-muted-foreground font-mono">⌘K</kbd>
        </div>
        <span className="text-[11px] text-muted-foreground">·</span>
        <span className="text-[11px] text-muted-foreground">{title}</span>
        {subtitle && <><ChevronRight size={11} className="text-muted-foreground" /><span className="text-[11px] text-foreground">{subtitle}</span></>}
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground border border-border/60 rounded px-2 py-1">
          <span className="size-1.5 rounded-full bg-[#10B981] animate-pulse" />
          All systems operational
        </div>
        <button onClick={() => setNotifs(v => !v)} className={cn("relative p-1.5 rounded transition-colors cursor-pointer", notifs ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
          <Bell size={14} />
          {notifs && <span className="absolute top-0.5 right-0.5 size-1.5 bg-primary rounded-full" />}
        </button>
        <div className="text-[10px] font-mono text-muted-foreground border border-border rounded px-2 py-1">v2.14.0</div>
      </div>
    </header>
  );
}

function AppShell({ current, nav, title, subtitle, children }: { current: Screen; nav: Nav; title: string; subtitle?: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background" style={{ fontFamily: "'Geist', -apple-system, sans-serif" }}>
      <Sidebar current={current} nav={nav} />
      <TopBar title={title} subtitle={subtitle} />
      <main className="ml-[220px] mt-11 p-5 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}

// ── AUTH SCREENS ───────────────────────────────────────────────────────────────
function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex" style={{ fontFamily: "'Geist', -apple-system, sans-serif" }}>
      {/* Left panel */}
      <div className="hidden lg:flex w-[420px] bg-secondary border-r border-border flex-col p-8 relative overflow-hidden">
        <div className="flex items-center gap-2.5 mb-12">
          <div className="size-7 bg-primary rounded flex items-center justify-center">
            <Zap size={14} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-foreground">PayGate</span>
          <span className="text-[10px] font-mono text-muted-foreground border border-border rounded px-1.5 py-0.5 ml-1">INFRASTRUCTURE</span>
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground leading-tight mb-2">Payment infrastructure<br />built for scale</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">Enterprise-grade payment processing, settlement automation, and fraud intelligence for platforms moving billions.</p>
          </div>
          <div className="space-y-3 pt-2">
            {[
              { icon: Shield, label: "PCI DSS Level 1 certified", sub: "SAQ-D attestation on file" },
              { icon: Zap, label: "99.999% uptime SLA", sub: "Multi-region active-active" },
              { icon: Globe, label: "180+ currencies & methods", sub: "Local acquiring in 47 markets" },
              { icon: Activity, label: "Real-time fraud scoring", sub: "<50ms ML inference p99" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="size-7 rounded border border-border bg-card flex items-center justify-center mt-0.5 shrink-0">
                  <Icon size={13} className="text-primary" />
                </div>
                <div>
                  <div className="text-xs font-medium text-foreground">{label}</div>
                  <div className="text-[11px] text-muted-foreground">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-auto pt-8 border-t border-border/50">
          <div className="text-[10px] text-muted-foreground">
            Processing <span className="font-mono text-foreground">$4.2B+</span> annually across <span className="font-mono text-foreground">180+</span> countries
          </div>
        </div>
        {/* decorative grid */}
        <div className="absolute bottom-0 right-0 w-48 h-48 opacity-[0.03]" style={{ backgroundImage: "repeating-linear-gradient(0deg,#fff 0,#fff 1px,transparent 0,transparent 24px),repeating-linear-gradient(90deg,#fff 0,#fff 1px,transparent 0,transparent 24px)" }} />
      </div>
      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[360px]">
          {children}
        </div>
      </div>
    </div>
  );
}

function LoginScreen({ nav }: { nav: Nav }) {
  const [email, setEmail] = useState("jamie@paygate.io");
  const [pass, setPass] = useState("••••••••••••");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); nav("dashboard"); }, 800);
  };

  return (
    <AuthShell>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-foreground mb-1">Sign in to your account</h1>
        <p className="text-xs text-muted-foreground">Enter your credentials to access the dashboard</p>
      </div>
      <div className="space-y-3">
        <div>
          <label className="text-[11px] font-medium text-muted-foreground block mb-1.5">Email address</label>
          <div className="relative">
            <Mail size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={email} onChange={e => setEmail(e.target.value)}
              className="w-full bg-secondary border border-border rounded pl-8 pr-3 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors"
              placeholder="you@company.com" />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-medium text-muted-foreground">Password</label>
            <button onClick={() => nav("recovery")} className="text-[11px] text-primary hover:text-[#818CF8] transition-colors cursor-pointer">Forgot password?</button>
          </div>
          <div className="relative">
            <Lock size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={pass} onChange={e => setPass(e.target.value)} type={showPass ? "text" : "password"}
              className="w-full bg-secondary border border-border rounded pl-8 pr-9 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors"
              placeholder="••••••••••••" />
            <button onClick={() => setShowPass(v => !v)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
              {showPass ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
        </div>
        <button onClick={handleLogin}
          className="w-full bg-primary hover:bg-[#4F46E5] text-white py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer mt-1">
          {loading ? <RefreshCw size={13} className="animate-spin" /> : null}
          {loading ? "Authenticating…" : "Sign in"}
        </button>
      </div>
      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[10px] text-muted-foreground">or continue with SSO</span>
          <div className="flex-1 h-px bg-border" />
        </div>
        <button className="w-full border border-border bg-secondary hover:bg-muted/20 text-foreground py-2 rounded text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer">
          <Globe size={13} className="text-muted-foreground" />
          SAML / OIDC Single Sign-On
        </button>
      </div>
      <div className="mt-5 text-center">
        <span className="text-[11px] text-muted-foreground">No account? </span>
        <button onClick={() => nav("register")} className="text-[11px] text-primary hover:text-[#818CF8] transition-colors cursor-pointer">Request access</button>
      </div>
      <div className="mt-6 flex items-center gap-1.5 text-[10px] text-muted-foreground">
        <Shield size={10} className="text-[#10B981]" />
        Protected by 256-bit TLS · SOC 2 Type II · ISO 27001
      </div>
    </AuthShell>
  );
}

function RegisterScreen({ nav }: { nav: Nav }) {
  return (
    <AuthShell>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-foreground mb-1">Create your account</h1>
        <p className="text-xs text-muted-foreground">Set up your PayGate merchant account</p>
      </div>
      <div className="space-y-3">
        {[
          { label: "Company legal name", placeholder: "Acme Corp Inc.", icon: Building },
          { label: "Business email", placeholder: "admin@company.com", icon: Mail },
          { label: "Full name", placeholder: "Jamie Rodriguez", icon: null },
        ].map(f => (
          <div key={f.label}>
            <label className="text-[11px] font-medium text-muted-foreground block mb-1.5">{f.label}</label>
            <div className="relative">
              {f.icon && <f.icon size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />}
              <input className={cn("w-full bg-secondary border border-border rounded py-2 text-sm text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground", f.icon ? "pl-8 pr-3" : "px-3")} placeholder={f.placeholder} />
            </div>
          </div>
        ))}
        <div>
          <label className="text-[11px] font-medium text-muted-foreground block mb-1.5">Password</label>
          <div className="relative">
            <Lock size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="password" placeholder="Min. 12 characters" className="w-full bg-secondary border border-border rounded pl-8 pr-3 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors placeholder:text-muted-foreground" />
          </div>
          <div className="mt-1.5 flex gap-1">
            {["Length", "Uppercase", "Number", "Symbol"].map((r, i) => (
              <div key={r} className={cn("flex-1 h-0.5 rounded-full", i < 2 ? "bg-primary" : "bg-border")} />
            ))}
          </div>
        </div>
        <div>
          <label className="text-[11px] font-medium text-muted-foreground block mb-1.5">Business type</label>
          <select className="w-full bg-secondary border border-border rounded px-3 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors cursor-pointer">
            <option>Platform / Marketplace</option>
            <option>SaaS / Software</option>
            <option>E-commerce</option>
            <option>Financial Services</option>
          </select>
        </div>
        <div className="flex items-start gap-2 pt-1">
          <div className="size-4 border border-border rounded bg-primary flex items-center justify-center mt-0.5 shrink-0 cursor-pointer">
            <Check size={10} className="text-white" />
          </div>
          <span className="text-[11px] text-muted-foreground">I agree to the <span className="text-primary cursor-pointer">Terms of Service</span> and <span className="text-primary cursor-pointer">Data Processing Agreement</span></span>
        </div>
        <button onClick={() => nav("dashboard")} className="w-full bg-primary hover:bg-[#4F46E5] text-white py-2 rounded text-sm font-medium transition-colors cursor-pointer">
          Create account
        </button>
      </div>
      <div className="mt-5 text-center">
        <span className="text-[11px] text-muted-foreground">Already have an account? </span>
        <button onClick={() => nav("login")} className="text-[11px] text-primary hover:text-[#818CF8] transition-colors cursor-pointer">Sign in</button>
      </div>
    </AuthShell>
  );
}

function RecoveryScreen({ nav }: { nav: Nav }) {
  const [sent, setSent] = useState(false);
  return (
    <AuthShell>
      <button onClick={() => nav("login")} className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors mb-6 cursor-pointer">
        <ArrowLeft size={12} /> Back to sign in
      </button>
      {!sent ? (
        <>
          <div className="mb-6">
            <h1 className="text-lg font-semibold text-foreground mb-1">Reset your password</h1>
            <p className="text-xs text-muted-foreground">Enter your email and we'll send a secure reset link</p>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] font-medium text-muted-foreground block mb-1.5">Email address</label>
              <div className="relative">
                <Mail size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input className="w-full bg-secondary border border-border rounded pl-8 pr-3 py-2 text-sm text-foreground outline-none focus:border-primary transition-colors" placeholder="you@company.com" />
              </div>
            </div>
            <button onClick={() => setSent(true)} className="w-full bg-primary hover:bg-[#4F46E5] text-white py-2 rounded text-sm font-medium transition-colors cursor-pointer">
              Send reset link
            </button>
          </div>
        </>
      ) : (
        <div className="text-center">
          <div className="size-12 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={20} className="text-[#10B981]" />
          </div>
          <h1 className="text-base font-semibold text-foreground mb-2">Check your email</h1>
          <p className="text-xs text-muted-foreground mb-4">We sent a reset link to <span className="text-foreground font-medium">jamie@paygate.io</span>. Valid for 15 minutes.</p>
          <button onClick={() => nav("login")} className="w-full border border-border text-foreground py-2 rounded text-sm font-medium hover:bg-muted/20 transition-colors cursor-pointer">Back to sign in</button>
        </div>
      )}
    </AuthShell>
  );
}

// ── DASHBOARD ─────────────────────────────────────────────────────────────────
function DashboardScreen({ nav }: { nav: Nav }) {
  return (
    <AppShell current="dashboard" nav={nav} title="Dashboard">
      <PageHeader title="Platform Overview" subtitle="Real-time · Refreshed 14s ago">
        <Btn variant="outline" size="xs"><Download size={11} />Export</Btn>
        <Btn size="xs"><RefreshCw size={11} />Refresh</Btn>
      </PageHeader>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        <KPI label="Gross Payment Volume" value="$84.1M" delta={12.4} sub="December MTD" icon={TrendingUp} />
        <KPI label="Net Revenue" value="$1.68M" delta={9.7} sub="After fees & refunds" icon={Landmark} />
        <KPI label="Success Rate" value="95.36%" delta={0.4} sub="↑ from 94.92% last month" icon={CheckCircle} />
        <KPI label="Failed Payments" value="3,891" delta={-8.2} sub="Declined this month" icon={XCircle} />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <KPI label="Pending Settlements" value="$2.1M" sub="2 batches pending" icon={Clock} />
        <KPI label="Active Merchants" value="247" delta={3.3} sub="18 onboarding" icon={Building} />
        <KPI label="Avg Transaction" value="$312.40" delta={1.8} sub="vs $306.80 last mo" icon={CreditCard} />
        <KPI label="Chargeback Rate" value="0.08%" sub="Threshold: 1.00%" icon={AlertTriangle} />
      </div>

      {/* Chart + breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-4">
        <SectionCard title="Payment Volume — Monthly (USD M)" action={
          <div className="flex gap-1">
            {["3M", "6M", "1Y"].map((v, i) => (
              <button key={v} className={cn("text-[10px] px-1.5 py-0.5 rounded cursor-pointer", i === 2 ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground")}>{v}</button>
            ))}
          </div>
        }>
          <div className="p-4 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={VOLUME_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366F1" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#6366F1" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="sucGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="d" tick={{ fontSize: 9, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="volume" name="volume" stroke="#6366F1" strokeWidth={1.5} fill="url(#volGrad)" dot={false} />
                <Area type="monotone" dataKey="success" name="success" stroke="#10B981" strokeWidth={1.5} fill="url(#sucGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="px-4 pb-3 flex gap-4">
            {[{ color: "#6366F1", label: "Total Volume" }, { color: "#10B981", label: "Succeeded" }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <span className="size-1.5 rounded-full" style={{ backgroundColor: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </SectionCard>

        <div className="space-y-3">
          <SectionCard title="Gateway Split">
            <div className="p-3 space-y-2.5">
              {[
                { name: "Stripe", volume: 51, color: "#6366F1" },
                { name: "Adyen", volume: 31, color: "#10B981" },
                { name: "Braintree", volume: 12, color: "#F59E0B" },
                { name: "PayPal", volume: 6, color: "#8B5CF6" },
              ].map(g => (
                <div key={g.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] text-foreground">{g.name}</span>
                    <span className="text-[11px] font-mono text-muted-foreground">{g.volume}%</span>
                  </div>
                  <div className="h-1 bg-border rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${g.volume}%`, backgroundColor: g.color }} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Status Breakdown">
            <div className="p-3 grid grid-cols-2 gap-2">
              {[
                { label: "Succeeded", val: "95.4%", color: "#10B981" },
                { label: "Failed", val: "4.6%", color: "#EF4444" },
                { label: "Pending", val: "0.3%", color: "#F59E0B" },
                { label: "Refunded", val: "1.1%", color: "#8B5CF6" },
              ].map(s => (
                <div key={s.label} className="bg-background/50 rounded p-2 border border-border/50">
                  <div className="text-base font-semibold font-mono" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-[10px] text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      {/* Recent Transactions */}
      <SectionCard title="Recent Transactions" action={
        <button onClick={() => nav("payments")} className="text-[11px] text-primary hover:text-[#818CF8] transition-colors flex items-center gap-1 cursor-pointer">
          View all <ChevronRight size={11} />
        </button>
      }>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background/30">
              <tr>
                <Th>Transaction ID</Th>
                <Th>Merchant</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Gateway</Th>
                <Th>Timestamp</Th>
                <Th className="w-8"></Th>
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.slice(0, 6).map(tx => (
                <tr key={tx.id} className="hover:bg-muted/10 transition-colors cursor-pointer" onClick={() => nav("payment-detail")}>
                  <Td mono><span className="text-primary">{tx.id}</span></Td>
                  <Td>{tx.merchant}</Td>
                  <Td mono className="text-right">{fmt.currency(tx.amount, tx.currency)}</Td>
                  <Td><Badge status={tx.status} /></Td>
                  <Td><span className="text-[11px] text-muted-foreground">{tx.gateway}</span></Td>
                  <Td mono className="text-muted-foreground">{tx.ts}</Td>
                  <Td><ChevronRight size={12} className="text-muted-foreground" /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </AppShell>
  );
}

// ── PAYMENTS ──────────────────────────────────────────────────────────────────
function PaymentsScreen({ nav }: { nav: Nav }) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const filtered = TRANSACTIONS.filter(t =>
    (statusFilter === "all" || t.status === statusFilter) &&
    (query === "" || t.id.includes(query) || t.merchant.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <AppShell current="payments" nav={nav} title="Payments">
      <PageHeader title="Payments" subtitle="All payment intents and charges">
        <Btn variant="outline" size="xs"><Filter size={11} />Filters</Btn>
        <Btn variant="outline" size="xs"><Download size={11} />Export CSV</Btn>
        <Btn size="xs"><Plus size={11} />New Payment</Btn>
      </PageHeader>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 max-w-xs">
          <Input placeholder="Search by ID, merchant, card…" value={query} onChange={setQuery} icon={Search} />
        </div>
        <div className="flex items-center gap-1 border border-border rounded overflow-hidden">
          {["all", "succeeded", "failed", "pending", "refunded"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={cn("px-2.5 py-1.5 text-[11px] font-medium capitalize cursor-pointer transition-colors", statusFilter === s ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/20")}>
              {s}
            </button>
          ))}
        </div>
        <select className="bg-secondary border border-border rounded px-2.5 py-1.5 text-[11px] text-foreground outline-none cursor-pointer">
          <option>All gateways</option>
          <option>Stripe</option>
          <option>Adyen</option>
          <option>Braintree</option>
        </select>
      </div>

      <SectionCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background/30 sticky top-0">
              <tr>
                <Th>Transaction ID</Th>
                <Th>Merchant</Th>
                <Th>Amount</Th>
                <Th>Currency</Th>
                <Th>Status</Th>
                <Th>Gateway</Th>
                <Th>Country</Th>
                <Th>Timestamp</Th>
                <Th className="w-8"></Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(tx => (
                <tr key={tx.id} className="hover:bg-muted/10 transition-colors cursor-pointer" onClick={() => nav("payment-detail")}>
                  <Td mono><span className="text-primary hover:text-[#818CF8]">{tx.id}</span></Td>
                  <Td><span className="text-foreground text-xs">{tx.merchant}</span></Td>
                  <Td mono className="text-right font-medium">{fmt.currency(tx.amount, tx.currency)}</Td>
                  <Td mono className="text-muted-foreground">{tx.currency}</Td>
                  <Td><Badge status={tx.status} /></Td>
                  <Td><span className="text-[11px] text-muted-foreground">{tx.gateway}</span></Td>
                  <Td mono className="text-muted-foreground">{tx.country}</Td>
                  <Td mono className="text-muted-foreground text-[10px]">{tx.ts}</Td>
                  <Td><MoreHorizontal size={13} className="text-muted-foreground" /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-2.5 border-t border-border flex items-center justify-between">
          <span className="text-[11px] text-muted-foreground">Showing {filtered.length} of {TRANSACTIONS.length} transactions</span>
          <div className="flex gap-1">
            {[1, 2, 3, "...", 48].map((p, i) => (
              <button key={i} className={cn("size-6 rounded text-[11px] font-medium cursor-pointer", p === 1 ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted/30")}>{p}</button>
            ))}
          </div>
        </div>
      </SectionCard>
    </AppShell>
  );
}

// ── PAYMENT DETAIL ────────────────────────────────────────────────────────────
function PaymentDetailScreen({ nav }: { nav: Nav }) {
  const tx = TRANSACTIONS[0];
  return (
    <AppShell current="payments" nav={nav} title="Payments" subtitle={tx.id}>
      <div className="mb-4 flex items-center gap-2">
        <button onClick={() => nav("payments")} className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
          <ArrowLeft size={12} /> Back to Payments
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {/* Main details */}
        <div className="lg:col-span-2 space-y-3">
          <SectionCard title="Transaction Details">
            <div className="p-4 grid grid-cols-2 gap-x-8 gap-y-3">
              {[
                { label: "Transaction ID", value: tx.id, mono: true, highlight: true },
                { label: "Status", value: <Badge status={tx.status} /> },
                { label: "Amount", value: fmt.currency(tx.amount, tx.currency), mono: true },
                { label: "Currency", value: tx.currency, mono: true },
                { label: "Merchant", value: tx.merchant },
                { label: "Gateway", value: tx.gateway },
                { label: "Payment Method", value: tx.card, mono: true },
                { label: "Country", value: tx.country },
                { label: "IP Address", value: tx.ip, mono: true },
                { label: "Timestamp", value: tx.ts, mono: true },
              ].map(row => (
                <div key={row.label}>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{row.label}</div>
                  <div className={cn("text-xs flex items-center gap-1.5", row.mono && "font-mono", row.highlight && "text-primary")}>
                    {row.value}
                    {row.mono && typeof row.value === "string" && <Copy size={10} className="text-muted-foreground hover:text-foreground cursor-pointer" />}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Processing Timeline">
            <div className="p-4 space-y-0">
              {[
                { label: "Payment initiated", sub: "Customer submitted checkout form", ts: "14:23:05.841", icon: CreditCard, done: true },
                { label: "Fraud score computed", sub: "Risk: 12/100 — Passed", ts: "14:23:05.894", icon: Shield, done: true },
                { label: "Gateway routing", sub: "Selected: Stripe (primary)", ts: "14:23:05.901", icon: Zap, done: true },
                { label: "Authorisation request", sub: "Sent to card network", ts: "14:23:06.104", icon: Globe, done: true },
                { label: "Authorisation approved", sub: "Visa approved — Auth code: A82KL1", ts: "14:23:06.287", icon: CheckCircle, done: true },
                { label: "Capture confirmed", sub: "Funds captured successfully", ts: "14:23:07.003", icon: Check, done: true },
                { label: "Webhook dispatched", sub: "payment.succeeded → acmecorp.com", ts: "14:23:07.119", icon: Radio, done: true },
              ].map((step, i, arr) => (
                <div key={step.label} className="flex gap-3 relative">
                  <div className="flex flex-col items-center">
                    <div className={cn("size-5 rounded border flex items-center justify-center shrink-0", step.done ? "bg-[#10B981]/10 border-[#10B981]/30" : "bg-border/50 border-border")}>
                      <step.icon size={10} className={step.done ? "text-[#10B981]" : "text-muted-foreground"} />
                    </div>
                    {i < arr.length - 1 && <div className="w-px flex-1 bg-border my-1 min-h-[16px]" />}
                  </div>
                  <div className="pb-3 flex-1 flex items-start justify-between gap-4">
                    <div>
                      <div className="text-xs font-medium text-foreground">{step.label}</div>
                      <div className="text-[10px] text-muted-foreground">{step.sub}</div>
                    </div>
                    <span className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">{step.ts}</span>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Raw API Response">
            <div className="p-3 font-mono text-[10px] text-[#10B981] bg-background/50 rounded-b leading-relaxed overflow-x-auto">
              <pre>{`{
  "id": "${tx.id}",
  "object": "payment_intent",
  "amount": ${tx.amount * 100},
  "currency": "${tx.currency.toLowerCase()}",
  "status": "${tx.status}",
  "capture_method": "automatic",
  "payment_method": "pm_card_visa",
  "created": 1734262987,
  "gateway": {
    "name": "${tx.gateway}",
    "auth_code": "A82KL1",
    "network_tx_id": "NET_TXN_38291847",
    "response_code": "00"
  },
  "risk": { "score": 12, "level": "low" },
  "metadata": { "merchant_id": "mch_A1b2C3d4E5f6" }
}`}</pre>
            </div>
          </SectionCard>
        </div>

        {/* Side panel */}
        <div className="space-y-3">
          <SectionCard title="Actions">
            <div className="p-3 space-y-2">
              <Btn variant="outline" className="w-full justify-center"><RotateCcw size={11} />Issue Refund</Btn>
              <Btn variant="outline" className="w-full justify-center"><Copy size={11} />Copy Details</Btn>
              <Btn variant="outline" className="w-full justify-center"><Download size={11} />Download Receipt</Btn>
              <Btn variant="danger" className="w-full justify-center"><AlertTriangle size={11} />Flag for Review</Btn>
            </div>
          </SectionCard>
          <SectionCard title="Risk Assessment">
            <div className="p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">Risk Score</span>
                <RiskBadge score={12} />
              </div>
              <div className="h-1.5 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-[#10B981] rounded-full" style={{ width: "12%" }} />
              </div>
              {[
                { label: "Velocity check", pass: true },
                { label: "IP reputation", pass: true },
                { label: "Device fingerprint", pass: true },
                { label: "Address verification", pass: true },
                { label: "3D Secure", pass: true },
              ].map(r => (
                <div key={r.label} className="flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground">{r.label}</span>
                  <span className={cn("text-[10px] font-medium", r.pass ? "text-[#10B981]" : "text-[#EF4444]")}>
                    {r.pass ? "✓ Pass" : "✗ Fail"}
                  </span>
                </div>
              ))}
            </div>
          </SectionCard>
          <SectionCard title="Merchant">
            <div className="p-3 space-y-1.5">
              <div className="text-xs font-medium text-foreground">{tx.merchant}</div>
              <div className="font-mono text-[10px] text-muted-foreground">mch_A1b2C3d4E5f6</div>
              <div className="text-[11px] text-muted-foreground pt-1">Enterprise · US · Since 2022-03-14</div>
              <button onClick={() => nav("merchants")} className="text-[11px] text-primary hover:text-[#818CF8] transition-colors flex items-center gap-1 pt-1 cursor-pointer">
                View merchant <ChevronRight size={11} />
              </button>
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}

// ── TRANSACTIONS ──────────────────────────────────────────────────────────────
function TransactionsScreen({ nav }: { nav: Nav }) {
  return (
    <AppShell current="transactions" nav={nav} title="Transactions">
      <PageHeader title="Transaction History" subtitle="Complete ledger with filtering and search">
        <Btn variant="outline" size="xs"><Download size={11} />Export</Btn>
      </PageHeader>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1.5 border border-border rounded px-2.5 py-1.5 text-[11px] text-muted-foreground bg-secondary cursor-pointer">
          <Clock size={11} />
          Dec 1 – Dec 15, 2024
          <ChevronDown size={11} />
        </div>
        <Input placeholder="Search transactions…" icon={Search} />
        <select className="bg-secondary border border-border rounded px-2.5 py-1.5 text-[11px] text-foreground outline-none cursor-pointer">
          <option>All merchants</option>
          {MERCHANTS.map(m => <option key={m.id}>{m.name}</option>)}
        </select>
        <select className="bg-secondary border border-border rounded px-2.5 py-1.5 text-[11px] text-foreground outline-none cursor-pointer">
          <option>All currencies</option>
          <option>USD</option>
          <option>EUR</option>
          <option>GBP</option>
        </select>
      </div>
      <div className="grid grid-cols-4 gap-3 mb-3">
        {[
          { label: "Total Volume", value: "$84.1M", icon: TrendingUp },
          { label: "Transactions", value: "268,421", icon: Hash },
          { label: "Avg Value", value: "$312.40", icon: Activity },
          { label: "Refund Rate", value: "1.18%", icon: RotateCcw },
        ].map(k => <KPI key={k.label} label={k.label} value={k.value} icon={k.icon} />)}
      </div>
      <SectionCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background/30 sticky top-0">
              <tr>
                <Th>Transaction ID</Th>
                <Th>Merchant</Th>
                <Th>Amount</Th>
                <Th>Currency</Th>
                <Th>Status</Th>
                <Th>Gateway</Th>
                <Th>Card</Th>
                <Th>IP</Th>
                <Th>Timestamp</Th>
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map(tx => (
                <tr key={tx.id} className="hover:bg-muted/10 cursor-pointer" onClick={() => nav("payment-detail")}>
                  <Td mono><span className="text-primary">{tx.id}</span></Td>
                  <Td className="text-xs">{tx.merchant}</Td>
                  <Td mono className="text-right">{fmt.currency(tx.amount, tx.currency)}</Td>
                  <Td mono className="text-muted-foreground">{tx.currency}</Td>
                  <Td><Badge status={tx.status} /></Td>
                  <Td className="text-[11px] text-muted-foreground">{tx.gateway}</Td>
                  <Td mono className="text-muted-foreground">{tx.card}</Td>
                  <Td mono className="text-muted-foreground text-[10px]">{tx.ip}</Td>
                  <Td mono className="text-muted-foreground text-[10px]">{tx.ts}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </AppShell>
  );
}

// ── REFUNDS ───────────────────────────────────────────────────────────────────
function RefundsScreen({ nav }: { nav: Nav }) {
  const [refunds, setRefunds] = useState(REFUNDS);
  const approve = (id: string) => setRefunds(r => r.map(x => x.id === id ? { ...x, status: "completed", processed: new Date().toISOString().replace("T", " ").slice(0, 19) } : x));
  const reject = (id: string) => setRefunds(r => r.map(x => x.id === id ? { ...x, status: "rejected", processed: new Date().toISOString().replace("T", " ").slice(0, 19) } : x));

  const statusBg: Record<string, string> = {
    completed: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20",
    pending: "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
    rejected: "bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20",
  };

  return (
    <AppShell current="refunds" nav={nav} title="Refunds">
      <PageHeader title="Refund Management" subtitle="Review and process refund requests">
        <Btn size="xs"><Plus size={11} />Manual Refund</Btn>
      </PageHeader>
      <div className="grid grid-cols-4 gap-3 mb-4">
        <KPI label="Pending Review" value="2" sub="Require action" icon={Clock} />
        <KPI label="Processed Today" value="$4,198.99" sub="3 refunds" icon={CheckCircle} />
        <KPI label="Rejection Rate" value="12.5%" sub="This month" icon={XCircle} />
        <KPI label="Avg Resolution" value="2m 18s" sub="Last 30 days" icon={Zap} />
      </div>
      <SectionCard title="Refund Queue">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background/30">
              <tr>
                <Th>Refund ID</Th>
                <Th>Transaction</Th>
                <Th>Merchant</Th>
                <Th>Amount</Th>
                <Th>Reason</Th>
                <Th>Status</Th>
                <Th>Requested</Th>
                <Th>Processed</Th>
                <Th>Actions</Th>
              </tr>
            </thead>
            <tbody>
              {refunds.map(r => (
                <tr key={r.id} className="hover:bg-muted/10">
                  <Td mono><span className="text-primary text-[10px]">{r.id}</span></Td>
                  <Td mono><span className="text-muted-foreground text-[10px]">{r.txnId.slice(0, 18)}…</span></Td>
                  <Td className="text-xs">{r.merchant}</Td>
                  <Td mono className="text-right font-medium">{fmt.currency(r.amount, r.currency)}</Td>
                  <Td className="text-[11px] text-muted-foreground max-w-[180px] truncate">{r.reason}</Td>
                  <Td>
                    <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border uppercase tracking-wider", statusBg[r.status] ?? "bg-muted text-muted-foreground border-border")}>
                      <span className="size-1 rounded-full bg-current" />{r.status}
                    </span>
                  </Td>
                  <Td mono className="text-muted-foreground text-[10px]">{r.requested.slice(0, 16)}</Td>
                  <Td mono className="text-muted-foreground text-[10px]">{r.processed === "—" ? "—" : r.processed.slice(0, 16)}</Td>
                  <Td>
                    {r.status === "pending" ? (
                      <div className="flex gap-1">
                        <button onClick={() => approve(r.id)} className="px-2 py-0.5 text-[10px] rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20 hover:bg-[#10B981]/20 transition-colors cursor-pointer">Approve</button>
                        <button onClick={() => reject(r.id)} className="px-2 py-0.5 text-[10px] rounded bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20 hover:bg-[#EF4444]/20 transition-colors cursor-pointer">Reject</button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-muted-foreground">—</span>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </AppShell>
  );
}

// ── API KEYS ──────────────────────────────────────────────────────────────────
function APIKeysScreen({ nav }: { nav: Nav }) {
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setVisible(v => ({ ...v, [id]: !v[id] }));

  return (
    <AppShell current="api-keys" nav={nav} title="API Keys">
      <PageHeader title="API Keys" subtitle="Manage authentication credentials for gateway access">
        <Btn size="xs"><Plus size={11} />Create Key</Btn>
      </PageHeader>

      <div className="grid grid-cols-3 gap-3 mb-4">
        {[
          { label: "Live Keys", value: "2", sub: "Active in production" },
          { label: "Test Keys", value: "2", sub: "Sandbox environment" },
          { label: "API Calls (24h)", value: "1.2M", sub: "Peak: 89k/min" },
        ].map(k => <KPI key={k.label} label={k.label} value={k.value} sub={k.sub} />)}
      </div>

      <div className="space-y-3">
        {API_KEYS_DATA.map(key => (
          <SectionCard key={key.id}>
            <div className="p-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-foreground">{key.name}</span>
                    <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-widest border", key.env === "live" ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20" : "bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20")}>
                      {key.env}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded border border-border text-muted-foreground uppercase tracking-wider">{key.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="font-mono text-[11px] text-muted-foreground bg-background/50 px-2 py-0.5 rounded border border-border/50">
                      {visible[key.id] ? key.id : key.id.slice(0, 12) + "••••••••••••••••••••••••••••"}
                    </code>
                    <button onClick={() => toggle(key.id)} className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors">{visible[key.id] ? <EyeOff size={12} /> : <Eye size={12} />}</button>
                    <button className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors"><Copy size={12} /></button>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <Btn variant="outline" size="xs"><RefreshCw size={10} />Rotate</Btn>
                  <Btn variant="danger" size="xs"><X size={10} />Revoke</Btn>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 pt-3 border-t border-border/50">
                <div>
                  <div className="text-[10px] text-muted-foreground mb-0.5">Created</div>
                  <div className="text-[11px] font-mono text-foreground">{key.created}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground mb-0.5">Last used</div>
                  <div className="text-[11px] text-foreground">{key.lastUsed}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground mb-0.5">Permissions</div>
                  <div className="flex gap-1 flex-wrap">
                    {key.perms.map(p => (
                      <span key={p} className="text-[9px] px-1.5 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded">{p}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground mb-0.5">Status</div>
                  <span className="text-[10px] flex items-center gap-1 text-[#10B981]"><span className="size-1.5 rounded-full bg-[#10B981]" />Active</span>
                </div>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>

      <div className="mt-4">
        <SectionCard title="Rate Limits & Usage">
          <div className="p-4 grid grid-cols-3 gap-4">
            {[
              { label: "Requests / second", used: 340, max: 1000, unit: "req/s" },
              { label: "Requests / minute", used: 18400, max: 60000, unit: "req/min" },
              { label: "Requests / day", used: 1200000, max: 5000000, unit: "req/day" },
            ].map(r => (
              <div key={r.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] text-muted-foreground">{r.label}</span>
                  <span className="font-mono text-[11px] text-foreground">{fmt.number(r.used)} / {fmt.number(r.max)}</span>
                </div>
                <div className="h-1 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${(r.used / r.max) * 100}%` }} />
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">{((r.used / r.max) * 100).toFixed(1)}% utilisation</div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}

// ── WEBHOOKS ──────────────────────────────────────────────────────────────────
function WebhooksScreen({ nav }: { nav: Nav }) {
  return (
    <AppShell current="webhooks" nav={nav} title="Webhooks">
      <PageHeader title="Webhooks" subtitle="Event endpoints and delivery logs">
        <Btn size="xs"><Plus size={11} />Add Endpoint</Btn>
      </PageHeader>

      <div className="space-y-3 mb-4">
        {WEBHOOKS_DATA.map(wh => (
          <SectionCard key={wh.id}>
            <div className="p-4">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn("size-2 rounded-full", wh.status === "active" ? "bg-[#10B981]" : "bg-[#EF4444]")} />
                    <code className="font-mono text-xs text-foreground">{wh.url}</code>
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {wh.events.map(e => (
                      <span key={e} className="font-mono text-[9px] bg-primary/10 text-primary border border-primary/20 rounded px-1.5 py-0.5">{e}</span>
                    ))}
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <Btn variant="outline" size="xs"><Zap size={10} />Test</Btn>
                  <Btn variant="outline" size="xs"><Settings size={10} />Edit</Btn>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-3 pt-3 border-t border-border/50">
                <div>
                  <div className="text-[10px] text-muted-foreground mb-0.5">ID</div>
                  <div className="font-mono text-[10px] text-muted-foreground">{wh.id}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground mb-0.5">Last delivery</div>
                  <div className="font-mono text-[10px] text-foreground">{wh.lastDelivery}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground mb-0.5">Avg latency</div>
                  <div className={cn("text-[11px] font-mono", parseInt(wh.latency) > 1000 ? "text-[#EF4444]" : "text-foreground")}>{wh.latency}</div>
                </div>
                <div>
                  <div className="text-[10px] text-muted-foreground mb-0.5">Success rate</div>
                  <div className={cn("text-[11px] font-mono font-medium", wh.success === 100 ? "text-[#10B981]" : wh.success >= 90 ? "text-[#F59E0B]" : "text-[#EF4444]")}>{wh.success}%</div>
                </div>
              </div>
            </div>
          </SectionCard>
        ))}
      </div>

      <SectionCard title="Recent Delivery Log">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background/30">
              <tr>
                <Th>Delivery ID</Th>
                <Th>Event</Th>
                <Th>Endpoint</Th>
                <Th>Status</Th>
                <Th>HTTP</Th>
                <Th>Latency</Th>
                <Th>Timestamp</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "dlv_1a2b3c", event: "payment.succeeded", url: "api.acmecorp.com", status: "delivered", code: 200, ms: 142, ts: "14:23:09" },
                { id: "dlv_4d5e6f", event: "payment.succeeded", url: "hooks.techflow.io", status: "delivered", code: 200, ms: 89, ts: "14:21:35" },
                { id: "dlv_7g8h9i", event: "payment.failed", url: "globalshop.net", status: "failed", code: 503, ms: 5021, ts: "13:44:01" },
                { id: "dlv_0j1k2l", event: "payment.failed", url: "globalshop.net", status: "retrying", code: 500, ms: 4998, ts: "13:34:01" },
                { id: "dlv_3m4n5o", event: "settlement.completed", url: "novapay.com.au", status: "delivered", code: 200, ms: 201, ts: "12:00:04" },
              ].map(d => (
                <tr key={d.id} className="hover:bg-muted/10">
                  <Td mono className="text-[10px] text-primary">{d.id}</Td>
                  <Td mono className="text-[10px]">{d.event}</Td>
                  <Td className="text-[11px] text-muted-foreground">{d.url}</Td>
                  <Td>
                    <span className={cn("text-[10px] font-medium", d.status === "delivered" ? "text-[#10B981]" : d.status === "retrying" ? "text-[#F59E0B]" : "text-[#EF4444]")}>
                      {d.status}
                    </span>
                  </Td>
                  <Td mono className={cn("text-[11px]", d.code === 200 ? "text-[#10B981]" : "text-[#EF4444]")}>{d.code}</Td>
                  <Td mono className={cn("text-[11px]", d.ms > 1000 ? "text-[#EF4444]" : "text-muted-foreground")}>{d.ms}ms</Td>
                  <Td mono className="text-muted-foreground text-[10px]">{d.ts}</Td>
                  <Td><button className="text-[10px] text-primary hover:text-[#818CF8] cursor-pointer">View →</button></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </AppShell>
  );
}

// ── INTEGRATIONS ──────────────────────────────────────────────────────────────
function IntegrationsScreen({ nav }: { nav: Nav }) {
  const integrations = [
    { name: "Stripe", category: "Gateway", status: "connected", version: "v3.1.0", desc: "Primary payment processor for card-not-present transactions", logo: "S" },
    { name: "Adyen", category: "Gateway", status: "connected", version: "v2.8.4", desc: "European acquiring with local payment methods", logo: "A" },
    { name: "Braintree", category: "Gateway", status: "connected", version: "v1.4.2", desc: "PayPal ecosystem and Venmo integration", logo: "B" },
    { name: "Plaid", category: "Banking", status: "connected", version: "v5.0.1", desc: "Bank account verification and ACH initiation", logo: "P" },
    { name: "Marqeta", category: "Issuing", status: "connected", version: "v2.0.0", desc: "Virtual and physical card issuing program", logo: "M" },
    { name: "Sardine", category: "Fraud", status: "connected", version: "v1.9.3", desc: "Device intelligence and behavioral biometrics", logo: "Sa" },
    { name: "Salesforce", category: "CRM", status: "available", version: null, desc: "Sync merchant data and transaction events to CRM", logo: "SF" },
    { name: "Snowflake", category: "Analytics", status: "available", version: null, desc: "Bulk export to data warehouse for BI workloads", logo: "Sn" },
    { name: "PagerDuty", category: "Ops", status: "available", version: null, desc: "Incident routing for payment system alerts", logo: "PD" },
  ];

  return (
    <AppShell current="integrations" nav={nav} title="Integrations">
      <PageHeader title="Integrations" subtitle="Connected services and available plugins">
        <Btn variant="outline" size="xs"><Search size={11} />Browse catalog</Btn>
      </PageHeader>

      <div className="grid grid-cols-2 gap-2 mb-2">
        <span className="text-[11px] font-medium text-foreground">Connected ({integrations.filter(i => i.status === "connected").length})</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-5">
        {integrations.filter(i => i.status === "connected").map(int => (
          <div key={int.name} className="bg-card border border-border rounded p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded border border-border bg-secondary flex items-center justify-center font-mono text-[11px] font-semibold text-foreground">{int.logo}</div>
                <div>
                  <div className="text-xs font-medium text-foreground">{int.name}</div>
                  <div className="text-[10px] text-muted-foreground">{int.category}</div>
                </div>
              </div>
              <span className="flex items-center gap-1 text-[10px] text-[#10B981]"><span className="size-1.5 rounded-full bg-[#10B981]" />Connected</span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{int.desc}</p>
            <div className="flex items-center justify-between pt-1 border-t border-border/50">
              <code className="font-mono text-[10px] text-muted-foreground">{int.version}</code>
              <div className="flex gap-1.5">
                <Btn variant="ghost" size="xs"><Settings size={10} /></Btn>
                <Btn variant="outline" size="xs">Configure</Btn>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-2 text-[11px] font-medium text-foreground">Available ({integrations.filter(i => i.status === "available").length})</div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        {integrations.filter(i => i.status === "available").map(int => (
          <div key={int.name} className="bg-card border border-border/50 rounded p-4 flex flex-col gap-3 opacity-70">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded border border-border bg-secondary flex items-center justify-center font-mono text-[11px] font-semibold text-muted-foreground">{int.logo}</div>
                <div>
                  <div className="text-xs font-medium text-muted-foreground">{int.name}</div>
                  <div className="text-[10px] text-muted-foreground">{int.category}</div>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">{int.desc}</p>
            <Btn variant="outline" size="xs" className="self-start"><Plus size={10} />Connect</Btn>
          </div>
        ))}
      </div>
    </AppShell>
  );
}

// ── SETTLEMENTS ───────────────────────────────────────────────────────────────
function SettlementsScreen({ nav }: { nav: Nav }) {
  const settleBg: Record<string, string> = {
    completed: "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20",
    "in-progress": "bg-[#6366F1]/10 text-[#6366F1] border-[#6366F1]/20",
    scheduled: "bg-[#6B7280]/10 text-[#6B7280] border-[#6B7280]/20",
  };

  return (
    <AppShell current="settlements" nav={nav} title="Settlements">
      <PageHeader title="Settlements" subtitle="Daily settlement batches and bank transfers">
        <Btn variant="outline" size="xs"><Download size={11} />Export</Btn>
      </PageHeader>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <KPI label="Total Settled (MTD)" value="$24.1M" delta={8.4} sub="Dec 1–15" icon={Landmark} />
        <KPI label="Pending Transfer" value="$2.1M" sub="Arrives Dec 17–18" icon={Clock} />
        <KPI label="Avg Settlement Time" value="T+1.4" sub="Days to bank" icon={Activity} />
        <KPI label="Platform Fee Rate" value="2.0%" sub="Blended rate" icon={TrendingUp} />
      </div>

      <SectionCard title="Settlement Batches">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background/30">
              <tr>
                <Th>Settlement ID</Th>
                <Th>Period</Th>
                <Th>Transactions</Th>
                <Th>Gross Volume</Th>
                <Th>Platform Fees</Th>
                <Th>Net Payout</Th>
                <Th>Bank Account</Th>
                <Th>Status</Th>
                <Th>Arrival Date</Th>
              </tr>
            </thead>
            <tbody>
              {SETTLEMENTS.map(s => (
                <tr key={s.id} className="hover:bg-muted/10 cursor-pointer">
                  <Td mono className="text-primary text-[10px]">{s.id}</Td>
                  <Td mono className="text-muted-foreground">{s.period}</Td>
                  <Td mono className="text-right">{s.txns > 0 ? fmt.number(s.txns) : "—"}</Td>
                  <Td mono className="text-right font-medium">{s.gross > 0 ? fmt.currency(s.gross) : "—"}</Td>
                  <Td mono className="text-right text-[#EF4444]">{s.fees > 0 ? `-${fmt.currency(s.fees)}` : "—"}</Td>
                  <Td mono className="text-right text-[#10B981] font-medium">{s.net > 0 ? fmt.currency(s.net) : "—"}</Td>
                  <Td mono className="text-muted-foreground">{s.bank}</Td>
                  <Td>
                    <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border uppercase tracking-wider", settleBg[s.status])}>
                      <span className="size-1 rounded-full bg-current" />{s.status}
                    </span>
                  </Td>
                  <Td mono className="text-muted-foreground">{s.arrivalDate}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <SectionCard title="Settlement Schedule">
          <div className="p-3 space-y-2">
            {[
              { label: "Frequency", value: "Daily (T+1 business days)" },
              { label: "Cutoff time", value: "23:00 UTC" },
              { label: "Bank account", value: "Chase ••••7823" },
              { label: "Currency", value: "USD (auto-convert enabled)" },
              { label: "Min settlement", value: "$500.00" },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">{r.label}</span>
                <span className="text-[11px] font-mono text-foreground">{r.value}</span>
              </div>
            ))}
          </div>
        </SectionCard>
        <SectionCard title="Fee Structure">
          <div className="p-3 space-y-2">
            {[
              { label: "Processing fee", value: "1.8% + $0.25" },
              { label: "Refund fee", value: "$0.25 (retained)" },
              { label: "Chargeback fee", value: "$15.00" },
              { label: "FX markup", value: "1.0% above interbank" },
              { label: "Monthly platform", value: "$2,500" },
            ].map(r => (
              <div key={r.label} className="flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">{r.label}</span>
                <span className="text-[11px] font-mono text-foreground">{r.value}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </AppShell>
  );
}

// ── REPORTS ───────────────────────────────────────────────────────────────────
function ReportsScreen({ nav }: { nav: Nav }) {
  return (
    <AppShell current="reports" nav={nav} title="Reports">
      <PageHeader title="Reports & Analytics" subtitle="Financial performance and operational metrics">
        <Btn variant="outline" size="xs"><Filter size={11} />Date Range</Btn>
        <Btn variant="outline" size="xs"><Download size={11} />Export PDF</Btn>
        <Btn size="xs"><Download size={11} />Export CSV</Btn>
      </PageHeader>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <KPI label="Total Revenue" value="$84.1M" delta={12.4} sub="2024 YTD" icon={TrendingUp} />
        <KPI label="Net Revenue" value="$20.2M" delta={9.1} sub="After fees" icon={Landmark} />
        <KPI label="Transactions" value="268,421" delta={15.7} sub="YTD volume" icon={Hash} />
        <KPI label="Avg Success Rate" value="95.4%" delta={0.6} sub="vs 94.8% prior yr" icon={Activity} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <SectionCard title="Monthly Payment Volume (USD M)">
          <div className="p-4 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VOLUME_DATA} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="d" tick={{ fontSize: 9, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: 4, fontSize: 11 }} />
                <Bar dataKey="success" name="Succeeded" fill="#6366F1" radius={[2, 2, 0, 0]} />
                <Bar dataKey="failed" name="Failed" fill="#EF4444" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Success Rate Trend">
          <div className="p-4 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={VOLUME_DATA.map(d => ({ ...d, rate: ((d.success / d.volume) * 100) }))} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="d" tick={{ fontSize: 9, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <YAxis domain={[92, 100]} tick={{ fontSize: 9, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: 4, fontSize: 11 }} />
                <Line type="monotone" dataKey="rate" name="Success %" stroke="#10B981" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Top Merchants by Volume">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background/30">
              <tr>
                <Th>Rank</Th>
                <Th>Merchant</Th>
                <Th>Volume</Th>
                <Th>Transactions</Th>
                <Th>Avg Ticket</Th>
                <Th>Success Rate</Th>
                <Th>Revenue</Th>
              </tr>
            </thead>
            <tbody>
              {MERCHANTS.sort((a, b) => b.volume - a.volume).map((m, i) => (
                <tr key={m.id} className="hover:bg-muted/10">
                  <Td mono className="text-muted-foreground text-center">#{i + 1}</Td>
                  <Td className="text-xs font-medium">{m.name}</Td>
                  <Td mono className="text-right font-medium">{fmt.compact(m.volume)}</Td>
                  <Td mono className="text-right">{fmt.number(m.txns)}</Td>
                  <Td mono className="text-right text-muted-foreground">${((m.volume / m.txns)).toFixed(2)}</Td>
                  <Td mono className="text-right text-[#10B981]">95.{Math.floor(Math.random() * 9)}%</Td>
                  <Td mono className="text-right text-muted-foreground">{fmt.compact(m.volume * 0.02)}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </AppShell>
  );
}

// ── FRAUD MONITOR ─────────────────────────────────────────────────────────────
function FraudScreen({ nav }: { nav: Nav }) {
  return (
    <AppShell current="fraud" nav={nav} title="Fraud Monitor">
      <PageHeader title="Fraud Monitoring" subtitle="Real-time risk detection and rule management">
        <Btn variant="outline" size="xs"><Settings size={11} />Rules</Btn>
        <Btn size="xs"><Plus size={11} />New Rule</Btn>
      </PageHeader>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <KPI label="Active Alerts" value="4" sub="Require review" icon={AlertTriangle} />
        <KPI label="Blocked (24h)" value="38" delta={-22.4} sub="↓ vs yesterday" icon={ShieldAlert} />
        <KPI label="Fraud Rate" value="0.08%" sub="Below 0.1% threshold" icon={Activity} />
        <KPI label="ML Model Score" value="v4.2.1" sub="Accuracy: 99.1%" icon={Cpu} />
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="lg:col-span-2">
          <SectionCard title="Risk Alerts — Requires Action">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-background/30">
                  <tr>
                    <Th>Alert ID</Th>
                    <Th>Transaction</Th>
                    <Th>Merchant</Th>
                    <Th>Amount</Th>
                    <Th>Risk Score</Th>
                    <Th>Reason</Th>
                    <Th>Action</Th>
                    <Th>Time</Th>
                  </tr>
                </thead>
                <tbody>
                  {FRAUD_ALERTS.map(a => (
                    <tr key={a.id} className="hover:bg-muted/10">
                      <Td mono className="text-[10px] text-primary">{a.id}</Td>
                      <Td mono className="text-[10px] text-muted-foreground">{a.txnId.slice(0, 16)}…</Td>
                      <Td className="text-xs">{a.merchant}</Td>
                      <Td mono className="text-right font-medium">{fmt.currency(a.amount)}</Td>
                      <Td><RiskBadge score={a.risk} /></Td>
                      <Td className="text-[10px] text-muted-foreground max-w-[200px] truncate">{a.reason}</Td>
                      <Td>
                        <span className={cn("text-[10px] font-medium uppercase tracking-wider", {
                          blocked: "text-[#EF4444]",
                          review: "text-[#F59E0B]",
                          flagged: "text-[#F97316]",
                          allowed: "text-[#10B981]",
                        }[a.action])}>
                          {a.action}
                        </span>
                      </Td>
                      <Td mono className="text-muted-foreground text-[10px]">{a.ts}</Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </div>

        <div className="space-y-3">
          <SectionCard title="Alert Trend (7 days)">
            <div className="p-3 h-36">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={FRAUD_TREND} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                  <XAxis dataKey="d" tick={{ fontSize: 9, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "#111827", border: "1px solid #1F2937", borderRadius: 4, fontSize: 11 }} />
                  <Bar dataKey="alerts" name="Alerts" fill="#F59E0B" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="blocked" name="Blocked" fill="#EF4444" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard title="Active Rules">
            <div className="p-3 space-y-2">
              {[
                { name: "Velocity — IP", active: true, triggered: 12 },
                { name: "High value threshold", active: true, triggered: 4 },
                { name: "Card country mismatch", active: true, triggered: 8 },
                { name: "Proxy / VPN detection", active: true, triggered: 6 },
                { name: "New email domain", active: false, triggered: 0 },
              ].map(r => (
                <div key={r.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className={cn("size-1.5 rounded-full", r.active ? "bg-[#10B981]" : "bg-muted-foreground")} />
                    <span className="text-[11px] text-foreground">{r.name}</span>
                  </div>
                  <span className="font-mono text-[10px] text-muted-foreground">{r.triggered} hits</span>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>
    </AppShell>
  );
}

// ── MERCHANTS ─────────────────────────────────────────────────────────────────
function MerchantsScreen({ nav }: { nav: Nav }) {
  const riskColor: Record<string, string> = {
    low: "text-[#10B981]", medium: "text-[#F59E0B]", high: "text-[#EF4444]",
  };

  return (
    <AppShell current="merchants" nav={nav} title="Merchants">
      <PageHeader title="Merchant Management" subtitle="Onboarding, configuration, and compliance">
        <Btn variant="outline" size="xs"><Filter size={11} />Filter</Btn>
        <Btn size="xs"><Plus size={11} />Onboard Merchant</Btn>
      </PageHeader>

      <div className="grid grid-cols-4 gap-3 mb-4">
        <KPI label="Total Merchants" value="247" delta={3.3} sub="18 onboarding" icon={Building} />
        <KPI label="Active" value="231" sub="93.5% of total" icon={CheckCircle} />
        <KPI label="Under Review" value="8" sub="KYB in progress" icon={Clock} />
        <KPI label="Suspended" value="8" sub="Compliance hold" icon={AlertCircle} />
      </div>

      <SectionCard>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background/30">
              <tr>
                <Th>Merchant ID</Th>
                <Th>Name</Th>
                <Th>Plan</Th>
                <Th>Volume (MTD)</Th>
                <Th>Transactions</Th>
                <Th>Country</Th>
                <Th>Status</Th>
                <Th>Risk</Th>
                <Th>Joined</Th>
                <Th></Th>
              </tr>
            </thead>
            <tbody>
              {MERCHANTS.map(m => (
                <tr key={m.id} className="hover:bg-muted/10 cursor-pointer">
                  <Td mono className="text-primary text-[10px]">{m.id}</Td>
                  <Td className="text-xs font-medium">{m.name}</Td>
                  <Td>
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wider", m.plan === "Enterprise" ? "bg-primary/10 text-primary border-primary/20" : m.plan === "Growth" ? "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20" : "border-border text-muted-foreground")}>
                      {m.plan}
                    </span>
                  </Td>
                  <Td mono className="text-right font-medium">{fmt.compact(m.volume)}</Td>
                  <Td mono className="text-right">{fmt.number(m.txns)}</Td>
                  <Td mono className="text-muted-foreground">{m.country}</Td>
                  <Td><MerchantStatusBadge status={m.status} /></Td>
                  <Td><span className={cn("text-[11px] font-medium capitalize", riskColor[m.risk])}>{m.risk}</span></Td>
                  <Td mono className="text-muted-foreground text-[10px]">{m.joined}</Td>
                  <Td><ChevronRight size={12} className="text-muted-foreground" /></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </AppShell>
  );
}

// ── PLATFORM ──────────────────────────────────────────────────────────────────
function PlatformScreen({ nav }: { nav: Nav }) {
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    "3ds": true, "fraud-ml": true, "auto-retry": true, "smart-routing": true, "velocity-limits": true, "pci-tokenize": true,
  });
  const toggle = (k: string) => setToggles(v => ({ ...v, [k]: !v[k] }));

  const services = [
    { name: "Payment API", status: "operational", latency: "23ms", uptime: "99.999%", region: "us-east-1" },
    { name: "Fraud Engine", status: "operational", latency: "41ms", uptime: "99.997%", region: "us-east-1" },
    { name: "Webhook Dispatcher", status: "operational", latency: "8ms", uptime: "99.998%", region: "multi" },
    { name: "Settlement Service", status: "operational", latency: "12ms", uptime: "99.999%", region: "us-east-1" },
    { name: "Auth Service", status: "degraded", latency: "312ms", uptime: "99.94%", region: "eu-west-1" },
    { name: "Reporting Pipeline", status: "operational", latency: "450ms", uptime: "99.991%", region: "us-east-1" },
  ];

  return (
    <AppShell current="platform" nav={nav} title="Platform">
      <PageHeader title="Platform Control Center" subtitle="System health, configuration, and audit logs">
        <Btn variant="outline" size="xs"><Download size={11} />Audit Log</Btn>
      </PageHeader>

      {/* System health */}
      <div className="grid grid-cols-4 gap-3 mb-4">
        <KPI label="API Uptime (30d)" value="99.997%" sub="6.5s downtime" icon={Wifi} />
        <KPI label="P99 Latency" value="187ms" sub="Global average" icon={Zap} />
        <KPI label="Error Rate (1h)" value="0.003%" sub="Below SLO" icon={AlertCircle} />
        <KPI label="Active Connections" value="12,481" sub="Peak: 18,200" icon={Activity} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <SectionCard title="Service Health">
          <div className="divide-y divide-border/50">
            {services.map(s => (
              <div key={s.name} className="px-4 py-2.5 flex items-center gap-3">
                <span className={cn("size-2 rounded-full shrink-0", s.status === "operational" ? "bg-[#10B981]" : s.status === "degraded" ? "bg-[#F59E0B]" : "bg-[#EF4444]")} />
                <span className="text-xs text-foreground flex-1">{s.name}</span>
                <span className="font-mono text-[10px] text-muted-foreground">{s.region}</span>
                <span className={cn("font-mono text-[11px]", parseInt(s.latency) > 200 ? "text-[#F59E0B]" : "text-muted-foreground")}>{s.latency}</span>
                <span className={cn("font-mono text-[11px]", s.status === "operational" ? "text-[#10B981]" : "text-[#F59E0B]")}>{s.uptime}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Feature Flags">
          <div className="divide-y divide-border/50">
            {[
              { key: "3ds", label: "3D Secure v2.2", desc: "Liability shift authentication" },
              { key: "fraud-ml", label: "ML Fraud Scoring", desc: "Real-time model inference" },
              { key: "auto-retry", label: "Smart Retry", desc: "Intelligent decline recovery" },
              { key: "smart-routing", label: "Gateway Routing", desc: "Cost & success optimisation" },
              { key: "velocity-limits", label: "Velocity Controls", desc: "Rate limiting per card/IP" },
              { key: "pci-tokenize", label: "PCI Tokenisation", desc: "Network token enrollment" },
            ].map(f => (
              <div key={f.key} className="px-4 py-2.5 flex items-center justify-between">
                <div>
                  <div className="text-xs text-foreground">{f.label}</div>
                  <div className="text-[10px] text-muted-foreground">{f.desc}</div>
                </div>
                <button onClick={() => toggle(f.key)} className={cn("w-8 h-4 rounded-full transition-colors cursor-pointer relative", toggles[f.key] ? "bg-primary" : "bg-border")}>
                  <span className={cn("absolute top-0.5 size-3 rounded-full bg-white transition-transform", toggles[f.key] ? "translate-x-4" : "translate-x-0.5")} />
                </button>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Audit Log">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background/30">
              <tr>
                <Th>Timestamp</Th>
                <Th>User</Th>
                <Th>Action</Th>
                <Th>Resource</Th>
                <Th>IP Address</Th>
                <Th>Result</Th>
              </tr>
            </thead>
            <tbody>
              {[
                { ts: "14:23:07", user: "Jamie Rodriguez", action: "UPDATE", resource: "fraud-rule:fra_1a2b3c", ip: "104.23.184.12", ok: true },
                { ts: "14:21:00", user: "Sarah Chen", action: "CREATE", resource: "api-key:pk_live_9k8l7m", ip: "185.76.14.33", ok: true },
                { ts: "14:18:45", user: "Jamie Rodriguez", action: "DELETE", resource: "webhook:wh_9i0j1k2l", ip: "104.23.184.12", ok: false },
                { ts: "14:15:30", user: "Marcus Osei", action: "READ", resource: "settlement:stl_5E6F7G8H", ip: "78.46.201.7", ok: true },
                { ts: "13:55:22", user: "Sarah Chen", action: "UPDATE", resource: "merchant:mch_E5f6G7", ip: "185.76.14.33", ok: true },
                { ts: "13:44:08", user: "System", action: "ROTATE", resource: "api-key:pk_live_1a2b3c", ip: "internal", ok: true },
              ].map((e, i) => (
                <tr key={i} className="hover:bg-muted/10">
                  <Td mono className="text-muted-foreground text-[10px]">{e.ts}</Td>
                  <Td className="text-xs">{e.user}</Td>
                  <Td mono><span className={cn("text-[10px] font-semibold", e.action === "DELETE" ? "text-[#EF4444]" : e.action === "CREATE" ? "text-[#10B981]" : "text-[#6366F1]")}>{e.action}</span></Td>
                  <Td mono className="text-[10px] text-muted-foreground">{e.resource}</Td>
                  <Td mono className="text-[10px] text-muted-foreground">{e.ip}</Td>
                  <Td><span className={cn("text-[10px] font-medium", e.ok ? "text-[#10B981]" : "text-[#EF4444]")}>{e.ok ? "SUCCESS" : "DENIED"}</span></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </AppShell>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const nav: Nav = (s) => setScreen(s);

  const screens: Record<Screen, ReactNode> = {
    login: <LoginScreen nav={nav} />,
    register: <RegisterScreen nav={nav} />,
    recovery: <RecoveryScreen nav={nav} />,
    dashboard: <DashboardScreen nav={nav} />,
    payments: <PaymentsScreen nav={nav} />,
    "payment-detail": <PaymentDetailScreen nav={nav} />,
    transactions: <TransactionsScreen nav={nav} />,
    refunds: <RefundsScreen nav={nav} />,
    "api-keys": <APIKeysScreen nav={nav} />,
    webhooks: <WebhooksScreen nav={nav} />,
    integrations: <IntegrationsScreen nav={nav} />,
    settlements: <SettlementsScreen nav={nav} />,
    reports: <ReportsScreen nav={nav} />,
    fraud: <FraudScreen nav={nav} />,
    merchants: <MerchantsScreen nav={nav} />,
    platform: <PlatformScreen nav={nav} />,
  };

  return (
    <div style={{ fontFamily: "'Geist', -apple-system, BlinkMacSystemFont, sans-serif" }}>
      <style>{`
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #1F2937; border-radius: 2px; }
        ::-webkit-scrollbar-thumb:hover { background: #374151; }
        * { scrollbar-width: thin; scrollbar-color: #1F2937 transparent; }
        .font-mono { font-family: 'Geist Mono', 'Fira Code', monospace !important; }
      `}</style>
      {screens[screen]}
    </div>
  );
}
