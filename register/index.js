const form = document.getElementById('register-form');
const errorMessage = document.getElementById('form-error');
form.addEventListener('submit', (event) => {
  const username = form.elements['username'].value;
  const email = form.elements['email'].value;
  const password = form.elements['password'].value;
  event.preventDefault();
  errorMessage.textContent = ' ';
  console.log('register klikniety');
  console.log(username, email, password);
});
