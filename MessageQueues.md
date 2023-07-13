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