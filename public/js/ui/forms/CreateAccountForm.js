/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  /**
   * Создаёт счёт с помощью Account.create и закрывает
   * окно в случае успеха, а также вызывает App.update()
   * и сбрасывает форму
   * */
  onSubmit(data) {
    Account.create(data, (response, err) => {
			if (response.success === true) {
				App.getModal("register").reset();
				App.update();
				App.getModal("createAccount").close();

				return;
			}
		});

		console.error(err);
  }
}