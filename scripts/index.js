const MenuButton = {
    toggle() {
        document
            .querySelector(".add-category-button")
            .classList
            .contains("active") ? MenuButton.close() : MenuButton.open()
    },
    open() {
        document
            .querySelectorAll(".menu-options")
            .forEach(button => button.classList.add("active"))
    },
    close() {
        document
            .querySelectorAll(".menu-options")
            .forEach(button => button.classList.remove("active"))
    }
}
const CategoryModal = {
    open() {
        document
            .querySelector("#category-modal")
            .classList
            .add("active")

        DOM.categoryModal()
    },
    close() {
        document
            .querySelector("#category-modal")
            .classList
            .remove("active")
    }
}
const CreateTransactionModal = {
    type: "expense",
    open(type = "expense") {
        CreateTransactionModal.type = type
        document
            .querySelector(".modal-overlay")
            .classList
            .add("active")

        DOM.createTransactionModal()
        DOM.updateCreateTransactionMode()
        DOM.updateTransactionPreview()
    },
    close() {
        document
            .querySelector(".modal-overlay")
            .classList
            .remove("active")
    }
}
const UpdateTransactionModal = {
    open(index) {
        document
            .querySelector("#update-transaction-modal")
            .classList
            .add("active")
        document
            .querySelector("#update-transaction-form")
            .setAttribute("aria-modal-index", index)

        DOM.updateTransactionModal(index)
    },
    close() {
        document
            .querySelector("#update-transaction-modal")
            .classList
            .remove("active")
    }
}
const OpeningBalanceModal = {
    open() {
        document
            .querySelector("#opening-balance-modal")
            .classList
            .add("active")
    },
    close() {
        document
            .querySelector("#opening-balance-modal")
            .classList
            .remove("active")
    }
}

const CardColor = {
    totalMonth: {
        positive() {
            document
                .querySelector(".card.total-month")
                .classList
                .remove("negative")
            document
                .querySelector(".card.total-month")
                .classList
                .add("positive")
        },
        negative() {
            document
                .querySelector(".card.total-month")
                .classList
                .remove("positive")
            document
                .querySelector(".card.total-month")
                .classList
                .add("negative")
        }
    },
    totalBalance: {
        positive() {
            document
                .querySelector(".card.total-balance")
                .classList
                .remove("negative")
            document
                .querySelector(".card.total-balance")
                .classList
                .add("positive")
        },
        negative() {
            document
                .querySelector(".card.total-balance")
                .classList
                .remove("positive")
            document
                .querySelector(".card.total-balance")
                .classList
                .add("negative")
        }
    }
}

