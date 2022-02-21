let subscribers = {}

export function publish(event, args) {
    if (!subscribers[event]) return;
    
    subscribers[event].forEach(subscriberCallback => {
        subscriberCallback(args)
    });
}

export function subscribe(event, callback) {
    if (!subscribers[event]) {
        subscribers[event] = [];
    }
    subscribers[event].push(callback);
}
