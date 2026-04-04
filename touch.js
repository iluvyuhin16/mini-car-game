// Touch control system for mobile racing game
// Supports: Left/Right buttons + Push to the Max boost button

var leftBtnPressed = false;
var rightBtnPressed = false;
var boostPressed = false;

// Define isMobileDevice here so it's available globally
function isMobileDevice() {
  return (typeof window.ontouchstart !== 'undefined') ||
         (navigator.maxTouchPoints > 0) ||
         /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

function bindTouchBtn(el, onStart, onEnd) {
  if (!el) return;
  el.addEventListener('touchstart',  function(e) { e.preventDefault(); e.stopPropagation(); onStart(); }, { passive: false });
  el.addEventListener('touchend',    function(e) { e.preventDefault(); e.stopPropagation(); onEnd();   }, { passive: false });
  el.addEventListener('touchcancel', function(e) { e.preventDefault(); e.stopPropagation(); onEnd();   }, { passive: false });
  // Mouse fallback for desktop testing
  el.addEventListener('mousedown',  function(e) { onStart(); });
  el.addEventListener('mouseup',    function(e) { onEnd();   });
  el.addEventListener('mouseleave', function(e) { onEnd();   });
}

function initTouchControls() {
  var leftBtn  = document.getElementById('leftBtn');
  var rightBtn = document.getElementById('rightBtn');
  var boostBtn = document.getElementById('boostBtn');

  bindTouchBtn(leftBtn,
    function() { leftBtnPressed = true;  if (leftBtn)  leftBtn.classList.add('active');    },
    function() { leftBtnPressed = false; if (leftBtn)  leftBtn.classList.remove('active'); }
  );

  bindTouchBtn(rightBtn,
    function() { rightBtnPressed = true;  if (rightBtn) rightBtn.classList.add('active');    },
    function() { rightBtnPressed = false; if (rightBtn) rightBtn.classList.remove('active'); }
  );

  bindTouchBtn(boostBtn,
    function() {
      boostPressed = true;
      if (boostBtn) boostBtn.classList.add('active');
      if (typeof window.activateBoost === 'function') window.activateBoost();
    },
    function() {
      boostPressed = false;
      if (boostBtn) boostBtn.classList.remove('active');
    }
  );
}

// Initialize immediately and also on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTouchControls);
} else {
  initTouchControls();
}
