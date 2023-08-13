### Caching
- Caching is a technique allocate the data in some place where retrieval is faster
- that place is called cache
- caches help us avoid expensive network IO, disk IO, or computation
- examples
    - To get the profile information. Instead of making 5-6 joins among atbles, profile info can be stored in a cache, could be redis
    -Reading a specific line from a file
- AIM: Performance Improvement
- Caches are temporary storage place (behaves like a supplement)
- expensive - hence we cache a subset of data which is most likely to be accessed

- Lets say a cache goes down, this wont hamper the working of an application but there would be some issues around performance as data will now come from the database

eg of databases that behaves as caches: redis, memcached

- Points to keep in mind:
    - Caches are not restricted to RAM based storage that means cache is something that is closer to you and helps you avoid to make an expensive operation
    - Data stored in Key Value pairs (glorified hash tables)
    - examples of caching
        1. Google News - to access recently published news
        2. Auth tokens - to check the authenticity of every request that comes to backend
        3. Live stream - Last 10 mins of the data can be cached on CDN since its accessed the most

### Populating a Cache