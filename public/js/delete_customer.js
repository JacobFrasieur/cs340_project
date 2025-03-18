/*
Citation for following: delete_customer.js - all content heavily inspired
Date: 3/17/2025
Adapted From: NodeJS Starter App
Link: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/f805913e77a460e16291bb69ce35740630fd0fc9
*/

//This function was heavily inspired from the starter app
function deleteCustomer(customerID) {
    // Put our data we want to send in a javascript object
    let data = {
        customerID: customerID
    };

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/delete-customer/", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {

            // Add the new data to the table
            deleteRow(customerID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

//This function was heavily inspired from the starter app
function deleteRow(customerID){

    let table = document.getElementById("customer-table");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == customerID) {
            table.deleteRow(i);
            break;
       }
    }
}