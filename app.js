function attachEvents() {
    
    //LOAD BUTTON/LIST ALL CATCHES
    document.getElementById("load").addEventListener("click", function(event){
        let requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        apiLoad("https://fisher-game.firebaseio.com/catches.json", requestOptions);
    });

    //DELETE BUTTON/DELETE A CATCH
    document.getElementsByClassName("delete")[0].addEventListener("click", function(event){
        let requestOptions = {
            method: 'DELETE',
            redirect: 'follow'
          };
        let url = `https://fisher-game.firebaseio.com/catches/${catchId}.json`;
        apiDelete(url, requestOptions);
    });

    //THIS ADDS AN EVENT LISTENER TO ALL THE UPDATE/DELETE BUTTONS GENERATED IN THE DOM
    let catchesList = document.getElementById("catches");
    catchesList.addEventListener("click", (e) => {
        //EVENT.TARGET CAPTURES THE SPECIFIC BUTTON THAT TRIGGERED THE EVENT LISTENER
        let selection = event.target;
        let buttonType = selection.className;
        //RUN THE APPROPRIATE FUNCTION DEPENDING ON WHAT BUTTON WAS PUSHED AND PASS THE EVENT THAT TRIGGERED IT TO THE FUNCTION
        if(buttonType == "update"){
            apiUpdate(event);
        }else if(buttonType == "delete"){
            apiDelete(event);
        }
    });

    //ADD BUTTON/CREATE A NEW CATCH RECORD
    document.getElementsByClassName("add")[0].addEventListener("click", function(event){
        apiAdd("https://fisher-game.firebaseio.com/catches.json");
    });

    async function apiLoad(url, requestOptions){
        let deleteFiller = document.getElementsByClassName("catch");
        // console.log(deleteFiller);
        for(let records of deleteFiller){
            records.remove();
        }
        // deleteFiller.remove();
        let response = await fetch(url, requestOptions);
        let json = await response.json();
        console.log(json);
        // let responseArray = Object.entries(json);
        for(let item in json){
            let catchId = item;
            // let angler = json[item].angler;
            console.log(catchId);
            let addCatch = document.createElement("div");
            addCatch.className = "catch";
            addCatch.id = `${catchId}`;
            addCatch.innerHTML = `
                <label>Angler</label>
                <input type="text" class="angler" value="${json[item].angler}" />
                <hr>
                <label>Weight</label>      
                <input type="number" class="weight" value="${json[item].weight}" />
                <hr>
                <label>Species</label>
                <input type="text" class="species" value="${json[item].species}" />
                <hr>
                <label>Location</label>
                <input type="text" class="location" value="${json[item].location}" />
                <hr>
                <label>Bait</label>
                <input type="text" class="bait" value="${json[item].bait}" />
                <hr>
                <label>Capture Time</label>
                <input type="number" class="captureTime" value="${json[item].captureTime}" />
                <hr>
                <button class="update" id="${catchId}">Update</button>
                <button class="delete" id="${catchId}">Delete</button>
            </div>`;
            document.getElementById("catches").append(addCatch);
        }
    }

    async function apiAdd(url){

        //get the whole form and it's fields
        let addForm = document.getElementById("addForm");
        let formFields = addForm.children;

        //get the specific input field values entered
        let name = formFields[2].value;
        let weight = formFields[4].value;
        let species = formFields[6].value;
        let location = formFields[8].value;
        let bait = formFields[10].value;
        let captureTime = formFields[12].value;

        //ASSEMBLE INPUT INTO AN OBJECT TO BE USED IN THE POST REQUEST
        let newCatchObj = {
            angler:`${name}`,
            weight:`${weight}`,
            species:`${species}`,
            location:`${location}`,
            bait:`${bait}`,
            captureTime:`${captureTime}`
        };
        //USE FETCH WITH ASYNC/AWAIT TO POST THE OBJECT
        let response = await fetch(url, { 
            method: 'POST', 
            headers: { 
              "Content-type": "application/json"
            }, 
            body: JSON.stringify(newCatchObj),
          });

        //IF REQUEST SUCCESSFUL, RUN THE LOAD FUNCTION TO UPDATE RESULTS IN THE DOM
        if(response.ok){
            console.log("success");
            let requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
            apiLoad("https://fisher-game.firebaseio.com/catches.json", requestOptions);
        //or throw an error via alert box
        }else{
            alert(`Could Not Add Catch: ${response.statusText}`);
        }
    }

    async function apiUpdate(event){

        //get id of update button that was clicked
        let updateButton = event.target;
        let catchToUpdate = updateButton.id;
        //API PUT URL
        let url = `https://fisher-game.firebaseio.com/catches/${catchToUpdate}.json`;
        
        //get the form fields to be updated
        let formToUpdate = document.getElementById(catchToUpdate).children;
        let name = formToUpdate[1].value;
        let weight = formToUpdate[4].value;
        let species = formToUpdate[7].value;
        let location = formToUpdate[10].value;
        let bait = formToUpdate[13].value;
        let captureTime = formToUpdate[16].value;
        
        //ASSEMBLE INTO AN OBJECT TO BE USED IN THE PUT API REQUEST
        let updateCatchObj = {
            angler:`${name}`,
            weight:`${weight}`,
            species:`${species}`,
            location:`${location}`,
            bait:`${bait}`,
            captureTime:`${captureTime}`
        };

        //USE FETCH WITH ASYNC/AWAIT TO UPDATE THE API SERVER
        let response = await fetch(url, { 
            method: 'PUT', 
            headers: { 
              "Content-type": "application/json"
            }, 
            body: JSON.stringify(updateCatchObj),
          });

          //IF REQUEST SUCCESSFUL, RUN THE LOAD FUNCTION TO UPDATE RESULTS IN THE DOM
          if(response.ok){
            let requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
            apiLoad("https://fisher-game.firebaseio.com/catches.json", requestOptions);

        //or throw an error via alert box
        }else{
            alert(`Could Not Update Catch: ${response.statusText}`);
        }
    }
    
    async function apiDelete(event){

        //get button and id of delete button that was clicked
        let updateButton = event.target;
        let catchToDelete = updateButton.id;
        // url to send delete api request to
        let url = `https://fisher-game.firebaseio.com/catches/${catchToDelete}.json`;
        //send the fetch request using the delete api
        let response = await fetch(url, { 
            method: 'DELETE', 
            redirect: 'follow'
          });
          //if response successful, run load function again to update results in the dom
        if (response.ok) {
            
            let requestOptions = {
                method: 'GET',
                redirect: 'follow'
            };
            apiLoad("https://fisher-game.firebaseio.com/catches.json", requestOptions);
        //or throw an error via alert box
        }else{
            alert(`Could Not Delete Catch: ${response.statusText}`);
        }
    }
}
attachEvents();