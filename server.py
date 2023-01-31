from flask import Flask,render_template,request
import json

w = json.load(open("worldl.json"))

app = Flask(__name__)

# index page
@app.route("/")
def index():
    return render_template(
        "index.html",
        allCountries = w)

# country detail 
@app.route("/country/<n>")
def country(n):
    return render_template("country.html", country=w[int(n)])

# continent list
@app.route("/continent/<cont>")
def continent(cont):
    ret = [c for c in w if c['continent']==cont]
    return render_template(
        "index.html",
        allCountries = ret
    )

# country list
@app.route('/api/country/<name>')
def apiCountry(name):
    ret = [c for c in w if c['name']==name]
    return {"result":ret}

# continentlist
@app.route("/api/continentList")
def continentList():
    clist = list(set([c['continent'] for c in w]))
    clist.sort()
    return {"list":clist}

# country list
@app.route("/api/getListOfCountries/<cont>")
def getListOfCOuntries(cont):
    ret = [c['name'] for c in w if c['continent'] == cont]
    return {"result":ret}

# population
@app.route("/api/population")
def population():
    plist = [c for c in w]
    return {"plist":plist}

# search country by name
@app.route("/api/search/<target>")
def search(target):
    ret = [p['name'] for p in w if p['name'].casefold().startswith(target)][:10]
    return {"result":ret}

# delete country
@app.route("/api/world/<name>", methods=['GET','DELETE'])
def world(name):
    global w
    if request.method == 'GET':
        ret = [p for p in w if p['name']==name]
        return ret[0]
    if request.method == 'DELETE':
        print(f'User delete{name}')
        w = [p for p in w if p['name']!=name]
        return{}

# add country
@app.route('/api/newCountry', methods=['PUT'])
def newCountry():
    newcountry = request.json
    w.append(newcountry)
    return{}

app.run(debug=True)

if __name__ == '__main__':
    app.run(debug=True, port=5000)

   




