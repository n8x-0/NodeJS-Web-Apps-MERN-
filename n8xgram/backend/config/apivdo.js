const ApiVideoClient = require("@api.video/nodejs-client")

const apivideoClient = new ApiVideoClient({ apiKey: process.env.API_VIDEO_KEY });

module.exports = apivideoClient