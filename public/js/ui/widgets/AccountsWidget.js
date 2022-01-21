/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */

class AccountsWidget {
	/**
	 * Устанавливает текущий элемент в свойство element
	 * Регистрирует обработчики событий с помощью
	 * AccountsWidget.registerEvents()
	 * Вызывает AccountsWidget.update() для получения
	 * списка счетов и последующего отображения
	 * Если переданный элемент не существует,
	 * необходимо выкинуть ошибку.
	 * */
	constructor(element) {
		if (!element) {
			throw new Error("Transmitted an empty element");
		}

		this.element = element;
		this.registerEvents();
		this.update();
	}

	/**
	 * При нажатии на .create-account открывает окно
	 * #modal-new-account для создания нового счёта
	 * При нажатии на один из существующих счетов
	 * (которые отображены в боковой колонке),
	 * вызывает AccountsWidget.onSelectAccount()
	 * */
	registerEvents() {
		document
			.querySelector(".create-account")
			.addEventListener("click", (e) => {
				e.preventDefault();
				App.getModal("createAccount").open();
			});

		this.menuItemsLinks = [...this.element.querySelectorAll(".account")];

		this.menuItemsLinks.forEach((menuItem) => {
			menuItem.addEventListener("click", (evt) => {
				this.onSelectAccount(evt.currentTarget);
			});
		});
	}

	/**
	 * Метод доступен только авторизованным пользователям
	 * (User.current()).
	 * Если пользователь авторизован, необходимо
	 * получить список счетов через Account.list(). При
	 * успешном ответе необходимо очистить список ранее
	 * отображённых счетов через AccountsWidget.clear().
	 * Отображает список полученных счетов с помощью
	 * метода renderItem()
	 * */
	update() {
		if (User.current()) {
			Account.list(User.current(), (err, response) => {
				if (response.success) {
					this.clear();
					this.renderItem(response.data);
					this.registerEvents();
				} else {
					console.error(err);
				}
			});
		}
	}

	/**
	 * Очищает список ранее отображённых счетов.
	 * Для этого необходимо удалять все элементы .account
	 * в боковой колонке
	 * */
	clear() {
		[...this.element.querySelectorAll(".account")].forEach((elem) => {
			elem.remove();
		});
	}

	/**
	 * Срабатывает в момент выбора счёта
	 * Устанавливает текущему выбранному элементу счёта
	 * класс .active. Удаляет ранее выбранному элементу
	 * счёта класс .active.
	 * Вызывает App.showPage( 'transactions', { account_id: id_счёта });
	 * */
	onSelectAccount(element) {
		this.menuItemsLinks.forEach((link) => {
			if (link.classList.contains("active")) {
				link.classList.remove("active");
			}
		});
		element.classList.add("active");
		App.showPage("transactions", { account_id: element.dataset.id });
	}

	/**
	 * Возвращает HTML-код счёта для последующего
	 * отображения в боковой колонке.
	 * item - объект с данными о счёте
	 * */
	getAccountHTML(item) {
		const li = document.createElement("li");
		const a = document.createElement("a");
		const spanName = document.createElement("span");
		const spanSum = document.createElement("span");

		li.classList.add("account");
		li.dataset.id = item.id;

		a.href = "#";
		a.style.display = "flex";
		a.style.justifyContent = "space-between";
		spanName.textContent = item.name;
		spanName.style.marginRight = "10px";
		spanSum.textContent = item.sum;

		a.appendChild(spanName);
		a.appendChild(spanSum);
		li.appendChild(a);

		return li;
	}

	/**
	 * Получает массив с информацией о счетах.
	 * Отображает полученный с помощью метода
	 * AccountsWidget.getAccountHTML HTML-код элемента
	 * и добавляет его внутрь элемента виджета
	 * */
	renderItem(data) {
		data.forEach((item) => {
			this.element.appendChild(this.getAccountHTML(item));
		});
	}
}
