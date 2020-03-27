(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

console.warn('Compiled in DEV mode. Follow the advice at https://elm-lang.org/0.19.1/optimize for better performance and smaller assets.');


// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**_UNUSED/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**_UNUSED/
	if (typeof x.$ === 'undefined')
	//*/
	/**/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0_UNUSED = 0;
var _Utils_Tuple0 = { $: '#0' };

function _Utils_Tuple2_UNUSED(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3_UNUSED(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr_UNUSED(c) { return c; }
function _Utils_chr(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil_UNUSED = { $: 0 };
var _List_Nil = { $: '[]' };

function _List_Cons_UNUSED(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log_UNUSED = F2(function(tag, value)
{
	return value;
});

var _Debug_log = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString_UNUSED(value)
{
	return '<internals>';
}

function _Debug_toString(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash_UNUSED(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.start.line === region.end.line)
	{
		return 'on line ' + region.start.line;
	}
	return 'on lines ' + region.start.line + ' through ' + region.end.line;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap(value) { return { $: 0, a: value }; }
function _Json_unwrap(value) { return value.a; }

function _Json_wrap_UNUSED(value) { return value; }
function _Json_unwrap_UNUSED(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
	var managers = {};
	result = init(result.a);
	var model = result.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		result = A2(update, msg, model);
		stepper(model = result.a, viewMetadata);
		_Platform_enqueueEffects(managers, result.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, result.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**_UNUSED/
	var node = args['node'];
	//*/
	/**/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS


function _VirtualDom_noScript(tag)
{
	return tag == 'script' ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return /^(on|formAction$)/i.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri_UNUSED(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,'')) ? '' : value;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return /^javascript:/i.test(value.replace(/\s/g,''))
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri_UNUSED(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value) ? '' : value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return /^\s*(javascript:|data:text\/html)/i.test(value)
		? 'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'
		: value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		message: func(record.message),
		stopPropagation: record.stopPropagation,
		preventDefault: record.preventDefault
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.message;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.stopPropagation;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.preventDefault) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var view = impl.view;
			/**_UNUSED/
			var domNode = args['node'];
			//*/
			/**/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.init,
		impl.update,
		impl.subscriptions,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.setup && impl.setup(sendToApp)
			var view = impl.view;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.body);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.title) && (_VirtualDom_doc.title = title = doc.title);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.onUrlChange;
	var onUrlRequest = impl.onUrlRequest;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		setup: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.protocol === next.protocol
							&& curr.host === next.host
							&& curr.port_.a === next.port_.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		init: function(flags)
		{
			return A3(impl.init, flags, _Browser_getUrl(), key);
		},
		view: impl.view,
		update: impl.update,
		subscriptions: impl.subscriptions
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { hidden: 'hidden', change: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { hidden: 'mozHidden', change: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { hidden: 'msHidden', change: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { hidden: 'webkitHidden', change: 'webkitvisibilitychange' }
		: { hidden: 'hidden', change: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		scene: _Browser_getScene(),
		viewport: {
			x: _Browser_window.pageXOffset,
			y: _Browser_window.pageYOffset,
			width: _Browser_doc.documentElement.clientWidth,
			height: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		width: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		height: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			scene: {
				width: node.scrollWidth,
				height: node.scrollHeight
			},
			viewport: {
				x: node.scrollLeft,
				y: node.scrollTop,
				width: node.clientWidth,
				height: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			scene: _Browser_getScene(),
			viewport: {
				x: x,
				y: y,
				width: _Browser_doc.documentElement.clientWidth,
				height: _Browser_doc.documentElement.clientHeight
			},
			element: {
				x: x + rect.left,
				y: y + rect.top,
				width: rect.width,
				height: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}
var $elm$core$Basics$EQ = {$: 'EQ'};
var $elm$core$Basics$GT = {$: 'GT'};
var $elm$core$Basics$LT = {$: 'LT'};
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === 'RBEmpty_elm_builtin') {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0.a;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (node.$ === 'SubTree') {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 'Err', a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 'Failure', a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 'Field', a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 'Index', a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 'Ok', a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 'OneOf', a: a};
};
var $elm$core$Basics$False = {$: 'False'};
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 'Just', a: a};
};
var $elm$core$Maybe$Nothing = {$: 'Nothing'};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 'Field':
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 'Nothing') {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'Index':
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 'OneOf':
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 'Array_elm_builtin', a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 'Leaf', a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 'SubTree', a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.nodeListSize) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.tail);
		} else {
			var treeLen = builder.nodeListSize * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.nodeList) : builder.nodeList;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.nodeListSize);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.tail) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.tail);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{nodeList: nodeList, nodeListSize: (len / $elm$core$Array$branchFactor) | 0, tail: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = {$: 'True'};
var $elm$core$Result$isOk = function (result) {
	if (result.$ === 'Ok') {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 'Normal':
			return 0;
		case 'MayStopPropagation':
			return 1;
		case 'MayPreventDefault':
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 'External', a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 'Internal', a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = function (a) {
	return {$: 'NotFound', a: a};
};
var $elm$url$Url$Http = {$: 'Http'};
var $elm$url$Url$Https = {$: 'Https'};
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {fragment: fragment, host: host, path: path, port_: port_, protocol: protocol, query: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 'Nothing') {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Http,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		$elm$url$Url$Https,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = function (a) {
	return {$: 'Perform', a: a};
};
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(_Utils_Tuple0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0.a;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return _Utils_Tuple0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(_Utils_Tuple0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0.a;
		return $elm$core$Task$Perform(
			A2($elm$core$Task$map, tagger, task));
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			$elm$core$Task$Perform(
				A2($elm$core$Task$map, toMessage, task)));
	});
var $elm$browser$Browser$element = _Browser_element;
var $author$project$Types$AnyBullOut = {$: 'AnyBullOut'};
var $author$project$Types$AppState = F4(
	function (players, game, screen, playing) {
		return {game: game, players: players, playing: playing, screen: screen};
	});
var $author$project$Types$AroundTheClock = F4(
	function (a, b, c, d) {
		return {$: 'AroundTheClock', a: a, b: b, c: c, d: d};
	});
var $author$project$Types$AroundTheClock180 = F4(
	function (a, b, c, d) {
		return {$: 'AroundTheClock180', a: a, b: b, c: c, d: d};
	});
var $author$project$Types$AroundTheClock180Score = function (a) {
	return {$: 'AroundTheClock180Score', a: a};
};
var $author$project$Types$AroundTheClockScore = function (a) {
	return {$: 'AroundTheClockScore', a: a};
};
var $author$project$Types$Baseball = F5(
	function (a, b, c, d, e) {
		return {$: 'Baseball', a: a, b: b, c: c, d: d, e: e};
	});
var $author$project$Types$BaseballScore = function (a) {
	return {$: 'BaseballScore', a: a};
};
var $author$project$Types$BasicBaseball = {$: 'BasicBaseball'};
var $author$project$Types$BasicCricket = {$: 'BasicCricket'};
var $author$project$Types$BasicDragon = {$: 'BasicDragon'};
var $author$project$Types$BasicIn = {$: 'BasicIn'};
var $author$project$Types$BasicOut = {$: 'BasicOut'};
var $author$project$Types$ChaseTheDragon = F4(
	function (a, b, c, d) {
		return {$: 'ChaseTheDragon', a: a, b: b, c: c, d: d};
	});
var $author$project$Types$ChaseTheDragonScore = function (a) {
	return {$: 'ChaseTheDragonScore', a: a};
};
var $author$project$Types$Cricket = F4(
	function (a, b, c, d) {
		return {$: 'Cricket', a: a, b: b, c: c, d: d};
	});
var $author$project$Types$CricketScore = F8(
	function (score, slice20, slice19, slice18, slice17, slice16, slice15, sliceBull) {
		return {score: score, slice15: slice15, slice16: slice16, slice17: slice17, slice18: slice18, slice19: slice19, slice20: slice20, sliceBull: sliceBull};
	});
var $author$project$Types$DoubleBonus = {$: 'DoubleBonus'};
var $author$project$Types$DoubleHit = {$: 'DoubleHit'};
var $author$project$Types$DoubleIn = {$: 'DoubleIn'};
var $author$project$Types$DoubleOut = {$: 'DoubleOut'};
var $author$project$Types$EditPlayers = F2(
	function (a, b) {
		return {$: 'EditPlayers', a: a, b: b};
	});
var $author$project$Types$GolfCricket = {$: 'GolfCricket'};
var $author$project$Types$Hit1 = function (a) {
	return {$: 'Hit1', a: a};
};
var $author$project$Types$Hit10 = function (a) {
	return {$: 'Hit10', a: a};
};
var $author$project$Types$Hit11 = function (a) {
	return {$: 'Hit11', a: a};
};
var $author$project$Types$Hit12 = function (a) {
	return {$: 'Hit12', a: a};
};
var $author$project$Types$Hit13 = function (a) {
	return {$: 'Hit13', a: a};
};
var $author$project$Types$Hit14 = function (a) {
	return {$: 'Hit14', a: a};
};
var $author$project$Types$Hit15 = function (a) {
	return {$: 'Hit15', a: a};
};
var $author$project$Types$Hit16 = function (a) {
	return {$: 'Hit16', a: a};
};
var $author$project$Types$Hit17 = function (a) {
	return {$: 'Hit17', a: a};
};
var $author$project$Types$Hit18 = function (a) {
	return {$: 'Hit18', a: a};
};
var $author$project$Types$Hit19 = function (a) {
	return {$: 'Hit19', a: a};
};
var $author$project$Types$Hit2 = function (a) {
	return {$: 'Hit2', a: a};
};
var $author$project$Types$Hit20 = function (a) {
	return {$: 'Hit20', a: a};
};
var $author$project$Types$Hit3 = function (a) {
	return {$: 'Hit3', a: a};
};
var $author$project$Types$Hit4 = function (a) {
	return {$: 'Hit4', a: a};
};
var $author$project$Types$Hit5 = function (a) {
	return {$: 'Hit5', a: a};
};
var $author$project$Types$Hit6 = function (a) {
	return {$: 'Hit6', a: a};
};
var $author$project$Types$Hit7 = function (a) {
	return {$: 'Hit7', a: a};
};
var $author$project$Types$Hit8 = function (a) {
	return {$: 'Hit8', a: a};
};
var $author$project$Types$Hit9 = function (a) {
	return {$: 'Hit9', a: a};
};
var $author$project$Types$HitBullseye = {$: 'HitBullseye'};
var $author$project$Types$HitDoubleBullseye = {$: 'HitDoubleBullseye'};
var $author$project$Types$HitMissed = {$: 'HitMissed'};
var $author$project$Types$Home = {$: 'Home'};
var $author$project$Types$Inning = function (a) {
	return {$: 'Inning', a: a};
};
var $author$project$Types$InningClosed = {$: 'InningClosed'};
var $author$project$Types$InningOpen = {$: 'InningOpen'};
var $author$project$Types$NewPlayerInitials = function (a) {
	return {$: 'NewPlayerInitials', a: a};
};
var $author$project$Types$NewPlayerName = function (a) {
	return {$: 'NewPlayerName', a: a};
};
var $author$project$Types$NoBullOut = {$: 'NoBullOut'};
var $author$project$Types$NoGame = {$: 'NoGame'};
var $author$project$Types$Numbers301 = F5(
	function (a, b, c, d, e) {
		return {$: 'Numbers301', a: a, b: b, c: c, d: d, e: e};
	});
var $author$project$Types$Numbers501 = F5(
	function (a, b, c, d, e) {
		return {$: 'Numbers501', a: a, b: b, c: c, d: d, e: e};
	});
var $author$project$Types$Numbers701 = F5(
	function (a, b, c, d, e) {
		return {$: 'Numbers701', a: a, b: b, c: c, d: d, e: e};
	});
var $author$project$Types$NumbersScore = function (a) {
	return {$: 'NumbersScore', a: a};
};
var $author$project$Types$PlayGame = function (a) {
	return {$: 'PlayGame', a: a};
};
var $author$project$Types$Player = F4(
	function (name, initials, hits, id) {
		return {hits: hits, id: id, initials: initials, name: name};
	});
var $author$project$Types$PlayerHits = function (a) {
	return {$: 'PlayerHits', a: a};
};
var $author$project$Types$PlayerID = function (a) {
	return {$: 'PlayerID', a: a};
};
var $author$project$Types$PlayerInitials = function (a) {
	return {$: 'PlayerInitials', a: a};
};
var $author$project$Types$PlayerName = function (a) {
	return {$: 'PlayerName', a: a};
};
var $author$project$Types$Score = function (a) {
	return {$: 'Score', a: a};
};
var $author$project$Types$SelectGame = {$: 'SelectGame'};
var $author$project$Types$SeventhInningCatch = {$: 'SeventhInningCatch'};
var $author$project$Types$SingleHit = {$: 'SingleHit'};
var $author$project$Types$Slice0 = {$: 'Slice0'};
var $author$project$Types$Slice1 = {$: 'Slice1'};
var $author$project$Types$Slice2 = {$: 'Slice2'};
var $author$project$Types$SliceClosed = {$: 'SliceClosed'};
var $author$project$Types$SliceOpen = {$: 'SliceOpen'};
var $author$project$Types$SplitBullOut = {$: 'SplitBullOut'};
var $author$project$Types$TripleBonus = {$: 'TripleBonus'};
var $author$project$Types$TripleHeadedDragon = {$: 'TripleHeadedDragon'};
var $author$project$Types$TripleHit = {$: 'TripleHit'};
var $author$project$Types$TripleIn = {$: 'TripleIn'};
var $author$project$Types$TripleOut = {$: 'TripleOut'};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$bool = _Json_decodeBool;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $elm$json$Json$Decode$list = _Json_decodeList;
var $elm$json$Json$Decode$map3 = _Json_map3;
var $elm$json$Json$Decode$map4 = _Json_map4;
var $elm$json$Json$Decode$map5 = _Json_map5;
var $elm$json$Json$Decode$map8 = _Json_map8;
var $elm$json$Json$Decode$string = _Json_decodeString;
var $author$project$Types$Decode$app_state_decoder = function () {
	var decode_screen = A2(
		$elm$json$Json$Decode$map,
		function (s) {
			switch (s) {
				case 'EDITPLAYERS':
					return A2(
						$author$project$Types$EditPlayers,
						$author$project$Types$NewPlayerName(''),
						$author$project$Types$NewPlayerInitials(''));
				case 'SELECTGAME':
					return $author$project$Types$SelectGame;
				case 'PLAYGAME':
					return $author$project$Types$PlayGame($elm$core$Maybe$Nothing);
				default:
					return $author$project$Types$Home;
			}
		},
		$elm$json$Json$Decode$string);
	var decode_score = A2($elm$json$Json$Decode$map, $author$project$Types$Score, $elm$json$Json$Decode$int);
	var decode_player_name = A2($elm$json$Json$Decode$map, $author$project$Types$PlayerName, $elm$json$Json$Decode$string);
	var decode_player_initials = A2($elm$json$Json$Decode$map, $author$project$Types$PlayerInitials, $elm$json$Json$Decode$string);
	var decode_player_id = A2($elm$json$Json$Decode$map, $author$project$Types$PlayerID, $elm$json$Json$Decode$int);
	var decode_numbers_score = A3(
		$elm$json$Json$Decode$map2,
		F2(
			function (i, n) {
				return _Utils_Tuple2(
					$author$project$Types$PlayerID(i),
					$author$project$Types$NumbersScore(
						$author$project$Types$Score(n)));
			}),
		A2($elm$json$Json$Decode$field, 'playerId', $elm$json$Json$Decode$int),
		A2($elm$json$Json$Decode$field, 'score', $elm$json$Json$Decode$int));
	var decode_numbers_scores = $elm$json$Json$Decode$list(decode_numbers_score);
	var decode_num_var_o = A2(
		$elm$json$Json$Decode$map,
		function (v) {
			switch (v) {
				case 'TO':
					return $author$project$Types$TripleOut;
				case 'DO':
					return $author$project$Types$DoubleOut;
				default:
					return $author$project$Types$BasicOut;
			}
		},
		$elm$json$Json$Decode$string);
	var decode_num_var_i = A2(
		$elm$json$Json$Decode$map,
		function (v) {
			switch (v) {
				case 'TI':
					return $author$project$Types$TripleIn;
				case 'DI':
					return $author$project$Types$DoubleIn;
				default:
					return $author$project$Types$BasicIn;
			}
		},
		$elm$json$Json$Decode$string);
	var decode_inning_state = A2(
		$elm$json$Json$Decode$map,
		function (s) {
			switch (s) {
				case 'O':
					return $author$project$Types$InningOpen;
				case 'C':
					return $author$project$Types$InningClosed;
				default:
					return $author$project$Types$InningClosed;
			}
		},
		$elm$json$Json$Decode$string);
	var decode_inning_score = A4(
		$elm$json$Json$Decode$map3,
		F3(
			function (i, s, sc) {
				return _Utils_Tuple3(
					$author$project$Types$Inning(i),
					s,
					$author$project$Types$Score(sc));
			}),
		A2($elm$json$Json$Decode$field, 'inning', $elm$json$Json$Decode$int),
		A2($elm$json$Json$Decode$field, 'state', decode_inning_state),
		A2($elm$json$Json$Decode$field, 'score', $elm$json$Json$Decode$int));
	var decode_inning_scores = $elm$json$Json$Decode$list(decode_inning_score);
	var decode_inning = A2($elm$json$Json$Decode$map, $author$project$Types$Inning, $elm$json$Json$Decode$int);
	var decode_hit = A2(
		$elm$json$Json$Decode$map,
		function (h) {
			switch (h) {
				case 'M':
					return $author$project$Types$HitMissed;
				case 'S1':
					return $author$project$Types$Hit1($author$project$Types$SingleHit);
				case 'D1':
					return $author$project$Types$Hit1($author$project$Types$DoubleHit);
				case 'T1':
					return $author$project$Types$Hit1($author$project$Types$TripleHit);
				case 'S2':
					return $author$project$Types$Hit2($author$project$Types$SingleHit);
				case 'D2':
					return $author$project$Types$Hit2($author$project$Types$DoubleHit);
				case 'T2':
					return $author$project$Types$Hit2($author$project$Types$TripleHit);
				case 'S3':
					return $author$project$Types$Hit3($author$project$Types$SingleHit);
				case 'D3':
					return $author$project$Types$Hit3($author$project$Types$DoubleHit);
				case 'T3':
					return $author$project$Types$Hit3($author$project$Types$TripleHit);
				case 'S4':
					return $author$project$Types$Hit4($author$project$Types$SingleHit);
				case 'D4':
					return $author$project$Types$Hit4($author$project$Types$DoubleHit);
				case 'T4':
					return $author$project$Types$Hit4($author$project$Types$TripleHit);
				case 'S5':
					return $author$project$Types$Hit5($author$project$Types$SingleHit);
				case 'D5':
					return $author$project$Types$Hit5($author$project$Types$DoubleHit);
				case 'T5':
					return $author$project$Types$Hit5($author$project$Types$TripleHit);
				case 'S6':
					return $author$project$Types$Hit6($author$project$Types$SingleHit);
				case 'D6':
					return $author$project$Types$Hit6($author$project$Types$DoubleHit);
				case 'T6':
					return $author$project$Types$Hit6($author$project$Types$TripleHit);
				case 'S7':
					return $author$project$Types$Hit7($author$project$Types$SingleHit);
				case 'D7':
					return $author$project$Types$Hit7($author$project$Types$DoubleHit);
				case 'T7':
					return $author$project$Types$Hit7($author$project$Types$TripleHit);
				case 'S8':
					return $author$project$Types$Hit8($author$project$Types$SingleHit);
				case 'D8':
					return $author$project$Types$Hit8($author$project$Types$DoubleHit);
				case 'T8':
					return $author$project$Types$Hit8($author$project$Types$TripleHit);
				case 'S9':
					return $author$project$Types$Hit9($author$project$Types$SingleHit);
				case 'D9':
					return $author$project$Types$Hit9($author$project$Types$DoubleHit);
				case 'T9':
					return $author$project$Types$Hit9($author$project$Types$TripleHit);
				case 'S10':
					return $author$project$Types$Hit10($author$project$Types$SingleHit);
				case 'D10':
					return $author$project$Types$Hit10($author$project$Types$DoubleHit);
				case 'T10':
					return $author$project$Types$Hit10($author$project$Types$TripleHit);
				case 'S11':
					return $author$project$Types$Hit11($author$project$Types$SingleHit);
				case 'D11':
					return $author$project$Types$Hit11($author$project$Types$DoubleHit);
				case 'T11':
					return $author$project$Types$Hit11($author$project$Types$TripleHit);
				case 'S12':
					return $author$project$Types$Hit12($author$project$Types$SingleHit);
				case 'D12':
					return $author$project$Types$Hit12($author$project$Types$DoubleHit);
				case 'T12':
					return $author$project$Types$Hit12($author$project$Types$TripleHit);
				case 'S13':
					return $author$project$Types$Hit13($author$project$Types$SingleHit);
				case 'D13':
					return $author$project$Types$Hit13($author$project$Types$DoubleHit);
				case 'T13':
					return $author$project$Types$Hit13($author$project$Types$TripleHit);
				case 'S14':
					return $author$project$Types$Hit14($author$project$Types$SingleHit);
				case 'D14':
					return $author$project$Types$Hit14($author$project$Types$DoubleHit);
				case 'T14':
					return $author$project$Types$Hit14($author$project$Types$TripleHit);
				case 'S15':
					return $author$project$Types$Hit15($author$project$Types$SingleHit);
				case 'D15':
					return $author$project$Types$Hit15($author$project$Types$DoubleHit);
				case 'T15':
					return $author$project$Types$Hit15($author$project$Types$TripleHit);
				case 'S16':
					return $author$project$Types$Hit16($author$project$Types$SingleHit);
				case 'D16':
					return $author$project$Types$Hit16($author$project$Types$DoubleHit);
				case 'T16':
					return $author$project$Types$Hit16($author$project$Types$TripleHit);
				case 'S17':
					return $author$project$Types$Hit17($author$project$Types$SingleHit);
				case 'D17':
					return $author$project$Types$Hit17($author$project$Types$DoubleHit);
				case 'T17':
					return $author$project$Types$Hit17($author$project$Types$TripleHit);
				case 'S18':
					return $author$project$Types$Hit18($author$project$Types$SingleHit);
				case 'D18':
					return $author$project$Types$Hit18($author$project$Types$DoubleHit);
				case 'T18':
					return $author$project$Types$Hit18($author$project$Types$TripleHit);
				case 'S19':
					return $author$project$Types$Hit19($author$project$Types$SingleHit);
				case 'D19':
					return $author$project$Types$Hit19($author$project$Types$DoubleHit);
				case 'T19':
					return $author$project$Types$Hit19($author$project$Types$TripleHit);
				case 'S20':
					return $author$project$Types$Hit20($author$project$Types$SingleHit);
				case 'D20':
					return $author$project$Types$Hit20($author$project$Types$DoubleHit);
				case 'T20':
					return $author$project$Types$Hit20($author$project$Types$TripleHit);
				case 'Bull':
					return $author$project$Types$HitBullseye;
				case 'DBull':
					return $author$project$Types$HitDoubleBullseye;
				default:
					return $author$project$Types$HitMissed;
			}
		},
		$elm$json$Json$Decode$string);
	var decode_hit_score = A3(
		$elm$json$Json$Decode$map2,
		F2(
			function (h, s) {
				return _Utils_Tuple2(
					h,
					$author$project$Types$Score(s));
			}),
		A2($elm$json$Json$Decode$field, 'hit', decode_hit),
		A2($elm$json$Json$Decode$field, 'score', $elm$json$Json$Decode$int));
	var decode_hit_scores = $elm$json$Json$Decode$list(decode_hit_score);
	var decode_hits = $elm$json$Json$Decode$list(decode_hit);
	var decode_player_hits = A2(
		$elm$json$Json$Decode$map,
		$author$project$Types$PlayerHits,
		$elm$json$Json$Decode$list(decode_hit));
	var decode_player = A5(
		$elm$json$Json$Decode$map4,
		$author$project$Types$Player,
		A2($elm$json$Json$Decode$field, 'name', decode_player_name),
		A2($elm$json$Json$Decode$field, 'initials', decode_player_initials),
		A2($elm$json$Json$Decode$field, 'hits', decode_player_hits),
		A2($elm$json$Json$Decode$field, 'id', decode_player_id));
	var decode_list_player = $elm$json$Json$Decode$list(decode_player);
	var decode_score_hits = A3(
		$elm$json$Json$Decode$map2,
		F2(
			function (s, l) {
				return _Utils_Tuple2(
					$author$project$Types$Score(s),
					l);
			}),
		A2($elm$json$Json$Decode$field, 'score', $elm$json$Json$Decode$int),
		A2(
			$elm$json$Json$Decode$field,
			'hits',
			$elm$json$Json$Decode$list(decode_hit)));
	var decode_ctd_var = A2(
		$elm$json$Json$Decode$map,
		function (v) {
			if (v === 'TD') {
				return $author$project$Types$TripleHeadedDragon;
			} else {
				return $author$project$Types$BasicDragon;
			}
		},
		$elm$json$Json$Decode$string);
	var decode_ctd_score = A3(
		$elm$json$Json$Decode$map2,
		F2(
			function (i, l) {
				return _Utils_Tuple2(
					$author$project$Types$PlayerID(i),
					$author$project$Types$ChaseTheDragonScore(l));
			}),
		A2($elm$json$Json$Decode$field, 'playerId', $elm$json$Json$Decode$int),
		A2($elm$json$Json$Decode$field, 'score', decode_hits));
	var decode_ctd_scores = $elm$json$Json$Decode$list(decode_ctd_score);
	var decode_ckt_var = A2(
		$elm$json$Json$Decode$map,
		function (v) {
			if (v === 'G') {
				return $author$project$Types$GolfCricket;
			} else {
				return $author$project$Types$BasicCricket;
			}
		},
		$elm$json$Json$Decode$string);
	var decode_ckt_slice = A2(
		$elm$json$Json$Decode$map,
		function (v) {
			switch (v) {
				case '_':
					return $author$project$Types$Slice0;
				case '/':
					return $author$project$Types$Slice1;
				case 'X':
					return $author$project$Types$Slice2;
				case 'O':
					return $author$project$Types$SliceOpen;
				case 'C':
					return $author$project$Types$SliceClosed;
				default:
					return $author$project$Types$Slice0;
			}
		},
		$elm$json$Json$Decode$string);
	var decode_ckt_score = A9(
		$elm$json$Json$Decode$map8,
		$author$project$Types$CricketScore,
		A2($elm$json$Json$Decode$field, 'score', decode_score),
		A2($elm$json$Json$Decode$field, 'slice20', decode_ckt_slice),
		A2($elm$json$Json$Decode$field, 'slice19', decode_ckt_slice),
		A2($elm$json$Json$Decode$field, 'slice18', decode_ckt_slice),
		A2($elm$json$Json$Decode$field, 'slice17', decode_ckt_slice),
		A2($elm$json$Json$Decode$field, 'slice16', decode_ckt_slice),
		A2($elm$json$Json$Decode$field, 'slice15', decode_ckt_slice),
		A2($elm$json$Json$Decode$field, 'sliceBull', decode_ckt_slice));
	var decode_ckt_score_t = A3(
		$elm$json$Json$Decode$map2,
		F2(
			function (i, s) {
				return _Utils_Tuple2(
					$author$project$Types$PlayerID(i),
					s);
			}),
		A2($elm$json$Json$Decode$field, 'playerId', $elm$json$Json$Decode$int),
		A2($elm$json$Json$Decode$field, 'score', decode_ckt_score));
	var decode_ckt_scores = $elm$json$Json$Decode$list(decode_ckt_score_t);
	var decode_bbl_var = A2(
		$elm$json$Json$Decode$map,
		function (v) {
			if (v === 'SIC') {
				return $author$project$Types$SeventhInningCatch;
			} else {
				return $author$project$Types$BasicBaseball;
			}
		},
		$elm$json$Json$Decode$string);
	var decode_bbl_score = A3(
		$elm$json$Json$Decode$map2,
		F2(
			function (i, l) {
				return _Utils_Tuple2(
					$author$project$Types$PlayerID(i),
					$author$project$Types$BaseballScore(l));
			}),
		A2($elm$json$Json$Decode$field, 'playerId', $elm$json$Json$Decode$int),
		A2($elm$json$Json$Decode$field, 'score', decode_inning_scores));
	var decode_bbl_scores = $elm$json$Json$Decode$list(decode_bbl_score);
	var decode_atc_var = A2(
		$elm$json$Json$Decode$map,
		function (v) {
			switch (v) {
				case 'BO':
					return $author$project$Types$AnyBullOut;
				case 'SO':
					return $author$project$Types$SplitBullOut;
				default:
					return $author$project$Types$NoBullOut;
			}
		},
		$elm$json$Json$Decode$string);
	var decode_atc_score = A3(
		$elm$json$Json$Decode$map2,
		F2(
			function (i, l) {
				return _Utils_Tuple2(
					$author$project$Types$PlayerID(i),
					$author$project$Types$AroundTheClockScore(l));
			}),
		A2($elm$json$Json$Decode$field, 'playerId', $elm$json$Json$Decode$int),
		A2($elm$json$Json$Decode$field, 'score', decode_hits));
	var decode_atc_scores = $elm$json$Json$Decode$list(decode_atc_score);
	var decode_atc_180_var = A2(
		$elm$json$Json$Decode$map,
		function (v) {
			if (v === 'TPL') {
				return $author$project$Types$TripleBonus;
			} else {
				return $author$project$Types$DoubleBonus;
			}
		},
		$elm$json$Json$Decode$string);
	var decode_atc_180_score = A3(
		$elm$json$Json$Decode$map2,
		F2(
			function (i, l) {
				return _Utils_Tuple2(
					$author$project$Types$PlayerID(i),
					$author$project$Types$AroundTheClock180Score(l));
			}),
		A2($elm$json$Json$Decode$field, 'playerId', $elm$json$Json$Decode$int),
		A2($elm$json$Json$Decode$field, 'score', decode_hit_scores));
	var decode_atc_180_scores = $elm$json$Json$Decode$list(decode_atc_180_score);
	var decode_game_state_type = function (s) {
		switch (s) {
			case '701':
				return A6(
					$elm$json$Json$Decode$map5,
					$author$project$Types$Numbers701,
					A2($elm$json$Json$Decode$field, 'in', decode_num_var_i),
					A2($elm$json$Json$Decode$field, 'out', decode_num_var_o),
					A2($elm$json$Json$Decode$field, 'current', $elm$json$Json$Decode$int),
					A2($elm$json$Json$Decode$field, 'turn', decode_hits),
					A2($elm$json$Json$Decode$field, 'scores', decode_numbers_scores));
			case '501':
				return A6(
					$elm$json$Json$Decode$map5,
					$author$project$Types$Numbers501,
					A2($elm$json$Json$Decode$field, 'in', decode_num_var_i),
					A2($elm$json$Json$Decode$field, 'out', decode_num_var_o),
					A2($elm$json$Json$Decode$field, 'current', $elm$json$Json$Decode$int),
					A2($elm$json$Json$Decode$field, 'turn', decode_hits),
					A2($elm$json$Json$Decode$field, 'scores', decode_numbers_scores));
			case '301':
				return A6(
					$elm$json$Json$Decode$map5,
					$author$project$Types$Numbers301,
					A2($elm$json$Json$Decode$field, 'in', decode_num_var_i),
					A2($elm$json$Json$Decode$field, 'out', decode_num_var_o),
					A2($elm$json$Json$Decode$field, 'current', $elm$json$Json$Decode$int),
					A2($elm$json$Json$Decode$field, 'turn', decode_hits),
					A2($elm$json$Json$Decode$field, 'scores', decode_numbers_scores));
			case 'ATC':
				return A5(
					$elm$json$Json$Decode$map4,
					$author$project$Types$AroundTheClock,
					A2($elm$json$Json$Decode$field, 'variant', decode_atc_var),
					A2($elm$json$Json$Decode$field, 'current', $elm$json$Json$Decode$int),
					A2($elm$json$Json$Decode$field, 'turn', decode_hits),
					A2($elm$json$Json$Decode$field, 'scores', decode_atc_scores));
			case 'ATC180':
				return A5(
					$elm$json$Json$Decode$map4,
					$author$project$Types$AroundTheClock180,
					A2($elm$json$Json$Decode$field, 'variant', decode_atc_180_var),
					A2($elm$json$Json$Decode$field, 'current', $elm$json$Json$Decode$int),
					A2($elm$json$Json$Decode$field, 'turn', decode_hits),
					A2($elm$json$Json$Decode$field, 'scores', decode_atc_180_scores));
			case 'BBL':
				return A6(
					$elm$json$Json$Decode$map5,
					$author$project$Types$Baseball,
					A2($elm$json$Json$Decode$field, 'variant', decode_bbl_var),
					A2($elm$json$Json$Decode$field, 'current', $elm$json$Json$Decode$int),
					A2($elm$json$Json$Decode$field, 'turn', decode_hits),
					A2($elm$json$Json$Decode$field, 'inning', decode_inning),
					A2($elm$json$Json$Decode$field, 'scores', decode_bbl_scores));
			case 'CTD':
				return A5(
					$elm$json$Json$Decode$map4,
					$author$project$Types$ChaseTheDragon,
					A2($elm$json$Json$Decode$field, 'variant', decode_ctd_var),
					A2($elm$json$Json$Decode$field, 'current', $elm$json$Json$Decode$int),
					A2($elm$json$Json$Decode$field, 'turn', decode_hits),
					A2($elm$json$Json$Decode$field, 'scores', decode_ctd_scores));
			case 'CKT':
				return A5(
					$elm$json$Json$Decode$map4,
					$author$project$Types$Cricket,
					A2($elm$json$Json$Decode$field, 'variant', decode_ckt_var),
					A2($elm$json$Json$Decode$field, 'current', $elm$json$Json$Decode$int),
					A2($elm$json$Json$Decode$field, 'turn', decode_hits),
					A2($elm$json$Json$Decode$field, 'scores', decode_ckt_scores));
			default:
				return $elm$json$Json$Decode$succeed($author$project$Types$NoGame);
		}
	};
	var decode_game_state = A2(
		$elm$json$Json$Decode$andThen,
		decode_game_state_type,
		A2($elm$json$Json$Decode$field, 'type', $elm$json$Json$Decode$string));
	return A5(
		$elm$json$Json$Decode$map4,
		$author$project$Types$AppState,
		A2($elm$json$Json$Decode$field, 'players', decode_list_player),
		A2($elm$json$Json$Decode$field, 'game', decode_game_state),
		A2($elm$json$Json$Decode$field, 'screen', decode_screen),
		A2($elm$json$Json$Decode$field, 'playing', $elm$json$Json$Decode$bool));
}();
var $author$project$Main$clean_state = {game: $author$project$Types$NoGame, players: _List_Nil, playing: false, screen: $author$project$Types$Home};
var $elm$json$Json$Decode$decodeValue = _Json_run;
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $author$project$Main$init = function (s) {
	var _v0 = A2($elm$json$Json$Decode$decodeValue, $author$project$Types$Decode$app_state_decoder, s);
	if (_v0.$ === 'Err') {
		return _Utils_Tuple2($author$project$Main$clean_state, $elm$core$Platform$Cmd$none);
	} else {
		var state = _v0.a;
		return _Utils_Tuple2(state, $elm$core$Platform$Cmd$none);
	}
};
var $elm$core$Platform$Sub$batch = _Platform_batch;
var $elm$core$Platform$Sub$none = $elm$core$Platform$Sub$batch(_List_Nil);
var $author$project$Types$FinalizeTurn = {$: 'FinalizeTurn'};
var $author$project$Types$SelectSubHit = function (a) {
	return {$: 'SelectSubHit', a: a};
};
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $elm$json$Json$Encode$bool = _Json_wrap;
var $elm$json$Json$Encode$int = _Json_wrap;
var $elm$json$Json$Encode$list = F2(
	function (func, entries) {
		return _Json_wrap(
			A3(
				$elm$core$List$foldl,
				_Json_addEntry(func),
				_Json_emptyArray(_Utils_Tuple0),
				entries));
	});
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(_Utils_Tuple0),
			pairs));
};
var $elm$json$Json$Encode$string = _Json_wrap;
var $author$project$Types$Encode$encode_app_state = function (state) {
	var encode_sub_hit = function (s) {
		switch (s.$) {
			case 'SubMissed':
				return 'M';
			case 'SingleHit':
				return 'S';
			case 'DoubleHit':
				return 'D';
			default:
				return 'T';
		}
	};
	var encode_screen = function (s) {
		switch (s.$) {
			case 'Home':
				return $elm$json$Json$Encode$string('HOME');
			case 'EditPlayers':
				return $elm$json$Json$Encode$string('EDITPLAYERS');
			case 'SelectGame':
				return $elm$json$Json$Encode$string('SELECTGAME');
			default:
				return $elm$json$Json$Encode$string('PLAYGAME');
		}
	};
	var encode_score = function (_v26) {
		var s = _v26.a;
		return $elm$json$Json$Encode$int(s);
	};
	var encode_player_name = function (_v25) {
		var name = _v25.a;
		return $elm$json$Json$Encode$string(name);
	};
	var encode_player_initials = function (_v24) {
		var i = _v24.a;
		return $elm$json$Json$Encode$string(i);
	};
	var encode_player_id = function (_v23) {
		var i = _v23.a;
		return $elm$json$Json$Encode$int(i);
	};
	var encode_numbers_score = function (_v22) {
		var i = _v22.a;
		var ns = _v22.b.a.a;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'playerId',
					encode_player_id(i)),
					_Utils_Tuple2(
					'score',
					$elm$json$Json$Encode$int(ns))
				]));
	};
	var encode_numbers_scores = function (l) {
		return A2($elm$json$Json$Encode$list, encode_numbers_score, l);
	};
	var encode_num_var_o = function (v) {
		return $elm$json$Json$Encode$string(
			function () {
				switch (v.$) {
					case 'BasicOut':
						return 'BO';
					case 'DoubleOut':
						return 'DO';
					default:
						return 'TO';
				}
			}());
	};
	var encode_num_var_i = function (v) {
		return $elm$json$Json$Encode$string(
			function () {
				switch (v.$) {
					case 'BasicIn':
						return 'BI';
					case 'DoubleIn':
						return 'DI';
					default:
						return 'TI';
				}
			}());
	};
	var encode_inning_state = function (s) {
		if (s.$ === 'InningOpen') {
			return $elm$json$Json$Encode$string('O');
		} else {
			return $elm$json$Json$Encode$string('C');
		}
	};
	var encode_inning_score = function (_v18) {
		var i = _v18.a.a;
		var s = _v18.b;
		var sc = _v18.c.a;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'inning',
					$elm$json$Json$Encode$int(i)),
					_Utils_Tuple2(
					'state',
					encode_inning_state(s)),
					_Utils_Tuple2(
					'score',
					$elm$json$Json$Encode$int(sc))
				]));
	};
	var encode_inning_scores = function (l) {
		return A2($elm$json$Json$Encode$list, encode_inning_score, l);
	};
	var encode_inning = function (_v17) {
		var i = _v17.a;
		return $elm$json$Json$Encode$int(i);
	};
	var encode_hit = function (h) {
		return $elm$json$Json$Encode$string(
			function () {
				switch (h.$) {
					case 'HitMissed':
						return 'M';
					case 'Hit1':
						var s = h.a;
						return encode_sub_hit(s) + '1';
					case 'Hit2':
						var s = h.a;
						return encode_sub_hit(s) + '2';
					case 'Hit3':
						var s = h.a;
						return encode_sub_hit(s) + '3';
					case 'Hit4':
						var s = h.a;
						return encode_sub_hit(s) + '4';
					case 'Hit5':
						var s = h.a;
						return encode_sub_hit(s) + '5';
					case 'Hit6':
						var s = h.a;
						return encode_sub_hit(s) + '6';
					case 'Hit7':
						var s = h.a;
						return encode_sub_hit(s) + '7';
					case 'Hit8':
						var s = h.a;
						return encode_sub_hit(s) + '8';
					case 'Hit9':
						var s = h.a;
						return encode_sub_hit(s) + '9';
					case 'Hit10':
						var s = h.a;
						return encode_sub_hit(s) + '10';
					case 'Hit11':
						var s = h.a;
						return encode_sub_hit(s) + '11';
					case 'Hit12':
						var s = h.a;
						return encode_sub_hit(s) + '12';
					case 'Hit13':
						var s = h.a;
						return encode_sub_hit(s) + '13';
					case 'Hit14':
						var s = h.a;
						return encode_sub_hit(s) + '14';
					case 'Hit15':
						var s = h.a;
						return encode_sub_hit(s) + '15';
					case 'Hit16':
						var s = h.a;
						return encode_sub_hit(s) + '16';
					case 'Hit17':
						var s = h.a;
						return encode_sub_hit(s) + '17';
					case 'Hit18':
						var s = h.a;
						return encode_sub_hit(s) + '18';
					case 'Hit19':
						var s = h.a;
						return encode_sub_hit(s) + '19';
					case 'Hit20':
						var s = h.a;
						return encode_sub_hit(s) + '20';
					case 'HitBullseye':
						return 'Bull';
					default:
						return 'DBull';
				}
			}());
	};
	var encode_hit_score = function (_v15) {
		var h = _v15.a;
		var s = _v15.b.a;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'hit',
					encode_hit(h)),
					_Utils_Tuple2(
					'score',
					$elm$json$Json$Encode$int(s))
				]));
	};
	var encode_hit_scores = function (l) {
		return A2($elm$json$Json$Encode$list, encode_hit_score, l);
	};
	var encode_hits = function (l) {
		return A2($elm$json$Json$Encode$list, encode_hit, l);
	};
	var encode_player_hits = function (_v14) {
		var l = _v14.a;
		return encode_hits(l);
	};
	var encode_player = function (_v13) {
		var name = _v13.name;
		var initials = _v13.initials;
		var hits = _v13.hits;
		var id = _v13.id;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'name',
					encode_player_name(name)),
					_Utils_Tuple2(
					'initials',
					encode_player_initials(initials)),
					_Utils_Tuple2(
					'hits',
					encode_player_hits(hits)),
					_Utils_Tuple2(
					'id',
					encode_player_id(id))
				]));
	};
	var encode_list_player = function (l) {
		return A2($elm$json$Json$Encode$list, encode_player, l);
	};
	var encode_score_hits = function (_v12) {
		var s = _v12.a.a;
		var l = _v12.b;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'score',
					$elm$json$Json$Encode$int(s)),
					_Utils_Tuple2(
					'hits',
					encode_hits(l))
				]));
	};
	var encode_ctd_var = function (v) {
		return $elm$json$Json$Encode$string(
			function () {
				if (v.$ === 'BasicDragon') {
					return 'SC';
				} else {
					return 'TD';
				}
			}());
	};
	var encode_ctd_score = function (_v10) {
		var i = _v10.a;
		var l = _v10.b.a;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'playerId',
					encode_player_id(i)),
					_Utils_Tuple2(
					'score',
					encode_hits(l))
				]));
	};
	var encode_ctd_scores = function (l) {
		return A2($elm$json$Json$Encode$list, encode_ctd_score, l);
	};
	var encode_ckt_var = function (v) {
		return $elm$json$Json$Encode$string(
			function () {
				if (v.$ === 'BasicCricket') {
					return 'B';
				} else {
					return 'G';
				}
			}());
	};
	var encode_ckt_slice = function (s) {
		switch (s.$) {
			case 'Slice0':
				return $elm$json$Json$Encode$string('_');
			case 'Slice1':
				return $elm$json$Json$Encode$string('/');
			case 'Slice2':
				return $elm$json$Json$Encode$string('X');
			case 'SliceOpen':
				return $elm$json$Json$Encode$string('O');
			default:
				return $elm$json$Json$Encode$string('C');
		}
	};
	var encode_ckt_score = function (s) {
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'score',
					encode_score(s.score)),
					_Utils_Tuple2(
					'slice20',
					encode_ckt_slice(s.slice20)),
					_Utils_Tuple2(
					'slice19',
					encode_ckt_slice(s.slice19)),
					_Utils_Tuple2(
					'slice18',
					encode_ckt_slice(s.slice18)),
					_Utils_Tuple2(
					'slice17',
					encode_ckt_slice(s.slice17)),
					_Utils_Tuple2(
					'slice16',
					encode_ckt_slice(s.slice16)),
					_Utils_Tuple2(
					'slice15',
					encode_ckt_slice(s.slice15)),
					_Utils_Tuple2(
					'sliceBull',
					encode_ckt_slice(s.sliceBull))
				]));
	};
	var encode_ckt_score_t = function (_v7) {
		var i = _v7.a;
		var s = _v7.b;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'playerId',
					encode_player_id(i)),
					_Utils_Tuple2(
					'score',
					encode_ckt_score(s))
				]));
	};
	var encode_ckt_scores = function (l) {
		return A2($elm$json$Json$Encode$list, encode_ckt_score_t, l);
	};
	var encode_bbl_var = function (v) {
		return $elm$json$Json$Encode$string(
			function () {
				if (v.$ === 'BasicBaseball') {
					return 'BSC';
				} else {
					return 'SIC';
				}
			}());
	};
	var encode_bbl_score = function (_v5) {
		var i = _v5.a;
		var l = _v5.b.a;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'playerId',
					encode_player_id(i)),
					_Utils_Tuple2(
					'score',
					encode_inning_scores(l))
				]));
	};
	var encode_bbl_scores = function (l) {
		return A2($elm$json$Json$Encode$list, encode_bbl_score, l);
	};
	var encode_atc_var = function (v) {
		return $elm$json$Json$Encode$string(
			function () {
				switch (v.$) {
					case 'NoBullOut':
						return 'ST';
					case 'AnyBullOut':
						return 'BO';
					default:
						return 'SO';
				}
			}());
	};
	var encode_atc_score = function (_v3) {
		var i = _v3.a;
		var hits = _v3.b.a;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'playerId',
					encode_player_id(i)),
					_Utils_Tuple2(
					'score',
					encode_hits(hits))
				]));
	};
	var encode_atc_scores = function (l) {
		return A2($elm$json$Json$Encode$list, encode_atc_score, l);
	};
	var encode_atc_180_var = function (v) {
		return $elm$json$Json$Encode$string(
			function () {
				if (v.$ === 'DoubleBonus') {
					return 'DBL';
				} else {
					return 'TPL';
				}
			}());
	};
	var encode_atc_180_score = function (_v1) {
		var i = _v1.a;
		var l = _v1.b.a;
		return $elm$json$Json$Encode$object(
			_List_fromArray(
				[
					_Utils_Tuple2(
					'playerId',
					encode_player_id(i)),
					_Utils_Tuple2(
					'score',
					encode_hit_scores(l))
				]));
	};
	var encode_atc_180_scores = function (l) {
		return A2($elm$json$Json$Encode$list, encode_atc_180_score, l);
	};
	var encode_game_state = function (s) {
		switch (s.$) {
			case 'NoGame':
				return $elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'type',
							$elm$json$Json$Encode$string('NoGame'))
						]));
			case 'Numbers701':
				var i = s.a;
				var o = s.b;
				var current = s.c;
				var hits = s.d;
				var scores = s.e;
				return $elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'type',
							$elm$json$Json$Encode$string('701')),
							_Utils_Tuple2(
							'in',
							encode_num_var_i(i)),
							_Utils_Tuple2(
							'out',
							encode_num_var_o(o)),
							_Utils_Tuple2(
							'current',
							$elm$json$Json$Encode$int(current)),
							_Utils_Tuple2(
							'turn',
							encode_hits(hits)),
							_Utils_Tuple2(
							'scores',
							encode_numbers_scores(scores))
						]));
			case 'Numbers501':
				var i = s.a;
				var o = s.b;
				var current = s.c;
				var hits = s.d;
				var scores = s.e;
				return $elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'type',
							$elm$json$Json$Encode$string('501')),
							_Utils_Tuple2(
							'in',
							encode_num_var_i(i)),
							_Utils_Tuple2(
							'out',
							encode_num_var_o(o)),
							_Utils_Tuple2(
							'current',
							$elm$json$Json$Encode$int(current)),
							_Utils_Tuple2(
							'turn',
							encode_hits(hits)),
							_Utils_Tuple2(
							'scores',
							encode_numbers_scores(scores))
						]));
			case 'Numbers301':
				var i = s.a;
				var o = s.b;
				var current = s.c;
				var hits = s.d;
				var scores = s.e;
				return $elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'type',
							$elm$json$Json$Encode$string('301')),
							_Utils_Tuple2(
							'in',
							encode_num_var_i(i)),
							_Utils_Tuple2(
							'out',
							encode_num_var_o(o)),
							_Utils_Tuple2(
							'current',
							$elm$json$Json$Encode$int(current)),
							_Utils_Tuple2(
							'turn',
							encode_hits(hits)),
							_Utils_Tuple2(
							'scores',
							encode_numbers_scores(scores))
						]));
			case 'AroundTheClock':
				var v = s.a;
				var current = s.b;
				var hits = s.c;
				var scores = s.d;
				return $elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'type',
							$elm$json$Json$Encode$string('ATC')),
							_Utils_Tuple2(
							'variant',
							encode_atc_var(v)),
							_Utils_Tuple2(
							'current',
							$elm$json$Json$Encode$int(current)),
							_Utils_Tuple2(
							'turn',
							encode_hits(hits)),
							_Utils_Tuple2(
							'scores',
							encode_atc_scores(scores))
						]));
			case 'AroundTheClock180':
				var v = s.a;
				var current = s.b;
				var hits = s.c;
				var scores = s.d;
				return $elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'type',
							$elm$json$Json$Encode$string('ATC180')),
							_Utils_Tuple2(
							'variant',
							encode_atc_180_var(v)),
							_Utils_Tuple2(
							'current',
							$elm$json$Json$Encode$int(current)),
							_Utils_Tuple2(
							'turn',
							encode_hits(hits)),
							_Utils_Tuple2(
							'scores',
							encode_atc_180_scores(scores))
						]));
			case 'Baseball':
				var v = s.a;
				var current = s.b;
				var hits = s.c;
				var inning = s.d;
				var scores = s.e;
				return $elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'type',
							$elm$json$Json$Encode$string('BBL')),
							_Utils_Tuple2(
							'variant',
							encode_bbl_var(v)),
							_Utils_Tuple2(
							'current',
							$elm$json$Json$Encode$int(current)),
							_Utils_Tuple2(
							'turn',
							encode_hits(hits)),
							_Utils_Tuple2(
							'inning',
							encode_inning(inning)),
							_Utils_Tuple2(
							'scores',
							encode_bbl_scores(scores))
						]));
			case 'ChaseTheDragon':
				var v = s.a;
				var current = s.b;
				var hits = s.c;
				var scores = s.d;
				return $elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'type',
							$elm$json$Json$Encode$string('CTD')),
							_Utils_Tuple2(
							'variant',
							encode_ctd_var(v)),
							_Utils_Tuple2(
							'current',
							$elm$json$Json$Encode$int(current)),
							_Utils_Tuple2(
							'turn',
							encode_hits(hits)),
							_Utils_Tuple2(
							'scores',
							encode_ctd_scores(scores))
						]));
			default:
				var v = s.a;
				var current = s.b;
				var hits = s.c;
				var scores = s.d;
				return $elm$json$Json$Encode$object(
					_List_fromArray(
						[
							_Utils_Tuple2(
							'type',
							$elm$json$Json$Encode$string('CKT')),
							_Utils_Tuple2(
							'variant',
							encode_ckt_var(v)),
							_Utils_Tuple2(
							'current',
							$elm$json$Json$Encode$int(current)),
							_Utils_Tuple2(
							'turn',
							encode_hits(hits)),
							_Utils_Tuple2(
							'scores',
							encode_ckt_scores(scores))
						]));
		}
	};
	return $elm$json$Json$Encode$object(
		_List_fromArray(
			[
				_Utils_Tuple2(
				'players',
				encode_list_player(state.players)),
				_Utils_Tuple2(
				'game',
				encode_game_state(state.game)),
				_Utils_Tuple2(
				'screen',
				encode_screen(state.screen)),
				_Utils_Tuple2(
				'playing',
				$elm$json$Json$Encode$bool(state.playing))
			]));
};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $author$project$Game$find_by_id = F2(
	function (p, l) {
		var check = F2(
			function (_v0, acc) {
				var i = _v0.a;
				var a = _v0.b;
				return (_Utils_eq(p, i) && _Utils_eq(acc, $elm$core$Maybe$Nothing)) ? $elm$core$Maybe$Just(a) : acc;
			});
		return A3($elm$core$List$foldr, check, $elm$core$Maybe$Nothing, l);
	});
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Game$player_id_at = F2(
	function (c, l) {
		var indexed = function (s) {
			return A2(
				$elm$core$List$indexedMap,
				F2(
					function (i, _v3) {
						var id = _v3.a;
						return _Utils_Tuple2(i, id);
					}),
				s);
		};
		var _v0 = $elm$core$List$head(
			A2(
				$elm$core$List$filter,
				function (_v1) {
					var i = _v1.a;
					var id = _v1.b;
					return _Utils_eq(i, c);
				},
				indexed(l)));
		if (_v0.$ === 'Nothing') {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v2 = _v0.a;
			var id = _v2.b;
			return $elm$core$Maybe$Just(id);
		}
	});
