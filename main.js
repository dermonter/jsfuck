const zero = '(+![])';
const one = '(+!![])';

const number = n => {
    if (n === 0) return zero;
    return Array.from({length: n}, () => one).join('+');
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
map["}"] = `${fill}[${number(32)}]`;
map["["] = `${fill}[${number(18)}]`;
map["]"] = `${fill}[${number(30)}]`;

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

    console.log(`Missing ${l}`);
    return undefined;
}

const str = (s) => Array.from(s).map(letter).join('+');

map["."] = `((+(${str("11e20")}))+[])[${number(1)}]`;

const func = (s) => `[][${str("fill")}][${str("constructor")}](${str(s)})`;
const funcEval = (s) => `${func(s)}()`
const funcNoStr = (s) => `[][${str("fill")}][${str("constructor")}](${s})`;

const tryC = funcEval("try{String().normalize(false)}catch(f){return f}");

map["R"] = `(${tryC}+[])[${number(0)}]`;
map["E"] = `(${tryC}+[])[${number(5)}]`;

const regexConstr = funcEval("return RegExp");
map["/"] = `(${regexConstr}()+[])[${number(0)}]`;
map["\\"] = `(${regexConstr}(${letter("/")})+[${number(1)}])`;
map[","] = `[]+[[]][${str("concat")}]([[]])`;

const syntaxErr = `${str("try{")}${funcNoStr(letter(","))}${str("}catch(f){return f}")}`;