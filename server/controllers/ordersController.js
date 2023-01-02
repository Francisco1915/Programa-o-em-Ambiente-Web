const res = require("express/lib/response");
const mongoose = require("mongoose");
const Employee = require("../models/Employee");
const Book = require("../models/Book");
const Order = require("../models/Order");
const User = require("../models/User");

var orderController = {};

orderController.list = async function (req, res) {

    let page = parseInt(req.query.page);
    let limit = parseInt(req.query.limit);
    if (!(page && limit)) {
        page = 1;
        limit = 4;
    }
    const skipIndex = (page - 1) * limit;
    const results = {};

    try {

        const count = await Order.countDocuments();
        const result = await Order.find().sort({ _id: 1 }).limit(limit).skip(skipIndex);

        results.results = result;
        results.page = page;
        results.limit = limit;
        results.pages = count / limit;

        res.render("main-orders", { title: "Orders System", list: results });
    } catch (err) {
        res.render('error', { message: err.message, error: err });
    }
};

orderController.show = async function (req, res) {
    let id = req.params.id;

    try {

        let order = await Order.findOne({ _id: id });
        console.log(order)
        if (!order) {
            res.render('error', { message: "Not found order with id " + id, error: { status: "", stack: "" } });
        } else {
            res.render("details-order", {
                title: "View Order",
                order: order,
            });
        }
    } catch (err) {
        res.render('error', { message: "Not found order with id " + id, error: err });
    }
};

orderController.create = async function (req, res) {

    const employees = await Employee.find();
    const clients = await User.find();
    const books = await Book.find();

    res.render("create-order", {
        title: "New Order",
        method: "post",
        action: "create",
        list: {
            employees: employees,
            books: books,
            clients: clients
        },
        order: new Order({})
    });
}

async function checkBooks(books) {
    let qt = [];
    let i = 0;
    books.forEach(async book => {
        const newBook = await Book.findOne({ isbn: book.isbn, status: book.status })
        if (newBook) {
            if (newBook.qt !== 0) {
                qt[i] = newBook.qt;
            }
            i++
        } else {
            res.render('error', { message: "Not found book with isbn " + book.isbn, error: { status: "", stack: "" } });
        }
    })
    return qt;
}

async function createBooks(req, res) {
    let books = [];
    let totalPrice = 0;
    if (Array.isArray(req.body.books)) {
        req.body.books.forEach(async book => {
            let isbn = book.split(" ", 3)[0];
            let status = book.split(" ", 3)[1];
            let price = book.split(" ", 3)[2];
            price = parseInt(price);

            const newBook = await Book.findOne({ isbn: isbn, status: status });
            if (newBook.qt !== 0) {
                totalPrice += price;

                books.push({ isbn: isbn, status: status });
            }
        });
    } else {
        let isbn = req.body.books.split(" ", 3)[0];
        let status = req.body.books.split(" ", 3)[1];
        let price = req.body.books.split(" ", 3)[2];
        price = parseInt(price);

        const newBook = await Book.findOne({ isbn: isbn, status: status });
        if (newBook.qt !== 0) {
            totalPrice += price;

            books.push({ isbn: isbn, status: status });
        }
    }

    data = {
        books: books,
        totalPrice: totalPrice
    }

    return data;
}

orderController.save = async function (req, res) {

    try {
        let emailCliente = req.body.emailCliente;
        let emailEmployee = req.body.emailEmployee;

        let points = 0;

        const employee = Employee.findOne({ email: emailEmployee })
        if (!employee) {
            res.render('error', { message: "Not found Employee with email " + emailEmployee, error: { status: "", stack: "" } });
        }

        const user = await User.findOne({ email: emailCliente })
        if (user) {
            points = user.points;
        } else {
            res.render('error', { message: "Not found client with email " + emailCliente, error: { status: "", stack: "" } });
        }

        let result = await createBooks(req);
        let books = result.books;
        let totalPrice = result.totalPrice;
        let qt = await checkBooks(books);

        if (books.length !== 0) {
            const order = new Order({
                clientEmail: emailCliente,
                employeeEmail: emailEmployee,
                books: books,
                priceOrder: totalPrice
            })

            const newClient = await User.findOne({ email: emailCliente });

            if (newClient) {
                points = newClient.points;
            } else {
                res.render('error', { message: "Not found client with email " + emailCliente, error: { status: "", stack: "" } });
            }

            const UpdateClient = await User.findOneAndUpdate({ email: emailCliente }, { $set: { points: points + (totalPrice) } }, { new: true });
            let j = 0;
            books.forEach(async book => {
                const book1 = await Book.findOneAndUpdate({ isbn: book.isbn, status: book.status }, { $set: { qt: qt[j] - 1 } }, { new: true });
                j++;
            })

            const newOrder = await order.save();

            res.render("details-order", {
                title: "Order",
                order: newOrder,
            });

        } else {
            console.log("error")
            req.body.booksError = "Not books found";
            const err1 = { name: "ValidationError" };
            throw err1;
        }
    } catch (err) {
        if (err.name == "ValidationError") {
            handleValidationError(err, req.body);
        }
        const employees = await Employee.find();
        const clients = await User.find();
        const books = await Book.find();

        res.render("create-order", {
            title: "New Order",
            method: "post",
            action: "create",
            list: {
                employees: employees,
                books: books,
                clients: clients
            },
            order: req.body
        });
    }
}

function handleValidationError(err, body) {
    for (field in err.errors) {
        switch (err.errors[field].path) {
            case "idCliente":
                body["idClienteError"] = err.errors[field].message;
                break;
            case "idEmployee":
                body["idEmployeeError"] = err.errors[field].message;
                break;
            case "books":
                body["booksError"] = err.errors[field].message;
                break;
            default:
                break;
        }
    }
}

module.exports = orderController;