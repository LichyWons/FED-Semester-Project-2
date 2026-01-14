const form = document.getElementById('register-form');
const errorMessage = document.getElementById('form-error-mail');
const passwordErrorMessage = document.getElementById('form-error-password');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  errorMessage.textContent = '';
  passwordErrorMessage.textContent = '';
  const username = form.elements['username'].value;
  const email = form.elements['email'].value;
  const password = form.elements['password'].value;
  const confirmPassword = form.elements['confirm-password'].value;

  if (!email.endsWith('@stud.noroff.no')) {
    errorMessage.textContent =
      ' Achtung!!! Email must be a stud.noroff.no address.';
    console.log('wrong email');
    return;
  }
  console.log('correct email');
  if (password !== confirmPassword) {
    passwordErrorMessage.textContent = 'Passwords do not match.';
    console.log('passwords do not match');
    return;
  }
  console.log('passwords match');
});
