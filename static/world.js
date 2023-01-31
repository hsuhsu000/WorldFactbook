// add country
document.getElementById('newCountry').onclick = async () =>{
    document.getElementById('newDetails').innerHTML = '';
    let divId = document.createElement('div');
    divId.innerHTML = `<label>Enter id: <input id = cId style="margin-left: 33px;"></label>`;
    let divName = document.createElement('div');
    divName.innerHTML = `<label>Enter name: <input id=cName></label>`;
    let addBtn = document.createElement('button');
    addBtn.innerText = 'Add new Country!';
    addBtn.onclick = ()=>{
        let payload = {
            "area": 916445,
            "capital": "Caracas",
            "continent": "South America",
            "flag": "//upload.wikimedia.org/wikipedia/commons/0/06/Flag_of_Venezuela.svg",
            "gdp": 382424000000,
            "id": parseInt(document.getElementById('cId').value),
            "name": document.getElementById('cName').value,
            "population": 28946101,
            "tld": ".ve"
        };
        fetch('/api/newCountry', {
            method:'PUT', body: JSON.stringify(payload),
            body: JSON.stringify(payload),
            headers:{'content-type':'application/json'}
        });
        
    }
    document.getElementById('newDetails').append(divId,divName,addBtn);
}

// search country
document.getElementById('search').onkeyup = async ()=>{
    let target = document.getElementById('search').value;
    if(target.length > 1){
        let r1 = await fetch(`/api/search/${target}`);
        let r = await r1.json();
        document.getElementById('dropdown').innerHTML = '';
        for (let p of r.result){
            let d = document.createElement('div');
            d.innerHTML = p;
            document.getElementById('dropdown').append(d);
            d.onclick = async()=>{
                document.getElementById('dropdown').innerHTML = '';
                let ret = await fetch(`/api/country/${p}`);
                let countrydata = await ret.json();
                //    alert(countrydata);
                showOneCountry(countrydata.result[0]);
            }
        }
    }
}

// country information [continent list, country list, country detail]
document.body.onload = async()=>{
    let ret = await fetch("/api/continentList");
    let cl = await ret.json();
    for(let cont of cl.list){
        let div = document.createElement('a');
        div.innerHTML = cont;
        // define classes for each continent as continent-label
        div.classList.add('continent-label'); 
        div.onclick = async ()=>{
            let ret = await fetch(`/api/getListOfCountries/${cont}`);
            let countryList = await ret.json();
            document.getElementById('listOfCountries').innerHTML = '';
            for(let c of countryList.result){
                let cdiv = document.createElement('div');
                cdiv.innerHTML = c;
                cdiv.classList.add('country-label');
                cdiv.onclick = async ()=>{
                   let ret = await fetch(`/api/country/${c}`);
                   let countrydata = await ret.json();
                   showOneCountry(countrydata.result[0]);
                };
                document.getElementById('listOfCountries').append(cdiv);
            }
        }
        let conList = document.getElementById('continentList');
        if(conList){
            document.getElementById('continentList').append(div, '  ');
        }  
    }
    //sort by population
    let r = await fetch('/api/population');
    let pop = await r.json();
    for(let p of pop.plist){
        let d = document.createElement('div');
        d.innerHTML = `
        ${p.name}:<b style="float: right; color: yellow;">${p.population}</b><hr>
        `;    
        document.getElementById('population').append(d);  
    }
    document.getElementById('sortPopulation').onclick = ()=>{
        document.getElementById('population').innerHTML = '';
        pop.plist.sort(function(a,b){
            return b.population - a.population;
        });
        for(let p of pop.plist){
            let div = document.createElement('div');
            div.innerHTML = `
            ${p.name}:<b style="float: right; color: yellow;">${p.population}</b><hr>
            `; 
            document.getElementById('population').append(div);
        }
    }
}

// country detail with function
function showOneCountry(cobj){
    document.getElementById('countryDetail').innerHTML = `
    <table>
        <h2 id='current'>${cobj.name}</h2>
        <tr><td><b>Id: </b></td><td id='currentId'>${cobj.id}</td></tr>
        <tr><td><b>Flag: </b></td><td><img src='${cobj.flag}'></td></tr>
        <tr><td><b>Name: </b></td><td>${cobj.name}</td></tr>
        <tr><td><b>Continent: </b></td><td>${cobj.continent}</td></tr>
        <tr><td><b>Capital: </b></td><td>${cobj.capital}</td></tr>
        <tr><td><b>Area: </b></td><td>${cobj.area.toLocaleString('en')}</td></tr>
        <tr><td><b>Population: </b></td><td>${cobj.population.toLocaleString('en')}</td></tr>
        <tr><td><b>GDP: </b></td><td>${cobj.gdp.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</td></tr>
    </table>
`;
}

// delete country
document.querySelectorAll('button.del').forEach(b=>{
    b.onclick = async()=>{
        console.log(`You click to delete ${b.dataset.name}`);
        let r = await fetch(`/api/world/${b.dataset.name}`,{method:'DELETE'})
        b.parentNode.classList.add('hideslowly');
    }
})

