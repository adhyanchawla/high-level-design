const {Kafka} = require('kafkajs')
const msg = process.argv[2];
run();
async function run() {
    try {
        const kafka = new Kafka({
            "clientId": "myApp",
            "brokers": ["192.168.1.67:9092"]
        });

        const producer = kafka.producer();
        await producer.connect()
        console.log("Connected!");
        const partition = msg[0] < "N" ? 0 : 1;
        const result = await producer.send({
            "topic": "Users",
            "messages": [
                {
                    "value": msg,
                    "partition": partition
                }
            ]
        })
        console.log(`Send successfully! ${JSON.stringify(result)}`);
        await producer.disconnect();
    }
    catch(ex) {
        console.log(`Something went wrong ${ex}`);
    } 
    finally {
        process.exit(0)
    }
}