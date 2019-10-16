var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://nareemani:nareemani123@cluster0-7id1m.mongodb.net/test?retryWrites=true"; 4
function speechResponse(speech, shouldEndSession) {
    return {
        "outputSpeech": {
            "type": "PlainText",
            "text": speech
        },
        shouldEndSession: shouldEndSession
    };

}
function generateFinalOutput(response, sessionAtrributes) {
    return {
        version: '1.0',
        sessionAtrributes,
        response
    }
}
function dbcall(data) {
    return new Promise(function (resolve, reject) {
        console.log('inside db call', data);
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("fordprocess");
            var query = {
                $and: [
                    { 'salesname': data.sales },
                    { 'salesjob': data.salesjob }
                ]
            };
            console.log("query", query);
            dbo.collection("fordprocess").findOne(query, function (err, result) {
                console.log(result);
                if (err) throw err;
                if (result == null) {
                    var message = `I am sorry I did't find that information. Please ask me again`;
                    resolve(message);
                }
                else {
                    var message = `The status of ${data.sales} with ${data.salesjob} is ${result.status}`;
                    resolve(message);

                }

            });
        });
    })
}
function dbcall1(data) {
    return new Promise(function (resolve, reject) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var dbo = db.db("fordprocess");
            var query = {
                $and: [
                    { 'salesname': data.sales },
                    {
                        'salesjob': data.salesjob
                    }
                ]
            };
            dbo.collection("fordprocess").findOne(query, function (err, result) {
                console.log(result);
                if (err) throw err;
                if (result == null) {
                    var message = `I am sorry I did't find that information. Please ask me again`;
                    resolve(message);
                }
                else {
                    var message = `The Duration of ${data.sales} with ${data.salesjob} is ${result.duration} seconds`;
                    resolve(message);
                }
            });
        });
    })
}
function processResource(event, res) {
    // console.log(event);
    console.log(event.request.intent.slots.job.value);
    console.log("event.request.intent.slots.salesforcerevenue.value", event.request.intent.slots);
    if (event.request.dialogState === 'STARTED' || event.request.dialogState === 'IN_PROGRESS') {
        const response = {
            "outputSpeech": null,
            "card": null,
            "directives": [{
                "type": "Dialog.Delegate"
            }],
            "reprompt": null,
            "shouldEndSession": false
        };
        const sessionAtrributes = {};
        const output = generateFinalOutput(response, sessionAtrributes);
        res.send(output);
    }
    else if (event.request.dialogState === 'COMPLETED') {
        const salesjob = event.request.intent.slots.job.value;
        const sales = event.request.intent.slots.salesforcerevenue.value;
        console.log("***** Process Name from user input is: " + salesjob);
        dbcall({ "salesjob": salesjob, "sales": sales }).then((data) => {

            const response = speechResponse(data, false);
            const sessionAtrributes = {};
            const output = generateFinalOutput(response, sessionAtrributes);
            res.send(output);

        })

    }
    else {
        const salesjob = event.request.intent.slots.job.value;
        const sales = event.request.intent.slots.salesforcerevenue.value;
        console.log("***** sales job from user input is: " + salesjob);
        console.log("***** sales from user input is: " + sales);
        dbcall({ "salesjob": salesjob, "sales": sales }).then((data) => {


            const response = speechResponse(data, false);
            const sessionAtrributes = {};
            const output = generateFinalOutput(response, sessionAtrributes);
            res.send(output);

        })
    }
}
function processDuration(event, res) {
    // console.log(event);
    console.log(event.request.intent.slots.job.value);
    console.log("event.request.dialogState", event.request.dialogState);
    if (event.request.dialogState === 'STARTED' || event.request.dialogState === 'IN_PROGRESS') {
        const response = {
            "outputSpeech": null,
            "card": null,
            "directives": [{
                "type": "Dialog.Delegate"
            }],
            "reprompt": null,
            "shouldEndSession": false
        };
        const sessionAtrributes = {};
        const output = generateFinalOutput(response, sessionAtrributes);
        res.send(output);
    }
    else if (event.request.dialogState === 'COMPLETED') {
        const salesjob = event.request.intent.slots.job.value;
        const sales = event.request.intent.slots.salesforcerevenue.value;
        console.log("***** Process Name from user input is: " + salesjob);
        dbcall1({ "salesjob": salesjob, "sales": sales }).then((data) => {

            const response = speechResponse(data, false);
            const sessionAtrributes = {};
            const output = generateFinalOutput(response, sessionAtrributes);
            res.send(output);

        })

    }
    else {
        const salesjob = event.request.intent.slots.job.value;
        const sales = event.request.intent.slots.salesforcerevenue.value;
        console.log("***** Process Name from user input is: " + salesjob);
        dbcall1({ "salesjob": salesjob, "sales": sales }).then((data) => {
            console.log('message', data);

            const response = speechResponse(data, false);
            const sessionAtrributes = {};
            const output = generateFinalOutput(response, sessionAtrributes);
            res.send(output);


        })
    }
}

function defaultProcess(event, res) {
    var message = `I am sorry I did't find that information. Please ask me again`;
    const response = speechResponse(message, false);
    const sessionAtrributes = {};
    const output = generateFinalOutput(response, sessionAtrributes);
    res.send(output);
}
function processLaunchRequest(event, res) {
    var speech = "Hello, this is demo skill bot. I can help you with Process information.";
    const response = speechResponse(speech, false);
    const sessionAtrributes = {};
    const output = generateFinalOutput(response, sessionAtrributes);
    res.send(output);
}

function processIntentRequest(event, res) {
    console.log("event.request.intent.name", event.request.intent.name);
    switch (event.request.intent.name) {
        case 'AMAZON.CancelIntent':
            break;
        case 'AMAZON.HelpIntent':
            break;
        case 'AMAZON.StopIntent':
            break;
        case 'StatusOfSalesforce':
            processResource(event, res);
            break;
        case 'DurationOfSalesRevenue':
            processDuration(event, res);
            break;
        default:
            defaultProcess(event, res);


    }
}

function processSessionEnded(event, res) {

}


exports.process = (req, res) => {
    var event = req.body;
    switch (event.request.type) {
        case 'LaunchRequest':
            processLaunchRequest(event, res);
            break;
        case 'IntentRequest':
            processIntentRequest(event, res);
            break;
        case 'SessionEndedRequest':
            processSessionEnded(event, res);
            break;
    }
}