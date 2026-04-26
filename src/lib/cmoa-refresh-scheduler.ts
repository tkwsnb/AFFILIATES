import { refreshCmoaNewReleaseCache } from './cmoa-newrelease';

const DISABLED = process.env.CMOA_AUTO_REFRESH === '0';
const INTERVAL_HOURS = Math.max(
    1,
    Number(process.env.CMOA_REFRESH_INTERVAL_HOURS ?? 6),
);

type GlobalTimers = typeof globalThis & { __cmoaAutoRefreshId?: ReturnType<typeof setInterval> };

/**
 * 起動中プロセス内で、指定間隔（既定 6 時間）ごとに新刊 cache を上書きする。
 * 本番の日次更新に加え、日付切り替わり直後（掲載が遅いことがある帯）を拾いやすくする意図で間隔を短めにしている。
 * 無効化: `CMOA_AUTO_REFRESH=0`
 * 間隔: `CMOA_REFRESH_INTERVAL_HOURS=12`（24 で「おおよそ1日1回」相当）
 */
export function startCmoaNewReleaseAutoRefresh(): void {
    const g = globalThis as GlobalTimers;
    if (g.__cmoaAutoRefreshId) {
        clearInterval(g.__cmoaAutoRefreshId);
        g.__cmoaAutoRefreshId = undefined;
    }

    if (DISABLED) {
        console.log(
            '[cmoa-newrelease] 自動更新はオフ (環境変数 CMOA_AUTO_REFRESH=0)',
        );
        return;
    }

    const ms = INTERVAL_HOURS * 60 * 60 * 1000;
    const run = () => {
        void refreshCmoaNewReleaseCache();
    };
    run();
    g.__cmoaAutoRefreshId = setInterval(run, ms);
    console.log(
        `[cmoa-newrelease] 自動更新: 約 ${INTERVAL_HOURS} 時間ごと (${Math.round(24 / INTERVAL_HOURS)} 回/日目安)`,
    );
}
