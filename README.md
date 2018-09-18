# Sushi Hunt

Quick note: The current version of the codebase is different from the one covered in the blogs. It's now written in a custom MVC like solution for extendability.

A progressive web app that lets you find the best sushi restaurants around you. The app currently uses Zomato's API to retrieve the list of restaurant recommendations. 

Visit https://sushi-hunt.herokuapp.com/ on your mobile Chrome browser on your Android device. 
Head to 'settings' in Chrome and tap 'Add to Home Screen' to see it in action.

## What makes an app progressive

### Service Worker
A Service Worker is a script that runs on your browser as a separate thread from your regular Javascript that you use to access the DOM or other Web APIs in the front-end. The Service Worker can intercept network requests and can be used to communicate with browser storage mechanisms like Cache or IndexedDb to retrieve your web app’s assets to create offline experiences.

### Promises
Promises are an alternative to how we generally write code to handle asynchronous computations. Browser events like XMLHttpRequests are asynchronous in nature, meaning they complete execution in an unknown order and time. To overcome this we tend to write a lot of nested callback functions which become difficult to read and maintain over time. Promises allow us to represent these asynchronous events in a sequence in which we want them to execute.

Here’s a rough example:
```
firstEvent().then(secondEvent).then(thirdEvent);`
```

Developers have used libraries like Q and Bluebird to implement Promises over the last few years. As of today all major browsers have enabled Promises by default except Internet Explorer (what a surprise!).
Service Workers heavily use Promises too so that we can follow what is happening to our assets we intend to cache at a glance.

### Cache
The Cache in our browser is going to be where we store all our assets using a Service Worker in this tutorial series. For more structured data like files or blobs, IndexedDB can be used as client-side storage.

### Web App Manifest
The Web App Manifest is a JSON file that stores information about the app such as its name, author, icons, screen orientation and more. Without this file our app cannot be saved to the home screen of our (Android) mobile device.

### HTTPS
Perhaps the most critical component of all, if you’re interested in deploying your app is to make sure your user connection to the web server is protected by the HTTPS protocol. Without the HTTPS, the power of our Service Worker makes the application vulnerable to man-in-the-middle attacks.

## My step by step guide to build this PWA
* Part1: https://blog.prototypr.io/create-a-web-app-that-works-offline-part-1-a9c2b130441e#.ekv6ng6vq
* Part2: https://blog.prototypr.io/create-a-web-app-that-works-offline-part-2-cc1827beea9f#.2oys2pzai
* Part3: https://blog.prototypr.io/create-a-web-app-that-feels-native-part-3-dbbf46444791#.nt88nqcth
* Part4: (Coming soon)

