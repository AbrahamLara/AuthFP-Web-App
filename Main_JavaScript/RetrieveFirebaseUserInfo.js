class RetrieveFirebaseUserInfo {
    
    constructor(userId,userName) {
        this.userId = userId;
        this.userName = userName;
    }

    printtUserId() {
        console.log(this.userId);
    }

    getUserId() {
        return this.userId;
    }

    userIdIsEmpty() {
        return this.userId === null;
    }

}