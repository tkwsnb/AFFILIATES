const DEBOUNCE_MS = 220;

function debounce(fn, ms) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), ms);
    };
}

function setup() {
    const root = document.getElementById('site-search');
    const input = document.getElementById('site-search-input');
    const list = document.getElementById('site-search-list');
    if (!root || !input || !list) return;

    const endpoint = root.dataset.endpoint || '/api/suggest';

    const close = () => {
        list.hidden = true;
        list.innerHTML = '';
    };

    const open = () => {
        if (list.children.length > 0) list.hidden = false;
    };

    const render = (items) => {
        list.innerHTML = '';
        if (!items.length) {
            close();
            return;
        }
        for (const it of items) {
            const li = document.createElement('li');
            li.className = 'site-search-item';
            li.setAttribute('role', 'presentation');
            const a = document.createElement('a');
            a.className = 'site-search-hit';
            a.href = it.href;
            a.setAttribute('role', 'option');
            if (it.external) {
                a.target = '_blank';
                a.rel = 'noopener noreferrer';
            }
            const top = document.createElement('div');
            top.className = 'site-search-top';
            const badge = document.createElement('span');
            badge.className = 'site-search-badge';
            badge.textContent = it.badge;
            const title = document.createElement('span');
            title.className = 'site-search-title';
            title.textContent = it.title;
            top.append(badge, title);
            const author = document.createElement('div');
            author.className = 'site-search-author';
            author.textContent = it.author;
            a.append(top, author);
            li.append(a);
            list.append(li);
        }
        open();
    };

    const run = async (q) => {
        const t = q.trim();
        if (t.length < 1) {
            close();
            return;
        }
        try {
            const res = await fetch(`${endpoint}?q=${encodeURIComponent(t)}`);
            if (!res.ok) {
                close();
                return;
            }
            const data = await res.json();
            render(Array.isArray(data.items) ? data.items : []);
        } catch {
            close();
        }
    };

    const debounced = debounce(() => run(input.value), DEBOUNCE_MS);

    input.addEventListener('input', () => {
        debounced();
    });

    input.addEventListener('focus', () => {
        if (list.children.length > 0) list.hidden = false;
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            close();
            input.blur();
            return;
        }
        if (e.key === 'Enter') {
            const first = list.querySelector('a.site-search-hit');
            if (first instanceof HTMLAnchorElement) {
                e.preventDefault();
                first.click();
            }
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target instanceof Node && root.contains(e.target)) return;
        close();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
} else {
    setup();
}
