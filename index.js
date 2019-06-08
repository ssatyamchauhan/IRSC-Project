const fs = require('fs');
const express = require('express')
const readline = require('readline');
const {google} = require('googleapis');
// const ejs=require('ejs');
var link;

var app = express()
app.set('view engine', 'ejs');
//getting children of folder
const SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly'];


// If modifying these scopes, delete token.json.
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.
// app.get('/show',(req,res)=>{
//   res.sendFile(__dirname+'/index.html')
// })

app.get('/show',(request,response)=>{
  fs.readFile('credentials.json', (err, content) => {
    if (err) {
      return console.log('Errzor loading client secret file:', err);
    }
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content),listFiles);})

function listFiles(auth) {
  const drive = google.drive({version: 'v3', auth})
  let link;
  drive.files.list({
    pageSize: 10,
    fields: 'nextPageToken, files(id, name)',
  },(err, res)=> {
    if (err) return console.log('The API returned an error: ' + err);
    const files = res.data.files;
    if (files.length) {
      // console.log('Files:');
      files.map((file) => {
        // console.log(`${file.name} (${file.id})`);
        if(file.name == 'Google'){
          link = 'https://drive.google.com/embeddedfolderview?id='+file.id +'#grid';
          // response.render(__dirname+'/myindex.ejs',{link:link})
          drive.files.list({
            q: `'${file.id}' in parents`
          }, (err, data) => {
             if (err) throw err
            //  console.log('your files', data.data)
            const imagesId=data.data.files;
            var links=[]
            for(var i =0;i<imagesId.length;i++){
              link='https://drive.google.com/uc?export=view&id='+imagesId[i].id
              links.push(link)
            }
            console.log(links)
            response.render(__dirname+'/myindex.ejs',{links :links});
            // imagesId.map((image)=>{
            //   console.log(`${image.name} (${image.id}) `)
            // })
          })
          }
      })
    }
     else {
      console.log('No files found.');
    }
  })
}

})
/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
      client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);

  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  // console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        // console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

// listFiles()


// function listFiles(auth) {
//   const drive = google.drive({version: 'v3', auth})
//   drive.files.list({
//     pageSize: 10,
//     fields: 'nextPageToken, files(id, name)',
//   },(err, res)=> {
//     if (err) return console.log('The API returned an error: ' + err);
//     const files = res.data.files;
//     if (files.length) {
//       // console.log('Files:');
//       files.map((file) => {
//         console.log(`${file.name} (${file.id})`);
//         if(file.name == 'Google'){
//           this.data = 'https://drive.google.com/embeddedfolderview?id='+file.id +'+#grid';
//           // return link
//           console.log(this.data)
//         }
//         })
//     }
//      else {
//       console.log('No files found.');
//     }
//   })
// }

// var fileId = '1fdw64ocbPoD9pjujILHnMUteoadVb7z9';

// function downloadFile(auth) {
//   var fileId = '1fdw64ocbPoD9pjujILHnMUteoadVb7z9';
//   var dest = fs.createWriteStream('/tmp/photo.jpg');
//   const drive = google.drive({version: 'v3', auth});
//   drive.files.get({fileId: fileId, alt: 'media'}, {responseType: 'stream'},
//     function(err, res){
//         res.data
//         .on('end', () => {
//             console.log('Done');
//         })
//         .on('error', err => {
//             console.log('Error', err);
//         })
//         .pipe(dest);
//       }
// );
//   }



app.listen(2050,()=>{
  console.log('your app is listening')
})