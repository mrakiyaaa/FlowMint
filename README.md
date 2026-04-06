<div align="center">

<img src="https://img.shields.io/badge/FlowMint-Personal%20Finance%20Tracker-E8825A?style=for-the-badge&logo=droplets&logoColor=white" alt="FlowMint" />

<br/>
<br/>

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-FF6B35?style=for-the-badge&logo=react&logoColor=white)

<br/>

> 🌿 **Track your income, expenses, and savings with a futuristic dark-mode interface**

<br/>

![License](https://img.shields.io/badge/license-MIT-E8825A?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-34D399?style=flat-square)
![Status](https://img.shields.io/badge/status-active-34D399?style=flat-square)

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Auth** | Email/password + Google OAuth via Supabase |
| 💰 **Salary Tracking** | Log monthly salary with tags |
| 💼 **Other Income** | Track freelance, side income, etc. |
| 🧾 **Expenses** | Categorize and monitor spending |
| 🐷 **Savings** | Manual savings with source tracking |
| 📊 **Totals & Charts** | Pie chart + bar chart breakdowns |
| ⚡ **Automations** | Auto-save or auto-expense rules by month |
| 🔔 **Notifications** | In-app alerts when automations fire |
| 🌙 **Dark / Light Mode** | Persisted theme per user profile |
| 📱 **Mobile First** | Bottom nav on mobile, sidebar on desktop |

---

## 🎨 Design System

<div align="center">

| Token | Value | Preview |
|---|---|---|
| Background | `#0E0E0E` | ![#0E0E0E](https://img.shields.io/badge/-%230E0E0E-0E0E0E?style=flat-square) |
| Card | `#1C1C1C` | ![#1C1C1C](https://img.shields.io/badge/-%231C1C1C-1C1C1C?style=flat-square) |
| Accent | `#E8825A` | ![#E8825A](https://img.shields.io/badge/-%23E8825A-E8825A?style=flat-square) |
| Success | `#34D399` | ![#34D399](https://img.shields.io/badge/-%2334D399-34D399?style=flat-square) |
| Danger | `#F87171` | ![#F87171](https://img.shields.io/badge/-%23F87171-F87171?style=flat-square) |

</div>

**Fonts:** `Syne` (headings) · `DM Mono` (currency amounts)

---

## 🗂️ Project Structure

```
src/
├── 📁 app/
│   ├── (auth)/          # login · register
│   └── (app)/           # dashboard · salary · income
│                          expenses · savings · totals
│                          automations · notifications · profile
├── 📁 components/
│   ├── layout/          # AppShell · Sidebar · BottomNav · GlobalBalanceChip
│   ├── ui/              # Card · Modal · Button · Input · Badge · EmptyState
│   ├── forms/           # SalaryForm · ExpenseForm · AutomationForm · OtherIncomeForm
│   └── tables/          # DataTable
├── 📁 lib/supabase/     # client · server · middleware
├── 📁 store/            # Zustand global state
├── 📁 types/            # TypeScript interfaces
└── 📁 utils/            # formatCurrency · getMonthName · calculateTotals
```

---

## 🗄️ Database Schema

```sql
profiles        → id, full_name, avatar_url, theme
salary_incomes  → id, user_id, amount, month, year, tag
other_incomes   → id, user_id, title, amount, date, month, year
expenses        → id, user_id, title, amount, date, month, year, tag
savings         → id, user_id, title, amount, source
automations     → id, user_id, label, action_type, amount, trigger_month,
                   from_source, target, is_active
notifications   → id, user_id, message, is_read, created_at
```

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/your-username/flowmint.git
cd flowmint
npm install
```

### 2. Configure Environment

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Set Up Supabase Trigger

Run this in your **Supabase SQL Editor** to auto-create user profiles on signup:

```sql
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, full_name, avatar_url, theme)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'avatar_url',
    'dark'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
```

### 4. Run the Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🚀

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Database & Auth** | Supabase (PostgreSQL) |
| **Styling** | Tailwind CSS v4 |
| **State Management** | Zustand |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Fonts** | Google Fonts (Syne + DM Mono) |

---

## 🔒 Auth Flow

```
User visits /dashboard
     ↓
proxy.ts checks session
     ↓
❌ No session → redirect /login
✅ Session ok → render page
```

---

## ⚡ Automation Engine

Automations run automatically when you visit the Automations page. Each rule:

1. Checks if `trigger_month` matches the current month
2. Verifies it hasn't already been executed this month
3. Creates a **saving** or **expense** entry
4. Sends an in-app **notification**

---

## 💱 Currency

All amounts are displayed in **LKR (Sri Lankan Rupee)**

```
formatCurrency(45200) → "LKR 45,200.00"
```

---

<div align="center">

**Built with 🧡 using Next.js + Supabase**

![Made with Love](https://img.shields.io/badge/Made%20with-🧡-E8825A?style=for-the-badge)

</div>
