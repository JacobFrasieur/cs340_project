// Get the objects we need to modify
let updateCustomerForm = document.getElementById('update-customer-form');

// Modify the objects we need
updateCustomerForm.addEventListener("submit", function (e) {
   
    // Prevent the form from submitting
    e.preventDefault();

    // Get form fields we need to get data from
    let inputCustomerID = document.getElementById("update-name");
    let inputAddress = document.getElementById("update-address");
    let inputPhone = document.getElementById("update-phone");

    // Get the values from the form fields
    let customerIDValue = inputCustomerID.value;
    let addressValue = inputAddress.value;
    let phoneValue = inputPhone.value;
    


    // Put our data we want to send in a javascript object
    let data = {
        customerID: customerIDValue,
        address: addressValue,
        phone: phoneValue
    };
    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/update-customer", true);
    xhttp.setRequestHeader("Content-type", "application/json");

    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, customerIDValue);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, customerID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("customer-table");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == customerID) {
        let updateRowIndex = table.getElementsByTagName("tr")[i];

        // Get td elements for address and phone
        let addressTd = updateRowIndex.getElementsByTagName("td")[2];
        let phoneTd = updateRowIndex.getElementsByTagName("td")[3];

        // Reassign values to updated data
        addressTd.innerHTML = parsedData[0].address;
        phoneTd.innerHTML = parsedData[0].phone;
       }
    }
}