//User_Label Initializers
const Profile_Image         = document.getElementById('Profile_Image');
const User_Name             = document.getElementById('User_Name');
//Main_Display intializers
const Sidebar               = document.getElementById('Sidebar');
const Message_Display_Box   = document.getElementById('Message_Display_Box');
//Initialize Firebase
var config                  = {
    apiKey: "AIzaSyCylUT0zVmt8UocdVuHZ3RGmuj1fNyyFbw",
    authDomain: "playground-a45e6.firebaseapp.com",
    databaseURL: "https://playground-a45e6.firebaseio.com",
    projectId: "playground-a45e6",
    storageBucket: "playground-a45e6.appspot.com",
    messagingSenderId: "102092502135"
};
//
var User                    = {
    id: "",
    name: "",
    email: "",
    profileImageURL: ""
}

var click                   = 0;

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
        
        click += 1;
        
        if(click == 1) Sidebar.style.width = '255px';
        
        else {
            click = 0;
            Sidebar.style.width = '0px';
        }
    });
    
    //Initializes WebPage for logged in User
    intializeIfUserIsLoggedOn(auth,database);
    
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
    console.log('User Id: ' + UserInfo);
}

function Intialize_Sidebar(database,uid) {
    database.child("AuthFP App Users").on('child_added', function(snapshot) {
        User.id                 = snapshot.key;
        User.name               = snapshot.child('name').val();
        User.email              = snapshot.child('email').val();
        User.profileImageURL    = snapshot.child('profileImageURL').val();
        
        if(User.id !== uid) $('#User_Table').append("<div class=\"User_Row\" onclick=\"Retrieve_User_Info('"+ User.id +"')\"><img id=\"profilePictureURL\" src=\" " + User.profileImageURL + "\" draggable=\"false\"><div class=\"User_Info\"><label id=\"Set_Name\"> " + User.name + " </label><label id=\"Set_Email\"> " + User.email + " </label></div></div>");
    });
}

function Setup_User_Label(database,firebaseUser) {
    
    database.child('AuthFP App Users').child(firebaseUser.uid).on('value', function(snapshot) {
        
        User_Name.textContent   = snapshot.child('name').val();
        Profile_Image.src       = snapshot.child('profileImageURL').val();
        
    });
    
}