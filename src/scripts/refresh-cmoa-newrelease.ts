/**
 * タスクスケジューラ / cron から単発で呼ぶ。例:
 *   bun run src/scripts/refresh-cmoa-newrelease.ts
 */
import { refreshCmoaNewReleaseCache } from '../lib/cmoa-newrelease';

const r = await refreshCmoaNewReleaseCache();
if (!r.ok) {
    console.error(r.error);
    process.exit(1);
}
console.log(`新刊 cache 更新完了: ${r.itemCount} 件`);
process.exit(0);