const Calendar = {
    months: [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    activeMonth() {
        let month = Storage.getActiveMonth()

        if (!month) {
            month = new Date().getMonth()
            Storage.setActiveMonth(month)
        }

        return Number(month)
    },
    setActiveMonth(month) {
        Storage.setActiveMonth(month)
    },
    switchMonth(intention) {
        if (intention !== 'previous' && intention !== 'next') return

        const activeMonth = Calendar.activeMonth()

        if (intention === 'previous') {
            document
                .querySelector("#switch-previous-month-button")
                .disabled = true

            if (activeMonth === 0) return
        }
        else if (intention === 'next') {
            document
                .querySelector("#switch-next-month-button")
                .disabled = true

            if (activeMonth === Calendar.months.length -1) return
        }

        const switchMonth   = document.getElementById('switch-month')
        const previousMonth = document.getElementById('previous-month')
        const currentMonth  = document.getElementById('current-month')
        const nextMonth     = document.getElementById('next-month')

        const currentMonthAlignment   = (switchMonth.offsetWidth / 2) - (currentMonth.offsetWidth / 2)
        currentMonth.style.transition = 'left 300ms ease-in-out, right 300ms ease-in-out, opacity 150ms linear'
        currentMonth.style.opacity    = '0'

        if (intention === 'previous') {
            const previousMonthAlignment   = (switchMonth.offsetWidth / 2) - (previousMonth.offsetWidth / 2)
            previousMonth.style.transition = 'left 300ms ease-in-out, opacity 150ms linear'
            previousMonth.style.opacity    = '100'
            previousMonth.style.left       = `${previousMonthAlignment}px`

            currentMonth.style.left = `${currentMonthAlignment}px`
        }
        else if (intention === 'next') {
            const alignmentNextMonth   = (switchMonth.offsetWidth / 2) - (nextMonth.offsetWidth / 2)
            nextMonth.style.transition = 'right 300ms ease-in-out, opacity 150ms linear'
            nextMonth.style.opacity    = '100'
            nextMonth.style.right      = `${alignmentNextMonth}px`

            currentMonth.style.right = `${currentMonthAlignment}px`
        }

        setTimeout(() => {
            currentMonth.style.transition = 'none'
            currentMonth.style.opacity    = '100'

            if (intention === 'previous') {
                previousMonth.style.transition = 'none'
                previousMonth.style.opacity    = '0'
                previousMonth.style.left       = '0'

                currentMonth.style.left = '-50%'
                Calendar.setActiveMonth(Calendar.activeMonth()-1)
                DOM.updateCalendar()
            }
            else if (intention === 'next') {
                nextMonth.style.transition = 'none'
                nextMonth.style.opacity    = '0'
                nextMonth.style.right      = '0'

                currentMonth.style.right = '-50%'
                Calendar.setActiveMonth(Calendar.activeMonth()+1)
                DOM.updateCalendar()
            }

            if (activeMonth !== 1) {
                document
                    .querySelector("#switch-previous-month-button")
                    .disabled = false
            }
            if (activeMonth === Calendar.months.length -1) {
                document
                    .querySelector("#switch-next-month-button")
                    .disabled = false
            }

            App.reload()
        }, 300)
    }
}

const Storage = {
    get() {
        const transactions = JSON.parse(localStorage.getItem("dev.finances:transactions"))

        if (!transactions) {
            let newTransactions = []

            for (let index = 0; index < 12; index++) {
                newTransactions.push({
                    monthIndex: index,
                    totalMonth: 0,
                    transactions: []
                })
            }
            return newTransactions
        }

        return transactions
    },
    getTransactions(monthIndex)  {
        return Storage.get()[monthIndex].transactions
    },
    getOpeningBalances() {
        const openingBalances = JSON.parse(localStorage.getItem("dev.finances:openingBalances"))

        if (openingBalances) {
            let normalized = false

            for (let index = openingBalances.length; index < 12; index++) {
                openingBalances.push(0)
                normalized = true
            }

            if (normalized) Storage.setOpeningBalances(openingBalances)

            return openingBalances
        }

        const newOpeningBalances = []

        for (let index = 0; index < 12; index++) {
            newOpeningBalances.push(0)
        }

        const oldOpeningBalance = localStorage.getItem("dev.finances:openingBalance")
        if (oldOpeningBalance !== null) {
            newOpeningBalances[Calendar.activeMonth()] = Number(oldOpeningBalance)
            localStorage.removeItem("dev.finances:openingBalance")
        }

        Storage.setOpeningBalances(newOpeningBalances)

        return newOpeningBalances
    },
    getOpeningBalance(monthIndex = Calendar.activeMonth()) {
        return Storage.getOpeningBalances()[monthIndex] || ""
    },
    getOpeningBalanceCurrencies() {
        const currencies = JSON.parse(localStorage.getItem("dev.finances:openingBalanceCurrencies"))

        if (currencies) {
            let normalized = false

            for (let index = currencies.length; index < 12; index++) {
                currencies.push("BRL")
                normalized = true
            }

            if (normalized) Storage.setOpeningBalanceCurrencies(currencies)

            return currencies
        }

        const newCurrencies = []

        for (let index = 0; index < 12; index++) {
            newCurrencies.push("BRL")
        }

        Storage.setOpeningBalanceCurrencies(newCurrencies)

        return newCurrencies
    },
    getOpeningBalanceCurrency(monthIndex = Calendar.activeMonth()) {
        return Storage.getOpeningBalanceCurrencies()[monthIndex] || "BRL"
    },
    getActiveMonth() {
        return localStorage.getItem("dev.finances:activeMonth") || ""
    },
    getCategories() {
        return JSON.parse(localStorage.getItem("dev.finances:categories")) || ['lazer', 'carro', 'casa', 'trabalho']
    },
    getCategoryBudgets() {
        return JSON.parse(localStorage.getItem("dev.finances:categoryBudgets")) || {}
    },
    getProfile() {
        return JSON.parse(localStorage.getItem("dev.finances:profile")) || {
            name: "",
            savingGoal: 0,
            streak: 0,
            loggedIn: false
        }
    },
    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    },
    update(transactionIndex, transaction, monthIndex) {
        let transactionsList = Storage.get()
        let transactions = Storage.getTransactions(monthIndex)

        if (transactions) {
            if (transactions[transactionIndex]) {
                transactions[transactionIndex] = transaction
            }
        }
        transactionsList[monthIndex].transactions = transactions
        Transaction.set(transactionsList)
    },
    setOpeningBalances(openingBalances) {
        localStorage.setItem("dev.finances:openingBalances", JSON.stringify(openingBalances))
    },
    setOpeningBalanceCurrencies(currencies) {
        localStorage.setItem("dev.finances:openingBalanceCurrencies", JSON.stringify(currencies))
    },
    setOpeningBalance(openingBalance, monthIndex = Calendar.activeMonth()) {
        let openingBalances = Storage.getOpeningBalances()
        openingBalances[monthIndex] = openingBalance
        Storage.setOpeningBalances(openingBalances)
    },
    setOpeningBalanceCurrency(currency, monthIndex = Calendar.activeMonth()) {
        let currencies = Storage.getOpeningBalanceCurrencies()
        currencies[monthIndex] = currency
        Storage.setOpeningBalanceCurrencies(currencies)
    },
    setActiveMonth(month) {
        localStorage.setItem("dev.finances:activeMonth", month)
    },
    setProfile(profile) {
        localStorage.setItem("dev.finances:profile", JSON.stringify(profile))
    },
    updateCategory(category) {
        let categories = Storage.getCategories()
        categories.push(category)
        localStorage.setItem("dev.finances:categories", JSON.stringify(categories))
    },
    updateCategoryBudget(category, budget) {
        let budgets = Storage.getCategoryBudgets()
        budgets[category] = budget
        localStorage.setItem("dev.finances:categoryBudgets", JSON.stringify(budgets))
    },
    setCategory(category) {
        let categories = Storage.getCategories()
        categories = categories.filter(item => item !== category)
        localStorage.setItem("dev.finances:categories", JSON.stringify(categories))

        let budgets = Storage.getCategoryBudgets()
        delete budgets[category]
        localStorage.setItem("dev.finances:categoryBudgets", JSON.stringify(budgets))
    }
}
const ProfileModal = {
    open() {
        document
            .querySelector("#profile-modal")
            .classList
            .add("active")

        DOM.profileModal()
    },
    close() {
        document
            .querySelector("#profile-modal")
            .classList
            .remove("active")
    }
}
const AuthModal = {
    open() {
        document
            .querySelector("#auth-modal")
            .classList
            .add("active")

        DOM.authModal()
    },
    close() {
        document
            .querySelector("#auth-modal")
            .classList
            .remove("active")
    }
}

