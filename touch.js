var ongoingTouches = [];
var joystickTouchId = null;
var joystickDeltaX = 0;

function copyTouch({ identifier, pageX, pageY }) {
  return { identifier, pageX, pageY };
}

function ongoingTouchIndexById ( idToFind ) {
		for (var i = 0; i < ongoingTouches.length; i++) {
			var id = ongoingTouches[i].identifier;
			if ( id == idToFind ) { return i; }
		}
		return -1;    // not found
	}

class TouchControl
{
	constructor(canvasTarget) // e.g. canvasTarget = document.getElementById("canvas")
	{
		this.target = canvasTarget;
		this.joystickContainer = document.getElementById('joystickContainer');
		this.joystickKnob = document.getElementById('joystickKnob');
		this.joystickCenterX = 0;
		this.joystickCenterY = 0;
		this.joystickRadius = 45; // Max distance knob can move from center
		this.isJoystickActive = false;

		canvasTarget.addEventListener("touchstart", this.handleStart.bind(this), false);
		canvasTarget.addEventListener("touchend", this.handleEnd.bind(this), false);
		canvasTarget.addEventListener("touchcancel", this.handleCancel.bind(this), false);
		canvasTarget.addEventListener("touchmove", this.handleMove.bind(this), false);

		// Also listen for touch events on joystick container
		if (this.joystickContainer) {
			this.joystickContainer.addEventListener("touchstart", this.handleJoystickStart.bind(this), false);
			this.joystickContainer.addEventListener("touchmove", this.handleJoystickMove.bind(this), false);
			this.joystickContainer.addEventListener("touchend", this.handleJoystickEnd.bind(this), false);
			this.joystickContainer.addEventListener("touchcancel", this.handleJoystickEnd.bind(this), false);
		}

		this.setupJoystickPosition();
	}

	setupJoystickPosition() {
		if (this.joystickContainer) {
			var rect = this.joystickContainer.getBoundingClientRect();
			this.joystickCenterX = rect.left + rect.width / 2;
			this.joystickCenterY = rect.top + rect.height / 2;
		}
	}

	handleJoystickStart(e) {
		e.preventDefault();
		e.stopPropagation();
		var touches = e.changedTouches;

		for (var i = 0; i < touches.length; i++)
		{
			if (joystickTouchId === null) {
				joystickTouchId = touches[i].identifier;
				this.isJoystickActive = true;
				this.updateJoystick(touches[i].pageX, touches[i].pageY);
			}
		}
	}

	handleJoystickMove(e) {
		e.preventDefault();
		e.stopPropagation();
		var touches = e.changedTouches;

		for (var i = 0; i < touches.length; i++)
		{
			if (touches[i].identifier === joystickTouchId) {
				this.updateJoystick(touches[i].pageX, touches[i].pageY);
			}
		}
	}

	handleJoystickEnd(e) {
		e.preventDefault();
		e.stopPropagation();
		var touches = e.changedTouches;

		for (var i = 0; i < touches.length; i++)
		{
			if (touches[i].identifier === joystickTouchId) {
				joystickTouchId = null;
				this.isJoystickActive = false;
				joystickDeltaX = 0;
				// Reset knob position
				if (this.joystickKnob) {
					this.joystickKnob.style.transform = 'translate(-50%, -50%)';
				}
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
			distance = this.joystickRadius;
		}

		// Update knob position
		if (this.joystickKnob) {
			this.joystickKnob.style.transform = 'translate(calc(-50% + ' + dx + 'px), calc(-50% + ' + dy + 'px))';
		}

		// Calculate horizontal input (-1 to 1)
		joystickDeltaX = dx / this.joystickRadius;
	}

	handleStart(e)
	{
		e.preventDefault();
		var touches = e.changedTouches;

		for (var i = 0; i < touches.length; i++)
		{
			// Only add to ongoingTouches if not using joystick
			if (touches[i].identifier !== joystickTouchId) {
				ongoingTouches.push(copyTouch(touches[i]));
			}
		}
	}

	handleMove(e)
	{
		e.preventDefault();
		var touches = e.changedTouches;

		for (var i = 0; i < touches.length; i++)
		{
			var idx = ongoingTouchIndexById(touches[i].identifier);

			if (idx >= 0)
			{
				ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
			}
			else
			{
				console.log("can't figure out which touch to continue");
			}
		}
	}

	handleEnd(e)
	{
		e.preventDefault();
		var touches = e.changedTouches;

		for (var i = 0; i < touches.length; i++)
		{
			var idx = ongoingTouchIndexById(touches[i].identifier);

			if (idx >= 0)
			{
				ongoingTouches.splice(idx, 1);  // remove it; we're done
			}
			else
			{
				console.log("can't figure out which touch to end");
			}
		}
	}

	handleCancel(e)
	{
		e.preventDefault();
		var touches = e.changedTouches;

		for (var i = 0; i < touches.length; i++)
		{
			var idx = ongoingTouchIndexById(touches[i].identifier);
			ongoingTouches.splice(idx, 1);  // remove it; we're done
		}
	}

} // end of touchDetector class