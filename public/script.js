document.addEventListener("DOMContentLoaded", function () {
  const idRadios = document.querySelectorAll('input[name="id-type"]');
  const idNumberInput = document.getElementById("id-number");

  idRadios.forEach(radio => {
    radio.addEventListener("change", function () {
      idNumberInput.disabled = false;
      idNumberInput.required = true;
      idNumberInput.placeholder = `Введіть ${this.value.toUpperCase()}`;
    });
  });

  const bankType = document.getElementById("bank-type");
  const swiftContainer = document.getElementById("swift-container");

  bankType.addEventListener("change", function () {
    swiftContainer.style.display = this.value === "other" ? "block" : "none";
  });

  const pitCheck = document.getElementById("pit-2023-check");
  const pitContainer = document.getElementById("pit-2023-container");

  pitCheck.addEventListener("change", function () {
    pitContainer.style.display = this.checked ? "block" : "none";
  });

  // Обработка выбора адреса
  const residenceCountry = document.getElementById("residence-country");
  const ukraineAddress = document.getElementById("ukraine-address");
  const polandAddress = document.getElementById("poland-address");
  const otherAddress = document.getElementById("other-address");

  residenceCountry.addEventListener("change", function () {
    ukraineAddress.style.display = this.value === "ukraine" ? "block" : "none";
    polandAddress.style.display = this.value === "poland" ? "block" : "none";
    otherAddress.style.display = this.value === "other" ? "block" : "none";
  });

  // Функция для создания блока загрузки файла с кнопкой удаления
  function createFileInput(name) {
    const wrapper = document.createElement("div");
    wrapper.className = "file-input-wrapper";

    const input = document.createElement("input");
    input.type = "file";
    input.name = name;
    input.accept = ".pdf, .jpg, .png";

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.className = "remove-file-btn";
    removeBtn.textContent = "Видалити файл";
    removeBtn.addEventListener("click", function () {
      wrapper.remove();
    });

    wrapper.appendChild(input);
    wrapper.appendChild(removeBtn);
    return wrapper;
  }

  // Добавление нового файла для ПІТ-11 за 2024 рік
  const addPit11FileBtn = document.getElementById("add-pit11-file");
  if (addPit11FileBtn) {
    addPit11FileBtn.addEventListener("click", function () {
      const container = document.getElementById("pit-11-container");
      container.appendChild(createFileInput("pit-11[]"));
    });
  }

  // Добавление нового файла для ПІТ-11 або ПІТ-37 за 2023 рік
  const addPit2023FileBtn = document.getElementById("add-pit2023-file");
  if (addPit2023FileBtn) {
    addPit2023FileBtn.addEventListener("click", function () {
      const container = document.getElementById("pit-2023-files");
      container.appendChild(createFileInput("pit-2023[]"));
    });
  }

  // Проверка наличия хотя бы одного файла для ПІТ-11 за 2024 рік при отправке формы
  const form = document.querySelector("form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();  // Prevent form submission to check files

    const pit11Files = document.querySelectorAll('input[name="pit-11[]"]');
    let fileSelected = false;
    pit11Files.forEach(fileInput => {
      if (fileInput.files.length > 0) {
        fileSelected = true;
      }
    });

    if (!fileSelected) {
      alert("Будь ласка, завантажте хоча б один файл для ПІТ-11 за 2024 рік.");
    } else {
      console.log('Форма отправляется!');
      // Если файл выбран, можно продолжить отправку формы
      form.submit();  // Подтверждаем отправку формы
    }
  });
});
