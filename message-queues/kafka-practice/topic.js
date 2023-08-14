const {Kafka} = require('kafkajs');
run();
async function run() {
    try {
        const kafka = new Kafka({
            "clientId": "myApp",
            "brokers": ["192.168.1.67:9092"]
        });

        const admin = kafka.admin();
        await admin.connect()
        console.log("Connected!");
        await admin.createTopics({
            "topics": [{
                "topic": "Users",
                "numPartitions": 2
            }]
        });
        console.log('Done!');
        await admin.disconnect();
    }
    catch(ex) {
        console.log(`Something went wrong ${ex}`);
    } 
    finally {
        process.exit(0)
    }
}