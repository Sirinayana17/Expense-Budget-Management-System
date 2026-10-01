// 1. DOM SELECTION
const transactionForm =
    document.getElementById("transactionForm");

const transactionType =
    document.getElementById("transactionType");

const transactionTitle =
    document.getElementById("transactionTitle");

const transactionAmount =
    document.getElementById("transactionAmount");

const transactionCategory =
    document.getElementById("transactionCategory");

const transactionDate =
    document.getElementById("transactionDate");

const transactionDescription =
    document.getElementById("transactionDescription");

const transactionList =
    document.getElementById("transactionList");

const totalIncome =
    document.getElementById("totalIncome");

const totalExpense =
    document.getElementById("totalExpense");

const balance =
    document.getElementById("balance");

const monthlyBudget =
    document.getElementById("monthlyBudget");

const budgetInput =
    document.getElementById("budgetInput");

const setBudgetBtn =
    document.getElementById("setBudgetBtn");

const budgetDisplay =
    document.getElementById("budgetDisplay");

const budgetSpent =
    document.getElementById("budgetSpent");

const budgetRemaining =
    document.getElementById("budgetRemaining");

const budgetProgress =
    document.getElementById("budgetProgress");

const budgetMessage =
    document.getElementById("budgetMessage");

const searchInput =
    document.getElementById("searchInput");

const typeFilter =
    document.getElementById("typeFilter");

const categoryFilter =
    document.getElementById("categoryFilter");

const sortFilter =
    document.getElementById("sortFilter");

const categorySummary =
    document.getElementById("categorySummary");

const highestExpense =
    document.getElementById("highestExpense");

const averageExpense =
    document.getElementById("averageExpense");

const expenseCount =
    document.getElementById("expenseCount");

const incomeCount =
    document.getElementById("incomeCount");

const budgetStatus =
    document.getElementById("budgetStatus");

const formMessage =
    document.getElementById("formMessage");

const titleError =
    document.getElementById("titleError");

const amountError =
    document.getElementById("amountError");

const formTitle =
    document.getElementById("formTitle");

const submitBtn =
    document.getElementById("submitBtn");

const cancelEditBtn =
    document.getElementById("cancelEditBtn");

const clearAllBtn =
    document.getElementById("clearAllBtn");

// 2. APPLICATION STATE


let transactions = [];

let budget = 0;

let editingId = null;

// 3. ES6 CLASS


class Transaction {

    constructor(
        type,
        title,
        amount,
        category,
        date,
        description
    ) {

        this.id = Date.now() + Math.random();

        this.type = type;

        this.title = title;

        this.amount = amount;

        this.category = category;

        this.date = date;

        this.description = description;

    }

}
// 4. LOAD DATA FROM LOCAL STORAGE


function loadData() {

    try {

        const savedTransactions =
            localStorage.getItem("transactions");

        const savedBudget =
            localStorage.getItem("budget");


        if (savedTransactions) {

            transactions =
                JSON.parse(savedTransactions);

        }


        if (savedBudget) {

            budget =
                Number(savedBudget);

        }

    } catch (error) {

        console.error(
            "Error loading data:",
            error
        );

        transactions = [];

        budget = 0;

    }

}
// 5. SAVE DATA

function saveData() {

    try {

        localStorage.setItem(
            "transactions",
            JSON.stringify(transactions)
        );


        localStorage.setItem(
            "budget",
            JSON.stringify(budget)
        );

    } catch (error) {

        console.error(
            "Error saving data:",
            error
        );

    }

}
// 6. FORMAT CURRENCY


function formatCurrency(amount) {

    return `₹${amount.toLocaleString("en-IN")}`;

}
// 7. FORMAT DATE


function formatDate(date) {

    if (!date) {

        return "No date";

    }


    const dateObject =
        new Date(date);


    return dateObject.toLocaleDateString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}
// 8. SET TODAY'S DATE


function setDefaultDate() {

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    transactionDate.value = today;

}


// =====================================================
// 9. FORM VALIDATION
// =====================================================

function validateForm() {

    let isValid = true;


    titleError.textContent = "";

    amountError.textContent = "";

    formMessage.textContent = "";


    const title =
        transactionTitle.value.trim();


    const amount =
        Number(transactionAmount.value);


    // Title validation

    if (title === "") {

        titleError.textContent =
            "Title is required.";

        isValid = false;

    }


    // Amount validation

    if (
        transactionAmount.value === "" ||
        amount <= 0
    ) {

        amountError.textContent =
            "Enter a valid amount.";

        isValid = false;

    }


    // Title length

    if (
        title !== "" &&
        title.length < 2
    ) {

        titleError.textContent =
            "Title must contain at least 2 characters.";

        isValid = false;

    }


    return isValid;

}
// 10. ADD / UPDATE TRANSACTION


transactionForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        if (!validateForm()) {

            return;

        }


        const type =
            transactionType.value;

        const title =
            transactionTitle.value.trim();

        const amount =
            Number(transactionAmount.value);

        const category =
            transactionCategory.value;

        const date =
            transactionDate.value;

        const description =
            transactionDescription.value.trim();


        // UPDATE

        if (editingId !== null) {

            const transaction =
                transactions.find(
                    item =>
                        item.id === editingId
                );


            if (transaction) {

                transaction.type = type;

                transaction.title = title;

                transaction.amount = amount;

                transaction.category = category;

                transaction.date = date;

                transaction.description =
                    description;

            }


            formMessage.textContent =
                "Transaction updated successfully.";

        }

        // CREATE

        else {

            const newTransaction =
                new Transaction(
                    type,
                    title,
                    amount,
                    category,
                    date,
                    description
                );


            transactions.push(
                newTransaction
            );


            formMessage.textContent =
                "Transaction added successfully.";

        }


        saveData();

        resetForm();

        renderApplication();

    }
);
// 11. RESET FORM


function resetForm() {

    transactionForm.reset();

    setDefaultDate();


    editingId = null;


    formTitle.textContent =
        "Add Transaction";


    submitBtn.textContent =
        "Add Transaction";


    cancelEditBtn.classList.add(
        "hidden"
    );


    titleError.textContent = "";

    amountError.textContent = "";

}
// 12. CANCEL EDIT


cancelEditBtn.addEventListener(
    "click",
    function () {

        resetForm();

        formMessage.textContent = "";

    }
);
// 13. CALCULATE TOTAL INCOME

function calculateIncome() {

    return transactions

        .filter(
            transaction =>
                transaction.type === "income"
        )

        .reduce(
            (total, transaction) =>
                total + transaction.amount,
            0
        );

}
// 14. CALCULATE TOTAL EXPENSE


function calculateExpenses() {

    return transactions

        .filter(
            transaction =>
                transaction.type === "expense"
        )

        .reduce(
            (total, transaction) =>
                total + transaction.amount,
            0
        );

}
// 15. UPDATE DASHBOARD

function updateDashboard() {

    const income =
        calculateIncome();


    const expenses =
        calculateExpenses();


    const currentBalance =
        income - expenses;


    totalIncome.textContent =
        formatCurrency(income);


    totalExpense.textContent =
        formatCurrency(expenses);


    balance.textContent =
        formatCurrency(currentBalance);


    monthlyBudget.textContent =
        formatCurrency(budget);


    budgetDisplay.textContent =
        formatCurrency(budget);


    budgetSpent.textContent =
        formatCurrency(expenses);


    const remaining =
        budget - expenses;


    budgetRemaining.textContent =
        formatCurrency(
            Math.max(remaining, 0)
        );


    updateBudgetProgress(expenses);

}

// 16. BUDGET PROGRESS


function updateBudgetProgress(expenses) {

    if (budget <= 0) {

        budgetProgress.style.width =
            "0%";

        budgetMessage.textContent =
            "Set a monthly budget to track your spending.";

        budgetMessage.className =
            "message";

        return;

    }


    const percentage =
        (expenses / budget) * 100;


    const safePercentage =
        Math.min(percentage, 100);


    budgetProgress.style.width =
        `${safePercentage}%`;


    if (percentage > 100) {

        budgetMessage.textContent =
            "⚠️ Budget exceeded.";

        budgetMessage.className =
            "message warning";

    }

    else if (percentage >= 80) {

        budgetMessage.textContent =
            "⚠️ You are close to your budget limit.";

        budgetMessage.className =
            "message warning";

    }

    else {

        budgetMessage.textContent =
            "✓ You are within your budget.";

        budgetMessage.className =
            "message success";

    }

}

// 17. SET BUDGET


setBudgetBtn.addEventListener(
    "click",
    function () {

        const value =
            Number(budgetInput.value);


        if (value <= 0) {

            budgetMessage.textContent =
                "Please enter a valid budget.";

            return;

        }


        budget = value;


        budgetInput.value = "";


        saveData();

        updateDashboard();

    }
);
// 18. RENDER TRANSACTIONS


