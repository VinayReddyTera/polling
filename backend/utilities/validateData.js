const validate = {};

// Function to validate email format
validate.validateEmail = (email) => {
    // Regular expression to validate email format
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return emailRegex.test(email) ? true : false; // Return true if email matches the regex, otherwise false
}

// Function to validate name format
validate.validateName = (name) => {
    // Regular expression to validate name format
    let nameRegex = /^[A-Za-z\s'\-]+$/;
    return nameRegex.test(name) ? true : false; // Return true if name matches the regex, otherwise false
}

// Function to validate data against XSS (Cross-Site Scripting) attacks
validate.validateXss = (data) => {
    // Regular expression to match data without specific characters
    let dataRegex = /^[^<>&'"]*$/;
    return dataRegex.test(data); // Return true if data matches the regex, otherwise false
}

module.exports = validate;