const express = require('express');
const port = 9000;
const app = express();
const path = require('path');

app.use(express.json());


// apply different framing protections on the pages
app.use((req, res, next) => {
  
  // block framing using x-frame-options for social media page
  if (req.path === '/soc_med.html') {
    res.set('X-Frame-Options', 'DENY');
  }

  // block framing using CSP for banking page
  if (req.path === '/bank.html') {
    res.set('Content-Security-Policy', "frame-ancestors 'none';");
  } 
  
  // apply both protections for landing page
  if (req.path === '/') {
    res.set('X-Frame-Options', 'SAMEORIGIN');
    res.set('Content-Security-Policy', "frame-ancestors 'none';");
  }
  
  next();
});

app.use(express.static(path.join(__dirname, 'pages')));

// check if the user selects correct vulnerable site
app.post('/check-vulnerable', (req, res) => {
  const { site } = req.body;
  const correct = site === 'e_comm.html';
  res.json({ correct });
});

const fs = require('fs');
const filepath = path.join(__dirname, 'pages', 'victim.html');

// overwrite victim.html with attacker's payload
app.post('/write-to-victim', (req, res) => {
  const { code } = req.body;
  fs.writeFile(filepath, code, err => {
    if (err) {
      return res.json({ success: false });
    }
    res.json({ success: true });
  });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
