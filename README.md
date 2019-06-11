<h1 align="center">Rendering Google-Drive images directly on html-page</h1>

Hello Guys! Using nodejs I have implemented an api through which rendering google-drive images directly on html page. For google-Api authentication follow this link (https://developers.google.com/drive/api/v3/quickstart/nodejs).
and By ExpressJs doing a get request to obtain the link of the folder's files(images link) after that using ejs parsing the list of the link to .ejs file to render it on html page.

## Requirements


For linux, install nodejs and npm (node-package-manager) by running following commands in your Terminal.

```
sudo apt-get update
sudo apt install nodejs
sudo apt-get install npm
```
To install ejs embedded javascript, use this code on terminal

```
sudo apt install ejs --save

``
How to run the command on terminal

```
nodemon .
```
then open the chrome or any browser and run the ```localhost:2050/show``` you will get the photos with slider 

