'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Calendar,
    Check,
    DollarSign,
    Home,
    Scissors,
    Shield,
    Snowflake,
    Sparkles,
    Star,
    TrendingDown,
    Wrench,
    Zap,
    Bell,
    Droplets,
    BarChart3,
    Settings,
    HelpCircle,
    ChevronDown,
    ChevronRight,
    Search,
    Filter,
    MapPin,
    Clock,
    Users,
    Leaf,
    Phone,
    ArrowUpRight,
    type LucideIcon,
} from 'lucide-react'

const ease = [0.21, 0.47, 0.32, 0.98] as const

/* ─── FLOATING FEATURE BUBBLE ─── */

type FeatureStop = {
    label: string
    subtitle: string
    icon: LucideIcon
    iconColor: string
    iconBg: string
    // Position as % of the dashboard
    xPct: number
    yPct: number
}

const featureStops: FeatureStop[] = [
    {
        label: 'Save money every month',
        subtitle: 'Up to $847/yr in savings',
        icon: TrendingDown,
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-100',
        xPct: 58,
        yPct: 14,
    },
    {
        label: 'Schedule services easily',
        subtitle: 'We handle all the coordination',
        icon: Calendar,
        iconColor: 'text-violet-600',
        iconBg: 'bg-violet-100',
        xPct: 22,
        yPct: 48,
    },
    {
        label: '30+ service types to bundle',
        subtitle: 'Lawn, snow, HVAC, cleaning & more',
        icon: Sparkles,
        iconColor: 'text-primary',
        iconBg: 'bg-blue-100',
        xPct: 68,
        yPct: 42,
    },
    {
        label: 'All contractors vetted',
        subtitle: 'Licensed, insured & verified',
        icon: Shield,
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-100',
        xPct: 12,
        yPct: 72,
    },
    {
        label: 'Live status notifications',
        subtitle: 'Know before they arrive',
        icon: Bell,
        iconColor: 'text-amber-600',
        iconBg: 'bg-amber-100',
        xPct: 78,
        yPct: 4,
    },
    {
        label: 'Plan out your entire year',
        subtitle: 'Every season, every service',
        icon: Calendar,
        iconColor: 'text-primary',
        iconBg: 'bg-blue-100',
        xPct: 52,
        yPct: 74,
    },
    {
        label: 'Book recurring services',
        subtitle: 'Cleaning, lawn care & tune-ups',
        icon: Wrench,
        iconColor: 'text-orange-600',
        iconBg: 'bg-orange-100',
        xPct: 28,
        yPct: 34,
    },
    {
        label: 'Fully insured coverage',
        subtitle: 'Every visit, every contractor',
        icon: Shield,
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-100',
        xPct: 70,
        yPct: 60,
    },
]

function FloatingFeatureBubble() {
    const [index, setIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)

    const advance = useCallback(() => {
        if (!isHovered) {
            setIndex((prev) => (prev + 1) % featureStops.length)
        }
    }, [isHovered])

    useEffect(() => {
        const timer = setInterval(advance, 3200)
        return () => clearInterval(timer)
    }, [advance])

    const current = featureStops[index]
    const Icon = current.icon

    return (
        <motion.div
            className="absolute z-30 pointer-events-auto"
            animate={{
                left: `${current.xPct}%`,
                top: `${current.yPct}%`,
            }}
            transition={{
                type: 'spring' as const,
                stiffness: 70,
                damping: 18,
                mass: 1.2,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ willChange: 'transform', transform: 'translate(-50%, -50%)' }}
        >
            {/* Ping ring */}
            <motion.div
                className="absolute inset-0 -m-3 rounded-2xl border-2 border-primary/20"
                animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.4, 0, 0.4],
                }}
                transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Bubble */}
            <motion.div
                className="relative cursor-pointer select-none"
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
            >
                {/* Glow */}
                <motion.div
                    className="absolute -inset-3 rounded-2xl bg-primary/25 blur-xl"
                    animate={{
                        opacity: isHovered ? 0.7 : 0.15,
                        scale: isHovered ? 1.15 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                />

                <div className="relative flex items-center gap-2.5 rounded-xl border border-white/90 bg-white/[0.97] px-3 py-2 shadow-xl shadow-black/10 backdrop-blur-xl sm:px-3.5 sm:py-2.5">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`icon-${index}`}
                            initial={{ scale: 0.3, opacity: 0, rotate: -30 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.3, opacity: 0, rotate: 30 }}
                            transition={{ duration: 0.3, ease }}
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full sm:h-8 sm:w-8 ${current.iconBg}`}
                        >
                            <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${current.iconColor}`} />
                        </motion.div>
                    </AnimatePresence>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={`text-${index}`}
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -8 }}
                            transition={{ duration: 0.25 }}
                            className="min-w-[120px] sm:min-w-[140px]"
                        >
                            <p className="text-[11px] font-semibold text-gray-900 leading-tight sm:text-[12px]">{current.label}</p>
                            <p className="text-[9px] text-gray-400 leading-tight mt-0.5 sm:text-[10px]">{current.subtitle}</p>
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Progress dots */}
                <div className="flex items-center justify-center gap-1 mt-1.5">
                    {featureStops.map((_, i) => (
                        <motion.button
                            key={i}
                            onClick={() => setIndex(i)}
                            className="h-1 rounded-full"
                            animate={{
                                width: i === index ? 14 : 4,
                                backgroundColor: i === index ? 'var(--color-primary, #3b82f6)' : '#d1d5db',
                            }}
                            transition={{ duration: 0.3 }}
                        />
                    ))}
                </div>
            </motion.div>
        </motion.div>
    )
}

