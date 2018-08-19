//Deals with Profile_Image info
var storage_ref         = 'AuthFP_App_Users_Profile_Images/';
var file_name           = "person-default";
var file                ;

var auth;
var database;
var storage;

$(document).ready(function() {
    //Initialize Firebase
    var configure           = {
        apiKey: config.apiKey,
        authDomain: config.authDomain,
        databaseURL: config.databaseURL,
        projectId: config.projectId,
        storageBucket: config.storageBucket,
        messagingSenderId: config.messagingSenderId
    };

    firebase.initializeApp(configure);

    auth      = firebase.auth();
    database  = firebase.database().ref();
    storage   = firebase.storage().ref();

    //Login and Register Controll Handlers
    $('.login-control').on('click', HandleLoginControl);
    $('.signup-control').on('click', HandleSignUpControl);

    //When Enter key is pressed it fires off enter button
    $('#password').on('keyup', HandlePasswordInput);

    //Login and Register Button Handlers
    $('#login-btn').on('click', HandleLoginButton);
    $('#signup-btn').on('click', HandleSignUpButton);

    $('#profile_image').on('click', ClickFileInput);
    
});

const ClickFileInput  = function() {
    return $('#file_input').click();
}

const HandleLoginControl = function() {
    $('#name').addClass('hide');
    $('.name-separator').addClass('hide');

    $(this).addClass('selected').removeClass('bg-authfp');
    $('.signup-control').removeClass('selected').addClass('bg-authfp');

    $('#login-btn').removeClass('hide');
    $('#signup-btn').addClass('hide');
}

const HandleSignUpControl = function() {
    $('#name').removeClass('hide');
    $('.name-separator').removeClass('hide');
    
    $(this).addClass('selected').removeClass('bg-authfp');
    $('.login-control').removeClass('selected').addClass('bg-authfp');

    $('#login-btn').addClass('hide');
    $('#signup-btn').removeClass('hide');
}

const HandlePasswordInput = function(event) {
    event.preventDefault();
        
    if (event.keyCode === 13)
        $('.login-control').hasClass('hide') ? $('#signup-btn').click() : $('#login-btn').click();
    
}

function readURL() {
    if(this.files && this.files[0]) {
        var obj     = new FileReader();
        obj.onload  = function(data) {

            var image = new Image();
            image.src = data.target.result;

            image.onload = function() {                
                if (image.width == image.height) {
                    $('#profile_image').attr('src', image.src);
                    Set_Message_Label('white','Fill in all fields');
                }
                else 
                    Set_Message_Label('red','Image must have equal width and height');
            }
        }

        obj.readAsDataURL(this.files[0]);
        file        = this.files[0];
        file_name   = this.files[0].name;
    }
}

const HandleLoginButton = function() {


    auth.signInWithEmailAndPassword($('#email').val(), $('#password').val()).then(function() {
        
        window.location = "message_page.html";

    }).catch(function(error) {

        Set_Message_Label('rgb(255,58,0)','Failed to Login');

        console.log(error.code + ' : '+ error.message);

    });
}

const HandleSignUpButton = function() {

    auth.createUserWithEmailAndPassword($('#email').val(), $('#password').val()).then(function() {

        //Stores Profile Image into Firebase Storage
        storage.child(storage_ref + file_name).put(file).on('state_changed', function progress(snapshot) {

            //Handle Upload Session
            console.log('Profile Image in process of uploading');

        }, function error(err) {

            //Handle Failed Upload
            console.log('Profile Image failed to upload to storage or none was chosen');

        }, function complete() {

            console.log('Profile Image successfully uploaded');

            //Retrieve Profile Image URL
            storage.child(storage_ref + file_name).getDownloadURL().then(function(url) {

                console.log('Successfully Registered User');

                Set_Message_Label('white','User Created');

                Register_User_In_Database(auth,database,url);

            }).catch(function(error) {

                //Handle any errors
                console.log(error);

            });
        });

    }).catch(function(error) {

        console.log('an error occured');

    });
}

function Set_Message_Label(color,text) {
    $('.message-display').css('color', color).text(text);
}

function Register_User_In_Database(auth,database,url) {

    auth.onAuthStateChanged(firebaseUser => {

        database.child('AuthFP App Users').child(firebaseUser.uid).set({
            "email":Email_Input.value,
            "name": Name_Input.value,
            "profileImageURL": url
        });

    });

}