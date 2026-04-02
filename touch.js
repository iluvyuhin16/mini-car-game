// Touch control system for mobile racing game
// Supports: Virtual joystick (left) + Gas/Brake buttons (right)

var ongoingTouches = [];
var joystickTouchId = null;
var joystickDeltaX = 0;
var joystickDeltaY = 0;

// Track button states
var gasPressed = false;
var brakePressed = false;

function copyTouch({ identifier, pageX, pageY }) {
  return { identifier, pageX, pageY };
}

function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < ongoingTouches.length; i++) {
    if (ongoingTouches[i].identifier === idToFind) {
      return i;
    }
  }
  return -1;
}

class TouchControl {
  constructor(canvasTarget) {
    this.target = canvasTarget;
    this.joystickContainer = document.getElementById('joystickContainer');
    this.joystickBase = document.getElementById('joystickBase');
    this.joystickKnob = document.getElementById('joystickKnob');
    this.gasBtn = document.getElementById('gasBtn');
    this.brakeBtn = document.getElementById('brakeBtn');

    this.joystickCenterX = 0;
    this.joystickCenterY = 0;
    this.joystickRadius = 45;
    this.isJoystickActive = false;

    // Setup canvas touch events (for swipe gestures as fallback)
    canvasTarget.addEventListener('touchstart', this.handleStart.bind(this), { passive: false });
    canvasTarget.addEventListener('touchend', this.handleEnd.bind(this), { passive: false });
    canvasTarget.addEventListener('touchcancel', this.handleCancel.bind(this), { passive: false });
    canvasTarget.addEventListener('touchmove', this.handleMove.bind(this), { passive: false });

    // Joystick container touch events
    if (this.joystickContainer) {
      this.joystickContainer.addEventListener('touchstart', this.handleJoystickStart.bind(this), { passive: false });
      this.joystickContainer.addEventListener('touchmove', this.handleJoystickMove.bind(this), { passive: false });
      this.joystickContainer.addEventListener('touchend', this.handleJoystickEnd.bind(this), { passive: false });
      this.joystickContainer.addEventListener('touchcancel', this.handleJoystickEnd.bind(this), { passive: false });
    }

    // Gas button events
    if (this.gasBtn) {
      this.gasBtn.addEventListener('touchstart', this.handleGasStart.bind(this), { passive: false });
      this.gasBtn.addEventListener('touchend', this.handleGasEnd.bind(this), { passive: false });
      this.gasBtn.addEventListener('touchcancel', this.handleGasEnd.bind(this), { passive: false });
    }

    // Brake button events
    if (this.brakeBtn) {
      this.brakeBtn.addEventListener('touchstart', this.handleBrakeStart.bind(this), { passive: false });
      this.brakeBtn.addEventListener('touchend', this.handleBrakeEnd.bind(this), { passive: false });
      this.brakeBtn.addEventListener('touchcancel', this.handleBrakeEnd.bind(this), { passive: false });
    }

    // Setup initial joystick position
    this.setupJoystickPosition();

    // Handle window resize
    window.addEventListener('resize', this.setupJoystickPosition.bind(this));
  }

  setupJoystickPosition() {
    if (this.joystickBase) {
      var rect = this.joystickBase.getBoundingClientRect();
      this.joystickCenterX = rect.left + rect.width / 2;
      this.joystickCenterY = rect.top + rect.height / 2;
    }
  }

  // ---- Joystick Handlers ----
  handleJoystickStart(e) {
    e.preventDefault();
    e.stopPropagation();

    if (joystickTouchId === null) {
      var touch = e.changedTouches[0];
      joystickTouchId = touch.identifier;
      this.isJoystickActive = true;
      this.updateJoystick(touch.pageX, touch.pageY);
    }
  }

