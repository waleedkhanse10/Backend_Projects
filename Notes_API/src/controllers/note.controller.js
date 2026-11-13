import mongoose from "mongoose";
import { Note } from "../models/note.model.js"

const createNote = async (req, res) => {
    const { title, content, isPinned } = req.body;

    if (!title?.trim() || !content?.trim()) {
        return res.status(400).json({
            message: "title and content both are required and not empty"
        })
    }

    const note = await Note.create({
        title,
        content,
        isPinned
    })

    if (!note) {
        return res.status(500).json({
            message: "Some issue in save the note in db"
        })
    }

    return res.status(201).json({
        message: "Note created successfully!",
        note
    })
}

const getNotes = async (req, res) => {
    const notes = await Note.find();

    if (!notes) {
        return res.status(404).json({
            message: "Notes not found!"
        })
    }

    res.status(200).json({
        message: "notes fetched successfully!",
        notes
    })
}

const getNote = async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: "invalid note id"
        })
    }

    if (!id) {
        return res.status(400).json({
            message: "id required"
        })
    }

    const note = await Note.findById(id);

    if (!note) {
        return res.status(404).json({
            message: "note not found!"
        })
    }

    return res.status(200).json({
        message: "Note fetched",
        note
    })
}

const updateNote = async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: "invalid note id"
        })
    }

    if (!id) {
        return res.status(400).json({
            message: "id required"
        })
    }

    const updatedNote = req.body

    const note = await Note.findByIdAndUpdate(
        id,
        updatedNote,
        { new: true, runValidators: true }
    );

    if (!note) {
        return res.status(404).json({
            message: "Note not found!"
        })
    }

    return res.status(200).json({
        message: "Note update successfully",
        note
    })
}

const deleteNote = async (req, res) => {
    const id = req.params.id;

    if (!mongoose.isValidObjectId(id)) {
        return res.status(400).json({
            message: "invalid note id"
        })
    }

    if (!id) {
        return res.status(400).json({
            message: "id required"
        })
    }

    const note = await Note.findOneAndDelete({ _id: id })

    if (!note) {
        return res.status(404).json({
            message: "Note not found!"
        })
    }

    return res.status(200).json({
        message: "Note Delete successfully",
        note
    })
}

export {
    createNote,
    getNotes,
    getNote,
    updateNote,
    deleteNote
}

