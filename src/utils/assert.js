function AssertionFailed(message) {
	this.message = message;
}
AssertionFailed.prototype = Object.create(Error.prototype);

function assert(test, message) {
	if (!test) throw new AssertionFailed(message);
}

export default assert;