/* ─── MINI PROGRESS BAR ─── */

function MiniBar({ value, color }: { value: number; color: string }) {
    return (
        <div className="h-1.5 w-full rounded-full bg-gray-100">
            <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
        </div>
    )
}

/* ─── MAIN DASHBOARD MOCKUP ─── */

export function HeroDashboardMockup() {
    return (
        <div className="relative mx-auto">
            {/* Glow effect behind the dashboard */}
            <div className="absolute -inset-8 -z-10 mx-auto rounded-3xl bg-primary/[0.04] blur-3xl" />

            <div className="relative">
                {/* ── MAIN DASHBOARD FRAME ── */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8, ease }}
                    className="relative overflow-hidden rounded-xl border border-gray-200/80 bg-white shadow-2xl shadow-black/10 sm:rounded-2xl"
                >
                    {/* Floating bubble lives inside the dashboard frame */}
                    <FloatingFeatureBubble />

                    {/* Top bar */}
                    <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/60 px-3 py-1.5 sm:px-5 sm:py-2">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex items-center gap-1.5 sm:gap-2">
                                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 sm:h-6 sm:w-6 sm:rounded-lg">
                                    <Home className="h-2.5 w-2.5 text-primary sm:h-3 sm:w-3" />
                                </div>
                                <span className="text-[11px] font-semibold text-gray-900 sm:text-xs">My Home Plan</span>
                            </div>
                            <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5">
                                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                <span className="text-[7px] font-semibold text-emerald-700 sm:text-[8px]">Active</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2.5">
                            <div className="hidden sm:flex items-center gap-1.5 rounded-md border border-gray-200 bg-white px-2 py-0.5">
                                <Search className="h-2.5 w-2.5 text-gray-400" />
                                <span className="text-[9px] text-gray-400">Search...</span>
                                <span className="rounded bg-gray-100 px-1 py-0.5 text-[7px] text-gray-400">&#8984;K</span>
                            </div>
                            <div className="relative">
                                <Bell className="h-3 w-3 text-gray-400 sm:h-3.5 sm:w-3.5" />
                                <div className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-red-500" />
                            </div>
                            <div className="h-5 w-5 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
                                <span className="text-[7px] font-bold text-white sm:text-[8px]">JD</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex">
                        {/* Sidebar */}
                        <div className="hidden lg:flex w-36 shrink-0 flex-col border-r border-gray-100 bg-gray-50/30 py-2 xl:w-40">
                            {/* User card */}
                            <div className="mx-2.5 mb-2 rounded-md border border-gray-100 bg-white p-1.5">
                                <div className="flex items-center gap-1.5">
                                    <div className="h-6 w-6 rounded-full bg-gradient-to-br from-primary/80 to-primary flex items-center justify-center">
                                        <span className="text-[7px] font-bold text-white">JD</span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[9px] font-semibold text-gray-900 truncate">Jordan Davis</p>
                                        <p className="text-[7px] text-gray-400 truncate">Homeowner</p>
                                    </div>
                                    <ChevronDown className="h-2.5 w-2.5 text-gray-300 shrink-0" />
                                </div>
                            </div>

                            <div className="px-2 mb-0.5">
                                <p className="px-1 text-[7px] font-semibold uppercase tracking-wider text-gray-300">Menu</p>
                            </div>
                            <div className="px-2 mb-1">
                                <div className="flex items-center gap-1.5 rounded-md bg-primary px-2 py-1 shadow-sm shadow-primary/25">
                                    <BarChart3 className="h-3 w-3 text-white" />
                                    <span className="text-[10px] font-medium text-white">Dashboard</span>
                                </div>
                            </div>
                            <div className="px-2 space-y-px">
                                {[
                                    { icon: Wrench, label: 'Plan Builder' },
                                    { icon: Calendar, label: 'Bookings' },
                                    { icon: Sparkles, label: 'Services' },
                                    { icon: MapPin, label: 'Property' },
                                    { icon: DollarSign, label: 'Billing' },
                                    { icon: Users, label: 'My Contractors' },
                                ].map((item) => (
                                    <div key={item.label} className="flex items-center gap-1.5 rounded-md px-2 py-1 text-gray-500 hover:bg-gray-100/60 transition-colors">
                                        <item.icon className="h-3 w-3" />
                                        <span className="text-[10px]">{item.label}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-auto px-2 pt-2 border-t border-gray-100 mx-2 space-y-px">
                                <div className="flex items-center gap-1.5 rounded-md px-2 py-1 text-gray-400">
                                    <Settings className="h-3 w-3" />
                                    <span className="text-[10px]">Settings</span>
                                </div>
                                <div className="flex items-center gap-1.5 rounded-md px-2 py-1 text-gray-400">
                                    <HelpCircle className="h-3 w-3" />
                                    <span className="text-[10px]">Help & Support</span>
                                </div>
                            </div>
                        </div>

                        {/* Main content */}
                        <div className="flex-1 p-2.5 sm:p-3 lg:p-4">
                            {/* Welcome row */}
                            <div className="flex items-center justify-between mb-2.5">
                                <div>
                                    <h3 className="text-xs font-semibold text-gray-900 sm:text-sm">Welcome back, Jordan</h3>
                                    <p className="text-[9px] text-gray-400 mt-0.5 sm:text-[10px]">Your home is in great shape. Here&apos;s what&apos;s happening.</p>
                                </div>
                                <div className="hidden sm:flex items-center gap-1 rounded-md border border-primary/20 bg-primary/5 px-2 py-1">
                                    <Clock className="h-2.5 w-2.5 text-primary" />
                                    <span className="text-[9px] font-medium text-primary">Next service in 2 days</span>
                                </div>
                            </div>

                            {/* Stat Cards */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-2.5 sm:gap-2 sm:mb-3">
                                {[
                                    { label: 'Active Services', value: '8', change: '+2 this month', changeColor: 'text-emerald-500', icon: Sparkles, color: 'text-primary', bg: 'bg-primary/10', barColor: 'bg-primary', barValue: 80 },
                                    { label: 'Monthly Cost', value: '$189', change: '15% less than avg', changeColor: 'text-emerald-500', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', barColor: 'bg-emerald-500', barValue: 65 },
                                    { label: 'Annual Savings', value: '$847', change: 'vs hiring solo', changeColor: 'text-amber-500', icon: TrendingDown, color: 'text-amber-600', bg: 'bg-amber-50', barColor: 'bg-amber-500', barValue: 72 },
                                    { label: 'Completed Jobs', value: '24', change: '100% on time', changeColor: 'text-violet-500', icon: Check, color: 'text-violet-600', bg: 'bg-violet-50', barColor: 'bg-violet-500', barValue: 100 },
                                ].map((stat) => (
                                    <div key={stat.label} className="rounded-lg border border-gray-100 bg-white p-2 sm:p-2.5">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className={`flex h-4.5 w-4.5 items-center justify-center rounded-md sm:h-5 sm:w-5 ${stat.bg}`}>
                                                <stat.icon className={`h-2.5 w-2.5 ${stat.color}`} />
                                            </div>
                                            <ArrowUpRight className="h-2 w-2 text-gray-300" />
                                        </div>
                                        <p className="text-sm font-bold text-gray-900 leading-none sm:text-base">{stat.value}</p>
                                        <p className="text-[7px] text-gray-400 mt-0.5 sm:text-[8px]">{stat.label}</p>
                                        <div className="mt-1">
                                            <MiniBar value={stat.barValue} color={stat.barColor} />
                                        </div>
                                        <p className={`text-[7px] mt-0.5 font-medium ${stat.changeColor}`}>{stat.change}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Main grid - 3 columns on lg */}
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
                                {/* Upcoming Schedule */}
                                <div className="lg:col-span-5 rounded-lg border border-gray-100 bg-white p-2.5 sm:p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="h-3 w-3 text-primary" />
                                            <p className="text-[10px] font-semibold text-gray-900">Upcoming Schedule</p>
                                            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[7px] font-medium text-primary">3 this week</span>
                                        </div>
                                        <div className="hidden sm:flex items-center gap-1 rounded-md border border-gray-200 px-1.5 py-0.5 cursor-pointer hover:bg-gray-50 transition-colors">
                                            <Filter className="h-2.5 w-2.5 text-gray-400" />
                                            <span className="text-[8px] text-gray-500">This week</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1 sm:space-y-1.5">
                                        {[
                                            { icon: Scissors, label: 'Lawn Mowing & Edging', contractor: 'Mike R.', date: 'Tomorrow', time: '9:00 AM', color: 'text-emerald-600', bg: 'bg-emerald-50', status: 'Confirmed', statusColor: 'text-emerald-600 bg-emerald-50', rating: 4.9 },
                                            { icon: Droplets, label: 'Gutter Cleaning', contractor: 'Pro Gutters Co.', date: 'Thu, Mar 15', time: '10:30 AM', color: 'text-blue-600', bg: 'bg-blue-50', status: 'Scheduled', statusColor: 'text-blue-600 bg-blue-50', rating: 4.8 },
                                            { icon: Sparkles, label: 'House Cleaning', contractor: 'Sarah K.', date: 'Sat, Mar 17', time: '1:00 PM', color: 'text-violet-600', bg: 'bg-violet-50', status: 'Scheduled', statusColor: 'text-blue-600 bg-blue-50', rating: 5.0 },
                                        ].map((s) => (
                                            <div key={s.label} className="flex items-center justify-between rounded-md bg-gray-50/80 px-2 py-1.5">
                                                <div className="flex items-center gap-2">
                                                    <div className={`flex h-5 w-5 items-center justify-center rounded-md sm:h-6 sm:w-6 ${s.bg}`}>
                                                        <s.icon className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${s.color}`} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-medium text-gray-900 sm:text-[10px]">{s.label}</p>
                                                        <div className="flex items-center gap-1">
                                                            <p className="text-[7px] text-gray-400 sm:text-[8px]">{s.date} at {s.time}</p>
                                                            <span className="hidden sm:inline text-[7px] text-gray-300">|</span>
                                                            <span className="hidden sm:inline text-[7px] text-gray-500">{s.contractor}</span>
                                                            <span className="hidden sm:inline-flex items-center gap-0.5">
                                                                <Star className="h-2 w-2 fill-amber-400 text-amber-400" />
                                                                <span className="text-[7px] text-gray-400">{s.rating}</span>
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[7px] font-medium sm:text-[8px] ${s.statusColor}`}>
                                                    {s.status}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-2 flex items-center justify-center">
                                        <span className="text-[8px] font-medium text-primary cursor-pointer hover:underline flex items-center gap-0.5">
                                            View full schedule <ChevronRight className="h-2.5 w-2.5" />
                                        </span>
                                    </div>
                                </div>

                                {/* Plan Summary */}
                                <div className="lg:col-span-4 rounded-lg border border-primary/20 bg-gradient-to-br from-primary/[0.03] to-transparent p-2.5 sm:p-3">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-1.5">
                                            <div className="flex h-4.5 w-4.5 items-center justify-center rounded-md bg-primary/10">
                                                <Shield className="h-2.5 w-2.5 text-primary" />
                                            </div>
                                            <p className="text-[10px] font-semibold text-gray-900">Complete Plan</p>
                                        </div>
                                        <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[7px] font-semibold text-primary">Annual</span>
                                    </div>
                                    <div className="flex items-baseline gap-1 mb-0.5">
                                        <span className="text-lg font-bold text-primary sm:text-xl">$189</span>
                                        <span className="text-[9px] text-gray-400">/month</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 mb-2">
                                        <div className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-1.5 py-0.5">
                                            <Check className="h-2 w-2 text-emerald-500" />
                                            <span className="text-[7px] font-medium text-emerald-600">Saving 15%</span>
                                        </div>
                                        <span className="text-[7px] text-gray-400">$2,268/yr</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
                                        {['Lawn Care', 'Snow Removal', 'House Cleaning', 'HVAC Tune-ups', 'Gutter Cleaning', 'Pest Control', 'Window Washing', 'Pressure Washing'].map((svc) => (
                                            <div key={svc} className="flex items-center gap-1">
                                                <Check className="h-2 w-2 text-primary shrink-0" />
                                                <span className="text-[8px] text-gray-600 truncate">{svc}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-1.5 flex items-center justify-between rounded-md bg-primary/5 px-2 py-1">
                                        <span className="text-[8px] text-primary font-medium">Modify your plan</span>
                                        <ChevronRight className="h-2.5 w-2.5 text-primary" />
                                    </div>
                                </div>

                                {/* Right column - Recent Activity + Next Contractor inline */}
                                <div className="lg:col-span-3 space-y-2">
                                    {/* Next Contractor - compact */}
                                    <div className="rounded-lg border border-gray-100 bg-white p-2.5">
                                        <p className="text-[8px] font-semibold uppercase tracking-wider text-gray-300 mb-1.5">Next Contractor</p>
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-sm shrink-0">
                                                <span className="text-[9px] font-bold text-white">MR</span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-1">
                                                    <p className="text-[9px] font-semibold text-gray-900 truncate">Mike Rodriguez</p>
                                                    <div className="flex items-center gap-0.5 rounded-full bg-emerald-50 px-1 py-0.5 shrink-0">
                                                        <Shield className="h-1.5 w-1.5 text-emerald-600" />
                                                        <span className="text-[6px] font-semibold text-emerald-600">Verified</span>
                                                    </div>
                                                </div>
                                                <p className="text-[7px] text-gray-400 truncate">Lawn Mowing - Tomorrow 9 AM</p>
                                                <div className="flex items-center gap-0.5 mt-0.5">
                                                    {[1, 2, 3, 4, 5].map((i) => (
                                                        <Star key={i} className={`h-2 w-2 ${i <= 4 ? 'fill-amber-400 text-amber-400' : 'fill-amber-400/50 text-amber-400/50'}`} />
                                                    ))}
                                                    <span className="text-[7px] font-medium text-gray-400 ml-0.5">4.9</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Recent Activity */}
                                    <div className="rounded-lg border border-gray-100 bg-white p-2.5">
                                        <div className="flex items-center justify-between mb-1.5">
                                            <p className="text-[8px] font-semibold uppercase tracking-wider text-gray-300">Recent Activity</p>
                                            <span className="text-[7px] text-primary font-medium cursor-pointer hover:underline">View all</span>
                                        </div>
                                        <div className="space-y-1.5">
                                            {[
                                                { icon: Snowflake, label: 'Snow Removal', detail: 'Driveway cleared', date: 'Mar 8', color: 'text-sky-600', bg: 'bg-sky-50', rating: 5 },
                                                { icon: Zap, label: 'HVAC Tune-up', detail: 'Filter replaced', date: 'Mar 3', color: 'text-amber-600', bg: 'bg-amber-50', rating: 5 },
                                            ].map((s) => (
                                                <div key={s.label} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={`flex h-5 w-5 items-center justify-center rounded-md ${s.bg}`}>
                                                            <s.icon className={`h-2.5 w-2.5 ${s.color}`} />
                                                        </div>
                                                        <div>
                                                            <p className="text-[9px] font-medium text-gray-900">{s.label}</p>
                                                            <p className="text-[7px] text-gray-400">{s.detail} - {s.date}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-0.5">
                                                        {Array.from({ length: Math.min(s.rating, 3) }).map((_, i) => (
                                                            <Star key={i} className="h-1.5 w-1.5 fill-amber-400 text-amber-400" />
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
