// Touch control system for mobile racing game
// Supports: Left/Right buttons + Push to the Max boost button

var leftBtnPressed = false;
var rightBtnPressed = false;
var boostPressed = false;

// isMobileDevice() is defined in index.html - do not redefine here

// Show touch controls on mobile
function initTouchControlsVisibility() {
  if (isMobileDevice()) {
    document.body.classList.add('mobile-device');
  }
}

class TouchControl {
  constructor(canvasTarget) {
    this.target = canvasTarget;
    this.leftBtn = document.getElementById('leftBtn');
    this.rightBtn = document.getElementById('rightBtn');
    this.boostBtn = document.getElementById('boostBtn');

    // Left button events
    if (this.leftBtn) {
      this.leftBtn.addEventListener('touchstart', this.handleLeftStart.bind(this), { passive: false });
      this.leftBtn.addEventListener('touchend', this.handleLeftEnd.bind(this), { passive: false });
      this.leftBtn.addEventListener('touchcancel', this.handleLeftEnd.bind(this), { passive: false });
      // Mouse events for desktop testing
      this.leftBtn.addEventListener('mousedown', this.handleLeftStart.bind(this));
      this.leftBtn.addEventListener('mouseup', this.handleLeftEnd.bind(this));
      this.leftBtn.addEventListener('mouseleave', this.handleLeftEnd.bind(this));
    }

    // Right button events
    if (this.rightBtn) {
      this.rightBtn.addEventListener('touchstart', this.handleRightStart.bind(this), { passive: false });
      this.rightBtn.addEventListener('touchend', this.handleRightEnd.bind(this), { passive: false });
      this.rightBtn.addEventListener('touchcancel', this.handleRightEnd.bind(this), { passive: false });
      // Mouse events for desktop testing
      this.rightBtn.addEventListener('mousedown', this.handleRightStart.bind(this));
      this.rightBtn.addEventListener('mouseup', this.handleRightEnd.bind(this));
      this.rightBtn.addEventListener('mouseleave', this.handleRightEnd.bind(this));
    }

    // Boost button events (Push to the Max)
    if (this.boostBtn) {
      this.boostBtn.addEventListener('touchstart', this.handleBoostStart.bind(this), { passive: false });
      this.boostBtn.addEventListener('touchend', this.handleBoostEnd.bind(this), { passive: false });
      this.boostBtn.addEventListener('touchcancel', this.handleBoostEnd.bind(this), { passive: false });
      // Mouse events for desktop testing
      this.boostBtn.addEventListener('mousedown', this.handleBoostStart.bind(this));
      this.boostBtn.addEventListener('mouseup', this.handleBoostEnd.bind(this));
    }
  }

  // ---- Left Button Handlers ----
  handleLeftStart(e) {
    e.preventDefault();
    e.stopPropagation();
    leftBtnPressed = true;
    if (this.leftBtn) {
      this.leftBtn.classList.add('active');
    }
  }

  handleLeftEnd(e) {
    e.preventDefault();
    e.stopPropagation();
    leftBtnPressed = false;
    if (this.leftBtn) {
      this.leftBtn.classList.remove('active');
    }
  }

  // ---- Right Button Handlers ----
  handleRightStart(e) {
    e.preventDefault();
    e.stopPropagation();
    rightBtnPressed = true;
    if (this.rightBtn) {
      this.rightBtn.classList.add('active');
    }
  }

  handleRightEnd(e) {
    e.preventDefault();
    e.stopPropagation();
    rightBtnPressed = false;
    if (this.rightBtn) {
      this.rightBtn.classList.remove('active');
    }
  }

  // ---- Boost Button Handlers (Push to the Max) ----
  handleBoostStart(e) {
    e.preventDefault();
    e.stopPropagation();
    boostPressed = true;
    if (this.boostBtn) {
      this.boostBtn.classList.add('active');
    }
    // Trigger boost activation if available
    if (typeof window.activateBoost === 'function') {
      window.activateBoost();
    }
  }

  handleBoostEnd(e) {
    e.preventDefault();
    e.stopPropagation();
    boostPressed = false;
    if (this.boostBtn) {
      this.boostBtn.classList.remove('active');
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  initTouchControlsVisibility();
  new TouchControl(document.getElementsByTagName('canvas')[0]);
});

// Also try immediate initialization if DOM is already ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(function() {
    initTouchControlsVisibility();
    new TouchControl(document.getElementsByTagName('canvas')[0]);
  }, 100);
}

// Export for use in game
window.TouchControl = TouchControl;
