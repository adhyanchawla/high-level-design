const {Kafka} = require('kafkajs')
run();
async function run() {
    try {
        const kafka = new Kafka({
            "clientId": "myApp",
            "brokers": ["192.168.1.67:9092"]
        });

        const consumer = kafka.consumer({
            "groupId": "test"
        });
        await consumer.connect()
        console.log("Connected!");
        consumer.subscribe({
            "topic": "Users",
            "fromBeginning": true
        });

        await consumer.run({
            "eachMessage": async result=>{
                console.log(`RVD message ${result.message.value} on partition ${result.partition}`);
            }
        })
    }
    catch(ex) {
        console.log(`Something went wrong ${ex}`);
    } 
    finally {
    }
}