var $author$project$Game$update_by_id = F3(
	function (pid, a, l) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (_v0, acc) {
					var p = _v0.a;
					var s = _v0.b;
					return _Utils_eq(pid, p) ? A2(
						$elm$core$List$cons,
						_Utils_Tuple2(p, a),
						acc) : A2(
						$elm$core$List$cons,
						_Utils_Tuple2(p, s),
						acc);
				}),
			_List_Nil,
			l);
	});
var $author$project$Game$apply_score = F3(
	function (c, s, f) {
		var _v0 = A2($author$project$Game$player_id_at, c, s);
		if (_v0.$ === 'Nothing') {
			return s;
		} else {
			var pid = _v0.a;
			var _v1 = A2($author$project$Game$find_by_id, pid, s);
			if (_v1.$ === 'Nothing') {
				return s;
			} else {
				var ps = _v1.a;
				return A3(
					$author$project$Game$update_by_id,
					pid,
					f(
						_Utils_Tuple2(pid, ps)),
					s);
			}
		}
	});
var $author$project$Game$atc_next = function (ht) {
	switch (ht.$) {
		case 'HitMissed':
			return $elm$core$Maybe$Nothing;
		case 'Hit1':
			return $elm$core$Maybe$Just(
				$author$project$Types$Hit2($author$project$Types$SingleHit));
		case 'Hit2':
			return $elm$core$Maybe$Just(
				$author$project$Types$Hit3($author$project$Types$SingleHit));
		case 'Hit3':
			return $elm$core$Maybe$Just(
				$author$project$Types$Hit4($author$project$Types$SingleHit));
		case 'Hit4':
			return $elm$core$Maybe$Just(
				$author$project$Types$Hit5($author$project$Types$SingleHit));
		case 'Hit5':
			return $elm$core$Maybe$Just(
				$author$project$Types$Hit6($author$project$Types$SingleHit));
		case 'Hit6':
			return $elm$core$Maybe$Just(
				$author$project$Types$Hit7($author$project$Types$SingleHit));
		case 'Hit7':
			return $elm$core$Maybe$Just(
				$author$project$Types$Hit8($author$project$Types$SingleHit));
		case 'Hit8':
			return $elm$core$Maybe$Just(
				$author$project$Types$Hit9($author$project$Types$SingleHit));
		case 'Hit9':
			return $elm$core$Maybe$Just(
				$author$project$Types$Hit10($author$project$Types$SingleHit));
		case 'Hit10':
			return $elm$core$Maybe$Just(
				$author$project$Types$Hit11($author$project$Types$SingleHit));
		case 'Hit11':
			return $elm$core$Maybe$Just(
				$author$project$Types$Hit12($author$project$Types$SingleHit));
		case 'Hit12':
			return $elm$core$Maybe$Just(
				$author$project$Types$Hit13($author$project$Types$SingleHit));
		case 'Hit13':
			return $elm$core$Maybe$Just(
				$author$project$Types$Hit14($author$project$Types$SingleHit));
		case 'Hit14':
			return $elm$core$Maybe$Just(
				$author$project$Types$Hit15($author$project$Types$SingleHit));
		case 'Hit15':
			return $elm$core$Maybe$Just(
				$author$project$Types$Hit16($author$project$Types$SingleHit));
		case 'Hit16':
			return $elm$core$Maybe$Just(
				$author$project$Types$Hit17($author$project$Types$SingleHit));
		case 'Hit17':
			return $elm$core$Maybe$Just(
				$author$project$Types$Hit18($author$project$Types$SingleHit));
		case 'Hit18':
			return $elm$core$Maybe$Just(
				$author$project$Types$Hit19($author$project$Types$SingleHit));
		case 'Hit19':
			return $elm$core$Maybe$Just(
				$author$project$Types$Hit20($author$project$Types$SingleHit));
		case 'Hit20':
			return $elm$core$Maybe$Just($author$project$Types$HitBullseye);
		case 'HitBullseye':
			return $elm$core$Maybe$Just($author$project$Types$HitDoubleBullseye);
		default:
			return $elm$core$Maybe$Nothing;
	}
};
var $author$project$Cascade$cascade = F2(
	function (def, l) {
		var check = F2(
			function (_v2, acc) {
				var b = _v2.a;
				var a = _v2.b;
				if (acc.$ === 'Nothing') {
					return b ? $elm$core$Maybe$Just(a) : acc;
				} else {
					var v = acc;
					return v;
				}
			});
		var _v0 = A3($elm$core$List$foldl, check, $elm$core$Maybe$Nothing, l);
		if (_v0.$ === 'Just') {
			var a = _v0.a;
			return a;
		} else {
			return def;
		}
	});
