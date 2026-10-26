const STORAGE_KEY = "smartSpendTransactions";

const categories = {
  expense: ["Food & Dining", "Shopping", "Transport", "Bills & Utilities", "Health", "Entertainment", "Education", "Travel", "Home", "Other"],
  income: ["Salary", "Freelance", "Business", "Investment", "Gift", "Refund", "Other"]
};
const categoryColors = {
  "Food & Dining": "#f3a45b", "Shopping": "#8c7be8", "Transport": "#53b8bd",
  "Bills & Utilities": "#ef7d91", "Health": "#64bd8a", "Entertainment": "#6e9fe8",
  "Education": "#d6b45c", "Travel": "#5dc3a5", "Home": "#b58ae3", "Other": "#9aa6b5",
  "Salary": "#25b981", "Freelance": "#6e9fe8", "Business": "#8c7be8", "Investment": "#53b8bd",
  "Gift": "#ef7d91", "Refund": "#d6b45c"
};
const categoryIcons = {
  "Food & Dining": "☕", Shopping: "◇", Transport: "↗", "Bills & Utilities": "▤",
  Health: "＋", Entertainment: "♫", Education: "▣", Travel: "✈", Home: "⌂",
  Salary: "↙", Freelance: "✦", Business: "▦", Investment: "↗", Gift: "♡", Refund: "↩", Other: "•"
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const els = {
  balance: $("#totalBalance"), income: $("#totalIncome"), expenses: $("#totalExpenses"),
  monthSpent: $("#monthSpent"), monthCaption: $("#monthCaption"), list: $("#transactionList"),
  empty: $("#emptyState"), resultCount: $("#resultCount"), search: $("#searchInput"),
  typeFilter: $("#typeFilter"), categoryFilter: $("#categoryFilter"), sort: $("#sortSelect"),
  modal: $("#transactionModal"), form: $("#transactionForm"), modalTitle: $("#modalTitle"),
  id: $("#transactionId"), type: $("#transactionType"), title: $("#titleInput"),
  amount: $("#amountInput"), date: $("#dateInput"), category: $("#categoryInput"),
  note: $("#noteInput"), error: $("#formError"), donut: $("#spendingDonut"),
  donutTotal: $("#donutTotal"), legend: $("#categoryLegend"), toast: $("#toast")
};

let transactions = loadTransactions();
let toastTimer;

function loadTransactions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed.filter(isValidTransaction) : [];
  } catch (error) {
    console.error("Could not read saved transactions:", error);
    return [];
  }
}

function isValidTransaction(item) {
  return item && typeof item.id === "string" &&
    typeof item.title === "string" &&
    (item.type === "income" || item.type === "expense") &&
    Number.isFinite(Number(item.amount)) &&
    typeof item.date === "string" &&
    typeof item.category === "string";
}

function saveTransactions() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    return true;
  } catch (error) {
    console.error("Could not save transactions:", error);
    showToast("Unable to save data in this browser.");
    return false;
  }
}

function money(value, compact = false) {
  const number = Number(value) || 0;
  return new Intl.NumberFormat("en-IN", {
    style: "currency", currency: "INR",
    minimumFractionDigits: compact && Math.abs(number) >= 100000 ? 0 : 2,
    maximumFractionDigits: compact && Math.abs(number) >= 100000 ? 0 : 2
  }).format(number);
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

function currentDateString() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[char]);
}

function setCategories(type, selected = "") {
  const list = categories[type] || categories.expense;
  els.category.innerHTML = list.map(category =>
    `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`
  ).join("");
  if (selected && list.includes(selected)) els.category.value = selected;
}

function populateCategoryFilter() {
  const selected = els.categoryFilter.value || "all";
  const allCategories = [...new Set(transactions.map(item => item.category))].sort((a, b) => a.localeCompare(b));
  els.categoryFilter.innerHTML = `<option value="all">All categories</option>` +
    allCategories.map(category => `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`).join("");
  if (allCategories.includes(selected)) els.categoryFilter.value = selected;
}

function totals() {
  const income = transactions.filter(item => item.type === "income").reduce((sum, item) => sum + Number(item.amount), 0);
  const expenses = transactions.filter(item => item.type === "expense").reduce((sum, item) => sum + Number(item.amount), 0);
  const now = new Date();
  const monthExpenses = transactions.filter(item => {
    const date = new Date(`${item.date}T00:00:00`);
    return item.type === "expense" && date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
  }).reduce((sum, item) => sum + Number(item.amount), 0);
  return { income, expenses, balance: income - expenses, monthExpenses };
}

