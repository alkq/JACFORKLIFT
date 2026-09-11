// form-handler.js
document.querySelectorAll('form').forEach(form => {
  // Skip login form (VIC portal)
  if (form.closest('#loginState')) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const data = new FormData(form);

    try {
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        submitBtn.textContent = '✓ Sent Successfully';
        submitBtn.classList.add('bg-green-500');
        form.reset();
        setTimeout(() => {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          submitBtn.classList.remove('bg-green-500');
        }, 3000);
      } else {
        throw new Error('Submission failed');
      }
    } catch (error) {
      submitBtn.textContent = '✗ Try Again';
      submitBtn.classList.add('bg-red-500');
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        submitBtn.classList.remove('bg-red-500');
      }, 3000);
    }
  });
});