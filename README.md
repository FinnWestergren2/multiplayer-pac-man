# micro-rts

Welcome to micro-rts! It's a project I've been working on and will likely continue to work on for a long time. An RTS, or real time strategy game, is a type of game where you create and control multiple units to gather resources and destroy enemy units in real time (not turn-based). If you've ever played "Starcraft" or "Age of Empires", you've played an RTS. 

The purpose of this project was to create something I could show to my friends and to test my skills as a software engineer. I hope that one day my friends might actually have fun playing this game; more realistically I hope one day this game will be an actual game. Currently as of March 2021 it is still just a game engine, but a cool one at that.

The entire thing was written in typescript to make it playable in a browser and simple enough to deploy. The server and client communicate through websockets to keep the "RT" in "RTS". The server is running on node and the game is rendered in browser using p5.js. The netcode I wrote is a variation of client-side prediction, where the server and the client are both running copies of the game and the server corrects the client if it is outside a certain error margin. On top of that theres a bit of "rollback" that goes on, but I wouldn't quite call it rollback netcode because rollback is a beautiful and sophisticated thing which makes my code look like cave drawings. But it works pretty well and I didn't need to get my phd to do it either!

To play around with the game engine, clone this repo, navigate to the root, and run "npm run all" (install npm first if you haven't already https://www.npmjs.com/) Note: This works best in chrome. I personally develop in firefox and I am try to cater to firefox users as best I can, but chrome just does a much better job keeping up with the p5 graphics library. You can see this clearly when looking at the "UPS" (updates per second) between the two browsers.

To move your ship around the map, click on your character and right click on the destination. To see the full picture, open up a new tab and nav to the same url. You can play against yourself there. Or if you like, you can even play on multiple devices once the servers are running. Just navigate to [your_IP]:3000 on a browser from another computer and you can see the two clients interact!

Enjoy and let me know if you have any sweet ideas / want to contribute! I have no "grand vision", it's just something to kinda tack stuff onto when I feel like writing some code.
fwesterg@gmail.com

![image](https://user-images.githubusercontent.com/16493075/112911287-1927e700-90c3-11eb-87db-8adccbea8966.png)
