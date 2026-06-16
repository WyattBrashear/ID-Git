import sqlite3
from flask import Flask, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/query_sql')
def query_sql():
    query_sql = request.args.get('query')
    db = sqlite3.connect('./json_data/repos.db')
    cursor = db.cursor()
    cursor.execute(query_sql)
    results = cursor.fetchall()
    db.close()
    return {'results': results}

if __name__ == '__main__':
    app.run(port=8000)