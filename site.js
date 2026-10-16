document.querySelectorAll('form.nlform').forEach(f=>f.addEventListener('submit',e=>{const m=f.parentElement.querySelector('.nlmsg');
 if(f.dataset.pending){e.preventDefault();m.textContent="Signups open very soon. Nothing was sent or stored.";return}
 m.textContent="Almost there! Check your inbox to confirm your subscription (a Buttondown tab opened too).";}));
