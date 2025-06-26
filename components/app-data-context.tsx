'use client';
import React, { createContext, useContext, useState, ReactNode } from "react";

// Types
export type Transaction = {
  id: number;
  type: "expense" | "income";
  amount: number;
  category: string;
  description: string;
  date: string;
  icon: string;
};

export type Category = {
  id: number;
  name: string;
  icon: string;
  color: string;
  type: "expense" | "income";
  isDefault: boolean;
};

export type SavingsGoal = {
  id: number;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  color: string;
  category: string;
};

// Type pour une tontine
export interface Tontine {
  id: number;
  name: string;
  icon: string;
  amount: number;
  members: { name: string; amount: number; hasPaid: boolean }[];
  turns: number;
  currentTurn: number;
  cycle: string;
  history: { turn: number; date: string; amounts: { name: string; amount: number; paid: boolean }[] }[];
}

// Valeurs initiales (mock)
const initialTransactions: Transaction[] = [
  {
    id: 1,
    type: "expense",
    amount: 2500,
    category: "transport",
    description: "Car rapide Dakar-Pikine",
    date: "2025-01-25",
    icon: "🚌",
  },
  {
    id: 2,
    type: "income",
    amount: 50000,
    category: "salary",
    description: "Salaire janvier",
    date: "2025-01-25",
    icon: "💰",
  },
];

const initialCategories: Category[] = [
  { id: 1, name: "Transport", icon: "🚌", color: "bg-blue-100", type: "expense", isDefault: true },
  { id: 2, name: "Salaire", icon: "💰", color: "bg-green-100", type: "income", isDefault: true },
];

const initialSavings: SavingsGoal[] = [
  {
    id: 1,
    title: "Nouveau téléphone",
    targetAmount: 150000,
    currentAmount: 85000,
    deadline: "2025-06-01",
    icon: "📱",
    color: "bg-blue-100",
    category: "Technologie",
  },
];

const initialTontines: Tontine[] = [
  {
    id: 1,
    name: "Tontine du quartier",
    icon: "🤝",
    amount: 10000,
    members: [
      { name: "Awa", amount: 10000, hasPaid: true },
      { name: "Moussa", amount: 10000, hasPaid: false },
      { name: "Fatou", amount: 10000, hasPaid: true },
    ],
    turns: 3,
    currentTurn: 1,
    cycle: "Mensuel",
    history: [
      { turn: 1, date: "2025-01-01", amounts: [
        { name: "Awa", amount: 10000, paid: true },
        { name: "Moussa", amount: 10000, paid: false },
        { name: "Fatou", amount: 10000, paid: true },
      ] },
    ],
  },
];

// Contexte
export const AppDataContext = createContext<any>(null);

export function useAppData() {
  return useContext(AppDataContext);
}

export function AppDataProvider({ children }: { children: ReactNode }) {
  // States globaux
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(initialSavings);
  const [tontines, setTontines] = useState<Tontine[]>(initialTontines);

  // CRUD Transactions
  const addTransaction = (t: Omit<Transaction, "id">) => {
    setTransactions((prev) => [
      { ...t, id: Date.now() },
      ...prev,
    ]);
  };
  const updateTransaction = (id: number, t: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((tr) => (tr.id === id ? { ...tr, ...t } : tr)));
  };
  const deleteTransaction = (id: number) => {
    setTransactions((prev) => prev.filter((tr) => tr.id !== id));
  };

  // CRUD Catégories
  const addCategory = (c: Omit<Category, "id" | "isDefault">) => {
    setCategories((prev) => [
      { ...c, id: Date.now(), isDefault: false },
      ...prev,
    ]);
  };
  const updateCategory = (id: number, c: Partial<Category>) => {
    setCategories((prev) => prev.map((cat) => (cat.id === id ? { ...cat, ...c } : cat)));
  };
  const deleteCategory = (id: number) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
    setTransactions((prev) => prev.map((tr) =>
      tr.category === categories.find((cat) => cat.id === id)?.name
        ? { ...tr, category: "Sans catégorie" }
        : tr
    ));
  };

  // CRUD Savings
  const addSavingsGoal = (g: Omit<SavingsGoal, "id" | "currentAmount">) => {
    setSavingsGoals((prev) => [
      { ...g, id: Date.now(), currentAmount: 0 },
      ...prev,
    ]);
  };
  const updateSavingsGoal = (id: number, g: Partial<SavingsGoal>) => {
    setSavingsGoals((prev) => prev.map((goal) => (goal.id === id ? { ...goal, ...g } : goal)));
  };
  const deleteSavingsGoal = (id: number) => {
    setSavingsGoals((prev) => prev.filter((goal) => goal.id !== id));
  };

  // CRUD Tontines
  const addTontine = (tontine: Omit<Tontine, 'id' | 'history'>) => {
    setTontines(prev => [
      { ...tontine, id: Date.now(), history: [] },
      ...prev,
    ]);
  };
  const addTontineMember = (tontineId: number, memberName: string, amount: number = 0) => {
    setTontines(prev => prev.map(t => t.id === tontineId ? {
      ...t,
      members: [...t.members, { name: memberName, amount, hasPaid: false }],
    } : t));
  };
  const updateTontineMemberAmount = (tontineId: number, memberName: string, amount: number) => {
    setTontines(prev => prev.map(t => t.id === tontineId ? {
      ...t,
      members: t.members.map(m => m.name === memberName ? { ...m, amount } : m),
    } : t));
  };
  const payTontine = (tontineId: number, memberName: string) => {
    setTontines(prev => prev.map(t => t.id === tontineId ? {
      ...t,
      members: t.members.map(m => m.name === memberName ? { ...m, hasPaid: true } : m),
    } : t));
  };
  const nextTontineTurn = (tontineId: number) => {
    setTontines(prev => prev.map(t => {
      if (t.id !== tontineId) return t;
      // Ajoute l'état courant à l'historique
      const newHistory = [
        ...t.history,
        {
          turn: t.currentTurn + 1,
          date: new Date().toISOString().split('T')[0],
          amounts: t.members.map(m => ({ name: m.name, amount: m.amount, paid: m.hasPaid })),
        },
      ];
      return {
        ...t,
        currentTurn: t.currentTurn + 1,
        turns: t.turns + 1,
        members: t.members.map(m => ({ ...m, hasPaid: false })),
        history: newHistory,
      };
    }));
  };
  const deleteTontine = (tontineId: number) => {
    setTontines(prev => prev.filter(t => t.id !== tontineId));
  };

  const editTontineMember = (tontineId: number, oldName: string, newName: string, newAmount: number) => {
    setTontines(prev => prev.map(t => t.id === tontineId ? {
      ...t,
      members: t.members.map(m => m.name === oldName ? { ...m, name: newName, amount: newAmount } : m),
    } : t));
  };
  const deleteTontineMember = (tontineId: number, memberName: string) => {
    setTontines(prev => prev.map(t => t.id === tontineId ? {
      ...t,
      members: t.members.filter(m => m.name !== memberName),
    } : t));
  };

  const setTontineMemberUnpaid = (tontineId: number, memberName: string) => {
    setTontines(prev => prev.map(t => t.id === tontineId ? {
      ...t,
      members: t.members.map(m => m.name === memberName ? { ...m, hasPaid: false } : m),
    } : t));
  };

  return (
    <AppDataContext.Provider
      value={{
        transactions,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        savingsGoals,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        tontines,
        addTontine,
        addTontineMember,
        updateTontineMemberAmount,
        payTontine,
        nextTontineTurn,
        deleteTontine,
        editTontineMember,
        deleteTontineMember,
        setTontineMemberUnpaid,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
} 