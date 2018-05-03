//User_Label Initializers
const Profile_Image             = document.getElementById('Profile_Image');
const User_Name                 = document.getElementById('User_Name');
//Main_Display intializers
const Sidebar                   = document.getElementById('Sidebar');
const Message_Display_Box       = document.getElementById('Message_Display_Box');
const Upload_Image              = document.getElementById('Upload_Image');
const Text_Input                = document.getElementById('Text_Input');
const Blue_Bubble               = document.getElementById('Blue_Bubble');
const Grey_Bubble               = document.getElementById('Grey_Bubble');
const ChatPartner_ProfileImage  = document.getElementById('ChatPartner_ProfileImage');
//Initialize Firebase
var config                      = {
    apiKey: "AIzaSyCylUT0zVmt8UocdVuHZ3RGmuj1fNyyFbw",
    authDomain: "playground-a45e6.firebaseapp.com",
    databaseURL: "https://playground-a45e6.firebaseio.com",
    projectId: "playground-a45e6",
    storageBucket: "playground-a45e6.appspot.com",
    messagingSenderId: "102092502135"
};

var click                       = true;
var databaseInScope = null;

(function() {
    
    firebase.initializeApp(config);
    
    const auth      = firebase.auth();
    const database  = firebase.database().ref();
    const storage   = firebase.storage().ref();
    
    databaseInScope = database;

    //Logout_Button Handler
    document.getElementById('Logout_Button').addEventListener('click', e => {
        auth.signOut();
    });
    
    //Sets up Sidebar once Sidebar_Icon is clicked
    $('#Sidebar_Icon').click(function() {
        
        if(click) {
            click = false;
            Sidebar.style.width = '255px';
        } else {
            click = true;
            Sidebar.style.width = '0px';
        }
    });
    
    //Initializes WebPage for logged in User
    intializeIfUserIsLoggedOn(auth,database);
    
    //Allows for enter key to send messages
    Text_Input.addEventListener('keyup', function(event) {
        event.preventDefault();
        
        if (event.keyCode === 13) {
            if (Text_Input.value !== "")  {
                enterKeyAction(Text_Input.value,database,storage);
                Text_Input.value = "";
            }
        }
    });
}());

function intializeIfUserIsLoggedOn(auth,database) {
    //Checks whether a user is signed in
    auth.onAuthStateChanged(firebaseUser => {
        
        if(firebaseUser) {
            
            console.log('User Currently Logged In');
            Setup_User_Label(database,firebaseUser);
            Intialize_Sidebar(database,firebaseUser.uid);
            
        } else {
            window.location= "index.html";
        }
    });
}

function Retrieve_User_Info(profileImageURL,id,uid) {
    const need = new SetNecessities();

    databaseInScope.child('User-Messages').child(uid).child(id).on('child_added', function(snapshot) {
        var messageId = snapshot.key;

        databaseInScope.child('AuthFP App User Messages').child(messageId).on('value', function(Snapshot) {
            
            var toId = Snapshot.child('toId').val();
            var fromId = Snapshot.child('fromId').val();
            var text = Snapshot.child('text').val();
            
            if(fromId === uid) {
                $('#Display_Messages').append(need.setBlueBubble(text));
            } else {
                $('#Display_Messages').append(need.setGreyBubble(text,profileImageURL));
            }
        });

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
        
        User_Name.textContent   = snapshot.child('name').val();
        Profile_Image.src       = snapshot.child('profileImageURL').val();
        
    });
    
}

function enterKeyAction(text,database,storage) {
    console.log(text);
}