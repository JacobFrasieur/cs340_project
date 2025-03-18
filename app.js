/*
Citation for following: app.js - heavily inspired with the exception of DB queries & tables used
Date: 3/17/2025
Adapted From: NodeJS Starter App
Link: https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/f805913e77a460e16291bb69ce35740630fd0fc9
*/
const handlebars = require('handlebars');

//Handles dates properly
handlebars.registerHelper('formatDate', function(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: '2-digit'
    });
});





var express = require('express');   // We are using the express library for the web server
var app     = express();            // We need to instantiate an express object to interact with the server in our code
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static('public'))
PORT        = 8785;                 // Set a port number

// Database
var db = require('./database/db-connector')

const { engine } = require('express-handlebars');
var exphbs = require('express-handlebars');     // Import express-handlebars
app.engine('.hbs', engine({extname: ".hbs"}));  // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use the handlebars engine whenever it encounters a *.hbs file.

/*
    ROUTES
*/
// app.js

app.get('/', function(req, res)
    {  
        let query1 = "SELECT * FROM Customers;";               // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('index', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query
//Setup for GET customers
app.get('/customers', function(req, res)
    {  
        let query1 = "SELECT * FROM Customers;";               // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('customers', {data: rows});                  // Render the customers.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query

//Setup for GET invoices
app.get('/invoices', function(req, res)
    {  
        let query2 = "SELECT * FROM Invoices;";               // Define our query
        let query2_2 = "SELECT * FROM Customers;";

        db.pool.query(query2, function(error, rows, fields){    // Execute the query
            let invoices = rows;

            db.pool.query(query2_2, (error, rows, fields) => {
            

                let customers = rows;
                return res.render('invoices', {data: invoices, customers: customers});
            })
        })                                                      
    });                                                         

//Setup for GET products
app.get('/products', function(req, res)
    {  
        let query3 = "SELECT * FROM Products;";               

        db.pool.query(query3, function(error, rows, fields){    

            res.render('products', {data: rows});                  
        })                                                      
    });                                                         

//Setup for GET invoiceDetails (join table)
app.get('/invoicedetails', function(req, res)
    {  
        let query4 = "SELECT * FROM InvoiceDetails;";      
        let query4_2 = "SELECT * FROM Invoices"
        let query4_3 = "SELECT * FROM Products"
        
        db.pool.query(query4, function(error, rows, fields){    
            let invoicedetails = rows;

            db.pool.query(query4_2, (error, rows, fields) => {
                let invoices = rows;   
                
                db.pool.query(query4_3, (error, rows, fields) => {
                    let products = rows;
                
                    return res.render('invoicedetails', {data: invoicedetails, invoices: invoices, products: products});    
                });
            });                
        });                                                      
    });                                                         
 
//Setup for GET deliveries - Inspired by the starter app
app.get('/deliveries', function(req, res) {  
    let query5 = "SELECT * FROM Deliveries;";               
    let query5_2 = "SELECT * FROM Customers;";
    let query5_3 = "SELECT * FROM Invoices;";

    db.pool.query(query5, function(error, rows, fields) {    
        let deliveries = rows;

        db.pool.query(query5_2, (error, rows, fields) => {
            let customers = rows;

            db.pool.query(query5_3, (error, rows, fields) => {  
                let invoices = rows; 
                
                return res.render('deliveries', {data: deliveries, customers: customers, invoices: invoices});
            });
        }); 
    });                                                     
});
                                                        

//Setup for adding a new customer - Inspired by the starter app
app.post('/add-customer-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    data['input-address'] = data['input-address'] ? data['input-address'] : null;
    data['input-phone'] = data['input-phone'] ? data['input-phone'].replace(/-/g, '') : null;
    // Create the query and run it on the database
    query1 = `INSERT INTO Customers (name, address, phone) VALUES ('${data['input-name']}', '${data['input-address']}', '${data['input-phone']}')`;
    db.pool.query(query1, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/customers');
        }
    })
})

//Setup for adding a new invoice - Inspired by the starter app
app.post('/add-invoice-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    data['input-invoiceTotal'] = data['input-invoiceTotal'] ? data['input-invoiceTotal'] : null;
    // Create the query and run it on the database
    query2 = `INSERT INTO Invoices (customerID, invoiceDate, invoiceTotal) VALUES ('${data['input-customerID']}', '${data['input-invoiceDate']}', '${data['input-invoiceTotal']}')`;
    db.pool.query(query2, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/invoices');
        }
    })
})

//Setup for adding a new product
app.post('/add-product-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database - Inspired by the starter app
    query3 = `INSERT INTO Products (productName, cost, inventory) VALUES ('${data['input-productName']}', '${data['input-cost']}', '${data['input-inventory']}')`;
    db.pool.query(query3, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/products');
        }
    })
})

