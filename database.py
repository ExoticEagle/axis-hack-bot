import asyncpg
import os

async def init_db() -> asyncpg.connection.Connection:
    conn = await asyncpg.connect(dsn=os.getenv('DATABASE_URL'))
    await conn.execute(
    '''CREATE TABLE IF NOT EXISTS bot_history (
            s_no SERIAL PRIMARY KEY, 
            tweet_content varchar2(288), 
        )
    ''')
    # print("Create table if not exists done.")
    return conn

async def insert_history(tweet_text):
	conn = await init_db()
	await conn.execute("INSERT INTO bot_history VALUES $1", tweet_text)
	await conn.close()