var $author$project$Game$hit_eq_shallow = F2(
	function (a, b) {
		var _v0 = _Utils_Tuple2(a, b);
		_v0$23:
		while (true) {
			switch (_v0.a.$) {
				case 'HitMissed':
					if (_v0.b.$ === 'HitMissed') {
						var _v1 = _v0.a;
						var _v2 = _v0.b;
						return true;
					} else {
						break _v0$23;
					}
				case 'Hit1':
					if (_v0.b.$ === 'Hit1') {
						return true;
					} else {
						break _v0$23;
					}
				case 'Hit2':
					if (_v0.b.$ === 'Hit2') {
						return true;
					} else {
						break _v0$23;
					}
				case 'Hit3':
					if (_v0.b.$ === 'Hit3') {
						return true;
					} else {
						break _v0$23;
					}
				case 'Hit4':
					if (_v0.b.$ === 'Hit4') {
						return true;
					} else {
						break _v0$23;
					}
				case 'Hit5':
					if (_v0.b.$ === 'Hit5') {
						return true;
					} else {
						break _v0$23;
					}
				case 'Hit6':
					if (_v0.b.$ === 'Hit6') {
						return true;
					} else {
						break _v0$23;
					}
				case 'Hit7':
					if (_v0.b.$ === 'Hit7') {
						return true;
					} else {
						break _v0$23;
					}
				case 'Hit8':
					if (_v0.b.$ === 'Hit8') {
						return true;
					} else {
						break _v0$23;
					}
				case 'Hit9':
					if (_v0.b.$ === 'Hit9') {
						return true;
					} else {
						break _v0$23;
					}
				case 'Hit10':
					if (_v0.b.$ === 'Hit10') {
						return true;
					} else {
						break _v0$23;
					}
				case 'Hit11':
					if (_v0.b.$ === 'Hit11') {
						return true;
					} else {
						break _v0$23;
					}
				case 'Hit12':
					if (_v0.b.$ === 'Hit12') {
						return true;
					} else {
						break _v0$23;
					}
				case 'Hit13':
					if (_v0.b.$ === 'Hit13') {
						return true;
					} else {
						break _v0$23;
					}
				case 'Hit14':
					if (_v0.b.$ === 'Hit14') {
						return true;
					} else {
						break _v0$23;
					}
				case 'Hit15':
					if (_v0.b.$ === 'Hit15') {
						return true;
					} else {
						break _v0$23;
					}
				case 'Hit16':
					if (_v0.b.$ === 'Hit16') {
						return true;
					} else {
						break _v0$23;
					}
				case 'Hit17':
					if (_v0.b.$ === 'Hit17') {
						return true;
					} else {
						break _v0$23;
					}
				case 'Hit18':
					if (_v0.b.$ === 'Hit18') {
						return true;
					} else {
						break _v0$23;
					}
				case 'Hit19':
					if (_v0.b.$ === 'Hit19') {
						return true;
					} else {
						break _v0$23;
					}
				case 'Hit20':
					if (_v0.b.$ === 'Hit20') {
						return true;
					} else {
						break _v0$23;
					}
				case 'HitBullseye':
					if (_v0.b.$ === 'HitBullseye') {
						var _v3 = _v0.a;
						var _v4 = _v0.b;
						return true;
					} else {
						break _v0$23;
					}
				default:
					if (_v0.b.$ === 'HitDoubleBullseye') {
						var _v5 = _v0.a;
						var _v6 = _v0.b;
						return true;
					} else {
						break _v0$23;
					}
			}
		}
		return false;
	});
var $author$project$Game$hit_eq_shallow_m = F2(
	function (a, mb) {
		if (mb.$ === 'Just') {
			var b = mb.a;
			return A2($author$project$Game$hit_eq_shallow, a, b);
		} else {
			return false;
		}
	});
var $author$project$Game$around_the_clock = F4(
	function (v, c, hl, sl) {
		var check = F2(
			function (h, acc) {
				var _v1 = $elm$core$List$head(acc);
				if (_v1.$ === 'Nothing') {
					return A2(
						$author$project$Game$hit_eq_shallow,
						h,
						$author$project$Types$Hit1($author$project$Types$SingleHit)) ? _List_fromArray(
						[h]) : _List_Nil;
				} else {
					var n = _v1.a;
					return A2(
						$author$project$Game$hit_eq_shallow_m,
						h,
						$author$project$Game$atc_next(n)) ? A2($elm$core$List$cons, h, acc) : acc;
				}
			});
		var tally = function (s) {
			return $author$project$Types$AroundTheClockScore(
				A3($elm$core$List$foldr, check, s, hl));
		};
		var calc = function (_v0) {
			var s = _v0.b.a;
			return A2(
				$author$project$Cascade$cascade,
				tally(s),
				_List_fromArray(
					[
						_Utils_Tuple2(
						_Utils_eq(v, $author$project$Types$NoBullOut) && ($elm$core$List$length(hl) === 20),
						$author$project$Types$AroundTheClockScore(s)),
						_Utils_Tuple2(
						_Utils_eq(v, $author$project$Types$AnyBullOut) && ($elm$core$List$length(hl) === 21),
						$author$project$Types$AroundTheClockScore(s)),
						_Utils_Tuple2(
						_Utils_eq(v, $author$project$Types$SplitBullOut) && ($elm$core$List$length(hl) === 22),
						$author$project$Types$AroundTheClockScore(s))
					]));
		};
		return A3($author$project$Game$apply_score, c, sl, calc);
	});
var $author$project$Types$SubMissed = {$: 'SubMissed'};
var $author$project$Game$sub_hit = function (h) {
	switch (h.$) {
		case 'HitMissed':
			return $author$project$Types$SubMissed;
		case 'Hit1':
			var s = h.a;
			return s;
		case 'Hit2':
			var s = h.a;
			return s;
		case 'Hit3':
			var s = h.a;
			return s;
		case 'Hit4':
			var s = h.a;
			return s;
		case 'Hit5':
			var s = h.a;
			return s;
		case 'Hit6':
			var s = h.a;
			return s;
		case 'Hit7':
			var s = h.a;
			return s;
		case 'Hit8':
			var s = h.a;
			return s;
		case 'Hit9':
			var s = h.a;
			return s;
		case 'Hit10':
			var s = h.a;
			return s;
		case 'Hit11':
			var s = h.a;
			return s;
		case 'Hit12':
			var s = h.a;
			return s;
		case 'Hit13':
			var s = h.a;
			return s;
		case 'Hit14':
			var s = h.a;
			return s;
		case 'Hit15':
			var s = h.a;
			return s;
		case 'Hit16':
			var s = h.a;
			return s;
		case 'Hit17':
			var s = h.a;
			return s;
		case 'Hit18':
			var s = h.a;
			return s;
		case 'Hit19':
			var s = h.a;
			return s;
		case 'Hit20':
			var s = h.a;
			return s;
		case 'HitBullseye':
			return $author$project$Types$SingleHit;
		default:
			return $author$project$Types$DoubleHit;
	}
};
var $author$project$Game$around_the_clock_180 = F4(
	function (v, c, hl, sl) {
		var bonus = function (h) {
			if (v.$ === 'DoubleBonus') {
				var _v4 = $author$project$Game$sub_hit(h);
				if (_v4.$ === 'DoubleHit') {
					return $author$project$Types$Score(3);
				} else {
					return $author$project$Types$Score(1);
				}
			} else {
				var _v5 = $author$project$Game$sub_hit(h);
				if (_v5.$ === 'TripleHit') {
					return $author$project$Types$Score(3);
				} else {
					return $author$project$Types$Score(1);
				}
			}
		};
		var check = F2(
			function (h, acc) {
				var _v1 = $elm$core$List$head(acc);
				if (_v1.$ === 'Nothing') {
					return A2(
						$author$project$Game$hit_eq_shallow,
						h,
						$author$project$Types$Hit1($author$project$Types$SingleHit)) ? _List_fromArray(
						[
							_Utils_Tuple2(
							h,
							bonus(h))
						]) : _List_Nil;
				} else {
					var _v2 = _v1.a;
					var n = _v2.a;
					return A2(
						$author$project$Game$hit_eq_shallow_m,
						h,
						$author$project$Game$atc_next(n)) ? A2(
						$elm$core$List$cons,
						_Utils_Tuple2(
							h,
							bonus(h)),
						acc) : acc;
				}
			});
		var tally = function (s) {
			return $author$project$Types$AroundTheClock180Score(
				A3($elm$core$List$foldr, check, s, hl));
		};
		var calc = function (_v0) {
			var s = _v0.b.a;
			return ($elm$core$List$length(hl) === 20) ? $author$project$Types$AroundTheClock180Score(s) : tally(s);
		};
		return A3($author$project$Game$apply_score, c, sl, calc);
	});
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $elm$core$List$sortBy = _List_sortBy;
var $elm$core$List$sort = function (xs) {
	return A2($elm$core$List$sortBy, $elm$core$Basics$identity, xs);
};
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $author$project$Game$baseball = F5(
	function (v, c, hl, _v0, sl) {
		var i = _v0.a;
		var update_inning_score = F3(
			function (s, _v14, acc) {
				var i2 = _v14.a.a;
				var s2 = _v14.b;
				var sc2 = _v14.c.a;
				return _Utils_eq(i, i2) ? A2(
					$elm$core$List$cons,
					_Utils_Tuple3(
						$author$project$Types$Inning(i),
						$author$project$Types$InningClosed,
						$author$project$Types$Score(s + sc2)),
					acc) : A2(
					$elm$core$List$cons,
					_Utils_Tuple3(
						$author$project$Types$Inning(i2),
						s2,
						$author$project$Types$Score(sc2)),
					acc);
			});
		var total_score = function (_v13) {
			var l = _v13.a;
			return A3(
				$elm$core$List$foldl,
				F2(
					function (_v12, acc) {
						var s = _v12.c.a;
						return acc + s;
					}),
				0,
				l);
		};
		var total_scores = function (l) {
			return A3(
				$elm$core$List$foldl,
				F2(
					function (_v11, acc) {
						var s = _v11.b;
						return A2(
							$elm$core$List$cons,
							total_score(s),
							acc);
					}),
				_List_Nil,
				l);
		};
		var tie_exists = function (l) {
			var _v9 = A2(
				$elm$core$List$take,
				2,
				$elm$core$List$reverse(
					$elm$core$List$sort(
						total_scores(l))));
			if (_v9.b && _v9.b.b) {
				var a = _v9.a;
				var _v10 = _v9.b;
				var b = _v10.a;
				return _Utils_eq(a, b);
			} else {
				return false;
			}
		};
		var points_for_tie = F2(
			function (h, acc) {
				switch (h.$) {
					case 'HitBullseye':
						return acc + 1;
					case 'HitDoubleBullseye':
						return acc + 2;
					default:
						return acc;
				}
			});
		var points_for_sub = function (s) {
			switch (s.$) {
				case 'SingleHit':
					return 1;
				case 'DoubleHit':
					return 2;
				case 'TripleHit':
					return 3;
				default:
					return 0;
			}
		};
		var points_for_inning = F2(
			function (h, acc) {
				var _v6 = _Utils_Tuple2(i, h);
				_v6$9:
				while (true) {
					switch (_v6.a) {
						case 1:
							if (_v6.b.$ === 'Hit1') {
								var s = _v6.b.a;
								return acc + points_for_sub(s);
							} else {
								break _v6$9;
							}
						case 2:
							if (_v6.b.$ === 'Hit2') {
								var s = _v6.b.a;
								return acc + points_for_sub(s);
							} else {
								break _v6$9;
							}
						case 3:
							if (_v6.b.$ === 'Hit3') {
								var s = _v6.b.a;
								return acc + points_for_sub(s);
							} else {
								break _v6$9;
							}
						case 4:
							if (_v6.b.$ === 'Hit4') {
								var s = _v6.b.a;
								return acc + points_for_sub(s);
							} else {
								break _v6$9;
							}
						case 5:
							if (_v6.b.$ === 'Hit5') {
								var s = _v6.b.a;
								return acc + points_for_sub(s);
							} else {
								break _v6$9;
							}
						case 6:
							if (_v6.b.$ === 'Hit6') {
								var s = _v6.b.a;
								return acc + points_for_sub(s);
							} else {
								break _v6$9;
							}
						case 7:
							if (_v6.b.$ === 'Hit7') {
								var s = _v6.b.a;
								return acc + points_for_sub(s);
							} else {
								break _v6$9;
							}
						case 8:
							if (_v6.b.$ === 'Hit8') {
								var s = _v6.b.a;
								return acc + points_for_sub(s);
							} else {
								break _v6$9;
							}
						case 9:
							if (_v6.b.$ === 'Hit9') {
								var s = _v6.b.a;
								return acc + points_for_sub(s);
							} else {
								break _v6$9;
							}
						default:
							break _v6$9;
					}
				}
				return acc;
			});
		var closed = F2(
			function (_v5, acc) {
				var s = _v5.b;
				return acc ? _Utils_eq(s, $author$project$Types$InningClosed) : acc;
			});
		var player_closed = F2(
			function (_v4, acc) {
				var pid = _v4.a;
				var s = _v4.b.a;
				return acc ? A3($elm$core$List$foldr, closed, true, s) : acc;
			});
		var apply_inning_points = F2(
			function (il, s) {
				return A3(
					$elm$core$List$foldr,
					update_inning_score(s),
					_List_Nil,
					il);
			});
		var calc_7th = function (l) {
			var points = A3($elm$core$List$foldr, points_for_inning, 0, hl);
			var penalty = -((total_score(
				$author$project$Types$BaseballScore(l)) / 2) | 0);
			if (!points) {
				return A2(apply_inning_points, l, penalty);
			} else {
				var x = points;
				return A2(apply_inning_points, l, x);
			}
		};
		var calc_inning = function (il) {
			return A2(
				apply_inning_points,
				il,
				A3($elm$core$List$foldr, points_for_inning, 0, hl));
		};
		var calc_tie_game = function (il) {
			return A2(
				apply_inning_points,
				il,
				A3($elm$core$List$foldr, points_for_tie, 0, hl));
		};
		var calc = function (_v2) {
			var il = _v2.b.a;
			return A2(
				$author$project$Cascade$cascade,
				$author$project$Types$BaseballScore(
					calc_inning(il)),
				_List_fromArray(
					[
						_Utils_Tuple2(
						A3($elm$core$List$foldr, closed, true, il),
						$author$project$Types$BaseballScore(il)),
						_Utils_Tuple2(
						i > 9,
						$author$project$Types$BaseballScore(
							calc_tie_game(il))),
						_Utils_Tuple2(
						_Utils_eq(v, $author$project$Types$SeventhInningCatch) && (i === 7),
						$author$project$Types$BaseballScore(
							calc_7th(il)))
					]));
		};
		var append_inning = F3(
			function (ei, _v1, acc) {
				var pid = _v1.a;
				var l = _v1.b.a;
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(
						pid,
						$author$project$Types$BaseballScore(
							_Utils_ap(
								l,
								_List_fromArray(
									[
										_Utils_Tuple3(
										$author$project$Types$Inning(ei),
										$author$project$Types$InningOpen,
										$author$project$Types$Score(0))
									])))),
					acc);
			});
		var all_closed = function (l) {
			return A3($elm$core$List$foldr, player_closed, true, l);
		};
		var add_extra_inning = function (l) {
			return (all_closed(l) && tie_exists(l)) ? A3(
				$elm$core$List$foldr,
				append_inning(i + 1),
				_List_Nil,
				l) : l;
		};
		return add_extra_inning(
			A3($author$project$Game$apply_score, c, sl, calc));
	});
var $author$project$Game$ctd_next = function (ht) {
	_v0$13:
	while (true) {
		switch (ht.$) {
			case 'Hit10':
				if (ht.a.$ === 'TripleHit') {
					var _v1 = ht.a;
					return $elm$core$Maybe$Just(
						$author$project$Types$Hit11($author$project$Types$TripleHit));
				} else {
					break _v0$13;
				}
			case 'Hit11':
				if (ht.a.$ === 'TripleHit') {
					var _v2 = ht.a;
					return $elm$core$Maybe$Just(
						$author$project$Types$Hit12($author$project$Types$TripleHit));
				} else {
					break _v0$13;
				}
			case 'Hit12':
				if (ht.a.$ === 'TripleHit') {
					var _v3 = ht.a;
					return $elm$core$Maybe$Just(
						$author$project$Types$Hit13($author$project$Types$TripleHit));
				} else {
					break _v0$13;
				}
			case 'Hit13':
				if (ht.a.$ === 'TripleHit') {
					var _v4 = ht.a;
					return $elm$core$Maybe$Just(
						$author$project$Types$Hit14($author$project$Types$TripleHit));
				} else {
					break _v0$13;
				}
			case 'Hit14':
				if (ht.a.$ === 'TripleHit') {
					var _v5 = ht.a;
					return $elm$core$Maybe$Just(
						$author$project$Types$Hit15($author$project$Types$TripleHit));
				} else {
					break _v0$13;
				}
			case 'Hit15':
				if (ht.a.$ === 'TripleHit') {
					var _v6 = ht.a;
					return $elm$core$Maybe$Just(
						$author$project$Types$Hit16($author$project$Types$TripleHit));
				} else {
					break _v0$13;
				}
			case 'Hit16':
				if (ht.a.$ === 'TripleHit') {
					var _v7 = ht.a;
					return $elm$core$Maybe$Just(
						$author$project$Types$Hit17($author$project$Types$TripleHit));
				} else {
					break _v0$13;
				}
			case 'Hit17':
				if (ht.a.$ === 'TripleHit') {
					var _v8 = ht.a;
					return $elm$core$Maybe$Just(
						$author$project$Types$Hit18($author$project$Types$TripleHit));
				} else {
					break _v0$13;
				}
			case 'Hit18':
				if (ht.a.$ === 'TripleHit') {
					var _v9 = ht.a;
					return $elm$core$Maybe$Just(
						$author$project$Types$Hit19($author$project$Types$TripleHit));
				} else {
					break _v0$13;
				}
			case 'Hit19':
				if (ht.a.$ === 'TripleHit') {
					var _v10 = ht.a;
					return $elm$core$Maybe$Just(
						$author$project$Types$Hit20($author$project$Types$TripleHit));
				} else {
					break _v0$13;
				}
			case 'Hit20':
				if (ht.a.$ === 'TripleHit') {
					var _v11 = ht.a;
					return $elm$core$Maybe$Just($author$project$Types$HitBullseye);
				} else {
					break _v0$13;
				}
			case 'HitBullseye':
				return $elm$core$Maybe$Just($author$project$Types$HitDoubleBullseye);
			case 'HitDoubleBullseye':
				return $elm$core$Maybe$Just(
					$author$project$Types$Hit10($author$project$Types$TripleHit));
			default:
				break _v0$13;
		}
	}
	return $elm$core$Maybe$Nothing;
};
var $author$project$Game$hit_eq_m = F2(
	function (a, mb) {
		if (mb.$ === 'Just') {
			var b = mb.a;
			return _Utils_eq(a, b);
		} else {
			return false;
		}
	});
var $author$project$Game$chase_the_dragon = F4(
	function (v, c, hl, sl) {
		var check = F2(
			function (h, acc) {
				var _v1 = $elm$core$List$head(acc);
				if (_v1.$ === 'Nothing') {
					return _Utils_eq(
						h,
						$author$project$Types$Hit10($author$project$Types$TripleHit)) ? _List_fromArray(
						[h]) : _List_Nil;
				} else {
					var n = _v1.a;
					return A2(
						$author$project$Game$hit_eq_m,
						h,
						$author$project$Game$ctd_next(n)) ? A2($elm$core$List$cons, h, acc) : acc;
				}
			});
		var tally = function (s) {
			return $author$project$Types$ChaseTheDragonScore(
				A3($elm$core$List$foldr, check, s, hl));
		};
		var calc = function (_v0) {
			var s = _v0.b.a;
			return A2(
				$author$project$Cascade$cascade,
				tally(s),
				_List_fromArray(
					[
						_Utils_Tuple2(
						_Utils_eq(v, $author$project$Types$BasicDragon) && ($elm$core$List$length(hl) === 12),
						$author$project$Types$ChaseTheDragonScore(s)),
						_Utils_Tuple2(
						_Utils_eq(v, $author$project$Types$TripleHeadedDragon) && ($elm$core$List$length(hl) === 26),
						$author$project$Types$ChaseTheDragonScore(s))
					]));
		};
		return A3($author$project$Game$apply_score, c, sl, calc);
	});
var $author$project$Game$clear_hits = function (g) {
	switch (g.$) {
		case 'NoGame':
			return $author$project$Types$NoGame;
		case 'Numbers701':
			var i = g.a;
			var o = g.b;
			var c = g.c;
			var s = g.e;
			return A5($author$project$Types$Numbers701, i, o, c, _List_Nil, s);
		case 'Numbers501':
			var i = g.a;
			var o = g.b;
			var c = g.c;
			var s = g.e;
			return A5($author$project$Types$Numbers501, i, o, c, _List_Nil, s);
		case 'Numbers301':
			var i = g.a;
			var o = g.b;
			var c = g.c;
			var s = g.e;
			return A5($author$project$Types$Numbers301, i, o, c, _List_Nil, s);
		case 'AroundTheClock':
			var v = g.a;
			var c = g.b;
			var s = g.d;
			return A4($author$project$Types$AroundTheClock, v, c, _List_Nil, s);
		case 'AroundTheClock180':
			var v = g.a;
			var c = g.b;
			var s = g.d;
			return A4($author$project$Types$AroundTheClock180, v, c, _List_Nil, s);
		case 'Baseball':
			var v = g.a;
			var c = g.b;
			var i = g.d;
			var s = g.e;
			return A5($author$project$Types$Baseball, v, c, _List_Nil, i, s);
		case 'ChaseTheDragon':
			var v = g.a;
			var c = g.b;
			var s = g.d;
			return A4($author$project$Types$ChaseTheDragon, v, c, _List_Nil, s);
		default:
			var v = g.a;
			var c = g.b;
			var s = g.d;
			return A4($author$project$Types$Cricket, v, c, _List_Nil, s);
	}
};
var $author$project$Types$S15 = {$: 'S15'};
var $author$project$Types$S16 = {$: 'S16'};
var $author$project$Types$S17 = {$: 'S17'};
var $author$project$Types$S18 = {$: 'S18'};
var $author$project$Types$S19 = {$: 'S19'};
var $author$project$Types$S20 = {$: 'S20'};
var $author$project$Types$SB = {$: 'SB'};
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$Basics$not = _Basics_not;
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $author$project$Game$hit_base_points = function (h) {
	switch (h.$) {
		case 'HitMissed':
			return 0;
		case 'Hit1':
			var s = h.a;
			return 1;
		case 'Hit2':
			var s = h.a;
			return 2;
		case 'Hit3':
			var s = h.a;
			return 3;
		case 'Hit4':
			var s = h.a;
			return 4;
		case 'Hit5':
			var s = h.a;
			return 5;
		case 'Hit6':
			var s = h.a;
			return 6;
		case 'Hit7':
			var s = h.a;
			return 7;
		case 'Hit8':
			var s = h.a;
			return 8;
		case 'Hit9':
			var s = h.a;
			return 9;
		case 'Hit10':
			var s = h.a;
			return 10;
		case 'Hit11':
			var s = h.a;
			return 11;
		case 'Hit12':
			var s = h.a;
			return 12;
		case 'Hit13':
			var s = h.a;
			return 13;
		case 'Hit14':
			var s = h.a;
			return 14;
		case 'Hit15':
			var s = h.a;
			return 15;
		case 'Hit16':
			var s = h.a;
			return 16;
		case 'Hit17':
			var s = h.a;
			return 17;
		case 'Hit18':
			var s = h.a;
			return 18;
		case 'Hit19':
			var s = h.a;
			return 19;
		case 'Hit20':
			var s = h.a;
			return 20;
		case 'HitBullseye':
			return 25;
		default:
			return 25;
	}
};
var $author$project$Game$hit_points = function (h) {
	var mult = F2(
		function (p, s) {
			switch (s.$) {
				case 'SubMissed':
					return 0;
				case 'SingleHit':
					return p;
				case 'DoubleHit':
					return p * 2;
				default:
					return p * 3;
			}
		});
	switch (h.$) {
		case 'HitMissed':
			return 0;
		case 'Hit1':
			var s = h.a;
			return A2(mult, 1, s);
		case 'Hit2':
			var s = h.a;
			return A2(mult, 2, s);
		case 'Hit3':
			var s = h.a;
			return A2(mult, 3, s);
		case 'Hit4':
			var s = h.a;
			return A2(mult, 4, s);
		case 'Hit5':
			var s = h.a;
			return A2(mult, 5, s);
		case 'Hit6':
			var s = h.a;
			return A2(mult, 6, s);
		case 'Hit7':
			var s = h.a;
			return A2(mult, 7, s);
		case 'Hit8':
			var s = h.a;
			return A2(mult, 8, s);
		case 'Hit9':
			var s = h.a;
			return A2(mult, 9, s);
		case 'Hit10':
			var s = h.a;
			return A2(mult, 10, s);
		case 'Hit11':
			var s = h.a;
			return A2(mult, 11, s);
		case 'Hit12':
			var s = h.a;
			return A2(mult, 12, s);
		case 'Hit13':
			var s = h.a;
			return A2(mult, 13, s);
		case 'Hit14':
			var s = h.a;
			return A2(mult, 14, s);
		case 'Hit15':
			var s = h.a;
			return A2(mult, 15, s);
		case 'Hit16':
			var s = h.a;
			return A2(mult, 16, s);
		case 'Hit17':
			var s = h.a;
			return A2(mult, 17, s);
		case 'Hit18':
			var s = h.a;
			return A2(mult, 18, s);
		case 'Hit19':
			var s = h.a;
			return A2(mult, 19, s);
		case 'Hit20':
			var s = h.a;
			return A2(mult, 20, s);
		case 'HitBullseye':
			return 25;
		default:
			return 50;
	}
};
var $elm$core$Basics$neq = _Utils_notEqual;
var $author$project$Game$cricket = F3(
	function (c, hl, sl) {
		var set = F3(
			function (s, a, b) {
				switch (a.$) {
					case 'S20':
						return _Utils_update(
							s,
							{slice20: b});
					case 'S19':
						return _Utils_update(
							s,
							{slice19: b});
					case 'S18':
						return _Utils_update(
							s,
							{slice18: b});
					case 'S17':
						return _Utils_update(
							s,
							{slice17: b});
					case 'S16':
						return _Utils_update(
							s,
							{slice16: b});
					case 'S15':
						return _Utils_update(
							s,
							{slice15: b});
					default:
						return _Utils_update(
							s,
							{sliceBull: b});
				}
			});
		var last_open = F2(
			function (pid, a) {
				var others = function (_v11) {
					var id = _v11.a;
					return !_Utils_eq(pid, id);
				};
				var open = function (_v10) {
					var s = _v10.b;
					switch (a.$) {
						case 'S20':
							return _Utils_eq(s.slice20, $author$project$Types$SliceOpen);
						case 'S19':
							return _Utils_eq(s.slice19, $author$project$Types$SliceOpen);
						case 'S18':
							return _Utils_eq(s.slice18, $author$project$Types$SliceOpen);
						case 'S17':
							return _Utils_eq(s.slice17, $author$project$Types$SliceOpen);
						case 'S16':
							return _Utils_eq(s.slice16, $author$project$Types$SliceOpen);
						case 'S15':
							return _Utils_eq(s.slice15, $author$project$Types$SliceOpen);
						default:
							return _Utils_eq(s.sliceBull, $author$project$Types$SliceOpen);
					}
				};
				return A2(
					$elm$core$List$all,
					open,
					A2($elm$core$List$filter, others, sl));
			});
		var trim_points = F3(
			function (pid, a, i) {
				return A2(last_open, pid, a) ? 0 : i;
			});
		var get = F2(
			function (s, a) {
				switch (a.$) {
					case 'S20':
						return s.slice20;
					case 'S19':
						return s.slice19;
					case 'S18':
						return s.slice18;
					case 'S17':
						return s.slice17;
					case 'S16':
						return s.slice16;
					case 'S15':
						return s.slice15;
					default:
						return s.sliceBull;
				}
			});
		var close = F2(
			function (l, a) {
				var change = function (_v7) {
					var p = _v7.a;
					var s = _v7.b;
					switch (a.$) {
						case 'S20':
							return _Utils_Tuple2(
								p,
								_Utils_update(
									s,
									{slice20: $author$project$Types$SliceClosed}));
						case 'S19':
							return _Utils_Tuple2(
								p,
								_Utils_update(
									s,
									{slice19: $author$project$Types$SliceClosed}));
						case 'S18':
							return _Utils_Tuple2(
								p,
								_Utils_update(
									s,
									{slice18: $author$project$Types$SliceClosed}));
						case 'S17':
							return _Utils_Tuple2(
								p,
								_Utils_update(
									s,
									{slice17: $author$project$Types$SliceClosed}));
						case 'S16':
							return _Utils_Tuple2(
								p,
								_Utils_update(
									s,
									{slice16: $author$project$Types$SliceClosed}));
						case 'S15':
							return _Utils_Tuple2(
								p,
								_Utils_update(
									s,
									{slice15: $author$project$Types$SliceClosed}));
						default:
							return _Utils_Tuple2(
								p,
								_Utils_update(
									s,
									{sliceBull: $author$project$Types$SliceClosed}));
					}
				};
				return A2($elm$core$List$map, change, l);
			});
		var all_open = F2(
			function (l, a) {
				var open = function (_v5) {
					var s = _v5.b;
					switch (a.$) {
						case 'S20':
							return _Utils_eq(s.slice20, $author$project$Types$SliceOpen);
						case 'S19':
							return _Utils_eq(s.slice19, $author$project$Types$SliceOpen);
						case 'S18':
							return _Utils_eq(s.slice18, $author$project$Types$SliceOpen);
						case 'S17':
							return _Utils_eq(s.slice17, $author$project$Types$SliceOpen);
						case 'S16':
							return _Utils_eq(s.slice16, $author$project$Types$SliceOpen);
						case 'S15':
							return _Utils_eq(s.slice15, $author$project$Types$SliceOpen);
						default:
							return _Utils_eq(s.sliceBull, $author$project$Types$SliceOpen);
					}
				};
				return A2($elm$core$List$all, open, l);
			});
		var close_slice = F2(
			function (a, l) {
				return A2(all_open, l, a) ? A2(close, l, a) : l;
			});
		var post_process = function (l) {
			return A2(
				close_slice,
				$author$project$Types$S20,
				A2(
					close_slice,
					$author$project$Types$S19,
					A2(
						close_slice,
						$author$project$Types$S18,
						A2(
							close_slice,
							$author$project$Types$S17,
							A2(
								close_slice,
								$author$project$Types$S16,
								A2(
									close_slice,
									$author$project$Types$S15,
									A2(close_slice, $author$project$Types$SB, l)))))));
		};
		var add_points = F2(
			function (_v3, i) {
				var s = _v3.a;
				return $author$project$Types$Score(s + i);
			});
		var set_with_score = F5(
			function (pid, s, a, b, p) {
				switch (a.$) {
					case 'S20':
						return _Utils_update(
							s,
							{
								score: A2(
									add_points,
									s.score,
									A3(trim_points, pid, a, p)),
								slice20: b
							});
					case 'S19':
						return _Utils_update(
							s,
							{
								score: A2(
									add_points,
									s.score,
									A3(trim_points, pid, a, p)),
								slice19: b
							});
					case 'S18':
						return _Utils_update(
							s,
							{
								score: A2(
									add_points,
									s.score,
									A3(trim_points, pid, a, p)),
								slice18: b
							});
					case 'S17':
						return _Utils_update(
							s,
							{
								score: A2(
									add_points,
									s.score,
									A3(trim_points, pid, a, p)),
								slice17: b
							});
					case 'S16':
						return _Utils_update(
							s,
							{
								score: A2(
									add_points,
									s.score,
									A3(trim_points, pid, a, p)),
								slice16: b
							});
					case 'S15':
						return _Utils_update(
							s,
							{
								score: A2(
									add_points,
									s.score,
									A3(trim_points, pid, a, p)),
								slice15: b
							});
					default:
						return _Utils_update(
							s,
							{
								score: A2(
									add_points,
									s.score,
									A3(trim_points, pid, a, p)),
								sliceBull: b
							});
				}
			});
		var check = F5(
			function (pid, cs, h, x, a) {
				return A2(
					$author$project$Cascade$cascade,
					cs,
					_List_fromArray(
						[
							_Utils_Tuple2(
							_Utils_eq(
								A2(get, cs, a),
								$author$project$Types$Slice0),
							A2(
								$author$project$Cascade$cascade,
								A3(set, cs, a, $author$project$Types$Slice1),
								_List_fromArray(
									[
										_Utils_Tuple2(
										_Utils_eq(x, $author$project$Types$DoubleHit),
										A3(set, cs, a, $author$project$Types$Slice2)),
										_Utils_Tuple2(
										_Utils_eq(x, $author$project$Types$TripleHit),
										A3(set, cs, a, $author$project$Types$SliceOpen))
									]))),
							_Utils_Tuple2(
							_Utils_eq(
								A2(get, cs, a),
								$author$project$Types$Slice1),
							A2(
								$author$project$Cascade$cascade,
								A3(set, cs, a, $author$project$Types$Slice2),
								_List_fromArray(
									[
										_Utils_Tuple2(
										_Utils_eq(x, $author$project$Types$DoubleHit),
										A3(set, cs, a, $author$project$Types$SliceOpen)),
										_Utils_Tuple2(
										_Utils_eq(x, $author$project$Types$TripleHit),
										A5(
											set_with_score,
											pid,
											cs,
											a,
											$author$project$Types$SliceOpen,
											$author$project$Game$hit_base_points(h)))
									]))),
							_Utils_Tuple2(
							_Utils_eq(
								A2(get, cs, a),
								$author$project$Types$Slice2),
							A2(
								$author$project$Cascade$cascade,
								A3(set, cs, a, $author$project$Types$SliceOpen),
								_List_fromArray(
									[
										_Utils_Tuple2(
										_Utils_eq(x, $author$project$Types$DoubleHit),
										A5(
											set_with_score,
											pid,
											cs,
											a,
											$author$project$Types$SliceOpen,
											$author$project$Game$hit_base_points(h))),
										_Utils_Tuple2(
										_Utils_eq(x, $author$project$Types$TripleHit),
										A5(
											set_with_score,
											pid,
											cs,
											a,
											$author$project$Types$SliceOpen,
											2 * $author$project$Game$hit_base_points(h)))
									]))),
							_Utils_Tuple2(
							_Utils_eq(
								A2(get, cs, a),
								$author$project$Types$SliceOpen),
							A5(
								set_with_score,
								pid,
								cs,
								a,
								$author$project$Types$SliceOpen,
								$author$project$Game$hit_points(h))),
							_Utils_Tuple2(
							_Utils_eq(
								A2(get, cs, a),
								$author$project$Types$SliceClosed),
							cs)
						]));
			});
		var calc_hit = F3(
			function (pid, h, s) {
				switch (h.$) {
					case 'Hit20':
						var x = h.a;
						return A5(check, pid, s, h, x, $author$project$Types$S20);
					case 'Hit19':
						var x = h.a;
						return A5(check, pid, s, h, x, $author$project$Types$S19);
					case 'Hit18':
						var x = h.a;
						return A5(check, pid, s, h, x, $author$project$Types$S18);
					case 'Hit17':
						var x = h.a;
						return A5(check, pid, s, h, x, $author$project$Types$S17);
					case 'Hit16':
						var x = h.a;
						return A5(check, pid, s, h, x, $author$project$Types$S16);
					case 'Hit15':
						var x = h.a;
						return A5(check, pid, s, h, x, $author$project$Types$S15);
					case 'HitBullseye':
						return A5(check, pid, s, h, $author$project$Types$SingleHit, $author$project$Types$SB);
					case 'HitDoubleBullseye':
						return A5(check, pid, s, h, $author$project$Types$DoubleHit, $author$project$Types$SB);
					default:
						return s;
				}
			});
		var calc_basic = F2(
			function (pid, s) {
				return A3(
					$elm$core$List$foldr,
					calc_hit(pid),
					s,
					hl);
			});
		var calc = function (_v0) {
			var pid = _v0.a;
			var s = _v0.b;
			return A2(calc_basic, pid, s);
		};
		return post_process(
			A3($author$project$Game$apply_score, c, sl, calc));
	});
