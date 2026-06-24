// Load navbar component
fetch('addons/navbar.html')
  .then(res => res.text())
  .then(html => {
    document.getElementById('navbar-placeholder').innerHTML = html;
  })
  .catch(err => console.error('Failed to load navbar:', err));