function renderTransactions(data) {

    transactionList.innerHTML = "";


    if (data.length === 0) {

        transactionList.innerHTML = `
            <div class="empty-state">
                <h3>No transactions found</h3>
                <p>Add a transaction or change your filters.</p>
            </div>
        `;

        return;

    }


    data.forEach(
        transaction => {

            const item =
                document.createElement("div");


            item.className =
                "transaction-item";


            const sign =
                transaction.type === "income"
                    ? "+"
                    : "-";


            const icon =
                transaction.type === "income"
                    ? "↑"
                    : "↓";


            item.innerHTML = `

                <div class="transaction-left">

                    <div class="transaction-icon ${transaction.type}">
                        ${icon}
                    </div>


                    <div class="transaction-details">

                        <h3>
                            ${escapeHTML(transaction.title)}
                        </h3>

                        <p>
                            ${escapeHTML(transaction.category)}
                            •
                            ${formatDate(transaction.date)}
                        </p>

                        ${
                            transaction.description
                                ? `<p>
                                    ${escapeHTML(
                                        transaction.description
                                    )}
                                   </p>`
                                : ""
                        }

                    </div>

                </div>


                <div class="transaction-right">

                    <span
                        class="transaction-amount ${transaction.type}">

                        ${sign}
                        ${formatCurrency(transaction.amount)}

                    </span>


                    <button
                        class="edit-btn"
                        data-action="edit"
                        data-id="${transaction.id}">

                        Edit

                    </button>


                    <button
                        class="delete-btn"
                        data-action="delete"
                        data-id="${transaction.id}">

                        Delete

                    </button>

                </div>

            `;


            transactionList.appendChild(item);

        }
    );

}
// 19. ESCAPE HTML


function escapeHTML(value) {

    const div =
        document.createElement("div");


    div.textContent =
        value;


    return div.innerHTML;

}
// 20. EVENT DELEGATION


transactionList.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest("button");


        if (!button) {

            return;

        }


        const action =
            button.dataset.action;


        const id =
            Number(button.dataset.id);


        if (action === "delete") {

            deleteTransaction(id);

        }


        if (action === "edit") {

            editTransaction(id);

        }

    }
);

// 21. DELETE TRANSACTION


function deleteTransaction(id) {

    const transaction =
        transactions.find(
            item => item.id === id
        );


    if (!transaction) {

        return;

    }


    const confirmed =
        confirm(
            `Delete "${transaction.title}"?`
        );


    if (!confirmed) {

        return;

    }


    transactions =
        transactions.filter(
            item => item.id !== id
        );


    saveData();

    renderApplication();

}
// 22. EDIT TRANSACTION


function editTransaction(id) {

    const transaction =
        transactions.find(
            item => item.id === id
        );


    if (!transaction) {

        return;

    }


    editingId =
        id;


    transactionType.value =
        transaction.type;


    transactionTitle.value =
        transaction.title;


    transactionAmount.value =
        transaction.amount;


    transactionCategory.value =
        transaction.category;


    transactionDate.value =
        transaction.date;


    transactionDescription.value =
        transaction.description;


    formTitle.textContent =
        "Edit Transaction";


    submitBtn.textContent =
        "Update Transaction";


    cancelEditBtn.classList.remove(
        "hidden"
    );


    window.scrollTo({
        top: 350,
        behavior: "smooth"
    });

}

// 23. SEARCH


searchInput.addEventListener(
    "input",
    renderApplication
);
// 24. TYPE FILTER


typeFilter.addEventListener(
    "change",
    renderApplication
);

// 25. CATEGORY FILTER


categoryFilter.addEventListener(
    "change",
    renderApplication
);
// 26. SORT


sortFilter.addEventListener(
    "change",
    renderApplication
);

// 27. GET FILTERED DATA


function getFilteredTransactions() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const type =
        typeFilter.value;


    const category =
        categoryFilter.value;


    const sort =
        sortFilter.value;


    let result =
        [...transactions];


    // SEARCH

    if (search !== "") {

        result =
            result.filter(
                transaction =>

                    transaction.title
                        .toLowerCase()
                        .includes(search)

                    ||

                    transaction.category
                        .toLowerCase()
                        .includes(search)

                    ||

                    transaction.description
                        .toLowerCase()
                        .includes(search)
            );

    }


    // TYPE

    if (type !== "all") {

        result =
            result.filter(
                transaction =>
                    transaction.type === type
            );

    }


    // CATEGORY

    if (category !== "all") {

        result =
            result.filter(
                transaction =>
                    transaction.category === category
            );

    }


    // SORT

    if (sort === "newest") {

        result.sort(
            (a, b) =>
                new Date(b.date) -
                new Date(a.date)
        );

    }


    else if (sort === "oldest") {

        result.sort(
            (a, b) =>
                new Date(a.date) -
                new Date(b.date)
        );

    }


    else if (sort === "highest") {

        result.sort(
            (a, b) =>
                b.amount - a.amount
        );

    }


    else if (sort === "lowest") {

        result.sort(
            (a, b) =>
                a.amount - b.amount
        );

    }


    else if (sort === "az") {

        result.sort(
            (a, b) =>
                a.title.localeCompare(b.title)
        );

    }
    return result;

}
// 28. CATEGORY ANALYTICS


