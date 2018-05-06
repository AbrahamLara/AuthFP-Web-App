//Main_Display intializers
const Sidebar                   = document.getElementById('Sidebar');
//Display_Message Initializers
const Display_Messages          = document.getElementById('Display_Messages');
const Text_Input                = document.getElementById('Text_Input');
var chatPartner                 = null;
var currentUser                 = null;
//Initialize Firebase
var config                      = {
    apiKey: "AIzaSyCylUT0zVmt8UocdVuHZ3RGmuj1fNyyFbw",
    authDomain: "playground-a45e6.firebaseapp.com",
    databaseURL: "https://playground-a45e6.firebaseio.com",
    projectId: "playground-a45e6",
    storageBucket: "playground-a45e6.appspot.com",
    messagingSenderId: "102092502135"
};
var databaseInScope             = null;
var storageInScope              = null;
//OTher stuff yet to be named
var click                       = true;

(function() {
    
    resizeDisplays(0,100);

    firebase.initializeApp(config);
    
    const auth      = firebase.auth();
    const database  = firebase.database().ref();
    const storage   = firebase.storage().ref();
    
    databaseInScope = database;
    storageInScope  = storage;

    //Logout_Button Handler
    document.getElementById('Logout_Button').addEventListener('click', e => {
        auth.signOut();
    });
    
    //Sets up Sidebar once Sidebar_Icon is clicked
    $('#Sidebar_Icon').click(function() {
        
        if(click) {
            click = false;

            resizeDisplays(13,87);

        } else {
            click = true;
            
            resizeDisplays(0,100);
        }
    });
    
    //Initializes WebPage for logged in User
    intializeIfUserIsLoggedOn(auth,database);

    document.getElementById('Display_Messages').style.height = document.getElementById('Message_Display_Box').clientHeight - 90 + 'px';
    
    //Allows for enter key to send messages
    Text_Input.addEventListener('keyup', function(event) {
        event.preventDefault();
        
        if (event.keyCode === 13) {
            if (Text_Input.value !== "")  {
                enterKeyAction({
                    fromId: currentUser,
                    text: Text_Input.value,
                    timeStamp: new Date()/1000,
                    toId: chatPartner,
                });
                Text_Input.value = "";
            }
        }
    });

    //Will allow for me to get the image width and height to be able to upoad to firebase

    $("#Upload_File").change(function(e) {
        var file, img;

        if ((file = this.files[0])) {
            img = new Image();
            img.onload = function() {
                StoreImageToFirebase(file,file.name,this.width,this.height);
            };
            img.src = window.URL.createObjectURL(file);

        }

    });

}());

function resizeDisplays(Left_Display_Width,Right_Display_Width) {
    document.getElementById('Right_Display').style.width = Right_Display_Width + '%';
    document.getElementById('Left_Display').style.width = Left_Display_Width + '%';
    Text_Input.style.width = document.getElementById('Message_Display_Box').clientWidth - 45 + 'px';
}

function intializeIfUserIsLoggedOn(auth,database) {
    //Checks whether a user is signed in
    auth.onAuthStateChanged(firebaseUser => {
        
        if(firebaseUser) {
            currentUser = firebaseUser.uid;
            console.log('User Currently Logged In');
            Setup_User_Label(database,firebaseUser);
            Intialize_Sidebar(database,currentUser);
            
        } else {
            window.location= "index.html";
        }
    });
}

function Retrieve_User_Info(profileImageURL,id,uid) {
    const need  = new SetNecessities();

    chatPartner = id;

    //Clears chatlog so that different messages can load for individual conversations
    Display_Messages.innerHTML = "";

    databaseInScope.child('User-Messages').child(uid).child(id).on('child_added', function(snapshot) {

        var messageId = snapshot.key;

        databaseInScope.child('AuthFP App User Messages').child(messageId).on('value', function(Snapshot) {

            var fromId  = Snapshot.child('fromId').val();
            var text    = Snapshot.child('text').val();
            var imageUrl = Snapshot.child('imageUrl').val();

            if (fromId === uid) {

                imageUrl !== null ? $('#Display_Messages').append(need.setBlueBubbleImage(imageUrl)) 
                : $('#Display_Messages').append(need.setBlueBubbleText(text));

            } 
            
            if (fromId === chatPartner) {
                imageUrl !== null ? $('#Display_Messages').append(need.setGreyBubbleImage(imageUrl,profileImageURL)) 
                : $('#Display_Messages').append(need.setGreyBubbleText(text,profileImageURL));
            }

        });

        //Allows for the div to automatically scroll down to load new message
        Display_Messages.scrollTop = Display_Messages.scrollHeight;
    });

}

function Intialize_Sidebar(database,uid) {
    database.child("AuthFP App Users").on('child_added', function(snapshot) {
        var id                 = snapshot.key;
        var name               = snapshot.child('name').val();
        var email              = snapshot.child('email').val();
        var profileImageURL    = snapshot.child('profileImageURL').val();

        const need = new SetNecessities();
        
        if(id !== uid) $('#User_Table').append(need.setUserInfo(id,profileImageURL,name,email,uid));
    });
}

function Setup_User_Label(database,firebaseUser) {
    
    database.child('AuthFP App Users').child(firebaseUser.uid).on('value', function(snapshot) {
        
        document.getElementById('User_Name').textContent   = snapshot.child('name').val();
        document.getElementById('Profile_Image').src       = snapshot.child('profileImageURL').val();
        
    });
    
}

function enterKeyAction(newNode) {
    if(chatPartner !== null) {

        var childRef = databaseInScope.child('AuthFP App User Messages').push();

        childRef.update(newNode);

        var userMessageRef = databaseInScope.child('User-Messages').child(currentUser).child(chatPartner);
        
        var messageId = {};

        messageId[childRef.key] = 1;
        
        userMessageRef.update(messageId);
        
        databaseInScope.child('User-Messages').child(chatPartner).child(currentUser).update(messageId);
        
    }
}

function StoreImageToFirebase(file,file_name,width,height) {
    console.log('Uploading to fireabase!!!');

    if (chatPartner !== null) {
        
        //Store image into userMessages
        storageInScope.child('messageImages/'+file_name).put(file).on('state_changed', function progress(snapshot) {

            //Handle Upload Session
            console.log('Image in process of uploading');

        }, function error(err) {

            //Handle Failed Upload
            console.log('Image failed to upload to storage or none was chosen');

        }, function complete() {

            console.log('Image successfully uploaded');

            //Retrieve Profile Image URL
            storageInScope.child('messageImages/'+file_name).getDownloadURL().then(function(url) {

                console.log('Successfully UploadedImage');

                enterKeyAction({
                    fromId: currentUser,
                    imageHeight: height,
                    imageUrl: url,
                    imageWidth: width,
                    timeStamp: new Date()/1000,
                    toId: chatPartner,
                });

            }).catch(function(error) {

                //Handle any errors
                console.log(error);

            });
        });

    }

}