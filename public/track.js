(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const referral = urlParams.get('referral');

  if (referral) {
    fetch('/api/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ referral: referral }),
    });
  }
})();