const Transaction = {
    all: Storage.get(),
    add(transaction, monthIndex) {
        let transactionsList = Storage.get()
        transactionsList[monthIndex].transactions.push(transaction)
        Transaction.set(transactionsList)

        App.reload(true)
    },
    set(transactions) {
        Storage.set(transactions)
    },
    update(modalIndex, transaction, monthIndex) {
        Storage.update(modalIndex, transaction, monthIndex)

        App.reload(true)
    },
    addOpeningBalance(openingBalance) {
        Storage.setOpeningBalance(openingBalance.amount)
        Storage.setOpeningBalanceCurrency(openingBalance.currency)

        App.reload()
    },
    remove(index) {
        const monthIndex = Calendar.activeMonth()
        let transactionsList = Storage.get()
        transactionsList[monthIndex].transactions.splice(index, 1)
        Transaction.set(transactionsList)

        App.reload(true)
    },
    incomes() { // Somar entradas
        const monthIndex = Calendar.activeMonth()
        let income = 0

        Storage.getTransactions(monthIndex).forEach(transaction => {
            if (transaction.deposit) {
                if (transaction.amount > 0) {
                    income += transaction.amount
                }
            }
        })
        return income
    },
    expenses() { // Somar saídas
        const monthIndex = Calendar.activeMonth()
        let expense = 0

        Storage.getTransactions(monthIndex).forEach(transaction => {
            if (transaction.deposit) {
                if (transaction.amount < 0) {
                    expense += transaction.amount
                }
            }
        })
        return expense
    },
    categoryExpense(category, monthIndex = Calendar.activeMonth()) {
        let expense = 0

        Storage.getTransactions(monthIndex).forEach(transaction => {
            if (transaction.deposit && transaction.category === category && transaction.amount < 0) {
                expense += Math.abs(transaction.amount)
            }
        })

        return expense
    },
    totalMonth(allValues=false) {
        const monthIndex = Calendar.activeMonth()
        const openingBalance = Number(Storage.getOpeningBalance(monthIndex))

        const incomes = Transaction.incomes()
        const expenses = Transaction.expenses()

        const totalIE = incomes + expenses
        const totalIEWithOpeningBalance = incomes + expenses + openingBalance
        const totalMonth = totalIEWithOpeningBalance

        let transactionsList = Storage.get()
        transactionsList[monthIndex].totalMonth = totalIE
        Transaction.set(transactionsList)

        if (!allValues) return totalMonth
        return {incomes, expenses, totalMonth, openingBalance}
    },
    totalBalance() {
        const monthIndex = Calendar.activeMonth()

        let transactionsList = Storage.get()
        let totalBalance = 0

        for (let index = 0; index <= monthIndex; index++) {
            const openingBalance = Number(Storage.getOpeningBalance(index))
            const totalMonth = transactionsList[index].totalMonth
            totalBalance += openingBalance + totalMonth
        }

        return totalBalance
    },
    financialHealth() {
        const incomes = Number(Storage.getOpeningBalance()) + Transaction.incomes()
        const expenses = Math.abs(Transaction.expenses())
        const totalMonth = Transaction.totalMonth()
        let score = 100

        if (expenses > incomes) score -= 35
        if (expenses > incomes * 0.8) score -= 20
        if (totalMonth < 0) score -= 25
        if (Transaction.confirmedTransactions().length < 3) score -= 10
        if (incomes > expenses && incomes > 0) score += 10

        score = Math.max(0, Math.min(100, score))
        const status = score >= 70 ? "healthy" : score >= 40 ? "warning" : "critical"
        const title = Transaction.financialHealthTitle(score)
        const usagePercent = incomes > 0 ? Math.round((expenses / incomes) * 100) : 0

        if (incomes === 0 && expenses === 0) {
            return {
                status: "neutral",
                title: "Sem dados",
                message: "Registre entradas e saídas para acompanhar sua saúde financeira do mês."
            }
        }

        if (incomes === 0) {
            return {
                status: "critical",
                title: "Ruim",
                score,
                message: "Você registrou saídas sem entradas confirmadas neste mês."
            }
        }

        return {
            status,
            title,
            score,
            message: `Saúde ${title}: suas despesas representam ${usagePercent}% das receitas.`
        }

    },
    financialHealthTitle(score) {
        if (score >= 70) return "Boa"
        if (score >= 40) return "Média"
        return "Ruim"
    },
    averageBalance() {
        const activeMonth = Calendar.activeMonth()
        const transactionsList = Storage.get()
        let total = 0
        let count = 0

        for (let index = 0; index <= activeMonth; index++) {
            const openingBalance = Number(Storage.getOpeningBalance(index))
            const monthTotal = Number(transactionsList[index].totalMonth || 0)

            if (openingBalance !== 0 || monthTotal !== 0 || Storage.getTransactions(index).length > 0) {
                total += openingBalance + monthTotal
                count++
            }
        }

        return count === 0 ? 0 : Math.round(total / count)
    },
    confirmedTransactions() {
        return Storage
            .getTransactions(Calendar.activeMonth())
            .filter(transaction => transaction.deposit)
    },
    activityStreak() {
        const days = Transaction
            .confirmedTransactions()
            .map(transaction => Utils.unFormatDate(transaction.date))
            .sort()

        if (days.length === 0) return 0

        const uniqueDays = [...new Set(days)]
        let streak = 1
        let currentDate = new Date(`${uniqueDays[uniqueDays.length - 1]}T00:00:00`)

        for (let index = uniqueDays.length - 2; index >= 0; index--) {
            currentDate.setDate(currentDate.getDate() - 1)

            if (uniqueDays[index] !== currentDate.toISOString().slice(0, 10)) break

            streak++
        }

        return streak
    },
    behaviorProfile() {
        const transactions = Transaction.confirmedTransactions()
        const incomes = Number(Storage.getOpeningBalance()) + Transaction.incomes()
        const expenses = Math.abs(Transaction.expenses())
        const totalMonth = Transaction.totalMonth()

        if (totalMonth < 0) return "Em recuperação"
        if (transactions.length >= 8) return "Organizado"
        if (incomes > expenses && incomes > 0) return "Controlado"
        if (expenses >= incomes * 0.8 && incomes > 0) return "Em atenção"
        return "Em construção"
    }
}

