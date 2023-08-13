- Synchronous vs Asynchronous tasks

- Synchronous situation
    - Lets say you sent a request that needs to be instantly handled and send a response, the process would be synchronous
    - eg You open instagram and instantly a request is sent to the server the load the feed instantly, the server sends the request to the database and retrieves the feed and presents to the user

- Asynchronous situation
    - This is meant for long running tasks, which can be done in parallel with any other tasks as they may take to respond to a certain request
    - eg. Lets say I want to spin up an EC2 instance but its going to to take 5 mins to complete the process, we cant afford to wait for the request to be a blocker for the other HTTP requests, so in order to handle this request we push this request in a message queue which will take care of it and we can perform other tasks while EC2 instance spins up

- Messsage Queues
    - Also known as message brokers
    - They help services/applications communicate through messages asynchronously
    - Where are they required?
        - Long running tasks
        - Trigger dependent tasks across machines (something is done and you want to do something after that can be done by message passing) - like sending an email notification after completion of task lets say order
    - eg Video processing
        - lets say a user uploaded a video on youtube in 1080px and the video gets uploaded to S3 bucket
        - but video needs to be converted to other versions like 360px, 720px as well
        - so once the video is uploaded to the S3, at the same time, the video details are sent in the message queue telling the video processing to process other quality versions of the video
        - so this needs to be a task that has to performed in the background and should not hamper the functioning of the normal video that has been uploaded
        - so the video processer takes the video from the S3 bucket and starts processing the video in different versions
        - once processed, it aligns the other versions with the actual video (uploaded to database)

    - Features
        - Help us connect to two systems (from sender to receiver)
        - the message broker can buffer the message (it usually does) i.e. the consumers consumes the message at their own pace, therefore no synchronous load on them
        - Message brokers retain the message for 'N' days
        - Broker can requeue the message if not deleted
            - consume and delete the message, if not consumed properly the message will requeue
            - sometimes it may happen that you consumed the message but when you notify the message queue regarding the same, the process crashed and hence message inside the queue couldnt get deleted and hence it will requeue again and can be consumed again
        eg auto captioning 

    - Things to explore
        - Visibility timeout



### Message Streams

    - similar to message queues

    Why do we need them?
    - Lets take an example of medium.com to see the need for this
    - Lets say a user uploads a blog to medium, Now the API server needs to perform two tasks:
        - to update elastic search engine with the medium article (index into elastic search)
        - to update the database by incrementing the count
    - if we try to solve the problem by dropping the message to message broker and message broker solely takes care of updating the elastic search engine and the DB 
        - lets say it updated the elastic search engine but failed to update the DB or vice versa
    - OR if we consider two separate brokers but in that case what if 1 would fail to update
    - Hence this would lead to inconsistency across the system

    - so we need "WRITE TO ONE" and "READ BY MANY" kind of a semantic. eg Apache kafka, AWS kinesis
    - multiple types of consumers reading the message queue
    - eg in case of above example lets say the API notifies the message queue with an update, the message is consumed by multiple consumers
    - lets say we have two consumers:
        - search consumer: updates the elastic search engine
        - counter consumer: updates the database
    - the consumer iterates over the messages in the queue and pulls the message

### Kafka Essentials
- Most popular apache project
- kafka is a message stream that holds the messages
- internal structure of kafka:
    - Internally kafka has topic (which has a name)
    - every topic has n partitions (every message is sent to the partition based on the partitioning key lets say user_id) -- this is based on hashing mechanism (hash function is deterministic)
    - message is sent to a topic
    - and depending on configured hash key it is put in the partition
    ## Within partition messages are ordered (but no guarantee in ordering across partitions)
- Append only commit log
- performance
- distributed
- long polling - make a request and wait for some amounts of bytes for pull to happen (limit can be set)
- event driven, pub sub and queue
- scaling
- parallel processing
## limitations of Kafka
- No. of consumers = No. of partitions (one to one mapping)
- parallelism is limited due to this
- zookeeper (behaves weird when we scale) - if its down then it bring the entire system on its knees
- producer explicit partition can lead to problems (increases complexity for the consumers)
- complex to install, configure and manage

- when done with reading certain amount of messages, consumer can commit and kafka will store that commit. so next time when the consumer restarts it starts with the previous commit (kind of log based)


- Does the kafka store every single message ever received?
    - theoritcally it can but one needs to send deletion policy (using a cron job)

- every consumer can consume the message at their own pace

Commands to spin up Zookeeper on docker
docker run --name zookeeper -p 2181:2181 zookeeper

Commands to spin up Kafka on docker
docker run -p 9092:9092 --name kafka  -e KAFKA_ZOOKEEPER_CONNECT=192.168.1.67:2181 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://192.168.1.67:9092 -e KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1 -d confluentinc/cp-kafka

### Pubsub
- Both message streams and brokers pull the message out from the broker/message queue
- Pubsub says why should you pull if I can push

- What if I want 0 lag and low latency?
- realtime pub sub solves this issue (eg redis pubsub)

- instead of consumers pulling the message, message is pushed to them
- on redis, one can subscribe to a channel whenever a publisher publishes on that channel, subscribers get the data immediately
- things delivered really fast to a subscriber, low latency info

- Practical uses: Message broadcast, configuration push

- eg lets say servers are connected to pubsub and when one of the servers changes the configuration, it pushes an event to redis pubsub, sent to all the servers and all of them can handle it
- proactive communication between servers

- limitation of redis pubsub: nothing is buffered

Points to remember:
    - you have to be okay with eventual consistency
