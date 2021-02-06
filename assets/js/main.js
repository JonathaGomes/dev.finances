const buttonNewTransaction = document.querySelector("a.new");
const buttonCancel = document.querySelector("a.button.cancel");
const modal = document.querySelector(".modal-overlay");
let cardTotal = document.querySelector(".card.total");

buttonNewTransaction.addEventListener("click", () => {
	modal.classList.toggle("active");
});

buttonCancel.addEventListener("click", () => {
  modal.classList.toggle("active");
});

const Storage = {
  get() {
    return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];
  },
  set(transactions) {
    localStorage.setItem(
      "dev.finances:transactions",
      JSON.stringify(transactions)
    );
  },
};



const Transaction = {
  all: Storage.get(),
  add(transaction) {
    Transaction.all.push(transaction);
    App.reload();
  },
  remove(index) {
    const confirmRemove = window.confirm("Deseja mesmo excluir essa transação?");
    if (confirmRemove) {
      Transaction.all.splice(index, 1);
      App.reload();
    }
    
  },
  incomes() {
    let income = 0;
    Transaction.all.forEach((transaction) => {
      if (transaction.amount > 0) {
        income += transaction.amount;
      }
    });
    return income;
  },
  expenses() {
    let expense = 0;
    Transaction.all.forEach((transaction) => {
      if (transaction.amount < 0) {
        expense += transaction.amount;
      }
    });
    return expense;
  },
  total() {
    const total = Transaction.incomes() + Transaction.expenses();
    if (total < 0) {
      cardTotal.style.background = "#e92929";
    } else {
      cardTotal.style.background = "#49aa26";
    }
    return total
  },
};

const DOM = {
  transactionsContainer: document.querySelector("#data-table tbody"),
  addTransaction(transaction, index) {
    const tr = document.createElement("tr");
		tr.innerHTML = DOM.innerHMTMTransaction(transaction, index);
		tr.dataset.index = index

    DOM.transactionsContainer.appendChild(tr);
  },
  innerHMTMTransaction(transaction, index) {
    const CssClass = transaction.amount > 0 ? "income" : "expense";

    const amount = Utils.fomartCurrency(transaction.amount);

    const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CssClass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" class="delete-image" src="assets/img/minus.svg" alt="Remover Transação">
            </td>
        `;

    return html;
  },
  updateBalance() {
    document.getElementById("incomeDisplay").innerHTML = Utils.fomartCurrency(
      Transaction.incomes()
    );
    document.getElementById("expenseDisplay").innerHTML = Utils.fomartCurrency(
      Transaction.expenses()
    );
    document.getElementById("totalDisplay").innerHTML = Utils.fomartCurrency(
      Transaction.total()
    );
	},
	clearTransactions(){
		DOM.transactionsContainer.innerHTML = "";
	}
};

const Utils = {
  formatAmount(value) {
		value = Number(value) * 100

		return value
	},
	formatDate(date) {
		const splittedDate = date.split("-")
		return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
	},
  fomartCurrency(value) {
    const signal = Number(value) < 0 ? "-" : "";

    value = String(value).replace(/\D/g, "");

    value = Number(value) / 100;

    value = value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRl",
    });

    return signal + value;
  },
};

const Form = {
  description: document.querySelector("input#description"),
  amount: document.querySelector("input#amount"),
  date: document.querySelector("input#date"),

  getValues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value,
    };
  },
  formatValues() {
    let { description, amount, date } = Form.getValues();
    amount = Utils.formatAmount(amount);
    date = Utils.formatDate(date);
    return {
      description,
      amount,
      date,
    };
  },
  validateFields() {
    const { description, amount, date } = Form.getValues();
    if (
      description.trim() === "" ||
      amount.trim() === "" ||
      date.trim() === ""
    ) {
      throw new Error("Por favor, preencha todos os campos");
    }
	},
	clearFields() {
		Form.description.value = ""
		Form.amount.value = ""
		Form.date.value = "";
	},
  submit(event) {
    event.preventDefault();

    try {
      Form.validateFields();
      const transaction = Form.formatValues();
			Transaction.add(transaction); 
			Form.clearFields()
			modal.classList.toggle("active");
    } catch (error) {
      alert(error.message);
    }
  },
};

const App = {
	init(){
		Transaction.all.forEach((transaction, index) => {
      DOM.addTransaction(transaction, index);
    });

		DOM.updateBalance();

		Storage.set(Transaction.all)
	},
	reload(){
		DOM.clearTransactions()
		App.init()
	}
}


App.init()