var $author$project$Types$Delta = F2(
	function (a, b) {
		return {$: 'Delta', a: a, b: b};
	});
var $author$project$Types$DeltaNone = {$: 'DeltaNone'};
var $author$project$Game$cricket_golf = F3(
	function (c, hl, sl) {
		var set = F4(
			function (s, a, b, d) {
				switch (a.$) {
					case 'S20':
						return _Utils_Tuple2(
							_Utils_update(
								s,
								{slice20: b}),
							A2($elm$core$List$cons, $author$project$Types$DeltaNone, d));
					case 'S19':
						return _Utils_Tuple2(
							_Utils_update(
								s,
								{slice19: b}),
							A2($elm$core$List$cons, $author$project$Types$DeltaNone, d));
					case 'S18':
						return _Utils_Tuple2(
							_Utils_update(
								s,
								{slice18: b}),
							A2($elm$core$List$cons, $author$project$Types$DeltaNone, d));
					case 'S17':
						return _Utils_Tuple2(
							_Utils_update(
								s,
								{slice17: b}),
							A2($elm$core$List$cons, $author$project$Types$DeltaNone, d));
					case 'S16':
						return _Utils_Tuple2(
							_Utils_update(
								s,
								{slice16: b}),
							A2($elm$core$List$cons, $author$project$Types$DeltaNone, d));
					case 'S15':
						return _Utils_Tuple2(
							_Utils_update(
								s,
								{slice15: b}),
							A2($elm$core$List$cons, $author$project$Types$DeltaNone, d));
					default:
						return _Utils_Tuple2(
							_Utils_update(
								s,
								{sliceBull: b}),
							A2($elm$core$List$cons, $author$project$Types$DeltaNone, d));
				}
			});
		var last_open = F2(
			function (pid, a) {
				var others = function (_v20) {
					var id = _v20.a;
					return !_Utils_eq(pid, id);
				};
				var open = function (_v19) {
					var s = _v19.b;
					switch (a.$) {
						case 'S20':
							return _Utils_eq(s.slice20, $author$project$Types$SliceOpen);
						case 'S19':
							return _Utils_eq(s.slice19, $author$project$Types$SliceOpen);
						case 'S18':
							return _Utils_eq(s.slice18, $author$project$Types$SliceOpen);
						case 'S17':
							return _Utils_eq(s.slice17, $author$project$Types$SliceOpen);
						case 'S16':
							return _Utils_eq(s.slice16, $author$project$Types$SliceOpen);
						case 'S15':
							return _Utils_eq(s.slice15, $author$project$Types$SliceOpen);
						default:
							return _Utils_eq(s.sliceBull, $author$project$Types$SliceOpen);
					}
				};
				return A2(
					$elm$core$List$all,
					open,
					A2($elm$core$List$filter, others, sl));
			});
		var trim_points = F3(
			function (pid, a, i) {
				return A2(last_open, pid, a) ? 0 : i;
			});
		var get = F2(
			function (s, a) {
				switch (a.$) {
					case 'S20':
						return s.slice20;
					case 'S19':
						return s.slice19;
					case 'S18':
						return s.slice18;
					case 'S17':
						return s.slice17;
					case 'S16':
						return s.slice16;
					case 'S15':
						return s.slice15;
					default:
						return s.sliceBull;
				}
			});
		var close = F2(
			function (l, a) {
				var change = function (_v16) {
					var p = _v16.a;
					var s = _v16.b;
					switch (a.$) {
						case 'S20':
							return _Utils_Tuple2(
								p,
								_Utils_update(
									s,
									{slice20: $author$project$Types$SliceClosed}));
						case 'S19':
							return _Utils_Tuple2(
								p,
								_Utils_update(
									s,
									{slice19: $author$project$Types$SliceClosed}));
						case 'S18':
							return _Utils_Tuple2(
								p,
								_Utils_update(
									s,
									{slice18: $author$project$Types$SliceClosed}));
						case 'S17':
							return _Utils_Tuple2(
								p,
								_Utils_update(
									s,
									{slice17: $author$project$Types$SliceClosed}));
						case 'S16':
							return _Utils_Tuple2(
								p,
								_Utils_update(
									s,
									{slice16: $author$project$Types$SliceClosed}));
						case 'S15':
							return _Utils_Tuple2(
								p,
								_Utils_update(
									s,
									{slice15: $author$project$Types$SliceClosed}));
						default:
							return _Utils_Tuple2(
								p,
								_Utils_update(
									s,
									{sliceBull: $author$project$Types$SliceClosed}));
					}
				};
				return A2($elm$core$List$map, change, l);
			});
		var all_open = F2(
			function (l, a) {
				var open = function (_v14) {
					var s = _v14.b;
					switch (a.$) {
						case 'S20':
							return _Utils_eq(s.slice20, $author$project$Types$SliceOpen);
						case 'S19':
							return _Utils_eq(s.slice19, $author$project$Types$SliceOpen);
						case 'S18':
							return _Utils_eq(s.slice18, $author$project$Types$SliceOpen);
						case 'S17':
							return _Utils_eq(s.slice17, $author$project$Types$SliceOpen);
						case 'S16':
							return _Utils_eq(s.slice16, $author$project$Types$SliceOpen);
						case 'S15':
							return _Utils_eq(s.slice15, $author$project$Types$SliceOpen);
						default:
							return _Utils_eq(s.sliceBull, $author$project$Types$SliceOpen);
					}
				};
				return A2($elm$core$List$all, open, l);
			});
		var close_slice = F2(
			function (a, l) {
				return A2(all_open, l, a) ? A2(close, l, a) : l;
			});
		var post_process = function (l) {
			return A2(
				close_slice,
				$author$project$Types$S20,
				A2(
					close_slice,
					$author$project$Types$S19,
					A2(
						close_slice,
						$author$project$Types$S18,
						A2(
							close_slice,
							$author$project$Types$S17,
							A2(
								close_slice,
								$author$project$Types$S16,
								A2(
									close_slice,
									$author$project$Types$S15,
									A2(close_slice, $author$project$Types$SB, l)))))));
		};
		var add_points = F2(
			function (_v12, i) {
				var s = _v12.a;
				return $author$project$Types$Score(s + i);
			});
		var set_with_score = F6(
			function (pid, s, a, b, d, p) {
				switch (a.$) {
					case 'S20':
						return _Utils_Tuple2(
							_Utils_update(
								s,
								{slice20: b}),
							A2(
								$elm$core$List$cons,
								A2(
									$author$project$Types$Delta,
									$author$project$Types$S20,
									A2(
										add_points,
										s.score,
										A3(trim_points, pid, a, p))),
								d));
					case 'S19':
						return _Utils_Tuple2(
							_Utils_update(
								s,
								{slice19: b}),
							A2(
								$elm$core$List$cons,
								A2(
									$author$project$Types$Delta,
									$author$project$Types$S19,
									A2(
										add_points,
										s.score,
										A3(trim_points, pid, a, p))),
								d));
					case 'S18':
						return _Utils_Tuple2(
							_Utils_update(
								s,
								{slice18: b}),
							A2(
								$elm$core$List$cons,
								A2(
									$author$project$Types$Delta,
									$author$project$Types$S18,
									A2(
										add_points,
										s.score,
										A3(trim_points, pid, a, p))),
								d));
					case 'S17':
						return _Utils_Tuple2(
							_Utils_update(
								s,
								{slice17: b}),
							A2(
								$elm$core$List$cons,
								A2(
									$author$project$Types$Delta,
									$author$project$Types$S17,
									A2(
										add_points,
										s.score,
										A3(trim_points, pid, a, p))),
								d));
					case 'S16':
						return _Utils_Tuple2(
							_Utils_update(
								s,
								{slice16: b}),
							A2(
								$elm$core$List$cons,
								A2(
									$author$project$Types$Delta,
									$author$project$Types$S16,
									A2(
										add_points,
										s.score,
										A3(trim_points, pid, a, p))),
								d));
					case 'S15':
						return _Utils_Tuple2(
							_Utils_update(
								s,
								{slice15: b}),
							A2(
								$elm$core$List$cons,
								A2(
									$author$project$Types$Delta,
									$author$project$Types$S15,
									A2(
										add_points,
										s.score,
										A3(trim_points, pid, a, p))),
								d));
					default:
						return _Utils_Tuple2(
							_Utils_update(
								s,
								{sliceBull: b}),
							A2(
								$elm$core$List$cons,
								A2(
									$author$project$Types$Delta,
									$author$project$Types$SB,
									A2(
										add_points,
										s.score,
										A3(trim_points, pid, a, p))),
								d));
				}
			});
		var check = F6(
			function (pid, cs, h, x, d, a) {
				return A2(
					$author$project$Cascade$cascade,
					_Utils_Tuple2(
						cs,
						A2($elm$core$List$cons, $author$project$Types$DeltaNone, d)),
					_List_fromArray(
						[
							_Utils_Tuple2(
							_Utils_eq(
								A2(get, cs, a),
								$author$project$Types$Slice0),
							A2(
								$author$project$Cascade$cascade,
								A4(set, cs, a, $author$project$Types$Slice1, d),
								_List_fromArray(
									[
										_Utils_Tuple2(
										_Utils_eq(x, $author$project$Types$DoubleHit),
										A4(set, cs, a, $author$project$Types$Slice2, d)),
										_Utils_Tuple2(
										_Utils_eq(x, $author$project$Types$TripleHit),
										A4(set, cs, a, $author$project$Types$SliceOpen, d))
									]))),
							_Utils_Tuple2(
							_Utils_eq(
								A2(get, cs, a),
								$author$project$Types$Slice1),
							A2(
								$author$project$Cascade$cascade,
								A4(set, cs, a, $author$project$Types$Slice2, d),
								_List_fromArray(
									[
										_Utils_Tuple2(
										_Utils_eq(x, $author$project$Types$DoubleHit),
										A4(set, cs, a, $author$project$Types$SliceOpen, d)),
										_Utils_Tuple2(
										_Utils_eq(x, $author$project$Types$TripleHit),
										A6(
											set_with_score,
											pid,
											cs,
											a,
											$author$project$Types$SliceOpen,
											d,
											$author$project$Game$hit_base_points(h)))
									]))),
							_Utils_Tuple2(
							_Utils_eq(
								A2(get, cs, a),
								$author$project$Types$SliceOpen),
							A6(
								set_with_score,
								pid,
								cs,
								a,
								$author$project$Types$SliceOpen,
								d,
								$author$project$Game$hit_points(h))),
							_Utils_Tuple2(
							_Utils_eq(
								A2(get, cs, a),
								$author$project$Types$SliceClosed),
							_Utils_Tuple2(
								cs,
								A2($elm$core$List$cons, $author$project$Types$DeltaNone, d)))
						]));
			});
		var calc_hit = F3(
			function (pid, h, _v10) {
				var s = _v10.a;
				var d = _v10.b;
				switch (h.$) {
					case 'Hit20':
						var x = h.a;
						return A6(check, pid, s, h, x, d, $author$project$Types$S20);
					case 'Hit19':
						var x = h.a;
						return A6(check, pid, s, h, x, d, $author$project$Types$S19);
					case 'Hit18':
						var x = h.a;
						return A6(check, pid, s, h, x, d, $author$project$Types$S18);
					case 'Hit17':
						var x = h.a;
						return A6(check, pid, s, h, x, d, $author$project$Types$S17);
					case 'Hit16':
						var x = h.a;
						return A6(check, pid, s, h, x, d, $author$project$Types$S16);
					case 'Hit15':
						var x = h.a;
						return A6(check, pid, s, h, x, d, $author$project$Types$S15);
					case 'HitBullseye':
						return A6(check, pid, s, h, $author$project$Types$SingleHit, d, $author$project$Types$SB);
					case 'HitDoubleBullseye':
						return A6(check, pid, s, h, $author$project$Types$DoubleHit, d, $author$project$Types$SB);
					default:
						return _Utils_Tuple2(
							s,
							A2($elm$core$List$cons, $author$project$Types$DeltaNone, d));
				}
			});
		var calc_deltas = F2(
			function (pid, s) {
				return A3(
					$elm$core$List$foldr,
					calc_hit(pid),
					_Utils_Tuple2(s, _List_Nil),
					hl);
			});
		var add = F2(
			function (_v7, _v8) {
				var a = _v7.a;
				var b = _v8.a;
				return $author$project$Types$Score(a + b);
			});
		var tally = F3(
			function (s, slice, delta) {
				switch (slice.$) {
					case 'S20':
						return (_Utils_eq(s.slice20, $author$project$Types$SliceOpen) || _Utils_eq(s.slice20, $author$project$Types$SliceClosed)) ? s.score : A2(add, s.score, delta);
					case 'S19':
						return (_Utils_eq(s.slice19, $author$project$Types$SliceOpen) || _Utils_eq(s.slice19, $author$project$Types$SliceClosed)) ? s.score : A2(add, s.score, delta);
					case 'S18':
						return (_Utils_eq(s.slice18, $author$project$Types$SliceOpen) || _Utils_eq(s.slice18, $author$project$Types$SliceClosed)) ? s.score : A2(add, s.score, delta);
					case 'S17':
						return (_Utils_eq(s.slice17, $author$project$Types$SliceOpen) || _Utils_eq(s.slice17, $author$project$Types$SliceClosed)) ? s.score : A2(add, s.score, delta);
					case 'S16':
						return (_Utils_eq(s.slice16, $author$project$Types$SliceOpen) || _Utils_eq(s.slice16, $author$project$Types$SliceClosed)) ? s.score : A2(add, s.score, delta);
					case 'S15':
						return (_Utils_eq(s.slice15, $author$project$Types$SliceOpen) || _Utils_eq(s.slice15, $author$project$Types$SliceClosed)) ? s.score : A2(add, s.score, delta);
					default:
						return (_Utils_eq(s.sliceBull, $author$project$Types$SliceOpen) || _Utils_eq(s.sliceBull, $author$project$Types$SliceClosed)) ? s.score : A2(add, s.score, delta);
				}
			});
		var apply_delta_to_score = F2(
			function (d, _v5) {
				var pid = _v5.a;
				var s = _v5.b;
				if (d.$ === 'DeltaNone') {
					return _Utils_Tuple2(pid, s);
				} else {
					var slice = d.a;
					var delta = d.b;
					return _Utils_Tuple2(
						pid,
						_Utils_update(
							s,
							{
								score: A3(tally, s, slice, delta)
							}));
				}
			});
		var apply_deltas_to_score = F5(
			function (pid, ps, dl, _v3, acc) {
				var oid = _v3.a;
				var os = _v3.b;
				return _Utils_eq(pid, oid) ? A2(
					$elm$core$List$cons,
					_Utils_Tuple2(pid, ps),
					acc) : A2(
					$elm$core$List$cons,
					A3(
						$elm$core$List$foldl,
						apply_delta_to_score,
						_Utils_Tuple2(oid, os),
						dl),
					acc);
			});
		var apply_deltas_to_scores = F2(
			function (pid, _v2) {
				var ps = _v2.a;
				var dl = _v2.b;
				return A3(
					$elm$core$List$foldr,
					A3(apply_deltas_to_score, pid, ps, dl),
					_List_Nil,
					sl);
			});
		var apply_golf_score = function () {
			var _v0 = A2($author$project$Game$player_id_at, c, sl);
			if (_v0.$ === 'Nothing') {
				return sl;
			} else {
				var pid = _v0.a;
				var _v1 = A2($author$project$Game$find_by_id, pid, sl);
				if (_v1.$ === 'Nothing') {
					return sl;
				} else {
					var ps = _v1.a;
					return A2(
						apply_deltas_to_scores,
						pid,
						A2(calc_deltas, pid, ps));
				}
			}
		}();
		return post_process(apply_golf_score);
	});
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$Game$increment_player = function (g) {
	var next_player = F2(
		function (i, l) {
			return (_Utils_cmp(
				i,
				$elm$core$List$length(l) - 1) > -1) ? 0 : (i + 1);
		});
	var next_inning = F3(
		function (_v1, c, l) {
			var i = _v1.a;
			return (_Utils_cmp(
				c,
				$elm$core$List$length(l) - 1) > -1) ? $author$project$Types$Inning(i + 1) : $author$project$Types$Inning(i);
		});
	switch (g.$) {
		case 'NoGame':
			return $author$project$Types$NoGame;
		case 'Numbers701':
			var i = g.a;
			var o = g.b;
			var c = g.c;
			var h = g.d;
			var s = g.e;
			return A5(
				$author$project$Types$Numbers701,
				i,
				o,
				A2(next_player, c, s),
				h,
				s);
		case 'Numbers501':
			var i = g.a;
			var o = g.b;
			var c = g.c;
			var h = g.d;
			var s = g.e;
			return A5(
				$author$project$Types$Numbers501,
				i,
				o,
				A2(next_player, c, s),
				h,
				s);
		case 'Numbers301':
			var i = g.a;
			var o = g.b;
			var c = g.c;
			var h = g.d;
			var s = g.e;
			return A5(
				$author$project$Types$Numbers301,
				i,
				o,
				A2(next_player, c, s),
				h,
				s);
		case 'AroundTheClock':
			var v = g.a;
			var c = g.b;
			var h = g.c;
			var s = g.d;
			return A4(
				$author$project$Types$AroundTheClock,
				v,
				A2(next_player, c, s),
				h,
				s);
		case 'AroundTheClock180':
			var v = g.a;
			var c = g.b;
			var h = g.c;
			var s = g.d;
			return A4(
				$author$project$Types$AroundTheClock180,
				v,
				A2(next_player, c, s),
				h,
				s);
		case 'Baseball':
			var v = g.a;
			var c = g.b;
			var h = g.c;
			var i = g.d;
			var s = g.e;
			return A5(
				$author$project$Types$Baseball,
				v,
				A2(next_player, c, s),
				h,
				A3(next_inning, i, c, s),
				s);
		case 'ChaseTheDragon':
			var v = g.a;
			var c = g.b;
			var h = g.c;
			var s = g.d;
			return A4(
				$author$project$Types$ChaseTheDragon,
				v,
				A2(next_player, c, s),
				h,
				s);
		default:
			var v = g.a;
			var c = g.b;
			var h = g.c;
			var s = g.d;
			return A4(
				$author$project$Types$Cricket,
				v,
				A2(next_player, c, s),
				h,
				s);
	}
};
var $author$project$Game$numbers = F6(
	function (base, i, o, c, hl, sl) {
		var out_variant_calc = F3(
			function (v, ht, acc) {
				return A2(
					$author$project$Cascade$cascade,
					acc - $author$project$Game$hit_points(ht),
					_List_fromArray(
						[
							_Utils_Tuple2(!acc, 0),
							_Utils_Tuple2(
							(!(acc - $author$project$Game$hit_points(ht))) && _Utils_eq(
								$author$project$Game$sub_hit(ht),
								v),
							0),
							_Utils_Tuple2(
							((acc - $author$project$Game$hit_points(ht)) < 2) && _Utils_eq(v, $author$project$Types$DoubleHit),
							acc),
							_Utils_Tuple2(
							((acc - $author$project$Game$hit_points(ht)) < 3) && _Utils_eq(v, $author$project$Types$TripleHit),
							acc),
							_Utils_Tuple2(
							(acc - $author$project$Game$hit_points(ht)) < 0,
							acc)
						]));
			});
		var in_variant_calc = F3(
			function (v, ht, acc) {
				return A2(
					$author$project$Cascade$cascade,
					acc,
					_List_fromArray(
						[
							_Utils_Tuple2(
							_Utils_eq(acc, base) && _Utils_eq(
								$author$project$Game$sub_hit(ht),
								v),
							base - $author$project$Game$hit_points(ht)),
							_Utils_Tuple2(
							_Utils_cmp(acc, base) < 0,
							acc - $author$project$Game$hit_points(ht))
						]));
			});
		var diff_bust = F2(
			function (ht, acc) {
				return ((acc - $author$project$Game$hit_points(ht)) >= 0) ? (acc - $author$project$Game$hit_points(ht)) : acc;
			});
		var diff = F2(
			function (ht, acc) {
				return acc - $author$project$Game$hit_points(ht);
			});
		var calc = function (_v7) {
			var n = _v7.b.a.a;
			var _v0 = _Utils_Tuple3(
				_Utils_eq(n, base),
				i,
				o);
			if (_v0.a) {
				switch (_v0.b.$) {
					case 'BasicIn':
						var _v1 = _v0.b;
						return $author$project$Types$NumbersScore(
							$author$project$Types$Score(
								A3($elm$core$List$foldr, diff, base, hl)));
					case 'DoubleIn':
						var _v2 = _v0.b;
						return $author$project$Types$NumbersScore(
							$author$project$Types$Score(
								A3(
									$elm$core$List$foldr,
									in_variant_calc($author$project$Types$DoubleHit),
									base,
									hl)));
					default:
						var _v3 = _v0.b;
						return $author$project$Types$NumbersScore(
							$author$project$Types$Score(
								A3(
									$elm$core$List$foldr,
									in_variant_calc($author$project$Types$TripleHit),
									base,
									hl)));
				}
			} else {
				switch (_v0.c.$) {
					case 'BasicOut':
						var _v4 = _v0.c;
						return $author$project$Types$NumbersScore(
							$author$project$Types$Score(
								A3($elm$core$List$foldr, diff_bust, n, hl)));
					case 'DoubleOut':
						var _v5 = _v0.c;
						return $author$project$Types$NumbersScore(
							$author$project$Types$Score(
								A3(
									$elm$core$List$foldr,
									out_variant_calc($author$project$Types$DoubleHit),
									n,
									hl)));
					default:
						var _v6 = _v0.c;
						return $author$project$Types$NumbersScore(
							$author$project$Types$Score(
								A3(
									$elm$core$List$foldr,
									out_variant_calc($author$project$Types$TripleHit),
									n,
									hl)));
				}
			}
		};
		return A3($author$project$Game$apply_score, c, sl, calc);
	});