function renderSummary() {
  const data = totals();
  els.balance.textContent = money(data.balance);
  els.income.textContent = money(data.income);
  els.expenses.textContent = money(data.expenses);
  els.monthSpent.textContent = money(data.monthExpenses);
  els.monthCaption.textContent = `${new Date().toLocaleDateString("en-IN", { month: "long" })} expenses`;
  els.donutTotal.textContent = money(data.expenses, true);
}

function getFilteredTransactions() {
  const search = els.search.value.trim().toLowerCase();
  const type = els.typeFilter.value;
  const category = els.categoryFilter.value;
  const result = transactions.filter(item => {
    const matchesSearch = !search || [item.title, item.category, item.note || ""].some(value => value.toLowerCase().includes(search));
    const matchesType = type === "all" || item.type === type;
    const matchesCategory = category === "all" || item.category === category;
    return matchesSearch && matchesType && matchesCategory;
  });
  switch (els.sort.value) {
    case "oldest": result.sort((a, b) => a.date.localeCompare(b.date)); break;
    case "amountHigh": result.sort((a, b) => Number(b.amount) - Number(a.amount)); break;
    case "amountLow": result.sort((a, b) => Number(a.amount) - Number(b.amount)); break;
    default: result.sort((a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt);
  }
  return result;
}

function renderTransactions() {
  const items = getFilteredTransactions();
  els.list.innerHTML = items.map(item => {
    const icon = categoryIcons[item.category] || (item.type === "income" ? "↙" : "•");
    const amountPrefix = item.type === "income" ? "+" : "−";
    const note = item.note ? `<span class="transaction-note">${escapeHTML(item.note)}</span>` : "";
    return `<tr>
      <td><div class="transaction-name"><span class="transaction-avatar ${item.type}">${icon}</span><span><span class="transaction-title">${escapeHTML(item.title)}</span>${note}</span></div></td>
      <td><span class="category-pill">${escapeHTML(item.category)}</span></td>
      <td>${formatDate(item.date)}</td>
      <td><span class="amount ${item.type}">${amountPrefix}${money(item.amount)}</span></td>
      <td><div class="row-actions"><button class="row-action" data-action="edit" data-id="${item.id}" aria-label="Edit ${escapeHTML(item.title)}" title="Edit">✎</button><button class="row-action" data-action="delete" data-id="${item.id}" aria-label="Delete ${escapeHTML(item.title)}" title="Delete">×</button></div></td>
    </tr>`;
  }).join("");
  els.empty.classList.toggle("visible", items.length === 0);
  els.list.style.display = items.length === 0 ? "none" : "";
  els.resultCount.textContent = `${items.length} transaction${items.length === 1 ? "" : "s"}${items.length !== transactions.length ? ` of ${transactions.length}` : ""}`;
}

function renderInsights() {
  const byCategory = {};
  transactions.filter(item => item.type === "expense").forEach(item => {
    byCategory[item.category] = (byCategory[item.category] || 0) + Number(item.amount);
  });
  const entries = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const total = entries.reduce((sum, entry) => sum + entry[1], 0);
  if (!entries.length || total <= 0) {
    els.donut.style.background = "conic-gradient(#e9edf2 0deg 360deg)";
    els.legend.innerHTML = `<div class="legend-row"><span class="legend-dot" style="background:#e9edf2"></span><span class="legend-name">No expenses yet</span><span class="legend-amount">—</span></div>`;
    return;
  }
  let cumulative = 0;
  const segments = entries.map(([category, amount]) => {
    const start = cumulative;
    cumulative += amount / total * 360;
    return `${categoryColors[category] || "#9aa6b5"} ${start}deg ${cumulative}deg`;
  });
  els.donut.style.background = `conic-gradient(${segments.join(",")})`;
  els.legend.innerHTML = entries.slice(0, 5).map(([category, amount]) => `
    <div class="legend-row"><span class="legend-dot" style="background:${categoryColors[category] || "#9aa6b5"}"></span>
    <span class="legend-name">${escapeHTML(category)}</span><span class="legend-amount">${money(amount)}</span></div>
  `).join("");
}

function render() {
  renderSummary();
  populateCategoryFilter();
  renderTransactions();
  renderInsights();
}

function openModal(type = "expense", transaction = null) {
  els.form.reset();
  els.error.textContent = "";
  els.id.value = transaction ? transaction.id : "";
  els.modalTitle.textContent = transaction ? "Edit transaction" : "Add transaction";
  els.title.value = transaction ? transaction.title : "";
  els.amount.value = transaction ? transaction.amount : "";
  els.date.value = transaction ? transaction.date : currentDateString();
  els.note.value = transaction ? (transaction.note || "") : "";
  const chosenType = transaction ? transaction.type : type;
  els.type.value = chosenType;
  $$(".type-option").forEach(button => button.classList.toggle("selected", button.dataset.type === chosenType));
  setCategories(chosenType, transaction ? transaction.category : "");
  els.modal.classList.add("open");
  els.modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  setTimeout(() => els.title.focus(), 30);
}

function closeModal() {
  els.modal.classList.remove("open");
  els.modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function showToast(message) {
  els.toast.textContent = message;
  els.toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2600);
}

function handleSubmit(event) {
  event.preventDefault();
  els.error.textContent = "";
  const title = els.title.value.trim();
  const amount = Number(els.amount.value);
  const date = els.date.value;
  const type = els.type.value;
  const category = els.category.value;
  const note = els.note.value.trim();

  if (title.length < 2) {
    els.error.textContent = "Please enter a transaction name with at least 2 characters.";
    els.title.focus(); return;
  }
  if (!Number.isFinite(amount) || amount <= 0) {
    els.error.textContent = "Enter an amount greater than zero.";
    els.amount.focus(); return;
  }
  if (!date || date > currentDateString()) {
    els.error.textContent = "Choose a valid date that is not in the future.";
    els.date.focus(); return;
  }
  if (!category) {
    els.error.textContent = "Please choose a category.";
    els.category.focus(); return;
  }

  const existingIndex = transactions.findIndex(item => item.id === els.id.value);
  const transaction = {
    id: els.id.value || (crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`),
    title, amount: Math.round(amount * 100) / 100, date, type, category, note,
    createdAt: existingIndex >= 0 ? transactions[existingIndex].createdAt : Date.now()
  };
  if (existingIndex >= 0) {
    transactions[existingIndex] = transaction;
  } else {
    transactions.push(transaction);
  }
  if (!saveTransactions()) return;
  render();
  closeModal();
  showToast(existingIndex >= 0 ? "Transaction updated successfully." : "Transaction added successfully.");
}

function handleRowAction(event) {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const transaction = transactions.find(item => item.id === button.dataset.id);
  if (!transaction) return;
  if (button.dataset.action === "edit") {
    openModal(transaction.type, transaction);
  } else if (button.dataset.action === "delete") {
    if (!confirm(`Delete "${transaction.title}"? This action cannot be undone.`)) return;
    transactions = transactions.filter(item => item.id !== transaction.id);
    saveTransactions();
    render();
    showToast("Transaction deleted.");
  }
}

function exportCSV() {
  if (!transactions.length) {
    showToast("There are no transactions to export yet.");
    return;
  }
  const headers = ["Title", "Type", "Amount (INR)", "Category", "Date", "Note"];
  const rows = transactions
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(item => [item.title, item.type, item.amount, item.category, item.date, item.note || ""]);
  const csv = [headers, ...rows].map(row => row.map(value => {
    const safe = String(value).replace(/"/g, '""');
    return `"${safe}"`;
  }).join(",")).join("\r\n");
  const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `smartspend-transactions-${currentDateString()}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
  showToast("Transactions exported as CSV.");
}

function clearFilters() {
  els.search.value = "";
  els.typeFilter.value = "all";
  els.categoryFilter.value = "all";
  els.sort.value = "newest";
  renderTransactions();
}

$("#openAddBtn").addEventListener("click", () => openModal());
$("#emptyAddBtn").addEventListener("click", () => openModal());
$("#quickIncome").addEventListener("click", () => openModal("income"));
$("#quickExpense").addEventListener("click", () => openModal("expense"));
$("#closeModalBtn").addEventListener("click", closeModal);
$("#cancelModalBtn").addEventListener("click", closeModal);
els.modal.addEventListener("click", event => { if (event.target === els.modal) closeModal(); });
document.addEventListener("keydown", event => { if (event.key === "Escape" && els.modal.classList.contains("open")) closeModal(); });
$$(".type-option").forEach(button => button.addEventListener("click", () => {
  els.type.value = button.dataset.type;
  $$(".type-option").forEach(option => option.classList.toggle("selected", option === button));
  setCategories(button.dataset.type);
}));
els.form.addEventListener("submit", handleSubmit);
els.list.addEventListener("click", handleRowAction);
[els.search, els.typeFilter, els.categoryFilter, els.sort].forEach(element => {
  element.addEventListener(element === els.search ? "input" : "change", renderTransactions);
});
$("#clearFiltersBtn").addEventListener("click", clearFilters);
$("#exportBtn").addEventListener("click", exportCSV);
$("#viewAllBtn").addEventListener("click", () => {
  clearFilters();
  $("#transactions").scrollIntoView({ behavior: "smooth", block: "start" });
});
$("#todayLabel").textContent = new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }).toUpperCase();

setCategories("expense");
render();
