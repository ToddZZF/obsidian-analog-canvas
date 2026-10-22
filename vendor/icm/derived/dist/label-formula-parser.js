// LaTeX read into the formula tree: tokens, commands and environments.
import { Unsupported, } from "./label-formula-nodes.js";
import { ACCENTS, BIG_DELIMITERS, ENVIRONMENTS, FUNCTIONS, GREEK, IGNORED, LARGE_OPERATORS, NEGATIONS, SPACES, STYLES, SYMBOLS, alphabetCharacter, } from "./label-formula-symbols.js";
function tokenize(latex) {
    const tokens = [];
    const chars = [...latex];
    for (let index = 0; index < chars.length; index += 1) {
        const char = chars[index];
        if (char !== "\\") {
            tokens.push(char);
            continue;
        }
        let name = "";
        while (index + 1 < chars.length && /[A-Za-z]/u.test(chars[index + 1]))
            name += chars[++index];
        if (!name && index + 1 < chars.length)
            name = chars[++index];
        tokens.push(`\\${name}`);
    }
    return tokens;
}
const NO_STOPS = new Set();
const RIGHT_STOPS = new Set(["\\right", "\\middle"]);
const INDEX_STOPS = new Set(["]"]);
const CELL_STOPS = new Set(["&", "\\\\", "\\end"]);
const OPENERS = new Set(["(", "[", "{", "⟨", "⌈", "⌊"]);
const CLOSERS = new Set([")", "]", "}", "⟩", "⌉", "⌋"]);
class Parser {
    tokens;
    index = 0;
    constructor(tokens) {
        this.tokens = tokens;
    }
    parse() {
        const nodes = this.list({}, NO_STOPS);
        if (this.index < this.tokens.length)
            throw new Unsupported("stray }");
        return nodes;
    }
    peek() {
        return this.tokens[this.index];
    }
    skipSpaces() {
        while (this.peek() === " ")
            this.index += 1;
    }
    /** Nodes up to a closing brace or one of `stops`, which the caller takes. */
    list(context, stops) {
        const nodes = [];
        while (this.index < this.tokens.length) {
            const token = this.peek();
            if (token === "}" || stops.has(token))
                return nodes;
            if (token === "^" || token === "_" || token === "'") {
                this.index += 1;
                this.script(nodes, token, context);
                continue;
            }
            if (token === "\\limits" || token === "\\nolimits") {
                this.index += 1;
                const last = nodes.at(-1);
                if (last && (last.kind === "atom" || last.kind === "group"))
                    last.limits = token === "\\limits";
                continue;
            }
            this.index += 1;
            nodes.push(...this.node(token, context));
        }
        return nodes;
    }
    /** One argument: a braced group, or the next single token. */
    argument(context) {
        this.skipSpaces();
        const next = this.peek();
        if (next === undefined)
            throw new Unsupported("missing argument");
        this.index += 1;
        if (next === "{") {
            const nodes = this.list(context, NO_STOPS);
            if (this.peek() !== "}")
                throw new Unsupported("unclosed argument");
            this.index += 1;
            return nodes;
        }
        return this.node(next, context);
    }
    /** A braced word: an environment's name or an array's column letters. */
    braced() {
        this.skipSpaces();
        if (this.peek() !== "{")
            throw new Unsupported("missing {");
        this.index += 1;
        let text = "";
        while (this.index < this.tokens.length && this.peek() !== "}")
            text += this.tokens[this.index++];
        if (this.peek() !== "}")
            throw new Unsupported("unclosed {");
        this.index += 1;
        return text;
    }
    /** A TeX length, in em of the current size. */
    length() {
        this.skipSpaces();
        const braced = this.peek() === "{";
        if (braced)
            this.index += 1;
        this.skipSpaces();
        let number = "";
        while (/^[-+0-9.]$/u.test(this.peek() ?? ""))
            number += this.tokens[this.index++];
        this.skipSpaces();
        let unit = "";
        while (unit.length < 2 && /^[a-z]$/u.test(this.peek() ?? ""))
            unit += this.tokens[this.index++];
        if (braced) {
            this.skipSpaces();
            if (this.peek() !== "}")
                throw new Unsupported("length");
            this.index += 1;
        }
        const perUnit = {
            em: 1,
            ex: 0.43,
            pt: 0.1,
            pc: 1.2,
            mu: 1 / 18,
            px: 1 / 16,
            mm: 0.2845,
            cm: 2.845,
            in: 7.227,
        };
        const value = Number(number);
        const per = perUnit[unit];
        if (!number || !Number.isFinite(value) || per === undefined)
            throw new Unsupported("length");
        return value * per;
    }
    script(nodes, token, context) {
        const last = nodes.at(-1);
        const target = last?.kind === "scripts" &&
            (token === "_" ? !last.sub : !last.sup || token === "'")
            ? last
            : { kind: "scripts", base: nodes.pop() ?? null };
        if (target !== last)
            nodes.push(target);
        if (token === "'") {
            target.sup = [
                ...(target.sup ?? []),
                { kind: "atom", text: "′", cls: "ord", font: "upright" },
            ];
            return;
        }
        // A subscript names, so its letters stand upright as a label's do.
        const nested = this.argument(token === "_" ? { ...context, upright: true } : context);
        if (token === "_")
            target.sub = nested;
        else
            target.sup = [...(target.sup ?? []), ...nested];
    }
    delimiter() {
        this.skipSpaces();
        const token = this.peek();
        if (token === undefined)
            throw new Unsupported("missing delimiter");
        this.index += 1;
        if (token === ".")
            return null;
        if (token === "\\{")
            return "{";
        if (token === "\\}")
            return "}";
        if (token === "\\|")
            return "‖";
        if (token.startsWith("\\")) {
            const symbol = SYMBOLS[token.slice(1)];
            if (!symbol)
                throw new Unsupported(token);
            return symbol[0];
        }
        return token;
    }
    node(token, context) {
        if (token === "{") {
            const children = this.list(context, NO_STOPS);
            if (this.peek() !== "}")
                throw new Unsupported("unclosed group");
            this.index += 1;
            return [{ kind: "group", children }];
        }
        if (token.startsWith("\\"))
            return this.command(token.slice(1), context);
        return atomsOf(token, context);
    }
    environment(context) {
        const name = this.braced();
        const spec = ENVIRONMENTS[name];
        if (!spec)
            throw new Unsupported(`\\begin{${name}}`);
        let align = spec.align === "rl" ? "rl" : spec.align === "spec" ? [] : [spec.align];
        if (spec.align === "spec") {
            align = [...this.braced()].filter((letter) => "lcr".includes(letter));
            if (align.length === 0)
                throw new Unsupported("array columns");
        }
        const rows = [];
        let row = [];
        for (;;) {
            row.push(this.list({ ...context, upright: false }, CELL_STOPS));
            const token = this.peek();
            this.index += 1;
            if (token === "&")
                continue;
            if (token === "\\\\") {
                // A row's optional extra space, \\[2pt], is not kept.
                this.skipSpaces();
                if (this.peek() === "[")
                    while (this.index < this.tokens.length &&
                        this.tokens[this.index++] !== "]")
                        ;
                rows.push(row);
                row = [];
                continue;
            }
            if (token === "\\end") {
                if (this.braced() !== name)
                    throw new Unsupported(`\\end{${name}}`);
                rows.push(row);
                break;
            }
            throw new Unsupported(`unclosed ${name}`);
        }
        // A final \\ leaves an empty last row.
        const last = rows.at(-1);
        if (rows.length > 1 && last?.length === 1 && last[0].length === 0)
            rows.pop();
        const array = {
            kind: "array",
            rows,
            align,
            cellStyle: spec.cellStyle,
            gaps: spec.gaps,
        };
        return spec.left || spec.right
            ? [
                {
                    kind: "delimited",
                    left: spec.left ?? null,
                    right: spec.right ?? null,
                    body: [array],
                },
            ]
            : [array];
    }
    command(name, context) {
        if (name in SPACES)
            return [{ kind: "space", em: SPACES[name] }];
        if (IGNORED.has(name))
            return [];
        if (name in STYLES)
            return [{ kind: "style", style: STYLES[name] }];
        if (name in GREEK) {
            const text = GREEK[name];
            const upper = text === text.toUpperCase();
            return [
                {
                    kind: "atom",
                    text,
                    cls: "ord",
                    font: context.font ?? (upper || context.upright ? "upright" : "italic"),
                    ...(context.bold ? { bold: true } : {}),
                },
            ];
        }
        if (name in SYMBOLS) {
            const [text, cls] = SYMBOLS[name];
            return [{ kind: "atom", text, cls, font: "upright" }];
        }
        if (name in LARGE_OPERATORS) {
            const [text, large] = LARGE_OPERATORS[name];
            return [
                {
                    kind: "atom",
                    text,
                    cls: "op",
                    font: "upright",
                    large,
                    limits: large === "sum",
                },
            ];
        }
        if (name in FUNCTIONS) {
            const [text, limits] = FUNCTIONS[name];
            return [
                {
                    kind: "atom",
                    text,
                    cls: "op",
                    font: "upright",
                    ...(limits ? { limits } : {}),
                },
            ];
        }
        if (name in ACCENTS) {
            const accent = ACCENTS[name];
            return [{ kind: "accent", ...accent, body: this.argument(context) }];
        }
        if (name in BIG_DELIMITERS) {
            const [height, suffix] = BIG_DELIMITERS[name];
            const text = this.delimiter();
            if (text === null)
                return [{ kind: "space", em: 0.12 }];
            const cls = suffix ??
                (OPENERS.has(text) ? "open" : CLOSERS.has(text) ? "close" : "ord");
            return [{ kind: "atom", text, cls, font: "upright", stretch: height }];
        }
        if (name === "|")
            return [{ kind: "atom", text: "‖", cls: "rel", font: "upright" }];
        if (name === "{" || name === "}")
            return [
                {
                    kind: "atom",
                    text: name,
                    cls: name === "{" ? "open" : "close",
                    font: "upright",
                },
            ];
        if (name === "%" ||
            name === "&" ||
            name === "#" ||
            name === "$" ||
            name === "_")
            return [{ kind: "atom", text: name, cls: "ord", font: "upright" }];
        switch (name) {
            case "frac":
            case "dfrac":
            case "tfrac":
            case "cfrac": {
                const num = this.argument({ ...context, text: false });
                const den = this.argument({ ...context, text: false });
                return [
                    {
                        kind: "frac",
                        num,
                        den,
                        ...(name === "dfrac" || name === "cfrac"
                            ? { force: "display" }
                            : name === "tfrac"
                                ? { force: "text" }
                                : {}),
                    },
                ];
            }
            case "binom":
            case "dbinom":
            case "tbinom": {
                const num = this.argument({ ...context, text: false });
                const den = this.argument({ ...context, text: false });
                return [
                    {
                        kind: "delimited",
                        left: "(",
                        right: ")",
                        body: [
                            {
                                kind: "frac",
                                num,
                                den,
                                bar: false,
                                ...(name === "dbinom"
                                    ? { force: "display" }
                                    : name === "tbinom"
                                        ? { force: "text" }
                                        : {}),
                            },
                        ],
                    },
                ];
            }
            case "sqrt": {
                this.skipSpaces();
                let index;
                if (this.peek() === "[") {
                    this.index += 1;
                    index = this.list({ ...context, upright: true }, INDEX_STOPS);
                    if (this.peek() !== "]")
                        throw new Unsupported("unclosed root index");
                    this.index += 1;
                }
                return [
                    {
                        kind: "radical",
                        body: this.argument(context),
                        ...(index ? { index } : {}),
                    },
                ];
            }
            case "overline":
            case "bar":
                return [{ kind: "overline", body: this.argument(context) }];
            case "underline":
                return [{ kind: "underline", body: this.argument(context) }];
            case "overset":
            case "stackrel": {
                const over = this.argument(context);
                return [{ kind: "stack", over, base: this.argument(context) }];
            }
            case "underset": {
                const under = this.argument(context);
                return [{ kind: "stack", under, base: this.argument(context) }];
            }
            case "xrightarrow":
            case "xleftarrow": {
                this.skipSpaces();
                let under;
                if (this.peek() === "[") {
                    this.index += 1;
                    under = this.list(context, INDEX_STOPS);
                    if (this.peek() !== "]")
                        throw new Unsupported("unclosed [");
                    this.index += 1;
                }
                return [
                    {
                        kind: "xarrow",
                        arrow: name === "xrightarrow" ? "→" : "←",
                        over: this.argument(context),
                        ...(under ? { under } : {}),
                    },
                ];
            }
            case "not": {
                this.skipSpaces();
                const next = this.peek();
                const negated = next === undefined ? undefined : NEGATIONS[next];
                if (!negated)
                    throw new Unsupported("\\not");
                this.index += 1;
                return [{ kind: "atom", text: negated, cls: "rel", font: "upright" }];
            }
            case "mathrm":
            case "mathup":
            case "mathsf":
            case "mathnormal":
                return [
                    {
                        kind: "group",
                        children: this.argument({
                            ...context,
                            font: name === "mathnormal" ? "italic" : "upright",
                        }),
                    },
                ];
            case "operatorname": {
                const limits = this.peek() === "*";
                if (limits)
                    this.index += 1;
                return [
                    {
                        kind: "group",
                        cls: "op",
                        ...(limits ? { limits } : {}),
                        children: this.argument({ ...context, font: "upright" }),
                    },
                ];
            }
            case "mathop":
            case "mathrel":
            case "mathbin":
            case "mathord":
            case "mathopen":
            case "mathclose":
            case "mathpunct":
            case "mathinner": {
                const cls = {
                    mathop: "op",
                    mathrel: "rel",
                    mathbin: "bin",
                    mathord: "ord",
                    mathopen: "open",
                    mathclose: "close",
                    mathpunct: "punct",
                    mathinner: "ord",
                }[name];
                return [
                    {
                        kind: "group",
                        cls,
                        ...(cls === "op" ? { limits: true } : {}),
                        children: this.argument(context),
                    },
                ];
            }
            case "mathbb":
            case "Bbb":
            case "mathcal":
            case "mathscr":
            case "mathfrak":
            case "mathtt": {
                const alphabet = name === "mathbb" || name === "Bbb"
                    ? "double"
                    : name === "mathfrak"
                        ? "fraktur"
                        : name === "mathtt"
                            ? "mono"
                            : "script";
                return [
                    {
                        kind: "group",
                        children: this.argument({ ...context, alphabet, font: "upright" }),
                    },
                ];
            }
            case "text":
            case "textrm":
            case "textnormal":
            case "textsf":
            case "textup":
            case "mbox":
                return [
                    {
                        kind: "group",
                        children: this.argument({
                            ...context,
                            font: "upright",
                            text: true,
                        }),
                    },
                ];
            case "mathit":
            case "textit":
                return [
                    {
                        kind: "group",
                        children: this.argument({ ...context, font: "italic" }),
                    },
                ];
            case "mathbf":
            case "textbf":
            case "boldsymbol":
            case "bm":
                return [
                    {
                        kind: "group",
                        children: this.argument({ ...context, bold: true }),
                    },
                ];
            case "left": {
                const left = this.delimiter();
                const body = this.list(context, RIGHT_STOPS);
                // \middle splits the body with a fence of its own.
                while (this.peek() === "\\middle") {
                    this.index += 1;
                    const text = this.delimiter();
                    if (text !== null)
                        body.push({
                            kind: "atom",
                            text,
                            cls: "rel",
                            font: "upright",
                            middle: true,
                        });
                    body.push(...this.list(context, RIGHT_STOPS));
                }
                if (this.peek() !== "\\right")
                    throw new Unsupported("\\left alone");
                this.index += 1;
                const right = this.delimiter();
                return [{ kind: "delimited", left, right, body }];
            }
            case "right":
                throw new Unsupported("\\right alone");
            case "begin":
                return this.environment(context);
            case "hspace":
            case "hskip":
            case "kern":
            case "mkern":
            case "mskip": {
                if (this.peek() === "*")
                    this.index += 1;
                return [{ kind: "space", em: this.length() }];
            }
            case "phantom":
            case "hphantom":
            case "vphantom":
                return [
                    {
                        kind: "phantom",
                        body: this.argument(context),
                        width: name !== "vphantom",
                        height: name !== "hphantom",
                    },
                ];
            case "mathstrut":
                return [
                    {
                        kind: "phantom",
                        body: [{ kind: "atom", text: "(", cls: "open", font: "upright" }],
                        width: false,
                        height: true,
                    },
                ];
            case "bmod":
                return [{ kind: "atom", text: "mod", cls: "bin", font: "upright" }];
            case "mod":
            case "pmod": {
                const argument = this.argument({ ...context, upright: false });
                const mod = {
                    kind: "atom",
                    text: "mod",
                    cls: "ord",
                    font: "upright",
                };
                return name === "mod"
                    ? [
                        { kind: "space", em: 1 },
                        mod,
                        { kind: "space", em: 1 / 3 },
                        ...argument,
                    ]
                    : [
                        { kind: "space", em: 1 },
                        { kind: "atom", text: "(", cls: "open", font: "upright" },
                        mod,
                        { kind: "space", em: 1 / 3 },
                        ...argument,
                        { kind: "atom", text: ")", cls: "close", font: "upright" },
                    ];
            }
            // MathLive's semantic letters: an upright d, e, i and j.
            case "differentialD":
            case "capitalDifferentialD":
            case "exponentialE":
            case "imaginaryI":
            case "imaginaryJ":
                return [
                    {
                        kind: "atom",
                        text: {
                            differentialD: "d",
                            capitalDifferentialD: "D",
                            exponentialE: "e",
                            imaginaryI: "i",
                            imaginaryJ: "j",
                        }[name],
                        cls: "ord",
                        font: "upright",
                    },
                ];
            default:
                throw new Unsupported(`\\${name}`);
        }
    }
}
function atomsOf(char, context) {
    if (/\s/u.test(char))
        return context.text ? [{ kind: "space", em: 0.318 }] : [];
    if (char === "~")
        return [{ kind: "space", em: 0.318 }];
    const bold = context.bold ? { bold: true } : {};
    if (context.alphabet && /[A-Za-z0-9]/u.test(char))
        return [
            {
                kind: "atom",
                text: alphabetCharacter(char, context.alphabet),
                cls: "ord",
                font: "upright",
                ...bold,
            },
        ];
    if (/\p{L}/u.test(char)) {
        const upperGreek = /[Α-Ω]/u.test(char);
        return [
            {
                kind: "atom",
                text: char,
                cls: "ord",
                font: context.font ??
                    (context.upright || upperGreek ? "upright" : "italic"),
                ...bold,
            },
        ];
    }
    const upright = { font: "upright", ...bold };
    if (/[0-9.]/u.test(char))
        return [{ kind: "atom", text: char, cls: "ord", ...upright }];
    if (context.text)
        return [{ kind: "atom", text: char, cls: "ord", ...upright }];
    if (char === "-")
        return [{ kind: "atom", text: "−", cls: "bin", ...upright }];
    if (char === "*")
        return [{ kind: "atom", text: "∗", cls: "bin", ...upright }];
    if ("+±×·÷∓".includes(char))
        return [{ kind: "atom", text: char, cls: "bin", ...upright }];
    if (char === "∥")
        return [{ kind: "atom", text: "‖", cls: "rel", ...upright }];
    if ("=<>≤≥≈≠→←↔∝∼≃≡:".includes(char))
        return [{ kind: "atom", text: char, cls: "rel", ...upright }];
    if (",;".includes(char))
        return [{ kind: "atom", text: char, cls: "punct", ...upright }];
    if ("([".includes(char))
        return [{ kind: "atom", text: char, cls: "open", ...upright }];
    if (")]!?".includes(char))
        return [{ kind: "atom", text: char, cls: "close", ...upright }];
    if ("&#$%^_\\".includes(char))
        throw new Unsupported(char);
    return [{ kind: "atom", text: char, cls: "ord", ...upright }];
}
export function parse(latex) {
    return new Parser(tokenize(latex.trim())).parse();
}
