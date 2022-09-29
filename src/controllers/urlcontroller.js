const urlModel = require("../models/urlModel")
const shortId = require("shortid")
//const validUrl=require("valid-url")
const validation = require("validator")

const isValidRequestBody = (RequestBody) => {
    if (!Object.keys(RequestBody).length > 0) return false;
    return true;
};

const isValid = (value) => {
    if (typeof value === "undefined" || typeof value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
}

const createUrl = async function (req, res) {
    let data = req.body
    let longUrl = req.body.longUrl

    if (!isValid(data)) {
        return res.status(400).send({ status: false, message: "please enter data" })
    }

    if (!isValid(longUrl)) {
        return res.status(400).send({ status: false, message: "please enter url" })
    }
    let uniqueUrl = await urlModel.findOne({ longUrl: longUrl })
    if (uniqueUrl) {
        return res.status(400).send({ status: false, message: "Url already exists" })
    }
    if (!(/^(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})?$/).test(longUrl)) {
        return res.status(400).send({ status: false, message: "invalid base url" })
    }

    let urlCode = shortId.generate().toLowerCase()
    let shortUrl = `https://localhost:3000/${urlCode}`

    data.urlCode = urlCode
    data.shortUrl = shortUrl

    savedData = await urlModel.create(data)
    res.status(201).send({ status: false, message: "url successful created", data: savedData })
}

module.exports.createUrl = createUrl