function ExitIntentPopup() {
    let showPopup = false;
    let isHandlingExitIntent = false;
  
    function setShowPopup(newValue) {
      showPopup = newValue;
      updateModalContainerDisplay();
    }
  
    function handleExitIntent(event) {
      if (isHandlingExitIntent) return;
      isHandlingExitIntent = true;
  
      const enterTime = localStorage.getItem('enterTime');
      if (!enterTime) {
        localStorage.setItem('enterTime', Date.now().toString());
      }
  
      let pageVisits = parseInt(localStorage.getItem('pageVisits')) || 0;
      const timeOnWebsite = Date.now() - parseInt(localStorage.getItem('enterTime'), 10);
      const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  
      if ((timeOnWebsite >= 20000 || pageVisits >= 3 || scrollPercentage >= 30) && !event.relatedTarget) {
        const blockedTime = localStorage.getItem('exitIntentBlocked');
        if (!blockedTime || Date.now() - parseInt(blockedTime, 10) >= 172800000) {
          setShowPopup(true);
          localStorage.setItem('exitIntentBlocked', Date.now().toString());
        }
      }
  
      setTimeout(() => {
        isHandlingExitIntent = false;
      }, 1000);
    }
  
    function handlePageReload() {
      let pageVisits = parseInt(localStorage.getItem('pageVisits')) || 0;
      pageVisits += 1;
      localStorage.setItem('pageVisits', pageVisits.toString());
    }
  
    function handleRouteChange() {
      let pageVisits = parseInt(localStorage.getItem('pageVisits')) || 0;
      pageVisits += 1;
      localStorage.setItem('pageVisits', pageVisits.toString());
    }
  
    function updateModalContainerDisplay() {
      const modalContainer = document.getElementById('exit-intent-popup-container');
      if (modalContainer) {
        modalContainer.style.display = showPopup ? 'block' : 'none';
      }
    }
  
    // Initialize localStorage data if not already present
    if (!localStorage.getItem('enterTime')) {
      localStorage.setItem('enterTime', Date.now().toString());
    }
    if (!localStorage.getItem('pageVisits')) {
      localStorage.setItem('pageVisits', '0');
    }
  
    window.addEventListener('beforeunload', handlePageReload);
    document.addEventListener('mouseleave', handleExitIntent);
    window.addEventListener('routeChangeComplete', handleRouteChange);
  
    const modalContainer = document.createElement('div');
    modalContainer.setAttribute('id', 'exit-intent-popup-container');
    document.body.appendChild(modalContainer);
  
    modalContainer.innerHTML = `
      <div style="
        position: fixed;
        top: 30%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
        padding: 16px;
        border-radius: 8px;
        width: 90%; /* Responsive width */
        max-width: 600px; 
        text-align: center;
      ">
        <span style="position: absolute; top: 10px; right: 10px; cursor: pointer;" onclick="handleClosePopup()">X</span>
        <h6>Exit Intent Popup</h6>
        <p>Your popup content goes here.</p>
      </div>
    `;
  
    function handleClosePopup() {
      setShowPopup(false);
    }
  
    // Expose handleClosePopup to the global scope
    window.handleClosePopup = handleClosePopup;
  
    updateModalContainerDisplay();
  }
  
  // Example usage:
  ExitIntentPopup();
  