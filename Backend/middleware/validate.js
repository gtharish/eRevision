const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// runs before /signup — checks all fields are present, non-blank, valid format, and strong enough
const validateSignup = (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "username, email, and password are all required"
        });
    }

    if (!username.trim() || !email.trim() || !password.trim()) {
        return res.status(400).json({
            success: false,
            message: "fields cannot be empty or just whitespace"
        });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({
            success: false,
            message: "please enter a valid email address"
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "password must be at least 6 characters"
        });
    }

    next();
};

// runs before /login — just checks fields aren't blank, since we're not setting new passwords here
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password || !email.trim() || !password.trim()) {
        return res.status(400).json({
            success: false,
            message: "email and password are required"
        });
    }

    next();
};

export { validateSignup, validateLogin };