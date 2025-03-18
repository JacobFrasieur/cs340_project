/*
Citation for following: update_invoicedetails.js - all content heavily inspired
Date: 3/17/2025
Adapted From: NodeJS Starter App
Link: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/f805913e77a460e16291bb69ce35740630fd0fc9
*/

//This functionality was heavily inspired from the starter app

// Get the objects we need to modify
let updateCustomerForm = document.getElementById('update-invoicedetails-form');

// Modify the objects we need
updateCustomerForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputDetailsID = document.getElementById("update-detailsid");
    let inputInvoiceID = document.getElementById("update-invoiceid");
    let inputProductID = document.getElementById("update-productid");
    let inputQuantity = document.getElementById("update-quantity");

    // Get the values from the form fields
    let detailsIDValue = inputDetailsID.value;
    let invoiceIDValue = inputInvoiceID.value;
    let productIDValue = inputProductID.value;
    let quantityValue = inputQuantity.value;
    


    // Put our data we want to send in a javascript object
    let data = {
        detailsID: detailsIDValue,
        invoiceID: invoiceIDValue,
        productID: productIDValue,
        quantity: quantityValue
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-invoicedetails", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, detailsIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})

//This functionality was heavily inspired from the starter app

function updateRow(data, detailsID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("invoicedetails-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == detailsID) {
        let updateRowIndex = table.getElementsByTagName("tr")[i];

        // Get td elements for invoiceid, productid, quantity
        let invoiceTd = updateRowIndex.getElementsByTagName("td")[2];
        let productTd = updateRowIndex.getElementsByTagName("td")[3];
        let quantityTd = updateRowIndex.getElementsByTagName("td")[4];

        // Reassign values to updated data
        invoiceTd.innerHTML = parsedData[0].invoice;
        productTd.innerHTML = parsedData[0].product;
        quantityTd.innerHTML = parsedData[0].quantity;
       }
    }
}