var $author$project$Game$finalize_turn = function (state) {
	var calc = function () {
		switch (state.$) {
			case 'NoGame':
				return $author$project$Types$NoGame;
			case 'Numbers701':
				var i = state.a;
				var o = state.b;
				var c = state.c;
				var h = state.d;
				var s = state.e;
				return A5(
					$author$project$Types$Numbers701,
					i,
					o,
					c,
					h,
					A6($author$project$Game$numbers, 701, i, o, c, h, s));
			case 'Numbers501':
				var i = state.a;
				var o = state.b;
				var c = state.c;
				var h = state.d;
				var s = state.e;
				return A5(
					$author$project$Types$Numbers501,
					i,
					o,
					c,
					h,
					A6($author$project$Game$numbers, 501, i, o, c, h, s));
			case 'Numbers301':
				var i = state.a;
				var o = state.b;
				var c = state.c;
				var h = state.d;
				var s = state.e;
				return A5(
					$author$project$Types$Numbers301,
					i,
					o,
					c,
					h,
					A6($author$project$Game$numbers, 301, i, o, c, h, s));
			case 'AroundTheClock':
				var v = state.a;
				var c = state.b;
				var h = state.c;
				var s = state.d;
				return A4(
					$author$project$Types$AroundTheClock,
					v,
					c,
					h,
					A4($author$project$Game$around_the_clock, v, c, h, s));
			case 'AroundTheClock180':
				var v = state.a;
				var c = state.b;
				var h = state.c;
				var s = state.d;
				return A4(
					$author$project$Types$AroundTheClock180,
					v,
					c,
					h,
					A4($author$project$Game$around_the_clock_180, v, c, h, s));
			case 'Baseball':
				var v = state.a;
				var c = state.b;
				var h = state.c;
				var i = state.d;
				var s = state.e;
				return A5(
					$author$project$Types$Baseball,
					v,
					c,
					h,
					i,
					A5($author$project$Game$baseball, v, c, h, i, s));
			case 'ChaseTheDragon':
				var v = state.a;
				var c = state.b;
				var h = state.c;
				var s = state.d;
				return A4(
					$author$project$Types$ChaseTheDragon,
					v,
					c,
					h,
					A4($author$project$Game$chase_the_dragon, v, c, h, s));
			default:
				if (state.a.$ === 'BasicCricket') {
					var _v1 = state.a;
					var c = state.b;
					var h = state.c;
					var s = state.d;
					return A4(
						$author$project$Types$Cricket,
						$author$project$Types$BasicCricket,
						c,
						h,
						A3($author$project$Game$cricket, c, h, s));
				} else {
					var _v2 = state.a;
					var c = state.b;
					var h = state.c;
					var s = state.d;
					return A4(
						$author$project$Types$Cricket,
						$author$project$Types$GolfCricket,
						c,
						h,
						A3($author$project$Game$cricket_golf, c, h, s));
				}
		}
	}();
	return $author$project$Game$clear_hits(
		$author$project$Game$increment_player(calc));
};
var $author$project$Game$new_atc_180_score = function (p) {
	return _Utils_Tuple2(
		p.id,
		$author$project$Types$AroundTheClock180Score(_List_Nil));
};
var $author$project$Game$new_atc_180_scores = function (l) {
	return A2($elm$core$List$map, $author$project$Game$new_atc_180_score, l);
};
var $author$project$Game$new_atc_score = function (p) {
	return _Utils_Tuple2(
		p.id,
		$author$project$Types$AroundTheClockScore(_List_Nil));
};
var $author$project$Game$new_atc_scores = function (l) {
	return A2($elm$core$List$map, $author$project$Game$new_atc_score, l);
};
var $author$project$Game$new_bbl_score = function (p) {
	return _Utils_Tuple2(
		p.id,
		$author$project$Types$BaseballScore(
			A2(
				$elm$core$List$map,
				function (i) {
					return _Utils_Tuple3(
						$author$project$Types$Inning(i),
						$author$project$Types$InningOpen,
						$author$project$Types$Score(0));
				},
				A2($elm$core$List$range, 1, 9))));
};
var $author$project$Game$new_bbl_scores = function (l) {
	return A2($elm$core$List$map, $author$project$Game$new_bbl_score, l);
};
var $author$project$Game$new_ckt_score = function (p) {
	return _Utils_Tuple2(
		p.id,
		A8(
			$author$project$Types$CricketScore,
			$author$project$Types$Score(0),
			$author$project$Types$Slice0,
			$author$project$Types$Slice0,
			$author$project$Types$Slice0,
			$author$project$Types$Slice0,
			$author$project$Types$Slice0,
			$author$project$Types$Slice0,
			$author$project$Types$Slice0));
};
var $author$project$Game$new_ckt_scores = function (l) {
	return A2($elm$core$List$map, $author$project$Game$new_ckt_score, l);
};
var $author$project$Game$new_ctd_score = function (p) {
	return _Utils_Tuple2(
		p.id,
		$author$project$Types$ChaseTheDragonScore(_List_Nil));
};
var $author$project$Game$new_ctd_scores = function (l) {
	return A2($elm$core$List$map, $author$project$Game$new_ctd_score, l);
};
var $author$project$Game$new_num_score = F2(
	function (goal, p) {
		return _Utils_Tuple2(
			p.id,
			$author$project$Types$NumbersScore(
				$author$project$Types$Score(goal)));
	});
var $author$project$Game$new_num_scores = F2(
	function (goal, l) {
		return A2(
			$elm$core$List$map,
			$author$project$Game$new_num_score(goal),
			l);
	});
var $author$project$Game$new_game = F2(
	function (mode, players) {
		switch (mode.$) {
			case 'NoGame':
				return $author$project$Types$NoGame;
			case 'Numbers701':
				var i = mode.a;
				var o = mode.b;
				return A5(
					$author$project$Types$Numbers701,
					i,
					o,
					0,
					_List_Nil,
					A2($author$project$Game$new_num_scores, 701, players));
			case 'Numbers501':
				var i = mode.a;
				var o = mode.b;
				return A5(
					$author$project$Types$Numbers501,
					i,
					o,
					0,
					_List_Nil,
					A2($author$project$Game$new_num_scores, 501, players));
			case 'Numbers301':
				var i = mode.a;
				var o = mode.b;
				return A5(
					$author$project$Types$Numbers301,
					i,
					o,
					0,
					_List_Nil,
					A2($author$project$Game$new_num_scores, 301, players));
			case 'AroundTheClock':
				var v = mode.a;
				return A4(
					$author$project$Types$AroundTheClock,
					v,
					0,
					_List_Nil,
					$author$project$Game$new_atc_scores(players));
			case 'AroundTheClock180':
				var v = mode.a;
				return A4(
					$author$project$Types$AroundTheClock180,
					v,
					0,
					_List_Nil,
					$author$project$Game$new_atc_180_scores(players));
			case 'Baseball':
				var v = mode.a;
				return A5(
					$author$project$Types$Baseball,
					v,
					0,
					_List_Nil,
					$author$project$Types$Inning(1),
					$author$project$Game$new_bbl_scores(players));
			case 'ChaseTheDragon':
				var v = mode.a;
				return A4(
					$author$project$Types$ChaseTheDragon,
					v,
					0,
					_List_Nil,
					$author$project$Game$new_ctd_scores(players));
			default:
				var v = mode.a;
				return A4(
					$author$project$Types$Cricket,
					v,
					0,
					_List_Nil,
					$author$project$Game$new_ckt_scores(players));
		}
	});
var $author$project$Game$player_added = F2(
	function (l, g) {
		var find = F2(
			function (pid, sl) {
				return A3(
					$elm$core$List$foldl,
					F2(
						function (_v2, acc) {
							var spid = _v2.a;
							var s = _v2.b;
							return (_Utils_eq(spid, pid) && _Utils_eq(acc, $elm$core$Maybe$Nothing)) ? $elm$core$Maybe$Just(
								_Utils_Tuple2(spid, s)) : acc;
						}),
					$elm$core$Maybe$Nothing,
					sl);
			});
		var add_missing = F3(
			function (f, s, p) {
				var _v1 = A2(find, p.id, s);
				if (_v1.$ === 'Nothing') {
					return f(p);
				} else {
					var v = _v1.a;
					return v;
				}
			});
		var fix_scores = F2(
			function (f, s) {
				return A2(
					$elm$core$List$map,
					A2(add_missing, f, s),
					l);
			});
		switch (g.$) {
			case 'NoGame':
				return $author$project$Types$NoGame;
			case 'Numbers701':
				var i = g.a;
				var o = g.b;
				var c = g.c;
				var h = g.d;
				var s = g.e;
				return A5(
					$author$project$Types$Numbers701,
					i,
					o,
					c,
					h,
					A2(
						fix_scores,
						$author$project$Game$new_num_score(701),
						s));
			case 'Numbers501':
				var i = g.a;
				var o = g.b;
				var c = g.c;
				var h = g.d;
				var s = g.e;
				return A5(
					$author$project$Types$Numbers501,
					i,
					o,
					c,
					h,
					A2(
						fix_scores,
						$author$project$Game$new_num_score(501),
						s));
			case 'Numbers301':
				var i = g.a;
				var o = g.b;
				var c = g.c;
				var h = g.d;
				var s = g.e;
				return A5(
					$author$project$Types$Numbers301,
					i,
					o,
					c,
					h,
					A2(
						fix_scores,
						$author$project$Game$new_num_score(301),
						s));
			case 'AroundTheClock':
				var v = g.a;
				var c = g.b;
				var h = g.c;
				var s = g.d;
				return A4(
					$author$project$Types$AroundTheClock,
					v,
					c,
					h,
					A2(fix_scores, $author$project$Game$new_atc_score, s));
			case 'AroundTheClock180':
				var v = g.a;
				var c = g.b;
				var h = g.c;
				var s = g.d;
				return A4(
					$author$project$Types$AroundTheClock180,
					v,
					c,
					h,
					A2(fix_scores, $author$project$Game$new_atc_180_score, s));
			case 'Baseball':
				var v = g.a;
				var c = g.b;
				var h = g.c;
				var i = g.d;
				var s = g.e;
				return A5(
					$author$project$Types$Baseball,
					v,
					c,
					h,
					i,
					A2(fix_scores, $author$project$Game$new_bbl_score, s));
			case 'ChaseTheDragon':
				var v = g.a;
				var c = g.b;
				var h = g.c;
				var s = g.d;
				return A4(
					$author$project$Types$ChaseTheDragon,
					v,
					c,
					h,
					A2(fix_scores, $author$project$Game$new_ctd_score, s));
			default:
				var v = g.a;
				var c = g.b;
				var h = g.c;
				var s = g.d;
				return A4(
					$author$project$Types$Cricket,
					v,
					c,
					h,
					A2(fix_scores, $author$project$Game$new_ckt_score, s));
		}
	});
var $author$project$Game$player_removed = F2(
	function (l, g) {
		var fix_scores = function (s) {
			return A2(
				$elm$core$List$filter,
				function (_v1) {
					var i = _v1.a;
					return A2(
						$elm$core$List$any,
						function (p) {
							return _Utils_eq(p.id, i);
						},
						l);
				},
				s);
		};
		var fix_current = function (i) {
			return (_Utils_cmp(
				i,
				$elm$core$List$length(l) - 1) > -1) ? 0 : i;
		};
		switch (g.$) {
			case 'NoGame':
				return $author$project$Types$NoGame;
			case 'Numbers701':
				var i = g.a;
				var o = g.b;
				var c = g.c;
				var h = g.d;
				var s = g.e;
				return A5(
					$author$project$Types$Numbers701,
					i,
					o,
					fix_current(c),
					h,
					fix_scores(s));
			case 'Numbers501':
				var i = g.a;
				var o = g.b;
				var c = g.c;
				var h = g.d;
				var s = g.e;
				return A5(
					$author$project$Types$Numbers501,
					i,
					o,
					fix_current(c),
					h,
					fix_scores(s));
			case 'Numbers301':
				var i = g.a;
				var o = g.b;
				var c = g.c;
				var h = g.d;
				var s = g.e;
				return A5(
					$author$project$Types$Numbers301,
					i,
					o,
					fix_current(c),
					h,
					fix_scores(s));
			case 'AroundTheClock':
				var v = g.a;
				var c = g.b;
				var h = g.c;
				var s = g.d;
				return A4(
					$author$project$Types$AroundTheClock,
					v,
					fix_current(c),
					h,
					fix_scores(s));
			case 'AroundTheClock180':
				var v = g.a;
				var c = g.b;
				var h = g.c;
				var s = g.d;
				return A4(
					$author$project$Types$AroundTheClock180,
					v,
					fix_current(c),
					h,
					fix_scores(s));
			case 'Baseball':
				var v = g.a;
				var c = g.b;
				var h = g.c;
				var i = g.d;
				var s = g.e;
				return A5(
					$author$project$Types$Baseball,
					v,
					fix_current(c),
					h,
					i,
					fix_scores(s));
			case 'ChaseTheDragon':
				var v = g.a;
				var c = g.b;
				var h = g.c;
				var s = g.d;
				return A4(
					$author$project$Types$ChaseTheDragon,
					v,
					fix_current(c),
					h,
					fix_scores(s));
			default:
				var v = g.a;
				var c = g.b;
				var h = g.c;
				var s = g.d;
				return A4(
					$author$project$Types$Cricket,
					v,
					fix_current(c),
					h,
					fix_scores(s));
		}
	});
var $author$project$Game$record_toss = F2(
	function (n, g) {
		var apply = function (h) {
			return A2(
				$elm$core$List$take,
				3,
				A2($elm$core$List$cons, n, h));
		};
		switch (g.$) {
			case 'NoGame':
				return $author$project$Types$NoGame;
			case 'Numbers701':
				var i = g.a;
				var o = g.b;
				var c = g.c;
				var h = g.d;
				var s = g.e;
				return A5(
					$author$project$Types$Numbers701,
					i,
					o,
					c,
					apply(h),
					s);
			case 'Numbers501':
				var i = g.a;
				var o = g.b;
				var c = g.c;
				var h = g.d;
				var s = g.e;
				return A5(
					$author$project$Types$Numbers501,
					i,
					o,
					c,
					apply(h),
					s);
			case 'Numbers301':
				var i = g.a;
				var o = g.b;
				var c = g.c;
				var h = g.d;
				var s = g.e;
				return A5(
					$author$project$Types$Numbers301,
					i,
					o,
					c,
					apply(h),
					s);
			case 'AroundTheClock':
				var v = g.a;
				var c = g.b;
				var h = g.c;
				var s = g.d;
				return A4(
					$author$project$Types$AroundTheClock,
					v,
					c,
					apply(h),
					s);
			case 'AroundTheClock180':
				var v = g.a;
				var c = g.b;
				var h = g.c;
				var s = g.d;
				return A4(
					$author$project$Types$AroundTheClock180,
					v,
					c,
					apply(h),
					s);
			case 'Baseball':
				var v = g.a;
				var c = g.b;
				var h = g.c;
				var i = g.d;
				var s = g.e;
				return A5(
					$author$project$Types$Baseball,
					v,
					c,
					apply(h),
					i,
					s);
			case 'ChaseTheDragon':
				var v = g.a;
				var c = g.b;
				var h = g.c;
				var s = g.d;
				return A4(
					$author$project$Types$ChaseTheDragon,
					v,
					c,
					apply(h),
					s);
			default:
				var v = g.a;
				var c = g.b;
				var h = g.c;
				var s = g.d;
				return A4(
					$author$project$Types$Cricket,
					v,
					c,
					apply(h),
					s);
		}
	});
var $author$project$Ports$store_state = _Platform_outgoingPort('store_state', $elm$json$Json$Encode$string);
var $elm$core$String$toUpper = _String_toUpper;
var $elm$core$String$trim = _String_trim;
var $author$project$Main$update = F2(
	function (action, state) {
		var post_delete_player = function (s) {
			return _Utils_update(
				s,
				{
					game: A2($author$project$Game$player_removed, s.players, s.game)
				});
		};
		var post_add_player = function (s) {
			return _Utils_update(
				s,
				{
					game: A2($author$project$Game$player_added, s.players, s.game)
				});
		};
		var new_player = F3(
			function (_v5, _v6, i) {
				var n = _v5.a;
				var s = _v6.a;
				return {
					hits: $author$project$Types$PlayerHits(_List_Nil),
					id: $author$project$Types$PlayerID(i),
					initials: $author$project$Types$PlayerInitials(s),
					name: $author$project$Types$PlayerName(n)
				};
			});
		var move_player_up = F2(
			function (l, i) {
				var to_the_left = F2(
					function (p, acc) {
						return _Utils_eq(p.id, i) ? _Utils_ap(
							A2(
								$elm$core$List$take,
								$elm$core$List$length(acc) - 1,
								acc),
							_Utils_ap(
								_List_fromArray(
									[p]),
								A2(
									$elm$core$List$drop,
									$elm$core$List$length(acc) - 1,
									acc))) : _Utils_ap(
							acc,
							_List_fromArray(
								[p]));
					});
				return A3($elm$core$List$foldl, to_the_left, _List_Nil, l);
			});
		var move_player_down = F2(
			function (l, i) {
				return $elm$core$List$reverse(
					A2(
						move_player_up,
						$elm$core$List$reverse(l),
						i));
			});
		var id_num = function (_v4) {
			var i = _v4.a;
			return i;
		};
		var digest_initials = function (_v3) {
			var i = _v3.a;
			return $author$project$Types$NewPlayerInitials(
				$elm$core$String$toUpper(
					A2(
						$elm$core$String$left,
						2,
						$elm$core$String$trim(i))));
		};
		var delete_player = F2(
			function (l, i) {
				return A2(
					$elm$core$List$filter,
					function (p) {
						return !_Utils_eq(p.id, i);
					},
					l);
			});
		var available_id = function () {
			var consumed = $elm$core$List$sort(
				A2(
					$elm$core$List$map,
					function (p) {
						return id_num(p.id);
					},
					state.players));
			var check = F2(
				function (v, acc) {
					return _Utils_eq(v, acc) ? (v + 1) : acc;
				});
			return A3($elm$core$List$foldl, check, 0, consumed);
		}();
		var add_player = F3(
			function (l, n, i) {
				var empty = F2(
					function (_v1, _v2) {
						var s = _v1.a;
						var ni = _v2.a;
						return $elm$core$String$isEmpty(
							$elm$core$String$trim(s)) || $elm$core$String$isEmpty(
							$elm$core$String$trim(ni));
					});
				return A2(empty, n, i) ? l : _Utils_ap(
					l,
					_List_fromArray(
						[
							A3(new_player, n, i, available_id)
						]));
			});
		var new_state = function () {
			switch (action.$) {
				case 'GoHome':
					return _Utils_update(
						state,
						{screen: $author$project$Types$Home});
				case 'GoEditPlayers':
					return _Utils_update(
						state,
						{
							screen: A2(
								$author$project$Types$EditPlayers,
								$author$project$Types$NewPlayerName(''),
								$author$project$Types$NewPlayerInitials(''))
						});
				case 'GoSelectGame':
					return _Utils_update(
						state,
						{screen: $author$project$Types$SelectGame});
				case 'StartGame':
					return _Utils_update(
						state,
						{
							game: A2($author$project$Game$new_game, state.game, state.players),
							playing: true,
							screen: $author$project$Types$PlayGame($elm$core$Maybe$Nothing)
						});
				case 'ResumeGame':
					return _Utils_update(
						state,
						{
							screen: $author$project$Types$PlayGame($elm$core$Maybe$Nothing)
						});
				case 'EndGame':
					return _Utils_update(
						state,
						{
							game: A2($author$project$Game$new_game, state.game, state.players),
							playing: false,
							screen: $author$project$Types$Home
						});
				case 'GameSelected':
					var mode = action.a;
					return _Utils_update(
						state,
						{game: mode});
				case 'NewPlayerInput':
					var p = action.a;
					var i = action.b;
					return _Utils_update(
						state,
						{
							screen: A2(
								$author$project$Types$EditPlayers,
								p,
								digest_initials(i))
						});
				case 'NewPlayerCommit':
					var p = action.a;
					var i = action.b;
					return post_add_player(
						_Utils_update(
							state,
							{
								players: A3(add_player, state.players, p, i),
								screen: A2(
									$author$project$Types$EditPlayers,
									$author$project$Types$NewPlayerName(''),
									$author$project$Types$NewPlayerInitials(''))
							}));
				case 'DeletePlayer':
					var i = action.a;
					return post_delete_player(
						_Utils_update(
							state,
							{
								players: A2(delete_player, state.players, i)
							}));
				case 'Toss':
					var h = action.a;
					return _Utils_update(
						state,
						{
							screen: $author$project$Types$PlayGame(
								$elm$core$Maybe$Just(
									$author$project$Types$SelectSubHit(h)))
						});
				case 'TossModalSelect':
					var h = action.a;
					return _Utils_update(
						state,
						{
							game: A2($author$project$Game$record_toss, h, state.game),
							screen: $author$project$Types$PlayGame($elm$core$Maybe$Nothing)
						});
				case 'TossModalCancel':
					return _Utils_update(
						state,
						{
							screen: $author$project$Types$PlayGame($elm$core$Maybe$Nothing)
						});
				case 'FinishTurnModal':
					return _Utils_update(
						state,
						{
							screen: $author$project$Types$PlayGame(
								$elm$core$Maybe$Just($author$project$Types$FinalizeTurn))
						});
				case 'CancelFinishTurn':
					return _Utils_update(
						state,
						{
							screen: $author$project$Types$PlayGame($elm$core$Maybe$Nothing)
						});
				case 'FinishTurn':
					return _Utils_update(
						state,
						{
							game: $author$project$Game$finalize_turn(state.game),
							screen: $author$project$Types$PlayGame($elm$core$Maybe$Nothing)
						});
				case 'MovePlayerUp':
					var i = action.a;
					return _Utils_update(
						state,
						{
							players: A2(move_player_up, state.players, i)
						});
				default:
					var i = action.a;
					return _Utils_update(
						state,
						{
							players: A2(move_player_down, state.players, i)
						});
			}
		}();
		var save_state = A3(
			$elm$core$Basics$composeL,
			$author$project$Ports$store_state,
			$elm$json$Json$Encode$encode(0),
			$author$project$Types$Encode$encode_app_state(new_state));
		return _Utils_Tuple2(new_state, save_state);
	});
var $elm$json$Json$Decode$value = _Json_decodeValue;
var $elm$html$Html$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $elm$html$Html$Attributes$class = $elm$html$Html$Attributes$stringProperty('className');
var $elm$html$Html$div = _VirtualDom_node('div');
var $author$project$Types$GoHome = {$: 'GoHome'};
var $author$project$Types$GoSelectGame = {$: 'GoSelectGame'};
var $elm$html$Html$a = _VirtualDom_node('a');
var $author$project$Types$NewPlayerCommit = F2(
	function (a, b) {
		return {$: 'NewPlayerCommit', a: a, b: b};
	});
var $author$project$Types$NewPlayerInput = F2(
	function (a, b) {
		return {$: 'NewPlayerInput', a: a, b: b};
	});
var $elm$html$Html$button = _VirtualDom_node('button');
var $elm$html$Html$input = _VirtualDom_node('input');
var $elm$html$Html$label = _VirtualDom_node('label');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 'Normal', a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $elm$html$Html$Events$on = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $elm$html$Html$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$html$Html$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 'MayStopPropagation', a: a};
};
var $elm$html$Html$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$elm$virtual_dom$VirtualDom$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$html$Html$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $elm$html$Html$Events$onInput = function (tagger) {
	return A2(
		$elm$html$Html$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$elm$html$Html$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $elm$html$Html$Events$targetValue)));
};
var $elm$html$Html$Attributes$placeholder = $elm$html$Html$Attributes$stringProperty('placeholder');
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $elm$html$Html$text = $elm$virtual_dom$VirtualDom$text;
var $elm$html$Html$Attributes$value = $elm$html$Html$Attributes$stringProperty('value');
var $author$project$Main$add_player_form = F2(
	function (_v0, _v1) {
		var t = _v0.a;
		var ni = _v1.a;
		return _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('form-group')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Player Name')
							])),
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$value(t),
								$elm$html$Html$Attributes$placeholder('Name'),
								$elm$html$Html$Events$onInput(
								function (v) {
									return A2(
										$author$project$Types$NewPlayerInput,
										$author$project$Types$NewPlayerName(v),
										$author$project$Types$NewPlayerInitials(ni));
								}),
								$elm$html$Html$Attributes$class('form-control')
							]),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('form-group')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$label,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Player Initials (Max 2 Characters)')
							])),
						A2(
						$elm$html$Html$input,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$value(ni),
								$elm$html$Html$Attributes$placeholder('Initials'),
								$elm$html$Html$Events$onInput(
								function (v) {
									return A2(
										$author$project$Types$NewPlayerInput,
										$author$project$Types$NewPlayerName(t),
										$author$project$Types$NewPlayerInitials(v));
								}),
								$elm$html$Html$Attributes$class('form-control')
							]),
						_List_Nil)
					])),
				A2(
				$elm$html$Html$button,
				_List_fromArray(
					[
						$elm$html$Html$Events$onClick(
						A2(
							$author$project$Types$NewPlayerCommit,
							$author$project$Types$NewPlayerName(t),
							$author$project$Types$NewPlayerInitials(ni))),
						$elm$html$Html$Attributes$class('btn btn-primary')
					]),
				_List_fromArray(
					[
						$elm$html$Html$text('Add Player')
					]))
			]);
	});
var $elm$html$Html$li = _VirtualDom_node('li');
var $author$project$Types$DeletePlayer = function (a) {
	return {$: 'DeletePlayer', a: a};
};
var $author$project$Types$MovePlayerDown = function (a) {
	return {$: 'MovePlayerDown', a: a};
};
var $author$project$Types$MovePlayerUp = function (a) {
	return {$: 'MovePlayerUp', a: a};
};
var $author$project$Types$Text$player_initials_text = function (_v0) {
	var s = _v0.a;
	return s;
};
var $author$project$Types$Text$player_name_text = function (_v0) {
	var s = _v0.a;
	return s;
};
var $elm$html$Html$table = _VirtualDom_node('table');
var $elm$html$Html$td = _VirtualDom_node('td');
var $elm$html$Html$tr = _VirtualDom_node('tr');
var $author$project$Main$list_editable_players = function (l) {
	var player_edit_row = function (player) {
		return A2(
			$elm$html$Html$tr,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							$author$project$Types$Text$player_name_text(player.name) + (' (' + ($author$project$Types$Text$player_initials_text(player.initials) + ')')))
						])),
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Types$MovePlayerUp(player.id)),
									$elm$html$Html$Attributes$class('btn btn-primary')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('▲')
								]))
						])),
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Types$MovePlayerDown(player.id)),
									$elm$html$Html$Attributes$class('btn btn-primary')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('▼')
								]))
						])),
					A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$button,
							_List_fromArray(
								[
									$elm$html$Html$Events$onClick(
									$author$project$Types$DeletePlayer(player.id)),
									$elm$html$Html$Attributes$class('btn btn-danger')
								]),
							_List_fromArray(
								[
									$elm$html$Html$text('✖')
								]))
						]))
				]));
	};
	return _List_fromArray(
		[
			A2(
			$elm$html$Html$table,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('table')
				]),
			A2($elm$core$List$map, player_edit_row, l))
		]);
};
var $elm$html$Html$ul = _VirtualDom_node('ul');
var $author$project$Main$render_edit_players = F3(
	function (state, np, ni) {
		var select_game = (!state.playing) ? _List_fromArray(
			[
				A2(
				$elm$html$Html$li,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('nav-item')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$a,
						_List_fromArray(
							[
								$elm$html$Html$Events$onClick($author$project$Types$GoSelectGame),
								$elm$html$Html$Attributes$class('nav-link')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('Select Game')
							]))
					]))
			]) : _List_Nil;
		return _Utils_ap(
			_List_fromArray(
				[
					A2(
					$elm$html$Html$ul,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('nav bg-primary text-white')
						]),
					_Utils_ap(
						_List_fromArray(
							[
								A2(
								$elm$html$Html$li,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('nav-item')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$a,
										_List_fromArray(
											[
												$elm$html$Html$Events$onClick($author$project$Types$GoHome),
												$elm$html$Html$Attributes$class('nav-link')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Home')
											]))
									]))
							]),
						select_game))
				]),
			_Utils_ap(
				A2($author$project$Main$add_player_form, np, ni),
				_Utils_ap(
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Players')
								]))
						]),
					$author$project$Main$list_editable_players(state.players))));
	});