const DOM = {
    transactionsContainer: document.querySelector("#data-table tbody"),
    updateAuthArea() {
        const authActions = document.querySelector("#authActions")
        const profile = Storage.getProfile()
        const profileName = Utils.escapeHTML(profile.name || "Perfil")

        if (!authActions) return

        if (profile.loggedIn) {
            authActions.innerHTML = `
                <button type="button" class="auth-profile-button" onclick="ProfileModal.open()" aria-label="Abrir perfil OTO">
                    <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <path d="M20 21V19C20 16.8 18.2 15 16 15H8C5.8 15 4 16.8 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M12 11C14.2 11 16 9.2 16 7C16 4.8 14.2 3 12 3C9.8 3 8 4.8 8 7C8 9.2 9.8 11 12 11Z" stroke="currentColor" stroke-width="2"/>
                    </svg>
                    <span>${profileName}</span>
                </button>
                <button type="button" class="auth-logout-button" onclick="AuthForm.logout()" aria-label="Sair">
                    <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none">
                        <path d="M10 17L15 12L10 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M15 12H3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M12 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                </button>
            `
            return
        }

        authActions.innerHTML = `
            <button type="button" class="auth-login-button" onclick="AuthModal.open()" aria-label="Login ou registre-se">
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none">
                    <path d="M15 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M10 17L15 12L10 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M15 12H3" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                <span>Login / Registre-se</span>
            </button>
        `
    },
    authModal() {
        const profile = Storage.getProfile()
        const profileName = Utils.escapeHTML(profile.name || "Perfil sem apelido")

        document
            .querySelector("#auth-name")
            .value = profile.name || ""
    },
    addTransaction(transactions, index) {
        const deposit = transactions.deposit ? "deposit-activated" : "deposit-not-activated"

        const tr = document.createElement("tr")
        tr.innerHTML = DOM.innerHTMLTransaction(transactions, index)
        tr.classList.add(`${deposit}`)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transactions, index) {
        const CSSclass = transactions.amount > 0 ? "income" : "expense"
        const amount = Utils.formatCurrency(transactions.amount)
        const UpdateTransactionModal_func = `UpdateTransactionModal.open(${index})`
        const html = `
        <td onClick="${UpdateTransactionModal_func}" class="description">${transactions.description}</td>
        <td onClick="${UpdateTransactionModal_func}" class="description">${String(transactions.category)[0].toUpperCase() + String(transactions.category).substring(1)}</td>
        <td onClick="${UpdateTransactionModal_func}" class="${CSSclass}">${amount}</td>
        <td onClick="${UpdateTransactionModal_func}" class="date">${transactions.date}</td>
        <td onclick="Transaction.remove(${index})" class="center-item">
            <img src="./assets/minus.svg" class="remove" alt="Remover Transação">
        </td>
        `
        return html
    },
    categoryModal() {
        const categoryGroup = document.querySelector(".category-group")
        const categoryBudgetGroup = document.querySelector(".category-budget-group")
        const categories = Storage.getCategories()
        const budgets = Storage.getCategoryBudgets()

        categoryGroup.innerHTML = ""
        categoryBudgetGroup.innerHTML = ""
        for (let index = 0; index < categories.length; index++) {
            const category = categories[index]

            const p = document.createElement("p")
            p.value = category
            p.innerHTML = category

            categoryGroup.appendChild(p)

            const budget = Number(budgets[category] || 0)
            const spent = Transaction.categoryExpense(category)
            const remaining = budget - spent
            const percent = budget > 0 ? Math.min(Math.round((spent / budget) * 100), 999) : 0
            const status = budget === 0 ? "neutral" : percent >= 100 ? "critical" : percent >= 80 ? "warning" : "healthy"

            const article = document.createElement("article")
            article.classList.add("category-budget-card", status)
            article.innerHTML = `
                <strong>${String(category)[0].toUpperCase() + String(category).substring(1)}</strong>
                <span>Limite: ${budget > 0 ? Utils.formatCurrency(budget) : "sem limite"}</span>
                <span>Gasto: ${Utils.formatCurrency(spent)}</span>
                <span>Restante: ${budget > 0 ? Utils.formatCurrency(remaining) : "não definido"}</span>
                <span>Status: ${budget > 0 ? `${percent}% usado` : "configure um limite"}</span>
                <div class="category-budget-edit">
                    <input type="text" placeholder="Novo limite" inputmode="decimal" value="${budget > 0 ? Utils.formatSimpleAmountToText(String(budget)) : ""}">
                    <button type="button">Salvar</button>
                </div>
            `
            article
                .querySelector("button")
                .addEventListener("click", () => {
                    const input = article.querySelector("input")
                    const value = input.value.trim()

                    if (value !== "" && isNaN(Number(String(value).replace(",", ".")))) {
                        toastError("Por favor, preencha o limite corretamente!")
                        return
                    }

                    Storage.updateCategoryBudget(category, value === "" ? 0 : Utils.formatAmount(value))
                    DOM.categoryModal()
                    DOM.updateTransactionPreview()
                })

            categoryBudgetGroup.appendChild(article)
        }
    },
    createTransactionModal() {
        const select = document.querySelector("#category")
        const categories = Storage.getCategories()

        select.innerHTML = ""

        const option = document.createElement("option")
        option.value = '-1'
        option.innerHTML = 'Selecione a categoria:'
        select.appendChild(option)

        if (CreateTransactionModal.type === "income") {
            const incomeOption = document.createElement("option")
            incomeOption.value = "ganho não programado"
            incomeOption.innerHTML = "Ganho não programado"
            select.appendChild(incomeOption)
        }

        for (let index = 0; index < categories.length; index++) {
            const category = categories[index]

            const option = document.createElement("option")
            option.value = category
            option.innerHTML = category

            select.appendChild(option)
        }

        if (CreateTransactionModal.type === "income") {
            select.value = "ganho não programado"
        }
    },
    updateCreateTransactionMode() {
        const isIncome = CreateTransactionModal.type === "income"

        document
            .querySelector("#create-transaction-title")
            .innerHTML = isIncome ? "Novo ganho não programado" : "Novo gasto"
        document
            .querySelector("#description")
            .placeholder = isIncome ? "Descrição do ganho" : "Descrição do gasto"
        document
            .querySelector("#create-transaction-help")
            .innerHTML = isIncome
                ? "Informe o valor sem sinal. Este ganho será somado às entradas do mês."
                : "Informe o valor sem sinal. Este gasto será abatido do saldo e do resultado do mês."
    },
    updateTransactionModal(modalIndex) {
        const monthIndex = Calendar.activeMonth()
        const {category, description, amount, date, deposit} = Storage.getTransactions(monthIndex)[modalIndex]

        const select = document.querySelector("#update-category")
        const categories = Storage.getCategories()

        select.innerHTML = ""
        for (let index = 0; index < categories.length; index++) {
            const category = categories[index]

            const option = document.createElement("option")
            option.value = category
            option.innerHTML = category

            select.appendChild(option)
        }

        if (!categories.includes(category)) {
            const option = document.createElement("option")
            option.value = category
            option.innerHTML = String(category)[0].toUpperCase() + String(category).substring(1)

            select.appendChild(option)
        }

        document
            .querySelector("#update-category")
            .value = category
        document
            .querySelector("#update-description")
            .value = description
        document
            .querySelector("#update-amount")
            .value = Utils.formatSimpleAmountToText(String(amount))
        document
            .querySelector("#update-date")
            .value = Utils.unFormatDate(date)
        document
            .querySelector("#update-deposit")
            .checked = deposit
    },
    updateOpeningBalance() {
        const currency = Storage.getOpeningBalanceCurrency()

        document
            .querySelector("#openingBalanceDisplay")
            .innerHTML = Utils.formatCurrency(Storage.getOpeningBalance(), currency)
        document
            .querySelector("#opening-balance-amount")
            .value = Utils.formatSimpleAmountToText(String(Storage.getOpeningBalance()))
        document
            .querySelector("#opening-balance-currency")
            .value = currency
    },
    updateBalance() {
        const currency = Storage.getOpeningBalanceCurrency()
        const {incomes, expenses, totalMonth} = Transaction.totalMonth(true)
        const totalBalance = Transaction.totalBalance()
        const financialHealth = Transaction.financialHealth()

        document
            .querySelector("#incomeDisplay")
            .innerHTML = Utils.formatCurrency(incomes, currency)
        document
            .querySelector("#expenseDisplay")
            .innerHTML = Utils.formatCurrency(expenses, currency)
        document
            .querySelector("#totalMonthDisplay")
            .innerHTML = Utils.formatCurrency(totalMonth, currency)
        document
            .querySelector("#totalBalanceDisplay")
            .innerHTML = Utils.formatCurrency(totalBalance, currency)
        DOM.updateFinancialHealth(financialHealth)
    },
    updateFinancialHealth(financialHealth) {
        const card = document.querySelector("#financialHealthCard")

        card.classList.remove("excellent", "healthy", "warning", "critical", "neutral")
        card.classList.add(financialHealth.status)

        document
            .querySelector("#financialHealthBadge")
            .innerHTML = financialHealth.title
        document
            .querySelector("#financialHealthMessage")
            .innerHTML = financialHealth.message
    },
    profileModal() {
        const profile = Storage.getProfile()
        const financialHealth = Transaction.financialHealth()
        const currency = Storage.getOpeningBalanceCurrency()
        const averageBalance = Transaction.averageBalance()
        const behaviorProfile = Transaction.behaviorProfile()

        document
            .querySelector("#profile-name")
            .value = profile.name
        document
            .querySelector("#profile-saving-goal")
            .value = profile.savingGoal > 0 ? Utils.formatSimpleAmountToText(String(profile.savingGoal)) : ""

        document
            .querySelector("#profile-summary")
            .innerHTML = `
                <article class="profile-summary-card ${financialHealth.status}">
                    <strong>${profileName}</strong>
                    <span>Perfil: ${behaviorProfile}</span>
                    <span>Saúde financeira: ${financialHealth.title} (${financialHealth.score || 0}/100)</span>
                    <span>Meta de economia: ${profile.savingGoal > 0 ? Utils.formatCurrency(profile.savingGoal, currency) : "não definida"}</span>
                    <span>Saldo médio: ${Utils.formatCurrency(averageBalance, currency)}</span>
                    <span>Sequência: ${Transaction.activityStreak()} dia(s) com movimentações registradas</span>
                </article>
            `
    },
    updateTransactionPreview() {
        const preview = document.querySelector("#transaction-preview")
        const category = Form.category.value
        const amountValue = Form.amount.value
        const deposit = Form.deposit.checked
        const currency = Storage.getOpeningBalanceCurrency()

        preview.classList.remove("positive", "warning", "critical", "neutral")

        if (amountValue.trim() === "" || isNaN(Number(String(amountValue).replace(",", ".")))) {
            preview.classList.add("neutral")
            preview.innerHTML = `
                <strong>Prévia</strong>
                <p>Informe os dados da transação para visualizar o impacto no saldo.</p>
            `
            return
        }

        const amount = Form.formatAmountByType(Utils.formatAmount(amountValue))

        if (!deposit) {
            preview.classList.add("neutral")
            preview.innerHTML = `
                <strong>Prévia</strong>
                <p>Esta transação ficará aguardando depósito e ainda não altera o saldo.</p>
            `
            return
        }

        const currentBalance = Transaction.totalBalance()
        const nextBalance = currentBalance + amount
        const status = nextBalance < 0 ? "critical" : amount < 0 ? "warning" : "positive"
        let message = amount < 0
            ? `Seu saldo será reduzido de ${Utils.formatCurrency(currentBalance, currency)} para ${Utils.formatCurrency(nextBalance, currency)}.`
            : `Seu saldo aumentará para ${Utils.formatCurrency(nextBalance, currency)}.`

        if (category !== "-1" && amount < 0) {
            const budget = Number(Storage.getCategoryBudgets()[category] || 0)

            if (budget > 0) {
                const spent = Transaction.categoryExpense(category)
                const nextSpent = spent + Math.abs(amount)
                const percent = Math.round((nextSpent / budget) * 100)
                message += ` Categoria: ${percent}% do limite mensal usado.`
            }
        }

        preview.classList.add(status)
        preview.innerHTML = `
            <strong>${nextBalance < 0 ? "Atenção" : "Prévia"}</strong>
            <p>${nextBalance < 0 ? "Essa despesa deixará seu saldo negativo. " : ""}${message}</p>
        `
    },
    updateCalendar() {
        const activeMonth = Calendar.activeMonth()

        const previousMonth = activeMonth - 1
        const nextMonth     = activeMonth + 1

        let disabledPreviousMonth = false
        if (activeMonth === 0) disabledPreviousMonth = true

        let disabledNextMonth = false
        if (activeMonth === Calendar.months.length -1) disabledNextMonth = true

        document
            .querySelector("#switch-previous-month-button")
            .disabled = disabledPreviousMonth
        document
            .querySelector("#previous-month")
            .innerHTML = disabledPreviousMonth ? '' : Calendar.months[previousMonth]
        document
            .querySelector("#current-month")
            .innerHTML = Calendar.months[activeMonth]
        document
            .querySelector("#next-month")
            .innerHTML = disabledNextMonth ? '' : Calendar.months[nextMonth]
        document
            .querySelector("#switch-next-month-button")
            .disabled = disabledNextMonth
        document
            .querySelector("#year-calendar")
            .innerHTML = new Date().getFullYear()

    },
    totalCardColor(){
        const totalOfMonth = Transaction.totalMonth()
        if (totalOfMonth < 0) CardColor.totalMonth.negative()
        else CardColor.totalMonth.positive()

        const totalOfBalance = Transaction.totalBalance()
        if (totalOfBalance < 0) CardColor.totalBalance.negative()
        else CardColor.totalBalance.positive()
    },
    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    escapeHTML(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;")
    },
    formatCurrency(value, currency = "BRL") {
        const signal = Number(value) < 0 ? "-&nbsp;" : "+&nbsp;"

        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency,
        })

        return signal + value
    },
    formatAmount(value) {
        value = String(value).replace(",", ".")
        value = value * 100
        return Math.round(value)
    },
    formatSimpleAmountToText(value) {
        if (!value) return ""

        const decimalPlace = value.slice(-2)
        const integer = value.slice(0, -2)

        const formattedAmount = `${integer}.${decimalPlace}`

        return formattedAmount
    },
    formatSimple(value){
        const signal = Number(value) < 0 ? "- " : "+ "

        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        })

        return signal + value
    },
    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },
    unFormatDate(date) {
        const splittedDate = date.split("/")
        return `${splittedDate[2]}-${splittedDate[1]}-${splittedDate[0]}`
    }
}

