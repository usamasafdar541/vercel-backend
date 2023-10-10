// @desc Get all contacts
const asyncHandler = require("express-async-handler");
const Contact = require("../modles/contactsModel");
//Create Contacts
const createContact = asyncHandler(async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    if (!name || !email || !phone || !password) {
      res.status(400).json({
        status: false,
        message: "All fields Are Mandatory please fill the fields",
      });
    }
    const emailExist = await Contact.findOne({ email });
    if (emailExist) {
      return res.status(409).json({
        message: "Email Already Exist",
      });
    }
    const contact = new Contact({
      name,
      email,
      password,
      phone,
    });
    const result = await contact.save();
    return res.status(201).json({
      status: true,
      message: "contact created successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Creation Failed",
      error: error.message,
    });
  }
});
//GET ALL CONTACTS
const getAllContacts = asyncHandler(async (req, res) => {
  try {
    const user_id = req.body.id;
    const getContacts = await Contact.find(user_id);
    if (getContacts) {
      return res.status(200).json({
        status: true,
        message: "Contacts Found",
        data: getContacts,
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "No Contact Found",
      error: error.message,
    });
  }
});
//single contact
const getSingleContact = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Contact.findById(id);
    if (result) {
      return res.status(200).json({
        status: true,
        message: `Contact with the id is`,
        data: result,
      });
    }
  } catch (error) {
    return res.status(404).json({
      status: false,
      message: `No Contact found with id `,
      error: error.message,
    });
  }
});

const updateContact = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, password, phone } = req.body;
    const updatedContact = {};
    if (name) {
      updatedContact.name = name;
    }
    if (email) {
      updatedContact.email = email;
    }
    if (password) {
      updatedContact.password = password;
    }
    if (phone) {
      updatedContact.phone = phone;
    }
    const result = await Contact.findByIdAndUpdate(id, updatedContact, {
      new: true,
    });
    return res.status(200).json({
      status: true,
      message: "Successfully Updated",
      data: result,
    });
  } catch (error) {
    return res.status(404).json({
      status: false,
      message: "Error in updating contacts",
      error: error.message,
    });
  }
});
const deleteContact = asyncHandler(async (req, res) => {
  try {
    const id = req.params.id;
    const result = await Contact.findByIdAndDelete(id);
    return res.status(200).json({
      status: true,
      message: "Contact for this id is deleted Successfully",
      data: result,
    });
  } catch (error) {
    return res.status(404).json({
      status: false,
      message: "Error In Deleting the Conatct",
      error: error.message,
    });
  }
});
//routes

// api access

module.exports = {
  getAllContacts,
  getSingleContact,
  createContact,
  updateContact,
  deleteContact,
};