  handleJoystickMove(e) {
    e.preventDefault();
    e.stopPropagation();

    for (var i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === joystickTouchId) {
        this.updateJoystick(e.changedTouches[i].pageX, e.changedTouches[i].pageY);
        break;
      }
    }
  }

  handleJoystickEnd(e) {
    e.preventDefault();
    e.stopPropagation();

    for (var i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === joystickTouchId) {
        joystickTouchId = null;
        this.isJoystickActive = false;
        joystickDeltaX = 0;
        joystickDeltaY = 0;

        // Reset knob position with smooth animation
        if (this.joystickKnob) {
          this.joystickKnob.style.transform = 'translate(-50%, -50%)';
          this.joystickKnob.style.transition = 'transform 0.15s ease-out';
          setTimeout(() => {
            if (this.joystickKnob) {
              this.joystickKnob.style.transition = 'transform 0.05s ease-out';
            }
          }, 150);
        }
        break;
      }
    }
  }

  updateJoystick(touchX, touchY) {
    var dx = touchX - this.joystickCenterX;
    var dy = touchY - this.joystickCenterY;
    var distance = Math.sqrt(dx * dx + dy * dy);

    // Limit to joystick radius
    if (distance > this.joystickRadius) {
      dx = (dx / distance) * this.joystickRadius;
      dy = (dy / distance) * this.joystickRadius;
    }

    // Update knob position (knob moves within the base)
    if (this.joystickKnob) {
      this.joystickKnob.style.transform = 'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px))';
    }

    // Calculate normalized input (-1 to 1 for horizontal, -1 to 1 for vertical)
    // Horizontal: left is negative, right is positive
    // Vertical: up is negative (we don't really use this for racing)
    joystickDeltaX = dx / this.joystickRadius;
    joystickDeltaY = dy / this.joystickRadius;
  }

  // ---- Gas Button Handlers ----
  handleGasStart(e) {
    e.preventDefault();
    e.stopPropagation();
    gasPressed = true;
    this.gasBtn.classList.add('active');
  }

  handleGasEnd(e) {
    e.preventDefault();
    e.stopPropagation();
    gasPressed = false;
    if (this.gasBtn) {
      this.gasBtn.classList.remove('active');
    }
  }

  // ---- Brake Button Handlers ----
  handleBrakeStart(e) {
    e.preventDefault();
    e.stopPropagation();
    brakePressed = true;
    if (this.brakeBtn) {
      this.brakeBtn.classList.add('active');
    }
  }

  handleBrakeEnd(e) {
    e.preventDefault();
    e.stopPropagation();
    brakePressed = false;
    if (this.brakeBtn) {
      this.brakeBtn.classList.remove('active');
    }
  }

  // ---- Canvas Touch Handlers (fallback for swipe gestures) ----
  handleStart(e) {
    e.preventDefault();
    var touches = e.changedTouches;

    for (var i = 0; i < touches.length; i++) {
      // Don't add joystick touches to ongoingTouches
      if (touches[i].identifier !== joystickTouchId) {
        ongoingTouches.push(copyTouch(touches[i]));
      }
    }
  }

  handleMove(e) {
    e.preventDefault();
    var touches = e.changedTouches;

    for (var i = 0; i < touches.length; i++) {
      var idx = ongoingTouchIndexById(touches[i].identifier);
      if (idx >= 0) {
        ongoingTouches.splice(idx, 1, copyTouch(touches[i]));
      }
    }
  }

  handleEnd(e) {
    e.preventDefault();
    var touches = e.changedTouches;

    for (var i = 0; i < touches.length; i++) {
      var idx = ongoingTouchIndexById(touches[i].identifier);
      if (idx >= 0) {
        ongoingTouches.splice(idx, 1);
      }
    }
  }

  handleCancel(e) {
    e.preventDefault();
    var touches = e.changedTouches;

    for (var i = 0; i < touches.length; i++) {
      var idx = ongoingTouchIndexById(touches[i].identifier);
      if (idx >= 0) {
        ongoingTouches.splice(idx, 1);
      }
    }
  }
}

// Export for use in game - these are accessed directly by the game
// Note: joystickDeltaX and joystickDeltaY are set in the TouchControl class
window.TouchControl = TouchControl;