var $author$project$Types$EndGame = {$: 'EndGame'};
var $elm$svg$Svg$Attributes$height = _VirtualDom_attribute('height');
var $author$project$Game$hits = function (g) {
	switch (g.$) {
		case 'NoGame':
			return _List_Nil;
		case 'Numbers701':
			var h = g.d;
			return h;
		case 'Numbers501':
			var h = g.d;
			return h;
		case 'Numbers301':
			var h = g.d;
			return h;
		case 'AroundTheClock':
			var h = g.c;
			return h;
		case 'AroundTheClock180':
			var h = g.c;
			return h;
		case 'Baseball':
			var h = g.c;
			return h;
		case 'ChaseTheDragon':
			var h = g.c;
			return h;
		default:
			var h = g.c;
			return h;
	}
};
var $author$project$Types$FinishTurnModal = {$: 'FinishTurnModal'};
var $author$project$Types$Toss = function (a) {
	return {$: 'Toss', a: a};
};
var $elm$svg$Svg$Attributes$alignmentBaseline = _VirtualDom_attribute('alignment-baseline');
var $elm$svg$Svg$trustedNode = _VirtualDom_nodeNS('http://www.w3.org/2000/svg');
var $elm$svg$Svg$circle = $elm$svg$Svg$trustedNode('circle');
var $elm$core$Basics$cos = _Basics_cos;
var $elm$svg$Svg$Attributes$cx = _VirtualDom_attribute('cx');
var $elm$svg$Svg$Attributes$cy = _VirtualDom_attribute('cy');
var $elm$svg$Svg$Attributes$d = _VirtualDom_attribute('d');
var $elm$core$Basics$pi = _Basics_pi;
var $elm$core$Basics$degrees = function (angleInDegrees) {
	return (angleInDegrees * $elm$core$Basics$pi) / 180;
};
var $elm$svg$Svg$Attributes$fill = _VirtualDom_attribute('fill');
var $elm$svg$Svg$Attributes$fontSize = _VirtualDom_attribute('font-size');
var $elm$core$String$fromFloat = _String_fromNumber;
var $elm$svg$Svg$Events$onClick = function (msg) {
	return A2(
		$elm$html$Html$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $elm$svg$Svg$path = $elm$svg$Svg$trustedNode('path');
var $elm$svg$Svg$Attributes$r = _VirtualDom_attribute('r');
var $elm$core$Basics$sin = _Basics_sin;
var $elm$svg$Svg$Attributes$stroke = _VirtualDom_attribute('stroke');
var $elm$svg$Svg$Attributes$strokeWidth = _VirtualDom_attribute('stroke-width');
var $elm$svg$Svg$Attributes$textAnchor = _VirtualDom_attribute('text-anchor');
var $elm$svg$Svg$text_ = $elm$svg$Svg$trustedNode('text');
var $elm$svg$Svg$Attributes$x = _VirtualDom_attribute('x');
var $elm$svg$Svg$Attributes$y = _VirtualDom_attribute('y');
var $author$project$Main$render_board = function () {
	var start_end_points = F2(
		function (_v7, r) {
			var s = _v7.a;
			var e = _v7.b;
			return _Utils_Tuple2(
				_Utils_Tuple2(
					r * $elm$core$Basics$sin(s),
					r * $elm$core$Basics$cos(s)),
				_Utils_Tuple2(
					r * $elm$core$Basics$sin(e),
					r * $elm$core$Basics$cos(e)));
		});
	var panels = A2(
		$elm$core$List$indexedMap,
		F2(
			function (i, v) {
				return _Utils_Tuple2(
					_Utils_Tuple2(
						$elm$core$Basics$degrees(189 - (i * 18)),
						$elm$core$Basics$degrees(189 - ((i + 1) * 18))),
					v);
			}),
		_List_fromArray(
			[20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5]));
	var number_ring = function () {
		var point = F2(
			function (d, r) {
				return _Utils_Tuple2(
					r * $elm$core$Basics$sin(d),
					r * $elm$core$Basics$cos(d));
			});
		var nums = A2(
			$elm$core$List$indexedMap,
			F2(
				function (i, v) {
					return _Utils_Tuple2(
						$elm$core$Basics$degrees(180 - (i * 18)),
						v);
				}),
			_List_fromArray(
				[20, 1, 18, 4, 13, 6, 10, 15, 2, 17, 3, 19, 7, 16, 8, 11, 14, 9, 12, 5]));
		var draw_num = function (_v6) {
			var d = _v6.a;
			var v = _v6.b;
			return A2(
				$elm$svg$Svg$text_,
				_Utils_ap(
					function (_v5) {
						var x = _v5.a;
						var y = _v5.b;
						return _List_fromArray(
							[
								$elm$svg$Svg$Attributes$x(
								$elm$core$String$fromFloat(50 + x)),
								$elm$svg$Svg$Attributes$y(
								$elm$core$String$fromFloat(51 + y))
							]);
					}(
						A2(point, d, 46)),
					_List_fromArray(
						[
							$elm$svg$Svg$Attributes$alignmentBaseline('middle'),
							$elm$svg$Svg$Attributes$textAnchor('middle'),
							$elm$svg$Svg$Attributes$fontSize('5')
						])),
				_List_fromArray(
					[
						$elm$html$Html$text(
						$elm$core$String$fromInt(v))
					]));
		};
		return A2($elm$core$List$map, draw_num, nums);
	}();
	var miss = _List_fromArray(
		[
			A2(
			$elm$svg$Svg$circle,
			_List_fromArray(
				[
					$elm$svg$Svg$Events$onClick(
					$author$project$Types$Toss($author$project$Types$HitMissed)),
					$elm$svg$Svg$Attributes$cx('92'),
					$elm$svg$Svg$Attributes$cy('92'),
					$elm$svg$Svg$Attributes$r('7.5'),
					$elm$svg$Svg$Attributes$stroke('red'),
					$elm$svg$Svg$Attributes$strokeWidth('0.3'),
					$elm$svg$Svg$Attributes$fill('orange')
				]),
			_List_Nil),
			A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					$elm$svg$Svg$Events$onClick(
					$author$project$Types$Toss($author$project$Types$HitMissed)),
					$elm$svg$Svg$Attributes$x('92'),
					$elm$svg$Svg$Attributes$y('93'),
					$elm$svg$Svg$Attributes$alignmentBaseline('middle'),
					$elm$svg$Svg$Attributes$textAnchor('middle'),
					$elm$svg$Svg$Attributes$fontSize('5'),
					$elm$svg$Svg$Attributes$fill('red')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('MISS')
				]))
		]);
	var l_from = function (_v2) {
		var _v3 = _v2.a;
		var x0 = _v3.a;
		var y0 = _v3.b;
		var _v4 = _v2.b;
		var x1 = _v4.a;
		var y1 = _v4.b;
		return 'L ' + ($elm$core$String$fromFloat(50 + x0) + (' ' + ($elm$core$String$fromFloat(50 + y0) + (' L ' + ($elm$core$String$fromFloat(50 + x1) + (' ' + $elm$core$String$fromFloat(50 + y1)))))));
	};
	var index_to_hit = F2(
		function (id, s) {
			switch (id) {
				case 1:
					return $author$project$Types$Hit1(s);
				case 2:
					return $author$project$Types$Hit2(s);
				case 3:
					return $author$project$Types$Hit3(s);
				case 4:
					return $author$project$Types$Hit4(s);
				case 5:
					return $author$project$Types$Hit5(s);
				case 6:
					return $author$project$Types$Hit6(s);
				case 7:
					return $author$project$Types$Hit7(s);
				case 8:
					return $author$project$Types$Hit8(s);
				case 9:
					return $author$project$Types$Hit9(s);
				case 10:
					return $author$project$Types$Hit10(s);
				case 11:
					return $author$project$Types$Hit11(s);
				case 12:
					return $author$project$Types$Hit12(s);
				case 13:
					return $author$project$Types$Hit13(s);
				case 14:
					return $author$project$Types$Hit14(s);
				case 15:
					return $author$project$Types$Hit15(s);
				case 16:
					return $author$project$Types$Hit16(s);
				case 17:
					return $author$project$Types$Hit17(s);
				case 18:
					return $author$project$Types$Hit18(s);
				case 19:
					return $author$project$Types$Hit19(s);
				case 20:
					return $author$project$Types$Hit20(s);
				default:
					return $author$project$Types$HitMissed;
			}
		});
	var end_turn = _List_fromArray(
		[
			A2(
			$elm$svg$Svg$circle,
			_List_fromArray(
				[
					$elm$svg$Svg$Events$onClick($author$project$Types$FinishTurnModal),
					$elm$svg$Svg$Attributes$cx('8'),
					$elm$svg$Svg$Attributes$cy('92'),
					$elm$svg$Svg$Attributes$r('7.5'),
					$elm$svg$Svg$Attributes$stroke('black'),
					$elm$svg$Svg$Attributes$strokeWidth('0.3'),
					$elm$svg$Svg$Attributes$fill('green')
				]),
			_List_Nil),
			A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					$elm$svg$Svg$Events$onClick($author$project$Types$FinishTurnModal),
					$elm$svg$Svg$Attributes$x('8'),
					$elm$svg$Svg$Attributes$y('91'),
					$elm$svg$Svg$Attributes$alignmentBaseline('middle'),
					$elm$svg$Svg$Attributes$textAnchor('middle'),
					$elm$svg$Svg$Attributes$fontSize('4'),
					$elm$svg$Svg$Attributes$fill('black')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Finish')
				])),
			A2(
			$elm$svg$Svg$text_,
			_List_fromArray(
				[
					$elm$svg$Svg$Events$onClick($author$project$Types$FinishTurnModal),
					$elm$svg$Svg$Attributes$x('8'),
					$elm$svg$Svg$Attributes$y('95'),
					$elm$svg$Svg$Attributes$alignmentBaseline('middle'),
					$elm$svg$Svg$Attributes$textAnchor('middle'),
					$elm$svg$Svg$Attributes$fontSize('4'),
					$elm$svg$Svg$Attributes$fill('black')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Turn')
				]))
		]);
	var d_from_deg = F2(
		function (d, r) {
			return 'M 50 50 ' + (l_from(
				A2(start_end_points, d, r)) + ' Z');
		});
	var slice = function (_v0) {
		var d = _v0.a;
		var v = _v0.b;
		return A2(
			$elm$svg$Svg$path,
			_List_fromArray(
				[
					$elm$svg$Svg$Events$onClick(
					$author$project$Types$Toss(
						A2(index_to_hit, v, $author$project$Types$SingleHit))),
					$elm$svg$Svg$Attributes$d(
					A2(d_from_deg, d, 43)),
					$elm$svg$Svg$Attributes$stroke('white'),
					$elm$svg$Svg$Attributes$strokeWidth('0.25'),
					$elm$svg$Svg$Attributes$fill('black')
				]),
			_List_Nil);
	};
	var bull = A2(
		$elm$svg$Svg$circle,
		_List_fromArray(
			[
				$elm$svg$Svg$Events$onClick(
				$author$project$Types$Toss($author$project$Types$HitBullseye)),
				$elm$svg$Svg$Attributes$cx('50'),
				$elm$svg$Svg$Attributes$cy('50'),
				$elm$svg$Svg$Attributes$r('10'),
				$elm$svg$Svg$Attributes$stroke('white'),
				$elm$svg$Svg$Attributes$strokeWidth('0.25'),
				$elm$svg$Svg$Attributes$fill('black')
			]),
		_List_Nil);
	return _Utils_ap(
		A2($elm$core$List$map, slice, panels),
		_Utils_ap(
			_List_fromArray(
				[bull]),
			_Utils_ap(
				miss,
				_Utils_ap(end_turn, number_ring))));
}();
var $author$project$Main$append_to_name = F3(
	function (l, s, mid) {
		var unwrap = function (_v1) {
			var x = _v1.a;
			return x;
		};
		var name = function (id) {
			return A3(
				$elm$core$List$foldr,
				F2(
					function (p, acc) {
						return _Utils_eq(p.id, id) ? unwrap(p.name) : acc;
					}),
				'?????',
				l);
		};
		if (mid.$ === 'Just') {
			var id = mid.a;
			return _Utils_ap(
				name(id),
				s);
		} else {
			return '?????' + s;
		}
	});
var $author$project$Game$current_player_id = function (g) {
	switch (g.$) {
		case 'NoGame':
			return $elm$core$Maybe$Nothing;
		case 'Numbers701':
			var c = g.c;
			var s = g.e;
			return A2($author$project$Game$player_id_at, c, s);
		case 'Numbers501':
			var c = g.c;
			var s = g.e;
			return A2($author$project$Game$player_id_at, c, s);
		case 'Numbers301':
			var c = g.c;
			var s = g.e;
			return A2($author$project$Game$player_id_at, c, s);
		case 'AroundTheClock':
			var c = g.b;
			var s = g.d;
			return A2($author$project$Game$player_id_at, c, s);
		case 'AroundTheClock180':
			var c = g.b;
			var s = g.d;
			return A2($author$project$Game$player_id_at, c, s);
		case 'Baseball':
			var c = g.b;
			var s = g.e;
			return A2($author$project$Game$player_id_at, c, s);
		case 'ChaseTheDragon':
			var c = g.b;
			var s = g.d;
			return A2($author$project$Game$player_id_at, c, s);
		default:
			var c = g.b;
			var s = g.d;
			return A2($author$project$Game$player_id_at, c, s);
	}
};
var $author$project$Main$render_current_player_name = F2(
	function (gs, l) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container text-center')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(
					A3(
						$author$project$Main$append_to_name,
						l,
						' is throwing.',
						$author$project$Game$current_player_id(gs)))
				]));
	});
var $author$project$Types$Text$sub_hit_text = function (s) {
	switch (s.$) {
		case 'SubMissed':
			return '';
		case 'SingleHit':
			return '\u2802';
		case 'DoubleHit':
			return '\u2805';
		default:
			return '\u2807';
	}
};
var $author$project$Types$Text$hit_text = function (h) {
	switch (h.$) {
		case 'HitMissed':
			return '\u2297';
		case 'Hit1':
			var s = h.a;
			return '\u2460' + $author$project$Types$Text$sub_hit_text(s);
		case 'Hit2':
			var s = h.a;
			return '\u2461' + $author$project$Types$Text$sub_hit_text(s);
		case 'Hit3':
			var s = h.a;
			return '\u2462' + $author$project$Types$Text$sub_hit_text(s);
		case 'Hit4':
			var s = h.a;
			return '\u2463' + $author$project$Types$Text$sub_hit_text(s);
		case 'Hit5':
			var s = h.a;
			return '\u2464' + $author$project$Types$Text$sub_hit_text(s);
		case 'Hit6':
			var s = h.a;
			return '\u2465' + $author$project$Types$Text$sub_hit_text(s);
		case 'Hit7':
			var s = h.a;
			return '\u2466' + $author$project$Types$Text$sub_hit_text(s);
		case 'Hit8':
			var s = h.a;
			return '\u2467' + $author$project$Types$Text$sub_hit_text(s);
		case 'Hit9':
			var s = h.a;
			return '\u2468' + $author$project$Types$Text$sub_hit_text(s);
		case 'Hit10':
			var s = h.a;
			return '\u2469' + $author$project$Types$Text$sub_hit_text(s);
		case 'Hit11':
			var s = h.a;
			return '\u246A' + $author$project$Types$Text$sub_hit_text(s);
		case 'Hit12':
			var s = h.a;
			return '\u246B' + $author$project$Types$Text$sub_hit_text(s);
		case 'Hit13':
			var s = h.a;
			return '\u246C' + $author$project$Types$Text$sub_hit_text(s);
		case 'Hit14':
			var s = h.a;
			return '\u246D' + $author$project$Types$Text$sub_hit_text(s);
		case 'Hit15':
			var s = h.a;
			return '\u246E' + $author$project$Types$Text$sub_hit_text(s);
		case 'Hit16':
			var s = h.a;
			return '\u246F' + $author$project$Types$Text$sub_hit_text(s);
		case 'Hit17':
			var s = h.a;
			return '\u2470' + $author$project$Types$Text$sub_hit_text(s);
		case 'Hit18':
			var s = h.a;
			return '\u2471' + $author$project$Types$Text$sub_hit_text(s);
		case 'Hit19':
			var s = h.a;
			return '\u2472' + $author$project$Types$Text$sub_hit_text(s);
		case 'Hit20':
			var s = h.a;
			return '\u2473' + $author$project$Types$Text$sub_hit_text(s);
		case 'HitBullseye':
			return '\u24B7';
		default:
			return '\u2805\u24B7';
	}
};
var $author$project$Main$render_hits = function (hits) {
	var hit_div = function (hit) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('col-4 text-center')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text(
					$author$project$Types$Text$hit_text(hit))
				]));
	};
	return (!$elm$core$List$length(hits)) ? A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('container')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('col')
							]),
						_List_fromArray(
							[
								$elm$html$Html$text('No darts thrown yet.')
							]))
					]))
			])) : A2(
		$elm$html$Html$div,
		_List_fromArray(
			[
				$elm$html$Html$Attributes$class('container')
			]),
		_List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('row')
					]),
				A2(
					$elm$core$List$map,
					hit_div,
					$elm$core$List$reverse(hits)))
			]));
};
var $author$project$Types$CancelFinishTurn = {$: 'CancelFinishTurn'};
var $author$project$Types$FinishTurn = {$: 'FinishTurn'};
var $author$project$Types$TossModalCancel = {$: 'TossModalCancel'};
var $author$project$Types$TossModalSelect = function (a) {
	return {$: 'TossModalSelect', a: a};
};
var $elm$html$Html$h1 = _VirtualDom_node('h1');
var $author$project$Types$Text$short_hit_text = function (h) {
	switch (h.$) {
		case 'HitMissed':
			return '\u2297';
		case 'Hit1':
			return '\u2460';
		case 'Hit2':
			return '\u2461';
		case 'Hit3':
			return '\u2462';
		case 'Hit4':
			return '\u2463';
		case 'Hit5':
			return '\u2464';
		case 'Hit6':
			return '\u2465';
		case 'Hit7':
			return '\u2466';
		case 'Hit8':
			return '\u2467';
		case 'Hit9':
			return '\u2468';
		case 'Hit10':
			return '\u2469';
		case 'Hit11':
			return '\u246A';
		case 'Hit12':
			return '\u246B';
		case 'Hit13':
			return '\u246C';
		case 'Hit14':
			return '\u246D';
		case 'Hit15':
			return '\u246E';
		case 'Hit16':
			return '\u246F';
		case 'Hit17':
			return '\u2470';
		case 'Hit18':
			return '\u2471';
		case 'Hit19':
			return '\u2472';
		case 'Hit20':
			return '\u2473';
		case 'HitBullseye':
			return '\u24B7';
		default:
			return '\u2805\u24B7';
	}
};
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $elm$html$Html$Attributes$style = $elm$virtual_dom$VirtualDom$style;
var $author$project$Main$render_modal = function (modal) {
	var number_hit_buttons = F3(
		function (s, d, t) {
			return _List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('row text-center')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('col')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('btn btn-secondary'),
											$elm$html$Html$Events$onClick(
											$author$project$Types$TossModalSelect(s))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Single')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('row text-center')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('col')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('btn btn-success'),
											$elm$html$Html$Events$onClick(
											$author$project$Types$TossModalSelect(d))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Double')
										]))
								])),
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('col')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('btn btn-danger'),
											$elm$html$Html$Events$onClick(
											$author$project$Types$TossModalSelect(t))
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Triple')
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('row text-center')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('col')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$button,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('btn btn-warning'),
											$elm$html$Html$Events$onClick($author$project$Types$TossModalCancel)
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Cancel')
										]))
								]))
						]))
				]);
		});
	var subhit_modal = function (h) {
		return _List_fromArray(
			[
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('modal-backdrop show')
					]),
				_List_Nil),
				A2(
				$elm$html$Html$div,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('modal'),
						A2($elm$html$Html$Attributes$style, 'display', 'block')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('modal-dialog-centered')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$div,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('modal-content')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('modal-header text-center')
											]),
										_List_fromArray(
											[
												A2(
												$elm$html$Html$div,
												_List_fromArray(
													[
														$elm$html$Html$Attributes$class('modal-title w-100')
													]),
												_List_fromArray(
													[
														A2(
														$elm$html$Html$h1,
														_List_Nil,
														_List_fromArray(
															[
																$elm$html$Html$text(
																$author$project$Types$Text$short_hit_text(h))
															]))
													]))
											])),
										A2(
										$elm$html$Html$div,
										_List_fromArray(
											[
												$elm$html$Html$Attributes$class('modal-body')
											]),
										function () {
											switch (h.$) {
												case 'HitBullseye':
													return _List_fromArray(
														[
															A2(
															$elm$html$Html$div,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('row text-center')
																]),
															_List_fromArray(
																[
																	A2(
																	$elm$html$Html$div,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('col')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$button,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('btn btn-primary'),
																					$elm$html$Html$Events$onClick(
																					$author$project$Types$TossModalSelect($author$project$Types$HitBullseye))
																				]),
																			_List_fromArray(
																				[
																					$elm$html$Html$text('Single')
																				]))
																		])),
																	A2(
																	$elm$html$Html$div,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('col')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$button,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('btn btn-danger'),
																					$elm$html$Html$Events$onClick(
																					$author$project$Types$TossModalSelect($author$project$Types$HitDoubleBullseye))
																				]),
																			_List_fromArray(
																				[
																					$elm$html$Html$text('Double')
																				]))
																		]))
																])),
															A2(
															$elm$html$Html$div,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('row text-center')
																]),
															_List_fromArray(
																[
																	A2(
																	$elm$html$Html$div,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('col')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$button,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('btn btn-warning'),
																					$elm$html$Html$Events$onClick($author$project$Types$TossModalCancel)
																				]),
																			_List_fromArray(
																				[
																					$elm$html$Html$text('Cancel')
																				]))
																		]))
																]))
														]);
												case 'HitDoubleBullseye':
													return _List_fromArray(
														[
															A2(
															$elm$html$Html$div,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('row text-center')
																]),
															_List_fromArray(
																[
																	A2(
																	$elm$html$Html$div,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('col')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$button,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('btn btn-primary'),
																					$elm$html$Html$Events$onClick(
																					$author$project$Types$TossModalSelect($author$project$Types$HitBullseye))
																				]),
																			_List_fromArray(
																				[
																					$elm$html$Html$text('Single')
																				]))
																		])),
																	A2(
																	$elm$html$Html$div,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('col')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$button,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('btn btn-danger'),
																					$elm$html$Html$Events$onClick(
																					$author$project$Types$TossModalSelect($author$project$Types$HitDoubleBullseye))
																				]),
																			_List_fromArray(
																				[
																					$elm$html$Html$text('Double')
																				]))
																		]))
																])),
															A2(
															$elm$html$Html$div,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('row text-center')
																]),
															_List_fromArray(
																[
																	A2(
																	$elm$html$Html$div,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('col')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$button,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('btn btn-warning'),
																					$elm$html$Html$Events$onClick($author$project$Types$TossModalCancel)
																				]),
																			_List_fromArray(
																				[
																					$elm$html$Html$text('Cancel')
																				]))
																		]))
																]))
														]);
												case 'Hit1':
													return A3(
														number_hit_buttons,
														$author$project$Types$Hit1($author$project$Types$SingleHit),
														$author$project$Types$Hit1($author$project$Types$DoubleHit),
														$author$project$Types$Hit1($author$project$Types$TripleHit));
												case 'Hit2':
													return A3(
														number_hit_buttons,
														$author$project$Types$Hit2($author$project$Types$SingleHit),
														$author$project$Types$Hit2($author$project$Types$DoubleHit),
														$author$project$Types$Hit2($author$project$Types$TripleHit));
												case 'Hit3':
													return A3(
														number_hit_buttons,
														$author$project$Types$Hit3($author$project$Types$SingleHit),
														$author$project$Types$Hit3($author$project$Types$DoubleHit),
														$author$project$Types$Hit3($author$project$Types$TripleHit));
												case 'Hit4':
													return A3(
														number_hit_buttons,
														$author$project$Types$Hit4($author$project$Types$SingleHit),
														$author$project$Types$Hit4($author$project$Types$DoubleHit),
														$author$project$Types$Hit4($author$project$Types$TripleHit));
												case 'Hit5':
													return A3(
														number_hit_buttons,
														$author$project$Types$Hit5($author$project$Types$SingleHit),
														$author$project$Types$Hit5($author$project$Types$DoubleHit),
														$author$project$Types$Hit5($author$project$Types$TripleHit));
												case 'Hit6':
													return A3(
														number_hit_buttons,
														$author$project$Types$Hit6($author$project$Types$SingleHit),
														$author$project$Types$Hit6($author$project$Types$DoubleHit),
														$author$project$Types$Hit6($author$project$Types$TripleHit));
												case 'Hit7':
													return A3(
														number_hit_buttons,
														$author$project$Types$Hit7($author$project$Types$SingleHit),
														$author$project$Types$Hit7($author$project$Types$DoubleHit),
														$author$project$Types$Hit7($author$project$Types$TripleHit));
												case 'Hit8':
													return A3(
														number_hit_buttons,
														$author$project$Types$Hit8($author$project$Types$SingleHit),
														$author$project$Types$Hit8($author$project$Types$DoubleHit),
														$author$project$Types$Hit8($author$project$Types$TripleHit));
												case 'Hit9':
													return A3(
														number_hit_buttons,
														$author$project$Types$Hit9($author$project$Types$SingleHit),
														$author$project$Types$Hit9($author$project$Types$DoubleHit),
														$author$project$Types$Hit9($author$project$Types$TripleHit));
												case 'Hit10':
													return A3(
														number_hit_buttons,
														$author$project$Types$Hit10($author$project$Types$SingleHit),
														$author$project$Types$Hit10($author$project$Types$DoubleHit),
														$author$project$Types$Hit10($author$project$Types$TripleHit));
												case 'Hit11':
													return A3(
														number_hit_buttons,
														$author$project$Types$Hit11($author$project$Types$SingleHit),
														$author$project$Types$Hit11($author$project$Types$DoubleHit),
														$author$project$Types$Hit11($author$project$Types$TripleHit));
												case 'Hit12':
													return A3(
														number_hit_buttons,
														$author$project$Types$Hit12($author$project$Types$SingleHit),
														$author$project$Types$Hit12($author$project$Types$DoubleHit),
														$author$project$Types$Hit12($author$project$Types$TripleHit));
												case 'Hit13':
													return A3(
														number_hit_buttons,
														$author$project$Types$Hit13($author$project$Types$SingleHit),
														$author$project$Types$Hit13($author$project$Types$DoubleHit),
														$author$project$Types$Hit13($author$project$Types$TripleHit));
												case 'Hit14':
													return A3(
														number_hit_buttons,
														$author$project$Types$Hit14($author$project$Types$SingleHit),
														$author$project$Types$Hit14($author$project$Types$DoubleHit),
														$author$project$Types$Hit14($author$project$Types$TripleHit));
												case 'Hit15':
													return A3(
														number_hit_buttons,
														$author$project$Types$Hit15($author$project$Types$SingleHit),
														$author$project$Types$Hit15($author$project$Types$DoubleHit),
														$author$project$Types$Hit15($author$project$Types$TripleHit));
												case 'Hit16':
													return A3(
														number_hit_buttons,
														$author$project$Types$Hit16($author$project$Types$SingleHit),
														$author$project$Types$Hit16($author$project$Types$DoubleHit),
														$author$project$Types$Hit16($author$project$Types$TripleHit));
												case 'Hit17':
													return A3(
														number_hit_buttons,
														$author$project$Types$Hit17($author$project$Types$SingleHit),
														$author$project$Types$Hit17($author$project$Types$DoubleHit),
														$author$project$Types$Hit17($author$project$Types$TripleHit));
												case 'Hit18':
													return A3(
														number_hit_buttons,
														$author$project$Types$Hit18($author$project$Types$SingleHit),
														$author$project$Types$Hit18($author$project$Types$DoubleHit),
														$author$project$Types$Hit18($author$project$Types$TripleHit));
												case 'Hit19':
													return A3(
														number_hit_buttons,
														$author$project$Types$Hit19($author$project$Types$SingleHit),
														$author$project$Types$Hit19($author$project$Types$DoubleHit),
														$author$project$Types$Hit19($author$project$Types$TripleHit));
												case 'Hit20':
													return A3(
														number_hit_buttons,
														$author$project$Types$Hit20($author$project$Types$SingleHit),
														$author$project$Types$Hit20($author$project$Types$DoubleHit),
														$author$project$Types$Hit20($author$project$Types$TripleHit));
												default:
													return _List_fromArray(
														[
															A2(
															$elm$html$Html$div,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('row text-center')
																]),
															_List_fromArray(
																[
																	A2(
																	$elm$html$Html$div,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('col')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$button,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('btn btn-primary'),
																					$elm$html$Html$Events$onClick(
																					$author$project$Types$TossModalSelect($author$project$Types$HitMissed))
																				]),
																			_List_fromArray(
																				[
																					$elm$html$Html$text('Missed')
																				]))
																		])),
																	A2(
																	$elm$html$Html$div,
																	_List_fromArray(
																		[
																			$elm$html$Html$Attributes$class('col')
																		]),
																	_List_fromArray(
																		[
																			A2(
																			$elm$html$Html$button,
																			_List_fromArray(
																				[
																					$elm$html$Html$Attributes$class('btn btn-warning'),
																					$elm$html$Html$Events$onClick($author$project$Types$TossModalCancel)
																				]),
																			_List_fromArray(
																				[
																					$elm$html$Html$text('Cancel')
																				]))
																		]))
																]))
														]);
											}
										}())
									]))
							]))
					]))
			]);
	};
	var confirm_finish_modal = _List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('modal-backdrop show')
				]),
			_List_Nil),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('modal'),
					A2($elm$html$Html$Attributes$style, 'display', 'block')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('modal-dialog-centered')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('modal-content')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('modal-header text-center')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('modal-title w-100')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$h1,
													_List_Nil,
													_List_fromArray(
														[
															$elm$html$Html$text('Finish Turn')
														]))
												]))
										])),
									A2(
									$elm$html$Html$div,
									_List_fromArray(
										[
											$elm$html$Html$Attributes$class('modal-body')
										]),
									_List_fromArray(
										[
											A2(
											$elm$html$Html$div,
											_List_fromArray(
												[
													$elm$html$Html$Attributes$class('row text-center')
												]),
											_List_fromArray(
												[
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('col')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$button,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('btn btn-primary'),
																	$elm$html$Html$Events$onClick($author$project$Types$FinishTurn)
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Finish Turn')
																]))
														])),
													A2(
													$elm$html$Html$div,
													_List_fromArray(
														[
															$elm$html$Html$Attributes$class('col')
														]),
													_List_fromArray(
														[
															A2(
															$elm$html$Html$button,
															_List_fromArray(
																[
																	$elm$html$Html$Attributes$class('btn btn-danger'),
																	$elm$html$Html$Events$onClick($author$project$Types$CancelFinishTurn)
																]),
															_List_fromArray(
																[
																	$elm$html$Html$text('Cancel')
																]))
														]))
												]))
										]))
								]))
						]))
				]))
		]);
	if (modal.$ === 'Just') {
		if (modal.a.$ === 'SelectSubHit') {
			var h = modal.a.a;
			return subhit_modal(h);
		} else {
			var _v1 = modal.a;
			return confirm_finish_modal;
		}
	} else {
		return _List_Nil;
	}
};
var $author$project$Main$player_initials = F2(
	function (l, pid) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (p, acc) {
					return _Utils_eq(pid, p.id) ? p.initials : acc;
				}),
			$author$project$Types$PlayerInitials('??'),
			l);
	});
