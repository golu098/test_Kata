document.addEventListener('DOMContentLoaded', () => {
    const descriptionInput = document.getElementById('description');
    const amountInput = document.getElementById('amount');
    const categorySelect = document.getElementById('category');
    const addExpenseBtn = document.getElementById('addExpenseBtn');
    const expenseList = document.getElementById('expenseList');
    const summaryList = document.getElementById('summaryList');
 
    let expenses = [];
    let editMode = false;
    let currentExpenseId = null;
 
    addExpenseBtn.addEventListener('click', () => {
        const description = descriptionInput.value.trim();
        const amount = parseFloat(amountInput.value.trim());
        const category = categorySelect.value;
 
        if (!description || isNaN(amount) || amount <= 0 || !category) {
            alert('Please fill in all fields with valid data.');
            return;
        }
 
        if (editMode) {
            updateExpense(currentExpenseId, description, amount, category);
        } else {
            addExpense(description, amount, category);
        }
 
        clearInputs();
        renderExpenses();
        updateSummary();
    });
 
    function addExpense(description, amount, category) {
        if(amount>0){
        const expense = { id: Date.now(), description, amount, category };
        expenses.push(expense);
        }
        else{
            alert("no negative amount");
        }
    }
 
    function updateExpense(id, description, amount, category) {
        const expenseIndex = expenses.findIndex(exp => exp.id === id);
        if (expenseIndex !== -1) {
            expenses[expenseIndex] = { id, description, amount, category };
        }
        // Reset edit mode after updating
        editMode = false;
        currentExpenseId = null;
        addExpenseBtn.textContent = "Add Expense";
    }
 
    function renderExpenses() {
        expenseList.innerHTML = '';
        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${expense.description} - Rs. ${expense.amount.toFixed(2)} (${expense.category})
                <div class="actions">
                    <button onclick="editExpense(${expense.id})">Edit</button>
                    <button onclick="deleteExpense(${expense.id})">Delete</button>
                </div>
            `;
            expenseList.appendChild(li);
        });
    }
 
    window.editExpense = function (id) {
        const expense = expenses.find(exp => exp.id === id);
        if (expense) {
            descriptionInput.value = expense.description;
            amountInput.value = expense.amount;
            categorySelect.value = expense.category;
            editMode = true;
            currentExpenseId = id;
            addExpenseBtn.textContent = "Update Expense";
        }
    }
 
    window.deleteExpense = function (id) {
        expenses = expenses.filter(exp => exp.id !== id);
        renderExpenses();
        updateSummary();
    }
 
    function updateSummary() {
        const summary = expenses.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
            return acc;
        }, {});
 
        summaryList.innerHTML = '';
        for (const [category, total] of Object.entries(summary)) {
            const li = document.createElement('li');
            li.textContent = `${category}: Rs. ${total.toFixed(2)}`;
            summaryList.appendChild(li);
        }
    }
 
    function clearInputs() {
        descriptionInput.value = '';
        amountInput.value = '';
        categorySelect.value = '';
        editMode = false;
        currentExpenseId = null;
        addExpenseBtn.textContent = "Add Expense";
    }
});
