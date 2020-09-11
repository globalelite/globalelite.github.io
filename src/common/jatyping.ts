// eslint-disable-next-line max-classes-per-file
const noop = (): void => {
  // do nothing
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const delayRun = (delay: number, fn: () => any): void => {
  if (delay > 0) {
    setTimeout(fn, delay);
  } else {
    fn();
  }
};

export class RecursiveFunction<A extends unknown[]> {
  static Stop = class {};

  finish: Error;

  stop: Error;

  started: boolean;

  finished: boolean;

  onStart: (this: RecursiveFunction<A>) => void;

  onCall: (this: RecursiveFunction<A>, ...args: A) => void;

  onFinish: (this: RecursiveFunction<A>) => void;

  onStopped: (this: RecursiveFunction<A>) => void;

  constructor({
    onStart = noop,
    onCall = noop,
    onFinish = noop,
    onStopped = noop,
  }: {
    onStart?: (this: RecursiveFunction<A>) => void;
    onCall?: (this: RecursiveFunction<A>, ...args: A) => void;
    onFinish?: (this: RecursiveFunction<A>) => void;
    onStopped?: (this: RecursiveFunction<A>) => void;
  }) {
    this.finish = new Error(`finish: ${Math.random()}`);
    this.stop = new Error('stop');
    this.started = false;
    this.finished = false;
    this.onStart = onStart;
    this.onCall = onCall;
    this.onFinish = onFinish;
    this.onStopped = onStopped;
  }

  call(callback: (this: RecursiveFunction<A>) => void, delay = 0): void {
    if (this.finished) throw new Error('finished');

    delayRun(delay, () => {
      try {
        if (!this.started) {
          this.started = true;
          this.onStart();
        }
        callback.call(this);
      } catch (e) {
        if (e === this.finish) {
          this.callFinish();
        } else if (e === this.stop) {
          this.callStop();
        } else {
          throw e;
        }
      }
    });
  }

  callFinished(callback: (this: RecursiveFunction<A>) => void, delay = 0): void {
    if (this.finished) throw new Error('finished');

    this.finished = true;
    delayRun(delay, () => {
      callback.call(this);
    });
  }

  callFinish(delay = 0): void {
    this.callFinished(this.onFinish, delay);
  }

  callStop(delay = 0): void {
    this.callFinished(this.onStopped, delay);
  }

  next(delay: number, ...args: A): void {
    this.call(() => this.onCall(...args), delay);
  }
}

const [TYPING_TABLE, TYPING_REG] = ((): [Record<string, string[]>, RegExp] => {
  const table: Record<string, string[]> = { ん: ['ｎ', 'ん'], っ: ['ｘ', 'ｘｔ', 'っ'] };
  const gyous: Record<string, string> = {
    ｋ: 'かきくけこ',
    ｇ: 'がぎぐげご',
    ｓ: 'さしすせそ',
    ｚ: 'ざじずぜぞ',
    ｔ: 'たちつてと',
    ｄ: 'だぢづでど',
    ｎ: 'なにぬねの',
    ｈ: 'はひふへほ',
    ｂ: 'ばびぶべぼ',
    ｐ: 'ぱぴぷぺぽ',
    ｍ: 'まみむめも',
    ｙ: 'やゆよ',
    ｒ: 'らりるれろ',
    ｗ: 'わを',
  };
  const yoons = ['ゃ', 'ゅ', 'ょ'];
  ['ぁ', 'ぃ', 'ぅ', 'ぇ', 'ぉ'].forEach((yoon) => {
    table[yoon] = ['ｘ', yoon];
  });
  yoons.forEach((yoon) => {
    table[yoon] = ['ｘ', 'ｘｙ', yoon];
  });
  const ions: string[] = [];
  Object.keys(gyous).forEach((k1) => {
    const gyouChars = gyous[k1].split('');
    gyouChars.forEach((k2) => {
      table[k2] = [k1, k2];
    });
    if (gyouChars.length === 5) {
      const ion = gyouChars[1];
      ions.push(ion);
      yoons.forEach((yoon) => {
        const ionYoon = `${ion}${yoon}`;
        table[ionYoon] = ion === 'じ' ? ['ｊ', ionYoon] : [k1, `${k1}ｙ`, ionYoon];
      });
    }
  });
  return [table, new RegExp(`[${ions.join('')}][${yoons.join('')}]|.`, 'g')];
})();

const getCharTypings = (ch: string, afterCh: string): string[] => {
  if (ch === 'っ' && TYPING_TABLE[afterCh]) {
    return [TYPING_TABLE[afterCh][0]];
  }
  if (ch === 'ん' && TYPING_TABLE[afterCh] && TYPING_TABLE[afterCh][0] !== TYPING_TABLE[ch][0]) {
    return [TYPING_TABLE[ch][0]];
  }
  return TYPING_TABLE[ch] || [ch];
};

export const toTypings = (str: string, prefix = ''): string[] => {
  const chs = str.match(TYPING_REG) || [];
  const typings: string[] = [];
  let prevTyping = '';
  for (let i = 0; i < chs.length; i += 1) {
    const ch = chs[i];
    const chTypings = getCharTypings(ch, chs[i + 1]);
    const t = prevTyping;
    chTypings.forEach((ct) => {
      typings.push(`${prefix}${t}${ct}`);
    });
    prevTyping += ch;
  }
  return typings;
};

export const moveBefore = (elem: Node, insertElem: Node): void => {
  if (!elem.parentNode || !insertElem.parentNode) {
    throw new Error('Not found parentNode');
  }

  while (elem.firstChild) {
    if (elem.firstChild.nodeType === Node.ELEMENT_NODE) {
      moveBefore(elem.firstChild, insertElem);
    } else {
      insertElem.parentNode.insertBefore(elem.firstChild, insertElem);
    }
  }
  elem.parentNode.removeChild(elem);
};

type ClassNames = (string | null | undefined)[];

export const getClassName = (classNames: ClassNames): string =>
  classNames.filter((cn) => !!cn).join(' ');

export const createElement = (tagName: string, classNames: ClassNames): HTMLElement => {
  const elem = document.createElement(tagName);
  elem.className = getClassName(classNames);
  return elem;
};

export const findCaret = (
  elem: HTMLElement,
  tagName: string,
  classNames: ClassNames
): HTMLElement | null =>
  elem.querySelector<HTMLElement>(
    `${tagName}${classNames.filter((cn) => !!cn).map((cn) => `.${cn}`)}`
  );

export const findOrCreateCaret = (
  elem: HTMLElement,
  tagName: string,
  classNames: ClassNames
): HTMLElement => findCaret(elem, tagName, classNames) || createElement(tagName, classNames);

interface IMEDisablePattern {
  ime: false;
  inputs: string[];
}

interface IMEEnablePattern {
  ime?: true;
  inputs: string[];
  converts?: string[][];
}

export type Pattern = IMEDisablePattern | IMEEnablePattern;

export type LoosePattern =
  | Pattern
  | IMEDisablePattern['inputs']
  | [IMEEnablePattern['inputs']]
  | [IMEEnablePattern['inputs'], IMEEnablePattern['converts']];

const isLooseIMEDisablePattern = (
  loosePattern: unknown
): loosePattern is IMEDisablePattern['inputs'] =>
  !!(loosePattern && typeof (loosePattern as unknown[])[0] === 'string');

export const toPattern = (loosePattern: LoosePattern): Pattern => {
  if (!Array.isArray(loosePattern)) {
    return loosePattern;
  }

  if (isLooseIMEDisablePattern(loosePattern)) {
    return { ime: false, inputs: loosePattern };
  }

  return { inputs: loosePattern[0], converts: loosePattern[1] };
};

export interface Options {
  delay?: number;
  speed?: number;
  convertDelay?: number;
  convertSpeed?: number;
  removeDelay?: number;
  removeSpeed?: number;
  caretTagName?: string | null;
  caretClassName?: string | null;
  removeCaret?: boolean;
  inputTagName?: string;
  inputClassName?: string | null;
  inputTypingClassName?: string | null;
  inputConvertClassName?: string | null;
  patternsAttributeName?: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  onStart?: (this: RecursiveFunction<any[]>) => void;
  onTyping?: (this: RecursiveFunction<any[]>) => void;
  onFinish?: (this: RecursiveFunction<any[]>) => void;
  onStopped?: (this: RecursiveFunction<any[]>) => void;
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

const SHY = '\u00ad';
const REG_SHY = new RegExp(SHY, 'g');

export const clear = (elem: Node): void => {
  let node = elem.firstChild;
  let replaced = false;
  while (node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const curr = node;
      node = node.nextSibling;
      if (replaced) {
        elem.removeChild(curr);
      } else {
        curr.nodeValue = SHY;
      }
      replaced = true;
    } else {
      if (node.nodeType === Node.ELEMENT_NODE) {
        clear(node);
      }
      replaced = false;
      node = node.nextSibling;
    }
  }
};

export const updateByTypings = (
  node: Text,
  typings: string[],
  { delay = 0, speed = 20, onStart, onTyping, onFinish, onStopped }: Options
): void => {
  new RecursiveFunction<[number]>({
    onStart,
    onFinish,
    onStopped,
    onCall(index): void {
      if (typings.length <= index) {
        throw this.finish;
      }

      // eslint-disable-next-line no-param-reassign
      node.nodeValue = typings[index];
      if (onTyping) onTyping.call(this);

      this.next(1000 / speed, index + 1);
    },
  }).next(delay, 0);
};

export const removeTextNode = (
  node: Text,
  { delay, removeDelay, speed, removeSpeed, ...restOptions }: Options = {}
): void => {
  const currentText = `${node.nodeValue || ''}`;
  const typings: string[] = [];
  for (let i = currentText.length; i >= 0; i -= 1) {
    typings.push(currentText.slice(0, i) || SHY);
  }

  updateByTypings(node, typings, {
    ...restOptions,
    delay: removeDelay || delay || 0,
    speed: removeSpeed || speed || 40,
  });
};

export const removeFromNode = (
  startNode: Node | null,
  {
    delay,
    removeDelay,
    speed,
    removeSpeed,
    onStart,
    onFinish,
    onStopped,
    ...restOptions
  }: Options = {}
): void => {
  const delayBySpeed = 1000 / (removeSpeed || speed || 40);
  new RecursiveFunction<[Node | null]>({
    onStart,
    onFinish,
    onStopped,
    onCall(node): void {
      if (!node) {
        throw this.finish;
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        removeFromNode(node.lastChild, {
          ...restOptions,
          removeDelay: delayBySpeed,
          speed,
          removeSpeed,
          onFinish: () => {
            const nextNode = node.previousSibling;
            node.parentNode!.removeChild(node); // eslint-disable-line @typescript-eslint/no-non-null-assertion
            this.next(0, nextNode);
          },
        });
      } else if (node.nodeType === Node.TEXT_NODE) {
        removeTextNode(node as Text, {
          ...restOptions,
          removeDelay: delayBySpeed,
          speed,
          removeSpeed,
          onFinish: () => {
            const nextNode = node.previousSibling;
            node.parentNode!.removeChild(node); // eslint-disable-line @typescript-eslint/no-non-null-assertion
            this.next(0, nextNode);
          },
        });
      } else {
        this.next(0, node.previousSibling);
      }
    },
  }).next(removeDelay || delay || 0, startNode);
};

export const remove = (
  elem: HTMLElement,
  {
    delay,
    removeDelay,
    speed,
    removeSpeed,
    caretTagName = 'span',
    caretClassName = 'jatyping-caret',
    removeCaret = false,
    onStart,
    onFinish,
    onStopped,
    ...restOptions
  }: Options = {}
): void => {
  const delayBySpeed = 1000 / (removeSpeed || speed || 40);
  let targetNode = elem.lastChild;
  if (caretTagName) {
    targetNode = elem.appendChild(findOrCreateCaret(elem, caretTagName, [caretClassName]))
      .previousSibling;
  }

  new RecursiveFunction<[Node | null]>({
    onStart,
    onFinish(): void {
      if (removeCaret && caretTagName) {
        const caret = findCaret(elem, caretTagName, [caretClassName]);
        if (caret) elem.removeChild(caret);
      }
      if (!elem.firstChild) {
        elem.appendChild(document.createTextNode(SHY));
      }
      if (onFinish) onFinish.call(this);
    },
    onStopped,
    onCall(node): void {
      removeFromNode(node, {
        ...restOptions,
        removeDelay: delayBySpeed,
        speed,
        removeSpeed,
        onFinish: () => {
          this.callFinish();
        },
        onStopped: () => {
          this.callStop();
        },
      });
    },
  }).next(removeDelay || delay || 0, targetNode);
};

export const addTextNode = (
  node: Text,
  inputs: string[],
  {
    delay = 0,
    speed = 20,
    removeSpeed = 40,
    onStart,
    onTyping,
    onFinish,
    onStopped,
    ...restOptions
  }: Options = {}
): void => {
  new RecursiveFunction<[number]>({
    onStart,
    onFinish,
    onStopped,
    onCall(index): void {
      if (inputs.length <= index) {
        throw this.finish;
      }

      const input = inputs[index];
      const currentInput = `${node.nodeValue || ''}`.replace(REG_SHY, '');
      if (input.startsWith(currentInput)) {
        const typings = toTypings(input.slice(currentInput.length), currentInput);
        updateByTypings(node, typings, {
          ...restOptions,
          delay: 1000 / speed,
          speed,
          onTyping,
          onFinish: () => {
            this.next(1000 / speed, index + 1);
          },
          onStopped: () => {
            this.callStop();
          },
        });
      } else {
        removeTextNode(node, {
          ...restOptions,
          removeDelay: 1000 / removeSpeed,
          removeSpeed,
          onTyping() {
            if (onTyping) onTyping.call(this);
            const removedInput = `${node.nodeValue || ''}`.replace(REG_SHY, '');
            if (input.startsWith(removedInput)) {
              throw this.finish;
            }
          },
          onFinish: () => {
            this.next(1000 / speed, index);
          },
          onStopped: () => {
            this.callStop();
          },
        });
      }
    },
  }).next(delay, 0);
};

export const updateConverts = (
  rootElem: HTMLElement,
  converts: string[][],
  {
    delay,
    convertDelay,
    speed,
    convertSpeed,
    inputTagName = 'span',
    inputTypingClassName = 'jatyping-typing',
    inputConvertClassName = 'jatyping-convert',
    onStart,
    onTyping,
    onFinish,
    onStopped,
  }: Options = {}
): void => {
  const convertClassName = getClassName([inputTypingClassName, inputConvertClassName]);
  const defaultClassName = getClassName([inputTypingClassName]);
  const delayBySpeed = 1000 / (convertSpeed || speed || 10);
  let convertData: [HTMLElement, Text, string[]][];

  new RecursiveFunction({
    onStart,
    onFinish,
    onStopped,
    onCall(): void {
      if (!convertData.length) {
        throw this.finish;
      }

      const [elem, node, convs] = convertData[0];
      if (!convs.length) {
        convertData.shift();
        if (convertData.length) {
          convertData[0][0].className = convertClassName;
          elem.className = defaultClassName;
        }
      } else {
        node.nodeValue = convs.shift()!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
      }
      if (onTyping) onTyping.call(this);

      this.next(delayBySpeed);
    },
  }).call(function init() {
    while (rootElem.firstChild) rootElem.removeChild(rootElem.firstChild);

    convertData = converts.map((convert, i) => {
      const elem = createElement(
        inputTagName,
        i ? [inputTypingClassName] : [inputTypingClassName, inputConvertClassName]
      );
      const text = elem.appendChild(document.createTextNode(convert[0]));
      rootElem.appendChild(elem);
      return [elem, text, convert.slice(1)];
    });
    while (convertData[convertData.length - 1] && !convertData[convertData.length - 1][2].length) {
      convertData.pop();
    }

    this.next(delayBySpeed);
  }, convertDelay || delay || 0);
};

export const addFromNode = (
  afterNode: Node,
  loosePattern: LoosePattern,
  {
    convertSpeed = 10,
    inputTagName = 'span',
    inputClassName = 'jatyping-input',
    inputTypingClassName = 'jatyping-typing',
    onStart,
    onFinish,
    onStopped,
    ...restOptions
  }: Options = {}
): void => {
  const pattern = toPattern(loosePattern);

  const text = document.createTextNode('');
  const elem = createElement(inputTagName, [inputClassName]);
  if (pattern.ime === false) {
    elem.appendChild(text);
  } else {
    elem.appendChild(createElement(inputTagName, [inputTypingClassName])).appendChild(text);
  }

  afterNode.parentNode!.insertBefore(elem, afterNode); // eslint-disable-line @typescript-eslint/no-non-null-assertion

  addTextNode(text, pattern.inputs, {
    ...restOptions,
    onStart,
    onStopped,
    onFinish(): void {
      if (pattern.ime !== false && pattern.converts) {
        updateConverts(elem, pattern.converts, {
          ...restOptions,
          convertSpeed,
          inputTagName,
          inputTypingClassName,
          onFinish() {
            moveBefore(elem, elem);
            if (onFinish) onFinish.call(this);
          },
          onStopped,
        });
      } else {
        moveBefore(elem, elem);
        if (onFinish) onFinish.call(this);
      }
    },
  });
};

export const addToElement = (
  elem: HTMLElement,
  loosePatterns: LoosePattern[],
  {
    delay = 0,
    speed = 20,
    caretTagName = 'span',
    caretClassName = 'jatyping-caret',
    removeCaret = false,
    onStart,
    onFinish,
    onStopped,
    ...restOptions
  }: Options = {}
): void => {
  const delayBySpeed = 1000 / speed;
  let lastPoint: Node;
  let afterNode: Node;
  if (caretTagName) {
    afterNode = elem.appendChild(findOrCreateCaret(elem, caretTagName, [caretClassName]));
  } else {
    afterNode = elem.lastChild || (lastPoint = elem.appendChild(document.createTextNode('')));
  }

  new RecursiveFunction<[number]>({
    onStart,
    onFinish(): void {
      if (removeCaret && caretTagName) {
        const caret = findCaret(elem, caretTagName, [caretClassName]);
        if (caret) elem.removeChild(caret);
      } else if (lastPoint) {
        elem.removeChild(lastPoint);
      }
      if (onFinish) onFinish.call(this);
    },
    onStopped,
    onCall(index): void {
      if (loosePatterns.length <= index) {
        throw this.finish;
      }

      addFromNode(afterNode, loosePatterns[index], {
        ...restOptions,
        delay: delayBySpeed,
        speed,
        onFinish: () => {
          this.next(delayBySpeed, index + 1);
        },
        onStopped: () => {
          this.callStop();
        },
      });
    },
  }).next(delay || 0, 0);
};

const walkPatternsElem = (
  results: [HTMLElement, LoosePattern[]][],
  elem: HTMLElement,
  patternsAttributeName: string
): void => {
  if (elem.hasAttribute(patternsAttributeName)) {
    const patternsJson = elem.getAttribute(patternsAttributeName)!; // eslint-disable-line @typescript-eslint/no-non-null-assertion
    results.push([elem, JSON.parse(patternsJson)]);
    return;
  }

  for (let node = elem.firstChild; node; node = node.nextSibling) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      walkPatternsElem(results, node as HTMLElement, patternsAttributeName);
    }
  }
};