var $author$project$Main$render_atc = F3(
	function (lp, c, l) {
		var hits_to_string = function (hl) {
			return A2(
				$elm$core$String$join,
				' ',
				A3(
					$elm$core$List$foldl,
					F2(
						function (h, acc) {
							return A2(
								$elm$core$List$cons,
								$author$project$Types$Text$hit_text(h),
								acc);
						}),
					_List_Nil,
					hl));
		};
		var row = F2(
			function (i, _v1) {
				var pid = _v1.a;
				var hl = _v1.b.a;
				return A2(
					$elm$html$Html$tr,
					_Utils_eq(i, c) ? _List_fromArray(
						[
							$elm$html$Html$Attributes$class('table-info')
						]) : _List_Nil,
					A2(
						$elm$core$List$cons,
						A2(
							$elm$html$Html$td,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									function (_v0) {
										var x = _v0.a;
										return x;
									}(
										A2($author$project$Main$player_initials, lp, pid)))
								])),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$td,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										hits_to_string(hl))
									]))
							])));
			});
		return A2(
			$elm$html$Html$table,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('table')
				]),
			A2($elm$core$List$indexedMap, row, l));
	});
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $author$project$Main$render_atc_180 = F3(
	function (lp, c, l) {
		var unpack = function (_v4) {
			var s = _v4.a;
			return s;
		};
		var sum_scores = function (sl) {
			return A3(
				$elm$core$List$foldr,
				F2(
					function (_v2, _v3) {
						var a = _v2.a;
						var b = _v3.a;
						return $author$project$Types$Score(a + b);
					}),
				$author$project$Types$Score(0),
				sl);
		};
		var hits_to_string = function (hl) {
			return A2(
				$elm$core$String$join,
				' ',
				A3(
					$elm$core$List$foldl,
					F2(
						function (h, acc) {
							return A2(
								$elm$core$List$cons,
								$author$project$Types$Text$hit_text(h),
								acc);
						}),
					_List_Nil,
					hl));
		};
		var row = F2(
			function (i, _v1) {
				var pid = _v1.a;
				var hsl = _v1.b.a;
				return A2(
					$elm$html$Html$tr,
					_Utils_eq(i, c) ? _List_fromArray(
						[
							$elm$html$Html$Attributes$class('table-info')
						]) : _List_Nil,
					A2(
						$elm$core$List$cons,
						A2(
							$elm$html$Html$td,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									function (_v0) {
										var x = _v0.a;
										return x;
									}(
										A2($author$project$Main$player_initials, lp, pid)))
								])),
						A2(
							$elm$core$List$cons,
							A2(
								$elm$html$Html$td,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										$elm$core$String$fromInt(
											unpack(
												sum_scores(
													A2($elm$core$List$map, $elm$core$Tuple$second, hsl)))))
									])),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$td,
									_List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(
											hits_to_string(
												A2($elm$core$List$map, $elm$core$Tuple$first, hsl)))
										]))
								]))));
			});
		return A2(
			$elm$html$Html$table,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('table')
				]),
			A2($elm$core$List$indexedMap, row, l));
	});
var $author$project$Main$render_bbl = F4(
	function (lp, c, _v0, l) {
		var i = _v0.a;
		var sum = function (_v8) {
			var sl = _v8.a;
			return A3(
				$elm$core$List$foldr,
				F2(
					function (_v7, acc) {
						var z = _v7.c.a;
						return acc + z;
					}),
				0,
				sl);
		};
		var totals = _List_fromArray(
			[
				A2(
				$elm$html$Html$tr,
				_List_Nil,
				_Utils_ap(
					_List_fromArray(
						[
							A2(
							$elm$html$Html$td,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('T')
								]))
						]),
					A2(
						$elm$core$List$map,
						function (_v6) {
							var s = _v6.b;
							return A2(
								$elm$html$Html$td,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										$elm$core$String$fromInt(
											sum(s)))
									]));
						},
						l)))
			]);
		var inning_score = F2(
			function (x, _v5) {
				var s = _v5.a;
				return $elm$core$String$fromInt(
					A3(
						$elm$core$List$foldl,
						F2(
							function (_v4, acc) {
								var y = _v4.a.a;
								var z = _v4.c.a;
								return _Utils_eq(y, x) ? z : acc;
							}),
						0,
						s));
			});
		var player_inning = F2(
			function (x, _v3) {
				var s = _v3.b;
				return A2(
					$elm$html$Html$td,
					_List_Nil,
					_List_fromArray(
						[
							$elm$html$Html$text(
							A2(inning_score, x, s))
						]));
			});
		var inning = function (x) {
			return A2(
				$elm$html$Html$tr,
				_List_Nil,
				_Utils_ap(
					_List_fromArray(
						[
							A2(
							$elm$html$Html$td,
							_Utils_eq(i, x) ? _List_fromArray(
								[
									$elm$html$Html$Attributes$class('table-info')
								]) : _List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									$elm$core$String$fromInt(x))
								]))
						]),
					A2(
						$elm$core$List$map,
						player_inning(x),
						l)));
		};
		var innings = A2(
			$elm$core$List$map,
			inning,
			A2(
				$elm$core$List$range,
				1,
				A2($elm$core$Basics$max, 9, i)));
		var hdr = _List_fromArray(
			[
				A2(
				$elm$html$Html$tr,
				_List_Nil,
				_Utils_ap(
					_List_fromArray(
						[
							A2(
							$elm$html$Html$td,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('IN')
								]))
						]),
					A2(
						$elm$core$List$indexedMap,
						F2(
							function (x, _v1) {
								var pid = _v1.a;
								return A2(
									$elm$html$Html$td,
									_Utils_eq(c, x) ? _List_fromArray(
										[
											$elm$html$Html$Attributes$class('table-info')
										]) : _List_Nil,
									_List_fromArray(
										[
											$elm$html$Html$text(
											function (_v2) {
												var y = _v2.a;
												return y;
											}(
												A2($author$project$Main$player_initials, lp, pid)))
										]));
							}),
						l)))
			]);
		return A2(
			$elm$html$Html$table,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('table')
				]),
			_Utils_ap(
				hdr,
				_Utils_ap(innings, totals)));
	});
var $author$project$Main$render_ckt = F3(
	function (lp, c, l) {
		var slice = function (x) {
			switch (x.$) {
				case 'Slice0':
					return '';
				case 'Slice1':
					return '\u002D';
				case 'Slice2':
					return '\u002B';
				case 'SliceOpen':
					return '\u2295';
				default:
					return '\u229B';
			}
		};
		var hdr = _List_fromArray(
			[
				A2(
				$elm$html$Html$tr,
				_List_Nil,
				_List_fromArray(
					[
						A2($elm$html$Html$td, _List_Nil, _List_Nil),
						A2(
						$elm$html$Html$td,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('\u2473')
							])),
						A2(
						$elm$html$Html$td,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('\u2472')
							])),
						A2(
						$elm$html$Html$td,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('\u2471')
							])),
						A2(
						$elm$html$Html$td,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('\u2470')
							])),
						A2(
						$elm$html$Html$td,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('\u246F')
							])),
						A2(
						$elm$html$Html$td,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('\u246E')
							])),
						A2(
						$elm$html$Html$td,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('\u24B7')
							])),
						A2($elm$html$Html$td, _List_Nil, _List_Nil)
					]))
			]);
		var extract = function (_v2) {
			var s = _v2.a;
			return $elm$core$String$fromInt(s);
		};
		var row = F2(
			function (i, _v1) {
				var pid = _v1.a;
				var s = _v1.b;
				return A2(
					$elm$html$Html$tr,
					_Utils_eq(i, c) ? _List_fromArray(
						[
							$elm$html$Html$Attributes$class('table-info')
						]) : _List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$td,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									function (_v0) {
										var x = _v0.a;
										return x;
									}(
										A2($author$project$Main$player_initials, lp, pid)))
								])),
							A2(
							$elm$html$Html$td,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									slice(s.slice20))
								])),
							A2(
							$elm$html$Html$td,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									slice(s.slice19))
								])),
							A2(
							$elm$html$Html$td,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									slice(s.slice18))
								])),
							A2(
							$elm$html$Html$td,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									slice(s.slice17))
								])),
							A2(
							$elm$html$Html$td,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									slice(s.slice16))
								])),
							A2(
							$elm$html$Html$td,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									slice(s.slice15))
								])),
							A2(
							$elm$html$Html$td,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									slice(s.sliceBull))
								])),
							A2(
							$elm$html$Html$td,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									extract(s.score))
								]))
						]));
			});
		return A2(
			$elm$html$Html$table,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('table')
				]),
			_Utils_ap(
				hdr,
				A2($elm$core$List$indexedMap, row, l)));
	});
var $author$project$Main$render_ctd = F3(
	function (lp, c, l) {
		var hits_to_string = function (hl) {
			return A2(
				$elm$core$String$join,
				' ',
				A3(
					$elm$core$List$foldl,
					F2(
						function (h, acc) {
							return A2(
								$elm$core$List$cons,
								$author$project$Types$Text$hit_text(h),
								acc);
						}),
					_List_Nil,
					hl));
		};
		var row = F2(
			function (i, _v1) {
				var pid = _v1.a;
				var hl = _v1.b.a;
				return A2(
					$elm$html$Html$tr,
					_Utils_eq(i, c) ? _List_fromArray(
						[
							$elm$html$Html$Attributes$class('table-info')
						]) : _List_Nil,
					A2(
						$elm$core$List$cons,
						A2(
							$elm$html$Html$td,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									function (_v0) {
										var x = _v0.a;
										return x;
									}(
										A2($author$project$Main$player_initials, lp, pid)))
								])),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$td,
								_List_Nil,
								_List_fromArray(
									[
										$elm$html$Html$text(
										hits_to_string(hl))
									]))
							])));
			});
		return A2(
			$elm$html$Html$table,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('table')
				]),
			A2($elm$core$List$indexedMap, row, l));
	});
var $author$project$Main$render_numbers = F3(
	function (lp, c, l) {
		var row = F2(
			function (i, _v1) {
				var pid = _v1.a;
				var s = _v1.b.a.a;
				return A2(
					$elm$html$Html$tr,
					_Utils_eq(i, c) ? _List_fromArray(
						[
							$elm$html$Html$Attributes$class('table-info')
						]) : _List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$td,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									function (_v0) {
										var x = _v0.a;
										return x;
									}(
										A2($author$project$Main$player_initials, lp, pid)))
								])),
							A2(
							$elm$html$Html$td,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text(
									$elm$core$String$fromInt(s))
								]))
						]));
			});
		return A2(
			$elm$html$Html$table,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('table')
				]),
			A2($elm$core$List$indexedMap, row, l));
	});
var $author$project$Main$render_scores = F2(
	function (lp, g) {
		switch (g.$) {
			case 'NoGame':
				return $elm$html$Html$text('No Game');
			case 'Numbers701':
				var c = g.c;
				var l = g.e;
				return A3($author$project$Main$render_numbers, lp, c, l);
			case 'Numbers501':
				var c = g.c;
				var l = g.e;
				return A3($author$project$Main$render_numbers, lp, c, l);
			case 'Numbers301':
				var c = g.c;
				var l = g.e;
				return A3($author$project$Main$render_numbers, lp, c, l);
			case 'AroundTheClock':
				var c = g.b;
				var l = g.d;
				return A3($author$project$Main$render_atc, lp, c, l);
			case 'AroundTheClock180':
				var c = g.b;
				var l = g.d;
				return A3($author$project$Main$render_atc_180, lp, c, l);
			case 'Baseball':
				var c = g.b;
				var i = g.d;
				var l = g.e;
				return A4($author$project$Main$render_bbl, lp, c, i, l);
			case 'ChaseTheDragon':
				var c = g.b;
				var l = g.d;
				return A3($author$project$Main$render_ctd, lp, c, l);
			default:
				var c = g.b;
				var l = g.d;
				return A3($author$project$Main$render_ckt, lp, c, l);
		}
	});
var $elm$svg$Svg$svg = $elm$svg$Svg$trustedNode('svg');
var $elm$svg$Svg$Attributes$viewBox = _VirtualDom_attribute('viewBox');
var $elm$svg$Svg$Attributes$width = _VirtualDom_attribute('width');
var $author$project$Main$render_game = F2(
	function (state, modal) {
		return _Utils_ap(
			_List_fromArray(
				[
					A2(
					$elm$html$Html$ul,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('nav bg-primary text-white')
						]),
					_List_fromArray(
						[
							A2(
							$elm$html$Html$li,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('nav-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick($author$project$Types$GoHome),
											$elm$html$Html$Attributes$class('nav-link')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('Home')
										]))
								])),
							A2(
							$elm$html$Html$li,
							_List_fromArray(
								[
									$elm$html$Html$Attributes$class('nav-item')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$a,
									_List_fromArray(
										[
											$elm$html$Html$Events$onClick($author$project$Types$EndGame),
											$elm$html$Html$Attributes$class('nav-link')
										]),
									_List_fromArray(
										[
											$elm$html$Html$text('End Game')
										]))
								]))
						])),
					A2($author$project$Main$render_current_player_name, state.game, state.players),
					$author$project$Main$render_hits(
					$author$project$Game$hits(state.game)),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('board')
						]),
					_List_fromArray(
						[
							A2(
							$elm$svg$Svg$svg,
							_List_fromArray(
								[
									$elm$svg$Svg$Attributes$width('100%'),
									$elm$svg$Svg$Attributes$height('100%'),
									$elm$svg$Svg$Attributes$viewBox('0 0 100 100')
								]),
							$author$project$Main$render_board)
						])),
					A2($author$project$Main$render_scores, state.players, state.game)
				]),
			$author$project$Main$render_modal(modal));
	});
var $author$project$Types$GoEditPlayers = {$: 'GoEditPlayers'};
var $author$project$Types$ResumeGame = {$: 'ResumeGame'};
var $author$project$Types$StartGame = {$: 'StartGame'};
var $author$project$Types$Text$around_the_clock_180_variation_text = function (v) {
	if (v.$ === 'DoubleBonus') {
		return 'Double Bonus';
	} else {
		return 'Triple Bonus';
	}
};
var $author$project$Types$Text$around_the_clock_variation_text = function (v) {
	switch (v.$) {
		case 'NoBullOut':
			return 'Standard';
		case 'AnyBullOut':
			return 'Bull Out';
		default:
			return 'Split Bull Out';
	}
};
var $author$project$Types$Text$baseball_variation_text = function (v) {
	if (v.$ === 'BasicBaseball') {
		return 'Standard';
	} else {
		return '7th Inning Catch';
	}
};
var $author$project$Types$Text$cricket_variation_text = function (v) {
	if (v.$ === 'BasicCricket') {
		return 'Standard';
	} else {
		return 'Golf';
	}
};
var $author$project$Types$Text$dragon_variation_text = function (v) {
	if (v.$ === 'BasicDragon') {
		return 'Standard';
	} else {
		return 'Triple Headed Dragon';
	}
};
var $author$project$Types$Text$numbers_variation_in_text = function (v) {
	switch (v.$) {
		case 'BasicIn':
			return 'Any In';
		case 'DoubleIn':
			return 'Double In';
		default:
			return 'Triple In';
	}
};
var $author$project$Types$Text$numbers_variation_out_text = function (v) {
	switch (v.$) {
		case 'BasicOut':
			return 'Any Out';
		case 'DoubleOut':
			return 'Double Out';
		default:
			return 'TripleOut';
	}
};
var $elm$html$Html$span = _VirtualDom_node('span');
var $author$project$Types$Dom$game_name = function (mode) {
	switch (mode.$) {
		case 'NoGame':
			return A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('No Game Selected')
					]));
		case 'Numbers701':
			var vi = mode.a;
			var vo = mode.b;
			return A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('701 : '),
						$elm$html$Html$text(
						$author$project$Types$Text$numbers_variation_in_text(vi)),
						$elm$html$Html$text('/'),
						$elm$html$Html$text(
						$author$project$Types$Text$numbers_variation_out_text(vo))
					]));
		case 'Numbers501':
			var vi = mode.a;
			var vo = mode.b;
			return A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('501 : '),
						$elm$html$Html$text(
						$author$project$Types$Text$numbers_variation_in_text(vi)),
						$elm$html$Html$text('/'),
						$elm$html$Html$text(
						$author$project$Types$Text$numbers_variation_out_text(vo))
					]));
		case 'Numbers301':
			var vi = mode.a;
			var vo = mode.b;
			return A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('301 : '),
						$elm$html$Html$text(
						$author$project$Types$Text$numbers_variation_in_text(vi)),
						$elm$html$Html$text('/'),
						$elm$html$Html$text(
						$author$project$Types$Text$numbers_variation_out_text(vo))
					]));
		case 'AroundTheClock':
			var v = mode.a;
			return A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Around the Clock : '),
						$elm$html$Html$text(
						$author$project$Types$Text$around_the_clock_variation_text(v))
					]));
		case 'AroundTheClock180':
			var v = mode.a;
			return A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Around the Clock 180 : '),
						$elm$html$Html$text(
						$author$project$Types$Text$around_the_clock_180_variation_text(v))
					]));
		case 'Baseball':
			var v = mode.a;
			return A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Baseball : '),
						$elm$html$Html$text(
						$author$project$Types$Text$baseball_variation_text(v))
					]));
		case 'ChaseTheDragon':
			var v = mode.a;
			return A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Chase the Dragon : '),
						$elm$html$Html$text(
						$author$project$Types$Text$dragon_variation_text(v))
					]));
		default:
			var v = mode.a;
			return A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Cricket : '),
						$elm$html$Html$text(
						$author$project$Types$Text$cricket_variation_text(v))
					]));
	}
};
var $author$project$Main$render_home = function (state) {
	var start_game = (($elm$core$List$length(state.players) > 0) && ((!_Utils_eq(state.game, $author$project$Types$NoGame)) && (!state.playing))) ? _List_fromArray(
		[
			A2(
			$elm$html$Html$li,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('nav-item')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick($author$project$Types$StartGame),
							$elm$html$Html$Attributes$class('nav-link')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Start Game')
						]))
				]))
		]) : _List_Nil;
	var select_game = (!state.playing) ? _List_fromArray(
		[
			A2(
			$elm$html$Html$li,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('nav-item')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick($author$project$Types$GoSelectGame),
							$elm$html$Html$Attributes$class('nav-link')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Select Game')
						]))
				]))
		]) : _List_Nil;
	var resume_game = (($elm$core$List$length(state.players) > 0) && ((!_Utils_eq(state.game, $author$project$Types$NoGame)) && state.playing)) ? _List_fromArray(
		[
			A2(
			$elm$html$Html$li,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('nav-item')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$a,
					_List_fromArray(
						[
							$elm$html$Html$Events$onClick($author$project$Types$ResumeGame),
							$elm$html$Html$Attributes$class('nav-link')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text('Resume')
						]))
				]))
		]) : _List_Nil;
	var player = function (p) {
		return A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('row')
				]),
			_List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('col')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$author$project$Types$Text$player_name_text(p.name))
						])),
					A2(
					$elm$html$Html$div,
					_List_fromArray(
						[
							$elm$html$Html$Attributes$class('col')
						]),
					_List_fromArray(
						[
							$elm$html$Html$text(
							$author$project$Types$Text$player_initials_text(p.initials))
						]))
				]));
	};
	var players = A2($elm$core$List$map, player, state.players);
	return _List_fromArray(
		[
			A2(
			$elm$html$Html$ul,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('nav bg-primary text-white')
				]),
			_Utils_ap(
				start_game,
				_Utils_ap(
					resume_game,
					_Utils_ap(
						_List_fromArray(
							[
								A2(
								$elm$html$Html$li,
								_List_fromArray(
									[
										$elm$html$Html$Attributes$class('nav-item')
									]),
								_List_fromArray(
									[
										A2(
										$elm$html$Html$a,
										_List_fromArray(
											[
												$elm$html$Html$Events$onClick($author$project$Types$GoEditPlayers),
												$elm$html$Html$Attributes$class('nav-link')
											]),
										_List_fromArray(
											[
												$elm$html$Html$text('Edit Players')
											]))
									]))
							]),
						select_game)))),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container')
				]),
			_List_fromArray(
				[
					$elm$html$Html$text('Selected Game: '),
					$author$project$Types$Dom$game_name(state.game)
				])),
			A2(
			$elm$html$Html$div,
			_List_fromArray(
				[
					$elm$html$Html$Attributes$class('container')
				]),
			players)
		]);
};
var $elm$html$Html$p = _VirtualDom_node('p');
var $author$project$Types$Dom$game_description = function (mode) {
	switch (mode.$) {
		case 'NoGame':
			return A2($elm$html$Html$span, _List_Nil, _List_Nil);
		case 'Numbers701':
			return A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Total score of a 3 dart turn is deducted from the player\'s starting number of 701.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Inner bull is 50, outter bull is 25.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Winner must reach EXACTLY 0 points.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('If 0 is reached before finishing a turn, the turn is over, it is a win.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('If the turn results in a less than 0 score, called a Bust, no points are deducted for that turn.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Variations:')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Double In / Triple In : Requires double or triple hits during the opening turn in order to begin point deduction.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Double Out / Triple Out : Requires double or triple hits during the ending turn in order to end the game. Busts happen on a turn score of 1 or 2 respectively.')
							]))
					]));
		case 'Numbers501':
			return A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Total score of a 3 dart turn is deducted from the player\'s starting number of 501.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Inner bull is 50, outter bull is 25.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Winner must reach EXACTLY 0 points.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('If 0 is reached before finishing a turn, the turn is over, it is a win.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('If the turn results in a less than 0 score, called a Bust, no points are deducted for that turn.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Variations:')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Double In / Triple In : Requires double or triple hits during the opening turn in order to begin point deduction.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Double Out / Triple Out : Requires double or triple hits during the ending turn in order to end the game. Busts happen on a turn score of 1 or 2 respectively.')
							]))
					]));
		case 'Numbers301':
			return A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Total score of a 3 dart turn is deducted from the player\'s starting number of 301.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Inner bull is 50, outter bull is 25.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Winner must reach EXACTLY 0 points.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('If 0 is reached before finishing a turn, the turn is over, it is a win.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('If the turn results in a less than 0 score, called a Bust, no points are deducted for that turn.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Variations:')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Double In / Triple In : Requires double or triple hits during the opening turn in order to begin point deduction.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Double Out / Triple Out : Requires double or triple hits during the ending turn in order to end the game. Busts happen on a turn score of 1 or 2 respectively.')
							]))
					]));
		case 'AroundTheClock':
			return A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Each player takes a 3 dart turn.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Objective is to hit 1 to 20 in order.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('The player can not move on to the next number until the target number is hit, starting at 1.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('The target number increments after a successful hit on the current target number, so at most a player can advance 3 numbers in a turn.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('The first player to hit 20 wins.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Doubles and triples count as a normal hit.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Variations:')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Bull Out : After 20, player must hit double or single bullseye to win.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Split Bull Out : After 20, player must hit the outter bullseye, then the inner bullseye to win.')
							]))
					]));
		case 'AroundTheClock180':
			return A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('For the game, choose if triples or doubles will reward bonus points.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Each player takes a 3 dart turn.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Objective is to hit 1 to 20 in order.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('The player can not move on to the next number until the target number is hit, starting at 1.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('The target number increments after a successful hit on the current target number, so at most a player can advance 3 numbers in a turn.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Points are only issued on hits to the target number. Hits to old or future numbers do not issue points.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('A normal hit is worth 1 point. A hit to a double or triple (depending on what was chosen for the game) is worth 3 points.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Players who hit 20 are done with their turns.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('When all players finish, the one with the most points wins.')
							]))
					]));
		case 'Baseball':
			return A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Each player takes a 3 dart turn.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('There are 9 innings and the inning increments each round.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Players target the number based on the inning, so board positions 1 to 9 will be used.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Hitting the target number gives 1 run. Doubles and triples give 2 and 3 runs respectively.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Ties at the end of the 9th inning are broken by adding additional innings where the bullseye is the target.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Player with the most points wins.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Variations: ')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Seventh Inning Catch : No hits in the 7th inning results in the player\'s score being cut in half, rounded up.')
							]))
					]));
		case 'ChaseTheDragon':
			return A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Each player takes a 3 dart turn.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Objective is to hit triples of 10 to 20 in order, followed by the outter then inner bullseye.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('The player can not move on to the next number until the target number triple is hit, starting at 10.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('The target number increments after a successful hit on the current target number, so at most a player can advance 3 numbers in a turn.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('The first player to hit the inner bullseye wins.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Variations:')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Three Headed Dragon : Player must complete the 10 to 20, outter bullseye, inner bullseye pattern 3 times to win.')
							]))
					]));
		default:
			return A2(
				$elm$html$Html$span,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Each player takes a 3 dart turn.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('The targets are 15 to 20 and the inner and outter bullseye.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('A player can attempt to hit any target in any order during their turn.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Objective is for a player to open all targets and earn the most points.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Each player must open their own targets, one player opening a target does not open it for all other players.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('A player marks unopened targets with dart hits. A regular hit is 1 mark, a double hit is 2 marks, and a triple hit is 3 marks.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('A target is open when it has 3 marks.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('If all players have opened a target, it becomes closed for all players.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('A player can earn points by hitting their open targets. Points are rewarded based on the number of the target, double and triple multipliers apply.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('No points are rewarded for hits to closed targets.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('The game ends when all targets have been closed. The player with the most points wins.')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Variations:')
							])),
						A2(
						$elm$html$Html$p,
						_List_Nil,
						_List_fromArray(
							[
								$elm$html$Html$text('Golf : Gameplay is the same, but any points a player earns during a turn are given to all other players who have not yet opened the target. Once all targets are closed the player with the least points wins.')
							]))
					]));
	}
};
var $author$project$Types$GameSelected = function (a) {
	return {$: 'GameSelected', a: a};
};
var $author$project$Main$game_list = _List_fromArray(
	[
		$author$project$Types$NoGame,
		A5($author$project$Types$Numbers301, $author$project$Types$BasicIn, $author$project$Types$BasicOut, 0, _List_Nil, _List_Nil),
		A5($author$project$Types$Numbers501, $author$project$Types$BasicIn, $author$project$Types$BasicOut, 0, _List_Nil, _List_Nil),
		A5($author$project$Types$Numbers701, $author$project$Types$BasicIn, $author$project$Types$BasicOut, 0, _List_Nil, _List_Nil),
		A4($author$project$Types$Cricket, $author$project$Types$BasicCricket, 0, _List_Nil, _List_Nil),
		A5(
		$author$project$Types$Baseball,
		$author$project$Types$BasicBaseball,
		0,
		_List_Nil,
		$author$project$Types$Inning(0),
		_List_Nil),
		A4($author$project$Types$AroundTheClock, $author$project$Types$NoBullOut, 0, _List_Nil, _List_Nil),
		A4($author$project$Types$AroundTheClock180, $author$project$Types$DoubleBonus, 0, _List_Nil, _List_Nil),
		A4($author$project$Types$ChaseTheDragon, $author$project$Types$BasicDragon, 0, _List_Nil, _List_Nil)
	]);
var $author$project$Types$Dom$game_to_id = function (mode) {
	switch (mode.$) {
		case 'NoGame':
			return 'NGM';
		case 'Numbers301':
			switch (mode.a.$) {
				case 'BasicIn':
					switch (mode.b.$) {
						case 'BasicOut':
							var _v1 = mode.a;
							var _v2 = mode.b;
							return '301:BI:BO';
						case 'DoubleOut':
							var _v3 = mode.a;
							var _v4 = mode.b;
							return '301:BI:DO';
						default:
							var _v5 = mode.a;
							var _v6 = mode.b;
							return '301:BI:TO';
					}
				case 'DoubleIn':
					switch (mode.b.$) {
						case 'BasicOut':
							var _v7 = mode.a;
							var _v8 = mode.b;
							return '301:DI:BO';
						case 'DoubleOut':
							var _v9 = mode.a;
							var _v10 = mode.b;
							return '301:DI:DO';
						default:
							var _v11 = mode.a;
							var _v12 = mode.b;
							return '301:DI:TO';
					}
				default:
					switch (mode.b.$) {
						case 'BasicOut':
							var _v13 = mode.a;
							var _v14 = mode.b;
							return '301:TI:BO';
						case 'DoubleOut':
							var _v15 = mode.a;
							var _v16 = mode.b;
							return '301:TI:DO';
						default:
							var _v17 = mode.a;
							var _v18 = mode.b;
							return '301:TI:TO';
					}
			}
		case 'Numbers501':
			switch (mode.a.$) {
				case 'BasicIn':
					switch (mode.b.$) {
						case 'BasicOut':
							var _v19 = mode.a;
							var _v20 = mode.b;
							return '501:BI:BO';
						case 'DoubleOut':
							var _v21 = mode.a;
							var _v22 = mode.b;
							return '501:BI:DO';
						default:
							var _v23 = mode.a;
							var _v24 = mode.b;
							return '501:BI:TO';
					}
				case 'DoubleIn':
					switch (mode.b.$) {
						case 'BasicOut':
							var _v25 = mode.a;
							var _v26 = mode.b;
							return '501:DI:BO';
						case 'DoubleOut':
							var _v27 = mode.a;
							var _v28 = mode.b;
							return '501:DI:DO';
						default:
							var _v29 = mode.a;
							var _v30 = mode.b;
							return '501:DI:TO';
					}
				default:
					switch (mode.b.$) {
						case 'BasicOut':
							var _v31 = mode.a;
							var _v32 = mode.b;
							return '501:TI:BO';
						case 'DoubleOut':
							var _v33 = mode.a;
							var _v34 = mode.b;
							return '501:TI:DO';
						default:
							var _v35 = mode.a;
							var _v36 = mode.b;
							return '501:TI:TO';
					}
			}
		case 'Numbers701':
			switch (mode.a.$) {
				case 'BasicIn':
					switch (mode.b.$) {
						case 'BasicOut':
							var _v37 = mode.a;
							var _v38 = mode.b;
							return '701:BI:BO';
						case 'DoubleOut':
							var _v39 = mode.a;
							var _v40 = mode.b;
							return '701:BI:DO';
						default:
							var _v41 = mode.a;
							var _v42 = mode.b;
							return '701:BI:TO';
					}
				case 'DoubleIn':
					switch (mode.b.$) {
						case 'BasicOut':
							var _v43 = mode.a;
							var _v44 = mode.b;
							return '701:DI:BO';
						case 'DoubleOut':
							var _v45 = mode.a;
							var _v46 = mode.b;
							return '701:DI:DO';
						default:
							var _v47 = mode.a;
							var _v48 = mode.b;
							return '701:DI:TO';
					}
				default:
					switch (mode.b.$) {
						case 'BasicOut':
							var _v49 = mode.a;
							var _v50 = mode.b;
							return '701:TI:BO';
						case 'DoubleOut':
							var _v51 = mode.a;
							var _v52 = mode.b;
							return '701:TI:DO';
						default:
							var _v53 = mode.a;
							var _v54 = mode.b;
							return '701:TI:TO';
					}
			}
		case 'Cricket':
			if (mode.a.$ === 'BasicCricket') {
				var _v55 = mode.a;
				return 'CKT:B';
			} else {
				var _v56 = mode.a;
				return 'CKT:G';
			}
		case 'Baseball':
			if (mode.a.$ === 'BasicBaseball') {
				var _v57 = mode.a;
				return 'BBL:B';
			} else {
				var _v58 = mode.a;
				return 'BBL:S';
			}
		case 'AroundTheClock':
			switch (mode.a.$) {
				case 'NoBullOut':
					var _v59 = mode.a;
					return 'ATC:NBO';
				case 'AnyBullOut':
					var _v60 = mode.a;
					return 'ATC:ABO';
				default:
					var _v61 = mode.a;
					return 'ATC:SBO';
			}
		case 'AroundTheClock180':
			if (mode.a.$ === 'DoubleBonus') {
				var _v62 = mode.a;
				return '180:DB';
			} else {
				var _v63 = mode.a;
				return '180:TB';
			}
		default:
			if (mode.a.$ === 'BasicDragon') {
				var _v64 = mode.a;
				return 'CTD:BD';
			} else {
				var _v65 = mode.a;
				return 'CTD:TD';
			}
	}
};
var $elm$html$Html$option = _VirtualDom_node('option');
var $elm$html$Html$Attributes$boolProperty = F2(
	function (key, bool) {
		return A2(
			_VirtualDom_property,
			key,
			$elm$json$Json$Encode$bool(bool));
	});