function updateCategorySummary() {

    const expenseTransactions =
        transactions.filter(
            transaction =>
                transaction.type === "expense"
        );


    const categories = {};


    expenseTransactions.forEach(
        transaction => {

            if (
                categories[transaction.category]
            ) {

                categories[transaction.category]
                    += transaction.amount;

            }

            else {

                categories[transaction.category]
                    = transaction.amount;

            }

        }
    );


    const sortedCategories =
        Object.entries(categories)
            .sort(
                (a, b) =>
                    b[1] - a[1]
            );


    categorySummary.innerHTML = "";


    if (sortedCategories.length === 0) {

        categorySummary.innerHTML = `
            <p class="empty-state">
                No expense data available.
            </p>
        `;

        return;

    }


    const total =
        calculateExpenses();


    sortedCategories.forEach(
        ([category, amount]) => {

            const percentage =
                total > 0
                    ? (amount / total) * 100
                    : 0;


            const row =
                document.createElement("div");


            row.className =
                "category-row";


            row.innerHTML = `

                <div class="category-heading">

                    <span>
                        ${escapeHTML(category)}
                    </span>

                    <strong>
                        ${formatCurrency(amount)}
                    </strong>

                </div>


                <div class="category-bar-container">

                    <div
                        class="category-bar"
                        style="width: ${percentage}%">
                    </div>

                </div>

            `;


            categorySummary.appendChild(row);

        }
    );

}
// 29. STATISTICS


function updateStatistics() {

    const expenses =
        transactions.filter(
            transaction =>
                transaction.type === "expense"
        );


    const incomes =
        transactions.filter(
            transaction =>
                transaction.type === "income"
        );


    // Highest expense

    const highest =
        expenses.length > 0

            ? expenses.reduce(
                (max, current) =>
                    current.amount > max.amount
                        ? current
                        : max
            )

            : null;


    highestExpense.textContent =
        highest
            ? `${formatCurrency(highest.amount)} (${highest.title})`
            : "₹0";


    // Average

    const total =
        expenses.reduce(
            (sum, expense) =>
                sum + expense.amount,
            0
        );


    const average =
        expenses.length > 0
            ? total / expenses.length
            : 0;


    averageExpense.textContent =
        formatCurrency(
            Math.round(average)
        );


    expenseCount.textContent =
        expenses.length;


    incomeCount.textContent =
        incomes.length;


    // Every example

    const allExpensesPositive =
        expenses.length > 0 &&
        expenses.every(
            expense =>
                expense.amount > 0
        );


    // Some example

    const hasLargeExpense =
        expenses.some(
            expense =>
                expense.amount >= 10000
        );


    if (budget <= 0) {

        budgetStatus.textContent =
            "Not Set";

    }

    else if (
        hasLargeExpense ||
        !allExpensesPositive
    ) {

        budgetStatus.textContent =
            "Review Spending";

    }

    else if (
        calculateExpenses() > budget
    ) {

        budgetStatus.textContent =
            "Exceeded";

    }

    else {

        budgetStatus.textContent =
            "Within Budget";

    }

}
// 30. COMPLETE RENDER

function renderApplication() {

    const filteredTransactions =
        getFilteredTransactions();


    renderTransactions(
        filteredTransactions
    );


    updateDashboard();

    updateCategorySummary();

    updateStatistics();

}
// 31. CLEAR ALL DATA


clearAllBtn.addEventListener(
    "click",
    function () {

        if (transactions.length === 0) {

            alert("There are no transactions.");

            return;

        }


        const confirmed =
            confirm(
                "Are you sure you want to delete all transactions?"
            );


        if (!confirmed) {

            return;

        }


        transactions = [];

        budget = 0;


        localStorage.removeItem(
            "transactions"
        );


        localStorage.removeItem(
            "budget"
        );


        resetForm();

        renderApplication();

    }
);

// 32. KEYBOARD EVENT
transactionTitle.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            event.preventDefault();

            transactionAmount.focus();

        }

    }
);

// 33. INPUT EVENT


transactionTitle.addEventListener(
    "input",
    function () {

        if (
            transactionTitle.value.length > 0
        ) {

            titleError.textContent = "";

        }

    }
);



// 34. ASYNC / PROMISE DEMONSTRATION


function simulateLoading() {

    return new Promise(
        resolve => {

            setTimeout(
                function () {

                    resolve(
                        "Application loaded successfully"
                    );

                },
                300
            );

        }
    );

}


async function initializeApplication() {

    try {

        await simulateLoading();

        renderApplication();

    }

    catch (error) {

        console.error(
            "Initialization error:",
            error
        );

    }

}



// 35. INITIALIZE APPLICATION


loadData();

setDefaultDate();

initializeApplication();