const Form = {
    category:    document.querySelector("select#category"),
    description: document.querySelector("input#description"),
    amount:      document.querySelector("input#amount"),
    date:        document.querySelector("input#date"),
    deposit:     document.querySelector("input#deposit"),
    getValues() {

        return {
            category:    Form.category.value,
            description: Form.description.value,
            amount:      Form.amount.value,
            date:        Form.date.value,
            deposit:     Form.deposit.checked
        }
    },
    validateFields() {
        const {category, description, amount, date} = Form.getValues()

        if (category === '-1' || description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos!")
        }
    },
    formatValues() {
        let {category, description, amount, date, deposit} = Form.getValues()

        amount = Form.formatAmountByType(Utils.formatAmount(amount))
        date   = Utils.formatDate(date)

        return {
            category,
            description,
            amount,
            date,
            deposit
        }
    },
    formatAmountByType(amount) {
        const unsignedAmount = Math.abs(amount)

        return CreateTransactionModal.type === "income"
            ? unsignedAmount
            : -unsignedAmount
    },
    saveTransaction(transaction, monthIndex) {
        Transaction.add(transaction, monthIndex)
    },
    getDataByTransaction(date) {
        const cleanedDate  = String(date).replace(/\D/g, "")
        let monthIndex = cleanedDate.substring(2, 4)

        if (monthIndex.charAt(0) === '0') {
            monthIndex = monthIndex.substring(1) // Remove o primeiro caractere "0"
            monthIndex = String(Number(monthIndex) - 1)
        }

        return monthIndex
    },
    clearFields() {
        Form.category.value    = "-1"
        Form.description.value = ""
        Form.amount.value      = ""
        Form.date.value        = ""
        Form.deposit.checked   = true
        DOM.updateTransactionPreview()
    },
    submit(event) {
        event.preventDefault()

        try {
            Form.validateFields()                                          // Verifica campos
            const transaction = Form.formatValues()                        // Formata valores
            const monthIndex = Form.getDataByTransaction(transaction.date) // Pega mês da transação
            Form.saveTransaction(transaction, monthIndex)                  // Adiciona valores
            Form.clearFields()                                             // Limpa campos

            CreateTransactionModal.close()                                                  // Fecha modal
        } catch (error) {
            console.warn(error.message)
            toastError(error.message)
            //alert(error.message)
        }
    }
}
const UpdateTransactionForm = {
    category:    document.querySelector("select#update-category"),
    description: document.querySelector("input#update-description"),
    amount:      document.querySelector("input#update-amount"),
    date:        document.querySelector("input#update-date"),
    deposit:     document.querySelector("input#update-deposit"),
    getValues() {
        return {
            category:    UpdateTransactionForm.category.value,
            description: UpdateTransactionForm.description.value,
            amount:      UpdateTransactionForm.amount.value,
            date:        UpdateTransactionForm.date.value,
            deposit:     UpdateTransactionForm.deposit.checked
        }
    },
    validateFields() {
        const {category, description, amount, date} = UpdateTransactionForm.getValues()

        if (category === '-1' || description.trim() === "" || amount.trim() === "" || date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos!")
        }
    },
    formatValues() {
        let {category, description, amount, date, deposit} = UpdateTransactionForm.getValues()

        amount = Utils.formatAmount(amount)
        date   = Utils.formatDate(date)

        return {
            category,
            description,
            amount,
            date,
            deposit
        }
    },
    saveTransaction(modalIndex, transaction, monthIndex) {
        Transaction.update(modalIndex, transaction, monthIndex)
    },
    submit(event) {
        event.preventDefault()
        const modalIndex = document
            .querySelector("#update-transaction-form")
            .getAttribute("aria-modal-index")

        try {
            UpdateTransactionForm.validateFields()                                      // Verifica campos
            const transaction = UpdateTransactionForm.formatValues()                    // Formata valores
            const monthIndex = Calendar.activeMonth()                                   // Pega mês ativo
            UpdateTransactionForm.saveTransaction(modalIndex, transaction, monthIndex)  // Adiciona valores
            UpdateTransactionModal.close()                                              // Fecha modal
        } catch (error) {
            console.warn(error.message)
            toastError(error.message)
        }
    }
}
const OpeningBalanceForm = {
    amount: document.querySelector("input#opening-balance-amount"),
    currency: document.querySelector("select#opening-balance-currency"),
    getValues() {
        return {
            amount: OpeningBalanceForm.amount.value,
            currency: OpeningBalanceForm.currency.value
        }
    },
    validateFields() {
        const {amount, currency} = OpeningBalanceForm.getValues()

        if (amount.trim() !== "" && isNaN(Number(String(amount).replace(",", ".")))) {
            throw new Error("Por favor, preencha o valor corretamente!")
        }

        if (currency.trim() === "") {
            throw new Error("Por favor, selecione uma moeda!")
        }
    },
    formatValues() {
        let {amount, currency} = OpeningBalanceForm.getValues()

        amount = amount.trim() === "" ? 0 : Utils.formatAmount(amount)

        return {
            amount,
            currency
        }
    },
    saveOpeningBalance(openingBalance) {
        Transaction.addOpeningBalance(openingBalance)
    },
    submit(event) {
        event.preventDefault()

        try {
            OpeningBalanceForm.validateFields()                      // Verifica campos
            const openingBalance = OpeningBalanceForm.formatValues() // Formata valores
            OpeningBalanceForm.saveOpeningBalance(openingBalance)    // Adiciona valores

            OpeningBalanceModal.close()                              // Fecha modal
        } catch (error) {
            console.warn(error.message)
            toastError(error.message)
        }
    }
}
const ProfileForm = {
    name: document.querySelector("input#profile-name"),
    savingGoal: document.querySelector("input#profile-saving-goal"),
    getValues() {
        return {
            name: ProfileForm.name.value,
            savingGoal: ProfileForm.savingGoal.value
        }
    },
    validateFields() {
        const {savingGoal} = ProfileForm.getValues()

        if (savingGoal.trim() !== "" && isNaN(Number(String(savingGoal).replace(",", ".")))) {
            throw new Error("Por favor, preencha a meta corretamente!")
        }
    },
    formatValues() {
        const {name, savingGoal} = ProfileForm.getValues()
        const currentProfile = Storage.getProfile()

        return {
            name: name.trim(),
            savingGoal: savingGoal.trim() === "" ? 0 : Utils.formatAmount(savingGoal),
            streak: currentProfile.streak || 0,
            loggedIn: currentProfile.loggedIn || false
        }
    },
    submit(event) {
        event.preventDefault()

        try {
            ProfileForm.validateFields()
            Storage.setProfile(ProfileForm.formatValues())
            DOM.profileModal()
            DOM.updateBalance()
            DOM.updateAuthArea()

            ProfileModal.close()
        } catch (error) {
            console.warn(error.message)
            toastError(error.message)
        }
    }
}
const AuthForm = {
    name: document.querySelector("input#auth-name"),
    getValues() {
        return {
            name: AuthForm.name.value
        }
    },
    validateFields() {
        const {name} = AuthForm.getValues()

        if (name.trim() === "") {
            throw new Error("Por favor, informe seu nome ou apelido!")
        }
    },
    submit(event) {
        event.preventDefault()

        try {
            AuthForm.validateFields()

            const {name} = AuthForm.getValues()
            const currentProfile = Storage.getProfile()

            Storage.setProfile({
                ...currentProfile,
                name: name.trim(),
                loggedIn: true
            })

            DOM.updateAuthArea()
            DOM.updateBalance()
            AuthModal.close()
        } catch (error) {
            console.warn(error.message)
            toastError(error.message)
        }
    },
    logout() {
        const currentProfile = Storage.getProfile()

        Storage.setProfile({
            ...currentProfile,
            loggedIn: false
        })

        ProfileModal.close()
        AuthModal.close()
        DOM.updateAuthArea()
    }
}
const CreateCategoryForm = {
    category: document.querySelector("input#create-category"),
    budget: document.querySelector("input#create-category-budget"),
    getValues() {
        return {
            category: CreateCategoryForm.category.value,
            budget: CreateCategoryForm.budget.value
        }
    },
    validateFields() {
        let {category, budget} = CreateCategoryForm.getValues()

        if (category.trim() === "") {
            throw new Error("Por favor, preencha o campo!")
        }

        if (budget.trim() !== "" && isNaN(Number(String(budget).replace(",", ".")))) {
            throw new Error("Por favor, preencha o limite corretamente!")
        }

        category = String(category).toLowerCase()

        let categories = Storage.getCategories()
        if (categories.includes(category)) {
            throw new Error("Esta categoria já existe, por favor preencha o campo com um valor diferente!")
        }
    },
    formatValues() {
        let {category, budget} = CreateCategoryForm.getValues()

        category = String(category).toLowerCase()
        budget = budget.trim() === "" ? 0 : Utils.formatAmount(budget)

        return {category, budget}
    },
    saveCategory({category, budget}) {
        Storage.updateCategory(category)
        Storage.updateCategoryBudget(category, budget)
    },
    clearFields() {
        CreateCategoryForm.category.value = ""
        CreateCategoryForm.budget.value = ""
    },
    submit(event) {
        event.preventDefault()

        try {
            CreateCategoryForm.validateFields()                    // Verifica campos
            const category = CreateCategoryForm.formatValues()     // Formata valores
            CreateCategoryForm.saveCategory(category)              // Adiciona valores
            CreateCategoryForm.clearFields()                       // Limpa campos

            CategoryModal.close()                            // Fecha modal
        } catch (error) {
            console.warn(error.message)
            toastError(error.message)
        }
    }

}
const DeleteCategoryForm = {
    category: document.querySelector("input#delete-category"),
    getValues() {
        return {
            category: DeleteCategoryForm.category.value
        }
    },
    validateFields() {
        let {category} = DeleteCategoryForm.getValues()

        if (category.trim() === "") {
            throw new Error("Por favor, preencha o campo!")
        }

        category = String(category).toLowerCase()

        let categories = Storage.getCategories()
        if (!categories.includes(category)) {
            throw new Error("Esta categoria não existe, por favor preencha o campo com um valor diferente!")
        }
    },
    formatValues() {
        let {category} = DeleteCategoryForm.getValues()

        category = String(category).toLowerCase()

        return category
    },
    saveCategory(category) {
        Storage.setCategory(category)
    },
    clearFields() {
        DeleteCategoryForm.category.value = ""
    },
    submit(event) {
        event.preventDefault()

        try {
            DeleteCategoryForm.validateFields()                    // Verifica campos
            const category = DeleteCategoryForm.formatValues()     // Formata valores
            DeleteCategoryForm.saveCategory(category)              // Adiciona valores
            DeleteCategoryForm.clearFields()                       // Limpa campos

            CategoryModal.close()                                  // Fecha modal
        } catch (error) {
            console.warn(error.message)
            toastError(error.message)
        }
    }

}

