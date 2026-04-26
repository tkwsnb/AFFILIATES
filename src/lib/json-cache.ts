/**
 * Bun.file ベースの簡易 JSON ファイルキャッシュ。
 *
 * - `ttlMs` を指定すると `_fetchedAt` フィールドでタイムスタンプを見て期限切れ判定
 * - 指定しない場合は恒久キャッシュとして扱う
 * - パース失敗 / 存在しない / TTL 切れは全て `null` を返す
 */

interface Envelope<T> {
    _fetchedAt: number;
    data: T;
}

export async function readJsonCache<T>(
    path: string,
    ttlMs?: number,
): Promise<T | null> {
    const file = Bun.file(path);
    if (!(await file.exists())) return null;
    try {
        const raw = (await file.json()) as Envelope<T> | T;
        if (ttlMs === undefined) {
            return ((raw as Envelope<T>).data ?? raw) as T;
        }
        if (
            typeof raw !== 'object' ||
            raw === null ||
            typeof (raw as Envelope<T>)._fetchedAt !== 'number'
        ) {
            return null;
        }
        const env = raw as Envelope<T>;
        if (Date.now() - env._fetchedAt > ttlMs) return null;
        return env.data;
    } catch {
        return null;
    }
}

export async function writeJsonCache<T>(
    path: string,
    data: T,
    opts: { withTimestamp?: boolean } = {},
): Promise<void> {
    try {
        const payload = opts.withTimestamp
            ? ({ _fetchedAt: Date.now(), data } satisfies Envelope<T>)
            : data;
        await Bun.write(path, JSON.stringify(payload));
    } catch (err) {
        console.warn(`[json-cache] failed to write ${path}:`, err);
    }
}
