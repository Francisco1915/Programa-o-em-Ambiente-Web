const res = require("express/lib/response");
const mongoose = require("mongoose");
const { count } = require("../models/Employee");
const Book = require("../models/Book");
const Cart = require("../models/Cart");
const Receipt = require("../models/Receipt");
const User = require("../models/User");

var cartController = {};

cartController.getCartSize = async function (req, res) {
    let userId = req.userId;
    //let userId = "6294f30de136b39827f51274";

    const cart = await Cart.findOne({ user: userId });

    res.status(200).json({
        message: '',
        data: cart.books.length
    });
}

cartController.getCart = async function (req, res) {
    let userId = req.userId;
    //let userId = "6294f30de136b39827f51274";

    const cart = await Cart.findOne({ user: userId }).populate('books');

    res.status(200).json({
        message: '',
        data: cart
    });
}

cartController.addToCart = async function (req, res) {
    let userId = req.userId;
    //let userId = "6294f30de136b39827f51274";
    let bookId = req.params.bookId;
    //let bookId = "62915ca71b4ebab18d98d79c";

    try {
        const book = await Book.findById(bookId);

        if (!book) {
            return res.json({
                message: 'There is no book with the given id in our database.'
            });
        }

        const cart = await Cart.findOne({ user: userId });

        let bookIds = [];

        //Adicionar todos os livros ao booksId
        for (let b of cart.books) {
            bookIds.push(b.toString());
        }

        //Verirficar se o livro ja existe no carrinho
        if (bookIds.indexOf(bookId) !== -1) {
            return res.json({
                message: 'Book is already in your cart'
            });
        }

        //Colocar o livro no carrinho
        cart.books.push(bookId);
        cart.totalPrice += book.price;
        cart.save();

        res.status(200).json({
            message: 'Book added to cart!',
            data: cart
        });

    } catch (err) {
        return res.json({
            message: 'Something went wrong, please try again.'
        });
    };
}

cartController.removeFromCart = async function (req, res) {
    let userId = req.userId;
    //let userId = "6294f30de136b39827f51274";
    let bookId = req.params.bookId;
    //let bookId = "62915ca71b4ebab18d98d79c";

    try {

        const book = await Book.findById(bookId);

        if (!book) {
            return res.json({
                message: 'There is no book with the given id in our database.'
            });
        }

        const cart = await Cart.findOne({ user: userId });

        cart.books = cart.books
            .map(b => b.toString())
            .filter(b => b !== bookId);
        cart.totalPrice -= book.price;
        cart.save();

        res.status(200).json({
            message: 'Book removed from cart!',
            data: cart
        });
    } catch (err) {
        return res.json({
            message: 'Something went wrong, please try again.'
        });
    };
}

cartController.checkout = async function (req, res) {
    let userId = req.userId;
    //let userId = "6294f30de136b39827f51274";
    let totalPrice = 0;
    let products = [];

    try {

        const cart = await Cart.findOne({ user: userId }).populate('books');
        
        if (cart.books.length !== 0) {

        for (let book of cart.books) {

            const qtBuy = req.body[book._id.toString()];
            const bookDT = await Book.findOne({ _id : book });

            if (!(qtBuy > bookDT.qt)) {

                //Remover qt de livros
                const newBook = await Book.findOneAndUpdate({ _id: book}, { $set: { qt: bookDT.qt - qtBuy } }, { new: true });
                totalPrice += newBook.price * qtBuy;
                products.push({
                    id: newBook._id,
                    title: newBook.title,
                    author: newBook.author,
                    coverImageName: newBook.coverImageName,
                    price: newBook.price,
                    qt: qtBuy
                });
            } else {
                return res.json({
                    message: 'Something went wrong, dont have this quantity of book'
                });
            }
        }

    } else {
        return res.json({
            message: 'Something went wrong, add books in your cart'
        });
    }

        const receipt = await Receipt.create({
            user: userId,
            productsInfo: products,
            totalPrice: totalPrice,
            promo: req.body["points"] / 10
        });

        //Atribuir o historico de compra e adcionar os pontos ao user
        const user = await User.findOneAndUpdate({ _id: userId }, { $push: { receipt: receipt._id} } , { new: true });
        user.points += totalPrice - (req.body["points"] / 10);
        user.points -= req.body["points"];


        const newUser = await user.save();

        cart.books = [];
        cart.totalPrice = 0;
        const newCart = await cart.save();
        return res.status(200).json({
            message: 'Thank you for your order! Books will be sent to you as soon as possible!',
            data: receipt
        });

    } catch (err) {
        console.log(err);
        return res.json({
            message: 'Something went wrong, please try again.'
        });
    };
}

module.exports = cartController;