const App = {
    initAll() {
        App.initDOM()

        Storage.setOpeningBalances(Storage.getOpeningBalances())
        Storage.setOpeningBalanceCurrencies(Storage.getOpeningBalanceCurrencies())
        Storage.set(Storage.get())
    },
    initDOM() {
        Storage.getTransactions(Calendar.activeMonth())
            .forEach((transactions, index) => DOM.addTransaction(transactions, index))

        DOM.updateCalendar()        // Atualiza o mês ativo
        DOM.updateOpeningBalance()  // Atualiza o valor do saldo inicial
        DOM.updateBalance()         // Atualiza o valor dos cards
        DOM.updateAuthArea()        // Atualiza acesso e perfil
        DOM.totalCardColor()        // Atualiza a cor do card 'total'
    },
    reload(DOMOnly=false) {
        DOM.clearTransactions()
        if (DOMOnly) return App.initDOM()
        App.initAll()
    }
}
App.initAll()

Form.category.addEventListener("change", DOM.updateTransactionPreview)
Form.amount.addEventListener("input", DOM.updateTransactionPreview)
Form.date.addEventListener("change", DOM.updateTransactionPreview)
Form.deposit.addEventListener("change", DOM.updateTransactionPreview)



function toastError(message = "ERRO!") {
    /*let a = document.querySelector("???").innerHTML = `
    <div id="toast">
    <div class="img">Icon</div>
    <div class="description">${message}</div>
    </div>`*/

    const toastId = document.querySelector("#toast")
    toastId.className = "show"

    setTimeout(() => {
        toastId.className = toastId.className.replace("show", "")
    }, 5000)
}