export const add = (
  rootElem: HTMLElement,
  {
    delay = 0,
    speed = 20,
    caretTagName = 'span',
    caretClassName = 'jatyping-caret',
    removeCaret = false,
    patternsAttributeName = 'data-jatyping',
    onStart,
    onFinish,
    onStopped,
    ...restOptions
  }: Options = {}
): void => {
  const elemAndPatterns: [HTMLElement, LoosePattern[]][] = [];
  walkPatternsElem(elemAndPatterns, rootElem, patternsAttributeName);

  elemAndPatterns.forEach(([elem]) => {
    clear(elem);
  });

  const delayBySpeed = 1000 / speed;
  new RecursiveFunction<[number]>({
    onStart(): void {
      if (onStart) onStart.call(this);
      if (caretTagName) {
        const caret = findCaret(rootElem, caretTagName, [caretClassName]);
        if (caret) caret.parentNode!.removeChild(caret); // eslint-disable-line @typescript-eslint/no-non-null-assertion
      }
    },
    onFinish(): void {
      if (!removeCaret && caretTagName) {
        rootElem.appendChild(findOrCreateCaret(rootElem, caretTagName, [caretClassName]));
      }
      if (onFinish) onFinish.call(this);
    },
    onStopped,
    onCall(index): void {
      if (elemAndPatterns.length <= index) {
        throw this.finish;
      }

      const [elem, patterns] = elemAndPatterns[index];

      addToElement(elem, patterns, {
        ...restOptions,
        delay: delayBySpeed,
        speed,
        caretTagName,
        removeCaret: true,
        onFinish: () => {
          this.next(0, index + 1);
        },
        onStopped: () => {
          this.callStop();
        },
      });
    },
  }).next(delay || 0, 0);
};
