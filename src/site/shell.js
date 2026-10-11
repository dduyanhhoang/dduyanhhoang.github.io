/* A tiny pretend shell for the root page. Pure logic, no DOM, so
   shell.test.mjs can run it under Node.

   The "filesystem" is the site root: every page is a directory, plus a
   couple of text files to find. `cd <page>` opens that page; `cd ~`
   opens /home/, because that is where home is. */

function distance(a, b) {
  const row = Array.from({ length: b.length + 1 }, (_, j) => j);
  for (let i = 1; i <= a.length; i++) {
    let prev = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = row[j];
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = tmp;
    }
  }
  return row[b.length];
}

/** Nearest name for a "did you mean" hint, or null when nothing is close. */
export function closest(word, names) {
  let best = null, bestD = Infinity;
  for (const n of names) {
    const d = distance(word, n);
    if (d < bestD) { best = n; bestD = d; }
  }
  return bestD <= Math.max(2, Math.floor(word.length / 3)) ? best : null;
}

const FILES = {
  'hello.txt': 'hi. you found a file.\nthere is nothing else in here, I promise.\n\ntry: ls, cd home, whoami, neofetch',
  '.secret': 'you used ls -a. respect.',
};

const MANUAL = {
  help: 'list the commands',
  ls: 'list directory contents (try -a)',
  cd: 'change directory, which here means open a page',
  open: 'same as cd',
  pwd: 'print the working directory',
  cat: 'print a file',
  echo: 'print its arguments',
  whoami: 'print the current user',
  date: 'print the date and time',
  uname: 'print system information (try -a)',
  history: 'list the commands you typed',
  neofetch: 'show system info with a logo',
  clear: 'clear the screen (or Ctrl-L)',
  man: 'show a one-line manual page',
  sudo: 'run a command as root',
  exit: 'leave the shell',
};
const EXTRA = ['rm', 'vim', 'nano', 'emacs', 'logout'];
export const COMMANDS = Object.keys(MANUAL);

/**
 * @param {{ pages: {name: string, href: string}[], now?: () => Date }} opts
 * run(line) returns { out: [{ text, kind }], go?: href, clear?: true }
 *   kind: 'text' | 'error' | 'ls' (ls items carry `entries`)
 */
