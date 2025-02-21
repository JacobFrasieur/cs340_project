-- DATA MANIPULATION QUERIES BELOW.
-- Colon represents a placeholder for information passed. _dropdown means a dropdown menu will be used.

-- ---------------------------------------------------------------------
-- Select Queries

-- Get customers
SELECT * FROM Customers;

-- Get all invoices
SELECT * FROM Invoices;

-- Get all products
SELECT * FROM Products;

-- ---------------------------------------------------------------------
-- Insert Queries

-- Insert new customer (Doesnt work unless no attached invoices)
INSERT INTO Customers (name, address, phone)
VALUES (:name, :address, :phone);

-- Insert new invoice
INSERT INTO Invoices (customerID, invoiceDate, invoiceTotal)
VALUES (:customerID_dropdown, :invoiceDate, :invoiceTotal);

-- Insert new product
INSERT INTO Products (productName, cost, inventory)
VALUES (:productName, :cost, :inventory);

-- Insert new delivery
INSERT INTO Deliveries (deliveryDue, customerID, invoiceID)
VALUES (:deliveryDue, :customerID_dropdown, :invoiceID_dropdown);

-- Insert new invoice details
INSERT INTO InvoiceDetails (invoiceID, productID, quantity)
VALUES (:invoiceID_dropdown, :productID_dropdown, :quantity);

-- ---------------------------------------------------------------------
-- Update Queries

-- Update Customers
UPDATE Customers
SET name = :name, address = :address, phone = :phone WHERE customerID = :customerID;

-- Update Invoices
UPDATE Invoices
SET customerID = :customerID_dropdown, invoiceDate = :invoiceDate, invoiceTotal = :invoiceTotal WHERE invoiceID = :invoiceID;

-- Update Products
UPDATE Products 
SET productName = :productName, cost = :cost, inventory = :inventory WHERE productID = :productID;

-- Update Deliveries
UPDATE Deliveries
SET deliveryDue = :deliveryDue, customerID = :customerID_dropdown, invoiceID = :invoiceID_dropdown WHERE deliveryID = :deliveryID;

-- Update InvoiceDetails
UPDATE InvoiceDetails
SET invoiceID = :invoiceID_dropdown, productID = :productID_dropdown, quantity = :quantity WHERE detailsID = :detailsID;

-- ---------------------------------------------------------------------
-- Delete Queries

-- Delete Customers
DELETE FROM Customers WHERE customerID = :customerID;

-- Delete Invoices
DELETE FROM Invoices WHERE invoiceID = :invoiceID;

-- Delete Products
DELETE FROM Products WHERE productID = :productID;

-- Deletes Deliveries
DELETE FROM Deliveries WHERE deliveryID = :deliveryID;

-- Delete InvoiceDetails
DELETE FROM InvoiceDetails WHERE detailsID = :detailsID;