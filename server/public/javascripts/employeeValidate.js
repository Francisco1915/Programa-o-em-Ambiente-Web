let form = document.querySelector("#form");

form.addEventListener("submit", (evento) => {
  if (
    form.classList.contains("validName") ||
    form.classList.contains("validEmail") ||
    form.classList.contains("validPhone") ||
    form.classList.contains("validPw")
  ) {
  } else {
    validateForm();
    evento.preventDefault();
  }
});

function validateForm() {
  errorEmail();
  errorName();
  errorPhone();
  errorPw();
}

function errorPw() {
  let form = document.getElementById("form");
  let pw = document.getElementById("pwInput").value;
  let text = document.getElementById("textPw");

  let validate = true; //EDITAR

  setError(form, text, validate, pw, "Pw")
}

function errorEmail() {
  let form = document.getElementById("form");
  let email = document.getElementById("emailInput").value;
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}/;
  let text = document.getElementById("textEmail");

  let validate = emailRegex.test(email);

  setError(form, text, validate, email, "Email");
}

function errorPhone() {
  let form = document.getElementById("form");
  let phone = document.getElementById("phoneInput").value;
  const phoneRegex = /(9[1236][0-9])([0-9]{3})([0-9]{3})/;
  let text = document.getElementById("textPhone");

  let validate = phoneRegex.test(phone);

  setError(form, text, validate, phone, "Phone");
}

function setError(form, text, validate, element, errorMsg) {

  if (validate) {
    form.classList.add("valid" + errorMsg);
    form.classList.remove("invalid" + errorMsg);
    text.innerHTML = "Your " + errorMsg + " is valid";
    text.style.color = "#00ff00";
    console.log("valid")
  } else {
    form.classList.remove("valid" + errorMsg);
    form.classList.add("invalid" + errorMsg);
    text.innerHTML = "Enter a valid " + errorMsg;
    text.style.color = "#ff0000";
    console.log("invalid")
  }

  if (element == "") {
    form.classList.remove("valid" + errorMsg);
    form.classList.add("invalid" + errorMsg);
    text.style.color = "#ff0000";
    text.innerHTML = "Caracter Obrigatorio";
    console.log("invalid")
  }
}

function errorName() {
  let form = document.getElementById("form");
  let name = document.getElementById("nameInput").value;
  let text = document.getElementById("textName");

  let validate = true;

  setError(form, text, validate, name, "Name");
}
