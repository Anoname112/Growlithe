function Object (x, y, direction) {
	this.X = x * tileSize;
	this.Y = y * tileSize;
	this.Direction = direction;
}

Object.Bush = function (x, y) {
	var direction = 0;
	return new Object(x, y, direction);
}

Object.Rock = function (x, y) {
	var direction = 0;
	return new Object(x, y, direction);
}

Object.Voltrob = function (x, y) {
	var direction = (Math.random() < 0.5) ? -1 : 1;
	return new Object(x, y, direction);
}