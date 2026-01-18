console.log('Index.js loaded');
import { toggleNavByAuth, initLogout } from './authNav.js';

document.addEventListener('DOMContentLoaded', () => {
  toggleNavByAuth();
  initLogout();
});