export function createShell({ pages, now = () => new Date() }) {
  const started = now();
  const history = [];
  const dirs = new Map(pages.map((p) => [p.name, p]));
  const clean = (s) => s.replace(/^\.?\/+|\/+$/g, '').toLowerCase();

  const text = (t) => ({ out: [{ text: t, kind: 'text' }] });
  const error = (t) => ({ out: [{ text: t, kind: 'error' }] });

  function listing(all) {
    const entries = [
      ...(all ? ['.', '..'].map((name) => ({ name, type: 'dir' })) : []),
      ...pages.map((p) => ({ name: p.name, type: 'page', href: p.href })),
      ...Object.keys(FILES).filter((f) => all || !f.startsWith('.')).map((name) => ({ name, type: 'file' })),
    ];
    return { out: [{ kind: 'ls', entries }] };
  }

  function cd(arg, cmd) {
    const target = arg === undefined || arg === '~' || arg === '~/' ? 'home' : clean(arg);
    if (['', '.', '..'].includes(target)) return { out: [] };
    if (dirs.has(target)) return { out: [], go: dirs.get(target).href };
    if (FILES[target] !== undefined) return error(`${cmd}: ${arg}: Not a directory`);
    const hint = closest(target, [...dirs.keys()]);
    return error(`${cmd}: ${arg}: No such file or directory${hint ? ` (did you mean ${hint}?)` : ''}`);
  }

  function neofetch() {
    const up = Math.max(0, Math.round((now() - started) / 1000));
    const logo = ['  ▄▄▄▄▄▄▄  ', ' █ >_    █ ', ' █       █ ', '  ▀▀▀▀▀▀▀  '];
    const info = [
      'guest@ddah',
      '----------',
      'OS: ddah (in your browser)',
      'Host: GitHub Pages',
      'Shell: ddsh',
      `Uptime: ${up}s`,
      `Pages: ${pages.length}`,
    ];
    const rows = Math.max(logo.length, info.length);
    const lines = Array.from({ length: rows }, (_, i) => `${(logo[i] ?? '').padEnd(12)}  ${info[i] ?? ''}`);
    return text(lines.join('\n'));
  }

  function run(line) {
    const trimmed = line.trim();
    if (!trimmed) return { out: [] };
    history.push(trimmed);
    const [cmd, ...args] = trimmed.split(/\s+/);
    const flags = args.filter((a) => a.startsWith('-'));
    const operands = args.filter((a) => !a.startsWith('-'));

    switch (cmd) {
      case 'help':
        return text(['commands:', ...COMMANDS.map((c) => `  ${c.padEnd(9)} ${MANUAL[c]}`), '', 'keys: Tab completes, Up and Down walk history, Ctrl-L clears, Ctrl-C cancels'].join('\n'));
      case 'ls': {
        const where = operands[0] && clean(operands[0]);   // "/" cleans to ""
        if (where && where !== '.' && where !== '~') {
          if (dirs.has(where)) return text(`(${where} is a page. cd ${where} to open it.)`);
          if (FILES[where] !== undefined) return text(where);
          return error(`ls: cannot access '${operands[0]}': No such file or directory`);
        }
        return listing(flags.some((f) => f.includes('a')));
      }
      case 'cd': case 'open':
        return cd(operands[0], cmd);
      case 'pwd': return text('/');
      case 'whoami': return text('guest');
      case 'echo': return text(args.join(' '));
      case 'date': return text(now().toString());
      case 'uname':
        return text(flags.some((f) => f.includes('a')) ? 'Linux ddah 6.1.0-browser #1 SMP PREEMPT_DYNAMIC x86_64 GNU/Linux' : 'Linux');
      case 'cat': {
        if (!operands.length) return error('cat: missing file operand');
        const out = operands.map((f) => {
          const name = clean(f);
          if (FILES[name] !== undefined) return { text: FILES[name], kind: 'text' };
          if (dirs.has(name)) return { text: `cat: ${f}: Is a directory`, kind: 'error' };
          return { text: `cat: ${f}: No such file or directory`, kind: 'error' };
        });
        return { out };
      }
      case 'history':
        return text(history.map((h, i) => `${String(i + 1).padStart(4)}  ${h}`).join('\n'));
      case 'neofetch': return neofetch();
      case 'clear': return { out: [], clear: true };
      case 'man': {
        const page = operands[0];
        if (!page) return error('What manual page do you want?');
        return MANUAL[page] ? text(`${page}: ${MANUAL[page]}`) : error(`No manual entry for ${page}`);
      }
      case 'sudo': return error('[sudo] password for guest:\nguest is not in the sudoers file. This incident will be reported.');
      case 'rm': return error('rm: cannot remove: Read-only file system');
      case 'vim': case 'nano': case 'emacs': return text(`${cmd}: you would never get out anyway.`);
      case 'exit': case 'logout': return text('logout\n...there is no escape. try: cd ~');
      default: {
        const hint = closest(cmd, [...COMMANDS, ...dirs.keys()]);
        return error(`ddsh: ${cmd}: command not found${hint ? ` (did you mean ${hint}?)` : ''}`);
      }
    }
  }

  /* Bash-style Tab: complete the word if unique, else list the options. */
  function complete(line) {
    const parts = line.split(/\s+/);
    const word = parts.at(-1);
    const first = parts.length === 1;
    const pool = first
      ? [...COMMANDS, ...EXTRA]
      : parts[0] === 'cat' ? [...Object.keys(FILES), ...dirs.keys()] : [...dirs.keys(), ...(parts[0] === 'ls' ? Object.keys(FILES) : [])];
    const options = [...new Set(pool)].filter((o) => o.startsWith(word)).sort();
    if (options.length === 1) {
      const suffix = first ? ' ' : dirs.has(options[0]) ? '/' : ' ';
      return { line: [...parts.slice(0, -1), options[0]].join(' ') + suffix, options: [] };
    }
    /* extend to the longest common prefix, like bash */
    let prefix = options[0] ?? word;
    for (const o of options) while (!o.startsWith(prefix)) prefix = prefix.slice(0, -1);
    return { line: [...parts.slice(0, -1), prefix.length > word.length ? prefix : word].join(' '), options };
  }

  return { run, complete, history };
}