//Setup for adding a new invoicedetails
app.post('/add-invoicedetails-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database - Inspired by the starter app
    query4 = `INSERT INTO InvoiceDetails (invoiceID, productID, quantity) VALUES ('${data['input-invoiceID']}', '${data['input-productID']}', '${data['input-quantity']}')`;
    db.pool.query(query4, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/invoicedetails');
        }
    })
})

//Setup for adding a new delivery - Inspired by the starter app
app.post('/add-delivery-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    // Create the query and run it on the database
    query5 = `INSERT INTO Deliveries (deliveryDue, customerID, invoiceID) VALUES ('${data['input-deliveryDue']}', '${data['input-customerID']}', '${data['input-invoiceID']}')`;
    db.pool.query(query5, function(error, rows, fields){

        // Check to see if there was an error
        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }

        // If there was no error, we redirect back to our root route, which automatically runs the SELECT * FROM bsg_people and
        // presents it on the screen
        else
        {
            res.redirect('/deliveries');
        }
    })
})

//Setup for deleting a customer - Inspired by the starter app
app.delete('/delete-customer/', function(req,res,next){
    let data = req.body;
    let customerID = parseInt(data.customerID);
    let deleteInvoicesCustomerID = `DELETE FROM Invoices WHERE customerID = ?`;
    let deleteCustomer= `DELETE FROM Customers WHERE customerID = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteInvoicesCustomerID, [customerID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              else
              {
                  // Run the second query
                  db.pool.query(deleteCustomer, [customerID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
                      }
                  })
              }
})});

//Setup for deleting an invoiceDetail and associated spots in other tables - Inspired by the starter app
app.delete('/delete-invoicedetail/', function(req,res,next){
    let data = req.body;
    let detailsID = parseInt(data.detailsID);
    let deleteInvoiceDetailsCustomerID = `DELETE FROM InvoiceDetails WHERE detailsID = ?`;
  
  
          // Run the 1st query
          db.pool.query(deleteInvoiceDetailsCustomerID, [detailsID], function(error, rows, fields){
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }

})});

//Setup for deleting a product - Inspired by the starter app
app.delete('/delete-product/', function(req,res,next){
let data = req.body;
let productID = parseInt(data.productID);
let deleteInvoicesDetailsProductID = `DELETE FROM InvoiceDetails WHERE productID = ?`;
let deleteProduct= `DELETE FROM Products WHERE productID = ?`;


        // Run the 1st query
        db.pool.query(deleteInvoicesDetailsProductID, [productID], function(error, rows, fields){
            if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
            }

            else
            {
                // Run the second query
                db.pool.query(deleteProduct, [productID], function(error, rows, fields) {

                    if (error) {
                        console.log(error);
                        res.sendStatus(400);
                    } else {
                        res.sendStatus(204);
                    }
                })
            }
})});

//Setup for updating a customer - Inspired by the starter app
app.put('/update-customer', function(req,res,next){
    let data = req.body;
  
    let customerID = parseInt(data.customerID);
    let address = data.address;
    let phone = data.phone;

    let queryUpdateCustomer = `UPDATE Customers SET address = ?, phone = ? WHERE customerID = ?`;
    let selectCustomer = `SELECT * FROM Customers WHERE customerID = ?`;

          // Run the 1st query
          db.pool.query(queryUpdateCustomer, [address, phone, customerID], function(error, rows, fields) {
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectCustomer, [customerID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});

//Setup for updating an invoicedetail - Inspired by the starter app
app.put('/update-invoicedetails', function(req,res,next){
    let data = req.body;
  
    let detailsID = parseInt(data.detailsID);
    let invoiceID =  parseInt(data.invoiceID);
    let productID = parseInt(data.productID);
    let quantity = data.quantity;

    let queryUpdateInvoiceDetails = `UPDATE InvoiceDetails SET invoiceID = ?, productID = ?, quantity = ? WHERE detailsID = ?`;
    let selectInvoiceDetail = `SELECT * FROM InvoiceDetails WHERE detailsID = ?`;

          // Run the 1st query
          db.pool.query(queryUpdateInvoiceDetails, [invoiceID, productID, quantity], function(error, rows, fields) {
              if (error) {
  
              // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
              console.log(error);
              res.sendStatus(400);
              }
  
              // If there was no error, we run our second query and return that data so we can use it to update the people's
              // table on the front-end
              else
              {
                  // Run the second query
                  db.pool.query(selectInvoiceDetail, [detailsID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.send(rows);
                      }
                  })
              }
  })});



/*
    LISTENER
*/
app.listen(PORT, function(){            // This is the basic syntax for what is called the 'listener' which receives incoming requests on the specified PORT.
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});
