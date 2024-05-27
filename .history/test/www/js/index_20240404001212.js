/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    document.getElementById('deviceready').classList.add('ready');
}


  
  const getAllIncidence =
  
    'https://api.jsonbin.io/v3/b/660e4e3dacd3cb34a8332440/latest';
  
  async function allIncidenceApi(url) {
    try {
      const response = await fetch(url);
  
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      const getAPI = data.record.users;
  
      console.log(getAPI);
  
      return getAPI;
    } catch (error) {
      console.error("There was a problem fetching the data:", error.message);
      return { error: error.message };
    }
  }
  
  
  
  allIncidenceApi(getAllIncidence)
    .then((data) => {
      console.log(data)
      data.map((da) => {
        //let filter = `
         // <option value="">${datum.category}</option>
         // `;
        //document.getElementById("select").innerHTML += filter;
        let showIncidence = `
          <div class="card">
              
              <h2 class="title">${da.title}</h2>
              <h5>${da.content}</h5>
              <h6>category: ${da.category}</h6>
              <img class="img" src=data:${da.type};base64,${da.img} alt=${da.filename} />
          </div>   
      `;
        document.querySelector(".row").innerHTML += showIncidence;
      });
    })
    .catch((error) => {
      console.error(error);
  });
  
  
  
  
  
  
  //
  
  
  const createForm = document.getElementById("form");
  const statusDiv = document.getElementById("status");
  
  createForm.addEventListener("submit", async function (event) {
    event.preventDefault();
  
    const newCategory = document.getElementById("incidentType").value;
    const newTitle = document.getElementById("title").value;
    const newContent = document.getElementById("content").value;
   
    const imageInput = document.getElementById("imageInput").files[0];
  
    try {
      const base64Image = await getBase64(imageInput);
  
      const recordResponse = await fetch(
         'https://api.jsonbin.io/v3/b/660e4e3dacd3cb34a8332440/latest',
        {
          method: "GET",
          headers: {
            "X-Master-Key":
            "$2a$10$Y2KuZiWIlPBpkvV3DKhscuXhJB82gHLcgnFriCGmj6M8fZCNr4F92",
          },
        }
      );
  
      if (!recordResponse.ok) {
        throw new Error("Failed to fetch record data");
      }
  
      const recordData = await recordResponse.json();
  
      const newIncident = {
        id: "3",
        category: newCategory,
        title: newTitle,
        content: newContent,
        img: base64Image,
        filename: imageInput.name,
        type: imageInput.type,
      };
  
      const addNewIncidents = [...recordData.record.users, newIncident];
      const updateRecordedIncidents = {
        ...recordData.record,
        users: addNewIncidents,
      };
  
      const updateResponse = await fetch(
        'https://api.jsonbin.io/v3/b/660e4e3dacd3cb34a8332440',
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-Master-Key": "$2a$10$Y2KuZiWIlPBpkvV3DKhscuXhJB82gHLcgnFriCGmj6M8fZCNr4F92",
          },
          body: JSON.stringify(updateRecordedIncidents),
        }
      );
    
      if (!updateResponse.ok) {
        throw new Error("Failed to create new incident");
      }
  
      const updatedData = await updateResponse.json();
      console.log("New incident created:", updatedData);
      statusDiv.textContent = "Incident Posted Successfully";
      createForm.refresh();
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
      
    } catch (error) {
      console.error("Error creating new incident:", error.message);
      statusDiv.textContent = "Error creating incident";
    }
  })
  
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  }
  
  
  
