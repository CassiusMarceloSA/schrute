import { Expense } from '@/models';
import { GoogleSpreadsheet, GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet } from 'google-spreadsheet';

type SpreadsheetExpense = Expense & {
    date?: string,
    installmentValue?: string
    value: string
    totalValue?: string
}

const ENV = import.meta.env

function parseRowToObject(row: GoogleSpreadsheetRow) {
    return row.toObject();
}

function parseCurrencyToNumber(value: string) {
    const unmaskedValue = value.replace('$', '').replace(',', '')
    return Number(unmaskedValue)
}

function parseRowsToExpenses(rows: GoogleSpreadsheetRow[]): Expense[] {
    return rows.map(item => {
        const rowToObject = parseRowToObject(item) as SpreadsheetExpense;

        return {
            ...rowToObject,
            date: rowToObject.date ? new Date(rowToObject.date) : undefined,
            installmentValue: rowToObject.installmentValue ? parseCurrencyToNumber(rowToObject.installmentValue) : undefined,
            value: parseCurrencyToNumber(rowToObject.value),
            totalValue: rowToObject.totalValue ? parseCurrencyToNumber(rowToObject.totalValue) : undefined,
        }
    })
}

export async function getSheetsAccess() {
    const doc = new GoogleSpreadsheet(ENV.VITE_GOOGLE_SHEET_ID, {
        apiKey: ENV.VITE_GOOGLE_PRIVATE_KEY,
    });
    await doc.loadInfo();
    return doc;
}

export async function getSheetByTitle(doc: GoogleSpreadsheet, sheetTitle: string) {
    return doc.sheetsByTitle[sheetTitle];
}

export async function getRows(sheet: GoogleSpreadsheetWorksheet) {
    return sheet.getRows();
}

export async function addRow(sheet: GoogleSpreadsheetWorksheet, data: Expense) {
    return sheet.addRow(data)
}

export async function deleteRow(row: GoogleSpreadsheetRow) {
    return row.delete()
}

export async function getAllExpenses(doc: GoogleSpreadsheet) {
    const [feesResponse, recurrentFeesResponse] = doc.sheetsByIndex;

    const [feesRows, recurrentFeesRows] = await Promise.all([feesResponse.getRows(), recurrentFeesResponse.getRows()])

    const expenses = parseRowsToExpenses(feesRows)
    const recurrentExpenses = parseRowsToExpenses(recurrentFeesRows)

    return {
        expenses,
        recurrentExpenses
    }
}