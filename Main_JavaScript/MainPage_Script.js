//User_Label Initializers
const Profile_Image         = document.getElementById('Profile_Image');
const User_Name             = document.getElementById('User_Name');
//Main_Display intializers
const Sidebar               = document.getElementById('Sidebar');
const Message_Display_Box   = document.getElementById('Message_Display_Box');
const Upload_Image          = document.getElementById('Upload_Image');
const Text_Input            = document.getElementById('Text_Input');
//Initialize Firebase
var config                  = {
    apiKey: "AIzaSyCylUT0zVmt8UocdVuHZ3RGmuj1fNyyFbw",
    authDomain: "playground-a45e6.firebaseapp.com",
    databaseURL: "https://playground-a45e6.firebaseio.com",
    projectId: "playground-a45e6",
    storageBucket: "playground-a45e6.appspot.com",
    messagingSenderId: "102092502135"
};

var click                   = true;

(function() {
    
    firebase.initializeApp(config);
    
    const auth      = firebase.auth();
    const database  = firebase.database().ref();
    const storage   = firebase.storage().ref();
    
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
    
    Text_Input.addEventListener('keyup', function(event) {
        event.preventDefault();
        
        if (event.keyCode === 13) {
            enterKeyAction(Text_Input.value);
            Text_Input.value = "";
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

function Retrieve_User_Info(UserInfo) {
    const fire = new RetrieveFirebaseUserInfo(UserInfo);
    fire.getUserId();
    
}

function Intialize_Sidebar(database,uid) {
    database.child("AuthFP App Users").on('child_added', function(snapshot) {
        var id                 = snapshot.key;
        var name               = snapshot.child('name').val();
        var email              = snapshot.child('email').val();
        var profileImageURL    = snapshot.child('profileImageURL').val();
        
        if(id !== uid) $('#User_Table').append("<div class=\"User_Row\" onclick=\"Retrieve_User_Info('"+ id +"')\"><img id=\"profilePictureURL\" src=\" " + profileImageURL + "\" draggable=\"false\"><div class=\"User_Info\"><label id=\"Set_Name\"> " + name + " </label><label id=\"Set_Email\"> " + email + " </label></div></div>");
    });
}

function Setup_User_Label(database,firebaseUser) {
    
    database.child('AuthFP App Users').child(firebaseUser.uid).on('value', function(snapshot) {
        
        User_Name.textContent   = snapshot.child('name').val();
        Profile_Image.src       = snapshot.child('profileImageURL').val();
        
    });
    
}

function enterKeyAction(text) {
    console.log(text);
}