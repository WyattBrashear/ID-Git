import sqlite3
from flask import Flask, request
from flask_cors import CORS
from together import Together

app = Flask(__name__)
CORS(app)
together = Together(api_key="")
@app.route('/api/query_sql')
def query_sql():
    query_sql = request.args.get('query')
    db = sqlite3.connect('./json_data/repos.db')
    cursor = db.cursor()
    cursor.execute(query_sql)
    results = cursor.fetchall()
    db.close()
    return {'results': results}

@app.route('/api/execute_sql', methods=['POST'])
def execute_sql():
    query_sql = request.json.get('query')
    db = sqlite3.connect('./json_data/repos.db')
    cursor = db.cursor()
    cursor.execute(query_sql)
    results = cursor.fetchall()
    db.close()
    return {'results': results}
@app.route('/api/guestbook/', methods=['POST'])
def guestbook():
    name = request.form.get('name')
    message = request.form.get('message')
    db = sqlite3.connect('./json_data/repos.db')
    cursor = db.cursor()
    cursor.execute("CREATE TABLE IF NOT EXISTS guestbook (id INTEGER PRIMARY KEY, name TEXT, message TEXT)")
    db.commit()
    cursor.execute("INSERT INTO guestbook (name, message) VALUES (?, ?)", (name, message))
    db.commit()
    db.close()
    return {'status': 'success'}



@app.route("/api/query", methods=["POST"])
def im_too_lazy_to_do_javascript():
    data = request.get_json()
    query = data.get("messages")
    model = data.get("model")
    response = together.chat.completions.create(
        model=model,
        messages=query
    ).choices[0].message.content
    return {"response": response}

if __name__ == '__main__':
    app.run(port=8000)