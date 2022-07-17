String.prototype.hexDecode = function(){
    var j;
    var hexes = this.match(/.{1,4}/g) || [];
    var back = "";
    for(j = 0; j<hexes.length; j++) {
        back += String.fromCharCode(parseInt(hexes[j], 16));
    }

    return back;
}

String.prototype.hexEncode = function(){
    var hex, i;

    var result = "";
    for (i=0; i<this.length; i++) {
        hex = this.charCodeAt(i).toString(16);
        result += ("000"+hex).slice(-4);
    }

    return result
}

const zero = '(+![])';
const one = '(+!![])';

const number = n => {
    if (n == 0) return zero;
    if (n < 10) {
        return Array.from({length: n}, () => one).join('+');
    }

    n = n + [];
    return `+(${Array.from(n).map(l => `[${number(l)}]`).join('+')})`;
}

map = {}
map.f = `(![]+[])[${number(0)}]`;
map.a = `(![]+[])[${number(1)}]`;
map.l = `(![]+[])[${number(2)}]`;
map.s = `(![]+[])[${number(3)}]`;
map.t = `(!![]+[])[${number(0)}]`;
map.r = `(!![]+[])[${number(1)}]`;
map.e = `(!![]+[])[${number(3)}]`;
map.u = `(([][[]])+[])[${number(0)}]`;
map.n = `(([][[]])+[])[${number(1)}]`;
map.d = `(([][[]])+[])[${number(2)}]`;
map.i = `(([][[]])+[])[${number(5)}]`;
map.n = `(([][[]])+[])[${number(6)}]`;
map.d = `(([][[]])+[])[${number(8)}]`;

fill = `(([][(${map.f})+(${map.i})+(${map.l})+(${map.l})])+[])`;

map.c = `${fill}[${number(3)}]`;
map.o = `${fill}[${number(6)}]`;
map[" "] = `${fill}[${number(8)}]`;
map["("] = `${fill}[${number(13)}]`;
map[")"] = `${fill}[${number(14)}]`;
map["{"] = `${fill}[${number(16)}]`;
map["}"] = `${fill}[${number(36)}]`;
map["["] = `${fill}[${number(22)}]`;
map["]"] = `${fill}[${number(34)}]`;

const nonFullToString = (s) => {
    return Array.from(s).map(l => {
        if (map[l] === undefined) {
            console.log(`missing ${l}`)
            return '';
        }
        return map[l];
    }).join('+');
}

constructor = nonFullToString('constructor');

map["S"] = `(([]+[])[${constructor}]+[])[${number(9)}]`;
map.g = `(([]+[])[${constructor}]+[])[${number(14)}]`;

toStr = nonFullToString('toString');

const letter = (l) => {
    if (map[l] !== undefined) {
        return map[l];
    }

    if (l >= 0 && l <= 9) {
        return `(${number(l)}+[])`;
    }

    if (l >= 'a' && l <= 'z') {
        let n = l.charCodeAt(0);
        n -= 87;
        return `(${n})[${toStr}](${number(36)})`;
    }

    try {
        return anyUnicode(l);
    } catch(e) {
        console.log(`Missing ${l}`);
        return undefined;
    }
}

const str = (s) => Array.from(s).map(letter).join('+');

map["."] = `((+(${str("11e20")}))+[])[${number(1)}]`;
map["+"] = `((+(${str("1e100")}))+[])[${number(2)}]`;

const func = (s) => `[][${str("fill")}][${str("constructor")}](${str(s)})`;
const funcEval = (s) => `${func(s)}()`
const funcNoStr = (s) => `[][${str("fill")}][${str("constructor")}](${s})`;

const tryC = funcEval("try{String().normalize(false)}catch(f){return f}");

map["R"] = `(${tryC}+[])[${number(0)}]`;
map["E"] = `(${tryC}+[])[${number(5)}]`;

const regexConstr = funcEval("return RegExp");
map["/"] = `(${regexConstr}()+[])[${number(0)}]`;
map["\\"] = `(${regexConstr}(${letter("/")})+[])[${number(1)}]`;
map[","] = `[]+[[]][${str("concat")}]([[]])`;
map["F"] = `([][${str("fill")}][${str("constructor")}]+[])[${number(9)}]`;

const syntaxErr = funcEval(`try{Function([]+[[]].concat([[]]))}catch(f){return f}`);
map["'"] = `(${syntaxErr}+[])[${number(38)}]`;

const anyUnicode = (c) => `${funcEval("return '" + '\\' + `u${c.hexEncode()}'`)}`

const compile = (s) => funcEval(s);