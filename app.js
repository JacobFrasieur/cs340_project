// App.js



/*
    SETUP
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
PORT        = 8753;                 // Set a port number at the top so it's easy to change in the future

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
        let query1 = "SELECT * FROM bsg_people;";               // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('index', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query

app.get('/customers', function(req, res)
    {  
        let query1 = "SELECT * FROM Customers;";               // Define our query

        db.pool.query(query1, function(error, rows, fields){    // Execute the query

            res.render('customers', {data: rows});                  // Render the index.hbs file, and also send the renderer
        })                                                      // an object where 'data' is equal to the 'rows' we
    });                                                         // received back from the query

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

app.get('/products', function(req, res)
    {  
        let query3 = "SELECT * FROM Products;";               

        db.pool.query(query3, function(error, rows, fields){    

            res.render('products', {data: rows});                  
        })                                                      
    });                                                         

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


app.get('/deliveries', function(req, res)
    {  
        let query5 = "SELECT * FROM Deliveries;";               
        let query5_2 = "SELECT * FROM Customers;";

        db.pool.query(query5, function(error, rows, fields){    
            let deliveries = rows;

            db.pool.query(query5_2, (error, rows, fields) => {
            
                let customers = rows;
                return res.render('deliveries', {data: deliveries, customers: customers});
            })              
        })                                                      
    });                                                         

// app.js

app.post('/add-customer-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

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

app.post('/add-invoice-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

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

app.post('/add-product-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
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

app.post('/add-invoicedetails-form', function(req, res){
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;

    // Create the query and run it on the database
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

app.delete('/delete-customer/', function(req,res,next){
    let data = req.body;
    let customerID = parseInt(data.customerID);
    let deleteInvoicesCustomerID = `DELETE FROM Invoices WHERE customerID = ?`;
    let deleteCustomers= `DELETE FROM Customers WHERE customerID = ?`;
  
  
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
                  db.pool.query(deleteCustomers, [customerID], function(error, rows, fields) {
  
                      if (error) {
                          console.log(error);
                          res.sendStatus(400);
                      } else {
                          res.sendStatus(204);
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