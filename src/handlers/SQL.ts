import Util from '../Util.js';
import path from 'path';
import SQLite from 'better-sqlite3';
import { fileURLToPath } from 'url';
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sql = new SQLite(path.join(__dirname, '../../data/SQL/alot.sqlite'));

class SQL {
    constructor() {
        throw new Error('This class cannot be instantiated!');
    }

    static async InitDB(): Promise<void> {

        const statsdb = sql.prepare('SELECT count(*) FROM sqlite_master WHERE type=\'table\' AND name = \'stats\';').get();
        if (!statsdb['count(*)']) {
            sql.prepare('CREATE TABLE stats (id TEXT PRIMARY KEY, value INTEGER);').run();
            sql.prepare('CREATE UNIQUE INDEX idx_stats_id ON stats (id);').run();
            sql.pragma('synchronous = 1');
            sql.pragma('journal_mode = wal');
        }

        process.alot.db = sql;

        process.alot.getStat = sql.prepare('SELECT * FROM stats WHERE id = ?');
        process.alot.setStat = sql.prepare('INSERT OR REPLACE INTO stats (id, value) VALUES (@id, @value);');

        Util.log(`Initialized database: \`${sql.name}\`!`);
    }

}

export default SQL;