var $elm$html$Html$Attributes$selected = $elm$html$Html$Attributes$boolProperty('selected');
var $author$project$Types$Dom$game_to_option = F2(
	function (current, mode) {
		var shallow_eq = F2(
			function (c, m) {
				return _Utils_eq(
					$elm$core$List$head(
						A2($elm$core$String$split, ':', c)),
					$elm$core$List$head(
						A2($elm$core$String$split, ':', m)));
			});
		var is_selected = A2(
			shallow_eq,
			$author$project$Types$Dom$game_to_id(current),
			$author$project$Types$Dom$game_to_id(mode)) ? _List_fromArray(
			[
				$elm$html$Html$Attributes$selected(true)
			]) : _List_Nil;
		switch (mode.$) {
			case 'NoGame':
				return A2(
					$elm$html$Html$option,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$value(
								$author$project$Types$Dom$game_to_id(mode))
							]),
						is_selected),
					_List_fromArray(
						[
							$elm$html$Html$text('Select a Game')
						]));
			case 'Numbers701':
				return A2(
					$elm$html$Html$option,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$value(
								$author$project$Types$Dom$game_to_id(mode))
							]),
						is_selected),
					_List_fromArray(
						[
							$elm$html$Html$text('701')
						]));
			case 'Numbers501':
				return A2(
					$elm$html$Html$option,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$value(
								$author$project$Types$Dom$game_to_id(mode))
							]),
						is_selected),
					_List_fromArray(
						[
							$elm$html$Html$text('501')
						]));
			case 'Numbers301':
				return A2(
					$elm$html$Html$option,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$value(
								$author$project$Types$Dom$game_to_id(mode))
							]),
						is_selected),
					_List_fromArray(
						[
							$elm$html$Html$text('301')
						]));
			case 'AroundTheClock':
				return A2(
					$elm$html$Html$option,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$value(
								$author$project$Types$Dom$game_to_id(mode))
							]),
						is_selected),
					_List_fromArray(
						[
							$elm$html$Html$text('Around the Clock')
						]));
			case 'AroundTheClock180':
				return A2(
					$elm$html$Html$option,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$value(
								$author$project$Types$Dom$game_to_id(mode))
							]),
						is_selected),
					_List_fromArray(
						[
							$elm$html$Html$text('Around the Clock 180')
						]));
			case 'Baseball':
				return A2(
					$elm$html$Html$option,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$value(
								$author$project$Types$Dom$game_to_id(mode))
							]),
						is_selected),
					_List_fromArray(
						[
							$elm$html$Html$text('Baseball')
						]));
			case 'ChaseTheDragon':
				return A2(
					$elm$html$Html$option,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$value(
								$author$project$Types$Dom$game_to_id(mode))
							]),
						is_selected),
					_List_fromArray(
						[
							$elm$html$Html$text('Chase the Dragon')
						]));
			default:
				return A2(
					$elm$html$Html$option,
					_Utils_ap(
						_List_fromArray(
							[
								$elm$html$Html$Attributes$value(
								$author$project$Types$Dom$game_to_id(mode))
							]),
						is_selected),
					_List_fromArray(
						[
							$elm$html$Html$text('Cricket')
						]));
		}
	});
var $author$project$Types$Dom$id_to_game = function (s) {
	switch (s) {
		case '301:BI:BO':
			return A5($author$project$Types$Numbers301, $author$project$Types$BasicIn, $author$project$Types$BasicOut, 0, _List_Nil, _List_Nil);
		case '301:BI:DO':
			return A5($author$project$Types$Numbers301, $author$project$Types$BasicIn, $author$project$Types$DoubleOut, 0, _List_Nil, _List_Nil);
		case '301:BI:TO':
			return A5($author$project$Types$Numbers301, $author$project$Types$BasicIn, $author$project$Types$TripleOut, 0, _List_Nil, _List_Nil);
		case '301:DI:BO':
			return A5($author$project$Types$Numbers301, $author$project$Types$DoubleIn, $author$project$Types$BasicOut, 0, _List_Nil, _List_Nil);
		case '301:DI:DO':
			return A5($author$project$Types$Numbers301, $author$project$Types$DoubleIn, $author$project$Types$DoubleOut, 0, _List_Nil, _List_Nil);
		case '301:DI:TO':
			return A5($author$project$Types$Numbers301, $author$project$Types$DoubleIn, $author$project$Types$TripleOut, 0, _List_Nil, _List_Nil);
		case '301:TI:BO':
			return A5($author$project$Types$Numbers301, $author$project$Types$TripleIn, $author$project$Types$BasicOut, 0, _List_Nil, _List_Nil);
		case '301:TI:DO':
			return A5($author$project$Types$Numbers301, $author$project$Types$TripleIn, $author$project$Types$DoubleOut, 0, _List_Nil, _List_Nil);
		case '301:TI:TO':
			return A5($author$project$Types$Numbers301, $author$project$Types$TripleIn, $author$project$Types$TripleOut, 0, _List_Nil, _List_Nil);
		case '501:BI:BO':
			return A5($author$project$Types$Numbers501, $author$project$Types$BasicIn, $author$project$Types$BasicOut, 0, _List_Nil, _List_Nil);
		case '501:BI:DO':
			return A5($author$project$Types$Numbers501, $author$project$Types$BasicIn, $author$project$Types$DoubleOut, 0, _List_Nil, _List_Nil);
		case '501:BI:TO':
			return A5($author$project$Types$Numbers501, $author$project$Types$BasicIn, $author$project$Types$TripleOut, 0, _List_Nil, _List_Nil);
		case '501:DI:BO':
			return A5($author$project$Types$Numbers501, $author$project$Types$DoubleIn, $author$project$Types$BasicOut, 0, _List_Nil, _List_Nil);
		case '501:DI:DO':
			return A5($author$project$Types$Numbers501, $author$project$Types$DoubleIn, $author$project$Types$DoubleOut, 0, _List_Nil, _List_Nil);
		case '501:DI:TO':
			return A5($author$project$Types$Numbers501, $author$project$Types$DoubleIn, $author$project$Types$TripleOut, 0, _List_Nil, _List_Nil);
		case '501:TI:BO':
			return A5($author$project$Types$Numbers501, $author$project$Types$TripleIn, $author$project$Types$BasicOut, 0, _List_Nil, _List_Nil);
		case '501:TI:DO':
			return A5($author$project$Types$Numbers501, $author$project$Types$TripleIn, $author$project$Types$DoubleOut, 0, _List_Nil, _List_Nil);
		case '501:TI:TO':
			return A5($author$project$Types$Numbers501, $author$project$Types$TripleIn, $author$project$Types$TripleOut, 0, _List_Nil, _List_Nil);
		case '701:BI:BO':
			return A5($author$project$Types$Numbers701, $author$project$Types$BasicIn, $author$project$Types$BasicOut, 0, _List_Nil, _List_Nil);
		case '701:BI:DO':
			return A5($author$project$Types$Numbers701, $author$project$Types$BasicIn, $author$project$Types$DoubleOut, 0, _List_Nil, _List_Nil);
		case '701:BI:TO':
			return A5($author$project$Types$Numbers701, $author$project$Types$BasicIn, $author$project$Types$TripleOut, 0, _List_Nil, _List_Nil);
		case '701:DI:BO':
			return A5($author$project$Types$Numbers701, $author$project$Types$DoubleIn, $author$project$Types$BasicOut, 0, _List_Nil, _List_Nil);
		case '701:DI:DO':
			return A5($author$project$Types$Numbers701, $author$project$Types$DoubleIn, $author$project$Types$DoubleOut, 0, _List_Nil, _List_Nil);
		case '701:DI:TO':
			return A5($author$project$Types$Numbers701, $author$project$Types$DoubleIn, $author$project$Types$TripleOut, 0, _List_Nil, _List_Nil);
		case '701:TI:BO':
			return A5($author$project$Types$Numbers701, $author$project$Types$TripleIn, $author$project$Types$BasicOut, 0, _List_Nil, _List_Nil);
		case '701:TI:DO':
			return A5($author$project$Types$Numbers701, $author$project$Types$TripleIn, $author$project$Types$DoubleOut, 0, _List_Nil, _List_Nil);
		case '701:TI:TO':
			return A5($author$project$Types$Numbers701, $author$project$Types$TripleIn, $author$project$Types$TripleOut, 0, _List_Nil, _List_Nil);
		case 'CKT:B':
			return A4($author$project$Types$Cricket, $author$project$Types$BasicCricket, 0, _List_Nil, _List_Nil);
		case 'CKT:G':
			return A4($author$project$Types$Cricket, $author$project$Types$GolfCricket, 0, _List_Nil, _List_Nil);
		case 'BBL:B':
			return A5(
				$author$project$Types$Baseball,
				$author$project$Types$BasicBaseball,
				0,
				_List_Nil,
				$author$project$Types$Inning(1),
				_List_Nil);
		case 'BBL:S':
			return A5(
				$author$project$Types$Baseball,
				$author$project$Types$SeventhInningCatch,
				0,
				_List_Nil,
				$author$project$Types$Inning(1),
				_List_Nil);
		case 'ATC:NBO':
			return A4($author$project$Types$AroundTheClock, $author$project$Types$NoBullOut, 0, _List_Nil, _List_Nil);
		case 'ATC:ABO':
			return A4($author$project$Types$AroundTheClock, $author$project$Types$AnyBullOut, 0, _List_Nil, _List_Nil);
		case 'ATC:SBO':
			return A4($author$project$Types$AroundTheClock, $author$project$Types$SplitBullOut, 0, _List_Nil, _List_Nil);
		case '180:DB':
			return A4($author$project$Types$AroundTheClock180, $author$project$Types$DoubleBonus, 0, _List_Nil, _List_Nil);
		case '180:TB':
			return A4($author$project$Types$AroundTheClock180, $author$project$Types$TripleBonus, 0, _List_Nil, _List_Nil);
		case 'CTD:BD':
			return A4($author$project$Types$ChaseTheDragon, $author$project$Types$BasicDragon, 0, _List_Nil, _List_Nil);
		case 'CTD:TD':
			return A4($author$project$Types$ChaseTheDragon, $author$project$Types$TripleHeadedDragon, 0, _List_Nil, _List_Nil);
		default:
			return $author$project$Types$NoGame;
	}
};
var $elm$html$Html$select = _VirtualDom_node('select');
var $author$project$Main$mode_selector = function (mode) {
	return _List_fromArray(
		[
			A2(
			$elm$html$Html$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$elm$html$Html$select,
					_List_fromArray(
						[
							$elm$html$Html$Events$onInput(
							A2($elm$core$Basics$composeL, $author$project$Types$GameSelected, $author$project$Types$Dom$id_to_game)),
							$elm$html$Html$Attributes$class('custom-select')
						]),
					A2(
						$elm$core$List$map,
						$author$project$Types$Dom$game_to_option(mode),
						$author$project$Main$game_list))
				]))
		]);
};
var $author$project$Main$variant_selector = function (mode) {
	var is_selected = F2(
		function (a, b) {
			return _Utils_eq(a, b) ? _List_fromArray(
				[
					$elm$html$Html$Attributes$selected(true)
				]) : _List_Nil;
		});
	switch (mode.$) {
		case 'NoGame':
			return _List_Nil;
		case 'Numbers301':
			var vi = mode.a;
			var vo = mode.b;
			var x = mode.c;
			var y = mode.d;
			var z = mode.e;
			return _List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('In Rule')
								])),
							A2(
							$elm$html$Html$select,
							_List_fromArray(
								[
									$elm$html$Html$Events$onInput(
									A2($elm$core$Basics$composeL, $author$project$Types$GameSelected, $author$project$Types$Dom$id_to_game)),
									$elm$html$Html$Attributes$class('custom-select')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A5($author$project$Types$Numbers301, $author$project$Types$BasicIn, vo, x, y, z)))
											]),
										A2(is_selected, vi, $author$project$Types$BasicIn)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$numbers_variation_in_text($author$project$Types$BasicIn))
										])),
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A5($author$project$Types$Numbers301, $author$project$Types$DoubleIn, vo, x, y, z)))
											]),
										A2(is_selected, vi, $author$project$Types$DoubleIn)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$numbers_variation_in_text($author$project$Types$DoubleIn))
										])),
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A5($author$project$Types$Numbers301, $author$project$Types$TripleIn, vo, x, y, z)))
											]),
										A2(is_selected, vi, $author$project$Types$TripleIn)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$numbers_variation_in_text($author$project$Types$TripleIn))
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Out Rule')
								])),
							A2(
							$elm$html$Html$select,
							_List_fromArray(
								[
									$elm$html$Html$Events$onInput(
									A2($elm$core$Basics$composeL, $author$project$Types$GameSelected, $author$project$Types$Dom$id_to_game)),
									$elm$html$Html$Attributes$class('custom-select')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A5($author$project$Types$Numbers301, vi, $author$project$Types$BasicOut, x, y, z)))
											]),
										A2(is_selected, vo, $author$project$Types$BasicOut)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$numbers_variation_out_text($author$project$Types$BasicOut))
										])),
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A5($author$project$Types$Numbers301, vi, $author$project$Types$DoubleOut, x, y, z)))
											]),
										A2(is_selected, vo, $author$project$Types$DoubleOut)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$numbers_variation_out_text($author$project$Types$DoubleOut))
										])),
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A5($author$project$Types$Numbers301, vi, $author$project$Types$TripleOut, x, y, z)))
											]),
										A2(is_selected, vo, $author$project$Types$TripleOut)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$numbers_variation_out_text($author$project$Types$TripleOut))
										]))
								]))
						]))
				]);
		case 'Numbers501':
			var vi = mode.a;
			var vo = mode.b;
			var x = mode.c;
			var y = mode.d;
			var z = mode.e;
			return _List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('In Rule')
								])),
							A2(
							$elm$html$Html$select,
							_List_fromArray(
								[
									$elm$html$Html$Events$onInput(
									A2($elm$core$Basics$composeL, $author$project$Types$GameSelected, $author$project$Types$Dom$id_to_game)),
									$elm$html$Html$Attributes$class('custom-select')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A5($author$project$Types$Numbers501, $author$project$Types$BasicIn, vo, x, y, z)))
											]),
										A2(is_selected, vi, $author$project$Types$BasicIn)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$numbers_variation_in_text($author$project$Types$BasicIn))
										])),
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A5($author$project$Types$Numbers501, $author$project$Types$DoubleIn, vo, x, y, z)))
											]),
										A2(is_selected, vi, $author$project$Types$DoubleIn)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$numbers_variation_in_text($author$project$Types$DoubleIn))
										])),
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A5($author$project$Types$Numbers501, $author$project$Types$TripleIn, vo, x, y, z)))
											]),
										A2(is_selected, vi, $author$project$Types$TripleIn)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$numbers_variation_in_text($author$project$Types$TripleIn))
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Out Rule')
								])),
							A2(
							$elm$html$Html$select,
							_List_fromArray(
								[
									$elm$html$Html$Events$onInput(
									A2($elm$core$Basics$composeL, $author$project$Types$GameSelected, $author$project$Types$Dom$id_to_game)),
									$elm$html$Html$Attributes$class('custom-select')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A5($author$project$Types$Numbers501, vi, $author$project$Types$BasicOut, x, y, z)))
											]),
										A2(is_selected, vo, $author$project$Types$BasicOut)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$numbers_variation_out_text($author$project$Types$BasicOut))
										])),
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A5($author$project$Types$Numbers501, vi, $author$project$Types$DoubleOut, x, y, z)))
											]),
										A2(is_selected, vo, $author$project$Types$DoubleOut)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$numbers_variation_out_text($author$project$Types$DoubleOut))
										])),
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A5($author$project$Types$Numbers501, vi, $author$project$Types$TripleOut, x, y, z)))
											]),
										A2(is_selected, vo, $author$project$Types$TripleOut)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$numbers_variation_out_text($author$project$Types$TripleOut))
										]))
								]))
						]))
				]);
		case 'Numbers701':
			var vi = mode.a;
			var vo = mode.b;
			var x = mode.c;
			var y = mode.d;
			var z = mode.e;
			return _List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('In Rule')
								])),
							A2(
							$elm$html$Html$select,
							_List_fromArray(
								[
									$elm$html$Html$Events$onInput(
									A2($elm$core$Basics$composeL, $author$project$Types$GameSelected, $author$project$Types$Dom$id_to_game)),
									$elm$html$Html$Attributes$class('custom-select')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A5($author$project$Types$Numbers701, $author$project$Types$BasicIn, vo, x, y, z)))
											]),
										A2(is_selected, vi, $author$project$Types$BasicIn)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$numbers_variation_in_text($author$project$Types$BasicIn))
										])),
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A5($author$project$Types$Numbers701, $author$project$Types$DoubleIn, vo, x, y, z)))
											]),
										A2(is_selected, vi, $author$project$Types$DoubleIn)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$numbers_variation_in_text($author$project$Types$DoubleIn))
										])),
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A5($author$project$Types$Numbers701, $author$project$Types$TripleIn, vo, x, y, z)))
											]),
										A2(is_selected, vi, $author$project$Types$TripleIn)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$numbers_variation_in_text($author$project$Types$TripleIn))
										]))
								]))
						])),
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Out Rule')
								])),
							A2(
							$elm$html$Html$select,
							_List_fromArray(
								[
									$elm$html$Html$Events$onInput(
									A2($elm$core$Basics$composeL, $author$project$Types$GameSelected, $author$project$Types$Dom$id_to_game)),
									$elm$html$Html$Attributes$class('custom-select')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A5($author$project$Types$Numbers701, vi, $author$project$Types$BasicOut, x, y, z)))
											]),
										A2(is_selected, vo, $author$project$Types$BasicOut)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$numbers_variation_out_text($author$project$Types$BasicOut))
										])),
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A5($author$project$Types$Numbers701, vi, $author$project$Types$DoubleOut, x, y, z)))
											]),
										A2(is_selected, vo, $author$project$Types$DoubleOut)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$numbers_variation_out_text($author$project$Types$DoubleOut))
										])),
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A5($author$project$Types$Numbers701, vi, $author$project$Types$TripleOut, x, y, z)))
											]),
										A2(is_selected, vo, $author$project$Types$TripleOut)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$numbers_variation_out_text($author$project$Types$TripleOut))
										]))
								]))
						]))
				]);
		case 'AroundTheClock':
			var v = mode.a;
			var x = mode.b;
			var y = mode.c;
			var z = mode.d;
			return _List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Variation')
								])),
							A2(
							$elm$html$Html$select,
							_List_fromArray(
								[
									$elm$html$Html$Events$onInput(
									A2($elm$core$Basics$composeL, $author$project$Types$GameSelected, $author$project$Types$Dom$id_to_game)),
									$elm$html$Html$Attributes$class('custom-select')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A4($author$project$Types$AroundTheClock, $author$project$Types$NoBullOut, x, y, z)))
											]),
										A2(is_selected, v, $author$project$Types$NoBullOut)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$around_the_clock_variation_text($author$project$Types$NoBullOut))
										])),
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A4($author$project$Types$AroundTheClock, $author$project$Types$AnyBullOut, x, y, z)))
											]),
										A2(is_selected, v, $author$project$Types$AnyBullOut)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$around_the_clock_variation_text($author$project$Types$AnyBullOut))
										])),
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A4($author$project$Types$AroundTheClock, $author$project$Types$SplitBullOut, x, y, z)))
											]),
										A2(is_selected, v, $author$project$Types$SplitBullOut)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$around_the_clock_variation_text($author$project$Types$SplitBullOut))
										]))
								]))
						]))
				]);
		case 'AroundTheClock180':
			var v = mode.a;
			var x = mode.b;
			var y = mode.c;
			var z = mode.d;
			return _List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Variation')
								])),
							A2(
							$elm$html$Html$select,
							_List_fromArray(
								[
									$elm$html$Html$Events$onInput(
									A2($elm$core$Basics$composeL, $author$project$Types$GameSelected, $author$project$Types$Dom$id_to_game)),
									$elm$html$Html$Attributes$class('custom-select')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A4($author$project$Types$AroundTheClock180, $author$project$Types$DoubleBonus, x, y, z)))
											]),
										A2(is_selected, v, $author$project$Types$DoubleBonus)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$around_the_clock_180_variation_text($author$project$Types$DoubleBonus))
										])),
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A4($author$project$Types$AroundTheClock180, $author$project$Types$TripleBonus, x, y, z)))
											]),
										A2(is_selected, v, $author$project$Types$TripleBonus)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$around_the_clock_180_variation_text($author$project$Types$TripleBonus))
										]))
								]))
						]))
				]);
		case 'Baseball':
			var v = mode.a;
			var w = mode.b;
			var x = mode.c;
			var y = mode.d;
			var z = mode.e;
			return _List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Variation')
								])),
							A2(
							$elm$html$Html$select,
							_List_fromArray(
								[
									$elm$html$Html$Events$onInput(
									A2($elm$core$Basics$composeL, $author$project$Types$GameSelected, $author$project$Types$Dom$id_to_game)),
									$elm$html$Html$Attributes$class('custom-select')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A5($author$project$Types$Baseball, $author$project$Types$BasicBaseball, w, x, y, z)))
											]),
										A2(is_selected, v, $author$project$Types$BasicBaseball)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$baseball_variation_text($author$project$Types$BasicBaseball))
										])),
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A5($author$project$Types$Baseball, $author$project$Types$SeventhInningCatch, w, x, y, z)))
											]),
										A2(is_selected, v, $author$project$Types$SeventhInningCatch)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$baseball_variation_text($author$project$Types$SeventhInningCatch))
										]))
								]))
						]))
				]);
		case 'ChaseTheDragon':
			var v = mode.a;
			var x = mode.b;
			var y = mode.c;
			var z = mode.d;
			return _List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Variation')
								])),
							A2(
							$elm$html$Html$select,
							_List_fromArray(
								[
									$elm$html$Html$Events$onInput(
									A2($elm$core$Basics$composeL, $author$project$Types$GameSelected, $author$project$Types$Dom$id_to_game)),
									$elm$html$Html$Attributes$class('custom-select')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A4($author$project$Types$ChaseTheDragon, $author$project$Types$BasicDragon, x, y, z)))
											]),
										A2(is_selected, v, $author$project$Types$BasicDragon)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$dragon_variation_text($author$project$Types$BasicDragon))
										])),
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A4($author$project$Types$ChaseTheDragon, $author$project$Types$TripleHeadedDragon, x, y, z)))
											]),
										A2(is_selected, v, $author$project$Types$TripleHeadedDragon)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$dragon_variation_text($author$project$Types$TripleHeadedDragon))
										]))
								]))
						]))
				]);
		default:
			var v = mode.a;
			var x = mode.b;
			var y = mode.c;
			var z = mode.d;
			return _List_fromArray(
				[
					A2(
					$elm$html$Html$div,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$elm$html$Html$div,
							_List_Nil,
							_List_fromArray(
								[
									$elm$html$Html$text('Variation')
								])),
							A2(
							$elm$html$Html$select,
							_List_fromArray(
								[
									$elm$html$Html$Events$onInput(
									A2($elm$core$Basics$composeL, $author$project$Types$GameSelected, $author$project$Types$Dom$id_to_game)),
									$elm$html$Html$Attributes$class('custom-select')
								]),
							_List_fromArray(
								[
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A4($author$project$Types$Cricket, $author$project$Types$BasicCricket, x, y, z)))
											]),
										A2(is_selected, v, $author$project$Types$BasicCricket)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$cricket_variation_text($author$project$Types$BasicCricket))
										])),
									A2(
									$elm$html$Html$option,
									_Utils_ap(
										_List_fromArray(
											[
												$elm$html$Html$Attributes$value(
												$author$project$Types$Dom$game_to_id(
													A4($author$project$Types$Cricket, $author$project$Types$GolfCricket, x, y, z)))
											]),
										A2(is_selected, v, $author$project$Types$GolfCricket)),
									_List_fromArray(
										[
											$elm$html$Html$text(
											$author$project$Types$Text$cricket_variation_text($author$project$Types$GolfCricket))
										]))
								]))
						]))
				]);
	}
};
var $author$project$Main$render_select_game = function (mode) {
	return _Utils_ap(
		_List_fromArray(
			[
				A2(
				$elm$html$Html$ul,
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('nav bg-primary text-white')
					]),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$li,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('nav-item')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Types$GoHome),
										$elm$html$Html$Attributes$class('nav-link')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Home')
									]))
							])),
						A2(
						$elm$html$Html$li,
						_List_fromArray(
							[
								$elm$html$Html$Attributes$class('nav-item')
							]),
						_List_fromArray(
							[
								A2(
								$elm$html$Html$a,
								_List_fromArray(
									[
										$elm$html$Html$Events$onClick($author$project$Types$GoEditPlayers),
										$elm$html$Html$Attributes$class('nav-link')
									]),
								_List_fromArray(
									[
										$elm$html$Html$text('Edit Players')
									]))
							]))
					])),
				A2(
				$elm$html$Html$div,
				_List_Nil,
				_List_fromArray(
					[
						$elm$html$Html$text('Selected Game: '),
						$author$project$Types$Dom$game_name(mode)
					]))
			]),
		_Utils_ap(
			$author$project$Main$mode_selector(mode),
			_Utils_ap(
				$author$project$Main$variant_selector(mode),
				_List_fromArray(
					[
						A2(
						$elm$html$Html$div,
						_List_Nil,
						_List_fromArray(
							[
								$author$project$Types$Dom$game_description(mode)
							]))
					]))));
};
var $author$project$Main$view = function (state) {
	var block_scroll = function (modal) {
		if (modal.$ === 'Just') {
			return $elm$html$Html$div(
				_List_fromArray(
					[
						$elm$html$Html$Attributes$class('modal-open')
					]));
		} else {
			return $elm$html$Html$div(_List_Nil);
		}
	};
	var render = function () {
		var _v0 = state.screen;
		switch (_v0.$) {
			case 'Home':
				return A2(
					$elm$html$Html$div,
					_List_Nil,
					$author$project$Main$render_home(state));
			case 'EditPlayers':
				var np = _v0.a;
				var ni = _v0.b;
				return A2(
					$elm$html$Html$div,
					_List_Nil,
					A3($author$project$Main$render_edit_players, state, np, ni));
			case 'SelectGame':
				return A2(
					$elm$html$Html$div,
					_List_Nil,
					$author$project$Main$render_select_game(state.game));
			default:
				var modal = _v0.a;
				return A2(
					block_scroll,
					modal,
					A2($author$project$Main$render_game, state, modal));
		}
	}();
	return render;
};
var $author$project$Main$main = $elm$browser$Browser$element(
	{
		init: $author$project$Main$init,
		subscriptions: function (_v0) {
			return $elm$core$Platform$Sub$none;
		},
		update: $author$project$Main$update,
		view: $author$project$Main$view
	});
_Platform_export({'Main':{'init':$author$project$Main$main($elm$json$Json$Decode$value)(0)}});}(this));