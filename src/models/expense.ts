export type RecurringExpense = {
    totalValue: number
    installmentValue: number
    installments: number
    currentInstallments: number
    date: Date
}

export type Expense = {
    description: string
    paymentMethod: string
    value: number
    category: string
} & Partial<RecurringExpense>